// The Cloud Function URL is public, non-secret config — safe to bake into the client bundle.
export const CONTACT_FUNCTION_URL =
  process.env.EXPO_PUBLIC_CONTACT_FUNCTION_URL ??
  'https://asia-southeast1-nltac-lifezone.cloudfunctions.net/sendContactMessage';
