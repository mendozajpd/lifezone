import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Lifezone Tacloban',
  slug: 'lifezone',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'lifezone',
  userInterfaceStyle: 'dark',
  backgroundColor: '#0A0A0A',
  android: {
    adaptiveIcon: {
      backgroundColor: '#0A0A0A',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
    backgroundColor: '#0A0A0A',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0A0A0A',
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
