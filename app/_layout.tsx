/**
 * Root Layout Component
 * 
 * This is the top-level layout component that wraps the entire application.
 * It handles:
 * - Theme configuration (light/dark mode)
 * - Font loading
 * - Navigation stack setup
 * - Status bar configuration
 */

// Import necessary navigation and theming components
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// Import font loading utility from Expo
import { useFonts } from 'expo-font';
// Import stack navigation component
import { Stack } from 'expo-router';
// Import status bar component for platform-specific status bar styling
import { StatusBar } from 'expo-status-bar';
// Import reanimated for animations
import 'react-native-reanimated';

// Import custom hook for color scheme management
import { useColorScheme } from '@/hooks/useColorScheme';

// Root layout component for the app
export default function RootLayout() {
  // Get the current color scheme (light/dark)
  const colorScheme = useColorScheme();
  // Load custom fonts using Expo's font loading system
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // If fonts are not loaded yet, render nothing (prevents font flicker)
    // Async font loading only occurs in development.
    return null;
  }

  // Render the navigation and theming providers
  return (
    // ThemeProvider wraps the app to provide consistent theming
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Stack navigator for handling screen transitions */}
      <Stack>
        {/* Main tab navigation screen - hidden header as it's handled by tab navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Screen for handling 404/not found routes */}
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* Status bar that adapts to the current theme */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
