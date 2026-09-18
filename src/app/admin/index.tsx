import { Suspense, lazy } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { useAdminAuth } from '@/admin/use-admin-auth';
import { PageMeta } from '@/components/layout/page-meta';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { USE_EMULATORS } from '@/constants/firebase';
import { Colors, Fonts, Spacing } from '@/constants/theme';

// Split out of the public bundle: only someone who has signed in and passed the
// allowlist ever loads the editor.
const EditorScreen = lazy(() =>
  import('@/editor/editor-screen').then((module) => ({ default: module.EditorScreen }))
);

export default function AdminScreen() {
  // The editor depends on runtime web font loading and pointer drag, so it is
  // web-only by design. Guarding on the platform rather than importing the
  // Firebase module keeps the SDK out of native bundles entirely.
  if (Platform.OS !== 'web') {
    return (
      <Shell>
        <Text style={styles.title}>Site editor</Text>
        <Text style={styles.body}>Editing is available on the web. Open this page in a browser.</Text>
      </Shell>
    );
  }

  return <AdminGate />;
}

function AdminGate() {
  const { status, email, displayName, error, signIn, signOut } = useAdminAuth();

  if (status === 'loading') {
    return (
      <Shell>
        <ActivityIndicator color={Colors.text} />
        <Text style={styles.body}>Checking your session…</Text>
      </Shell>
    );
  }

  if (status === 'error') {
    return (
      <Shell>
        <Text style={styles.title}>Can’t reach Firebase</Text>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.hint}>
          {USE_EMULATORS
            ? 'The emulators may not be running. Start them with `docker compose up firebase`.'
            : 'Check the EXPO_PUBLIC_FIREBASE_* values in your .env.'}
        </Text>
      </Shell>
    );
  }

  if (status === 'signed-out') {
    return (
      <Shell>
        <Logo size="md" />
        <Text style={styles.title}>Site editor</Text>
        <Text style={styles.body}>Sign in with the Google account that was given edit access.</Text>
        <Button label="Continue with Google" onPress={signIn} />
        {USE_EMULATORS && (
          <Text style={styles.hint}>
            Using local emulators — the sign-in popup is the emulator’s test account picker, not
            Google.
          </Text>
        )}
      </Shell>
    );
  }

  if (status === 'checking') {
    return (
      <Shell>
        <ActivityIndicator color={Colors.text} />
        <Text style={styles.body}>Verifying access for {email}…</Text>
      </Shell>
    );
  }

  if (status === 'denied') {
    return (
      <Shell>
        <Text style={styles.title}>No edit access</Text>
        <Text style={styles.body}>
          {email} isn’t on the editor list. Ask someone who already has access to add this account.
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {USE_EMULATORS && (
          <Text style={styles.hint}>
            Locally, also check that this account is seeded (`npm run seed:admin {email}`) and that
            its email shows as verified in the Emulator UI — the rules require both.
          </Text>
        )}
        <Button label="Sign out" variant="outline" onPress={signOut} />
      </Shell>
    );
  }

  return (
    <Suspense
      fallback={
        <Shell>
          <ActivityIndicator color={Colors.text} />
          <Text style={styles.body}>Opening the editor…</Text>
        </Shell>
      }>
      <EditorScreen email={email} onSignOut={signOut} />
    </Suspense>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screen}>
      <PageMeta />
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    gap: Spacing.md,
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: Spacing.xl,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 24,
    color: Colors.text,
  },
  body: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.textMuted,
  },
  hint: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textMuted,
    opacity: 0.8,
  },
  error: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 21,
    color: '#F87171',
  },
});
