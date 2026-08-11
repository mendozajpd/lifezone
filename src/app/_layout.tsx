import { Archivo_300Light } from '@expo-google-fonts/archivo';
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Colors } from '@/constants/theme';
import { ScrollProvider } from '@/context/scroll-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ArchivoBlack_400Regular,
    Archivo_300Light,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
      <ScrollProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }} />
      </ScrollProvider>
    </View>
  );
}
