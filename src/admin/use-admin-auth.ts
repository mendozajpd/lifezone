import { useCallback, useEffect, useState } from 'react';

export type AdminStatus =
  /** Resolving the persisted session. */
  | 'loading'
  /** No session; show the sign-in button. */
  | 'signed-out'
  /** Signed in, confirming the account is on the allowlist. */
  | 'checking'
  /** Signed in but not an editor. */
  | 'denied'
  /** Signed in and allowed to edit. */
  | 'ready'
  /** Firebase could not be reached or is misconfigured. */
  | 'error';

export type AdminAuth = {
  status: AdminStatus;
  email: string | null;
  displayName: string | null;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

type State = Pick<AdminAuth, 'status' | 'email' | 'displayName' | 'error'>;

const INITIAL: State = { status: 'loading', email: null, displayName: null, error: null };

/** Popup flows surface these when the person simply changed their mind. */
const BENIGN_SIGN_IN_ERRORS = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
]);

function errorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code: unknown }).code);
  }
  return undefined;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

/**
 * Google sign-in plus the editor allowlist check.
 *
 * There is no registration: an account can edit only if `admins/{email}` exists
 * in Firestore.
 *
 * Every Firebase call goes through one dynamically imported module so the SDK
 * lands in a chunk only `/admin` fetches — see the note in `@/lib/firebase`.
 */
export function useAdminAuth(): AdminAuth {
  const [state, setState] = useState<State>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const firebase = await import('@/lib/firebase');
        if (cancelled) return;

        unsubscribe = firebase.watchAuth(async (user) => {
          if (cancelled) return;

          if (!user?.email) {
            setState({ ...INITIAL, status: 'signed-out' });
            return;
          }

          const identity = { email: user.email, displayName: user.displayName };
          setState({ status: 'checking', ...identity, error: null });

          try {
            const allowed = await firebase.isAllowlisted(user.email);
            if (cancelled) return;
            setState({ status: allowed ? 'ready' : 'denied', ...identity, error: null });
          } catch (error) {
            if (cancelled) return;
            // A rules rejection reads the same as "not on the list" from here.
            setState({ status: 'denied', ...identity, error: errorMessage(error) });
          }
        });
      } catch (error) {
        if (cancelled) return;
        setState({ ...INITIAL, status: 'error', error: errorMessage(error) });
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async () => {
    try {
      const firebase = await import('@/lib/firebase');
      await firebase.signInWithGoogle();
    } catch (error) {
      if (BENIGN_SIGN_IN_ERRORS.has(errorCode(error) ?? '')) return;
      setState((prev) => ({ ...prev, status: 'error', error: errorMessage(error) }));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const firebase = await import('@/lib/firebase');
      await firebase.signOutUser();
    } catch (error) {
      setState((prev) => ({ ...prev, error: errorMessage(error) }));
    }
  }, []);

  return { ...state, signIn, signOut };
}
