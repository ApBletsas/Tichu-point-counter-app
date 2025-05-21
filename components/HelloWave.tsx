// Import useEffect hook for handling component lifecycle
import { useEffect } from 'react';
// Import StyleSheet for component styling
import { StyleSheet } from 'react-native';
// Import necessary functions from react-native-reanimated for animations
import Animated, {
  useAnimatedStyle, // Hook for creating animated styles
  useSharedValue, // Hook for creating shared animation values
  withRepeat, // Function to repeat animations
  withSequence, // Function to chain multiple animations
  withTiming, // Function for smooth timing-based animations
} from 'react-native-reanimated';

// Import ThemedText component for consistent text styling
import { ThemedText } from '@/components/ThemedText';

// HelloWave component definition
export function HelloWave() {
  // Create a shared value for the rotation animation, starting at 0 degrees
  const rotationAnimation = useSharedValue(0);

  // Set up the animation when the component mounts
  useEffect(() => {
    // Configure the animation sequence
    rotationAnimation.value = withRepeat(
      // Create a sequence of two animations:
      withSequence(
        // First animation: rotate to 25 degrees over 150ms
        withTiming(25, { duration: 150 }),
        // Second animation: rotate back to 0 degrees over 150ms
        withTiming(0, { duration: 150 })
      ),
      4  // Repeat the entire sequence 4 times
    );
  }, [rotationAnimation]);

  // Create an animated style that applies the rotation transform
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  // Render the animated waving hand emoji
  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={styles.text}>👋</ThemedText>
    </Animated.View>
  );
}

// Style definitions for the component
const styles = StyleSheet.create({
  text: {
    fontSize: 28,        // Large font size for the emoji
    lineHeight: 32,      // Line height for proper vertical alignment
    marginTop: -6,       // Slight upward adjustment for better positioning
  },
});