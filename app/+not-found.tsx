// Import Link and Stack components from expo-router for navigation
import { Link, Stack } from 'expo-router';
// Import StyleSheet from react-native for styling
import { StyleSheet } from 'react-native';

// Import themed components for consistent styling
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// NotFoundScreen component that renders the 404 error page
export default function NotFoundScreen() {
  return (
    <>
      {/* Set the screen title to "Oops!" */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      {/* Main container with themed background */}
      <ThemedView style={styles.container}>
        {/* Error message text */}
        <ThemedText type="title">This screen does not exist.</ThemedText>
        {/* Link to return to home screen */}
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

// Style definitions for the not found screen
const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1,                    // Take up all available space
    alignItems: 'center',       // Center children horizontally
    justifyContent: 'center',   // Center children vertically
    padding: 20,               // Add padding around the content
  },
  // Link style
  link: {
    marginTop: 15,             // Add space above the link
    paddingVertical: 15,       // Add vertical padding to the link
  },
});