// Import React types for component props and children
import type { PropsWithChildren, ReactElement } from 'react';
// Import StyleSheet for component styling
import { StyleSheet } from 'react-native';
// Import necessary functions from react-native-reanimated for animations
import Animated, {
  interpolate, // Function to interpolate between values
  useAnimatedRef, // Hook for creating animated refs
  useAnimatedStyle, // Hook for creating animated styles
  useScrollViewOffset, // Hook to track scroll position
} from 'react-native-reanimated';

// Import themed components and hooks
import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

// Constant for header height
const HEADER_HEIGHT = 250;

// Define the props interface for the component
type Props = PropsWithChildren<{
  headerImage: ReactElement;                    // Header image component
  headerBackgroundColor: { dark: string; light: string };  // Theme-aware background color
}>;

// ParallaxScrollView component definition
export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  // Get current color scheme (light/dark)
  const colorScheme = useColorScheme() ?? 'light';
  // Create animated ref for the scroll view
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  // Track scroll offset for animations
  const scrollOffset = useScrollViewOffset(scrollRef);
  // Get bottom tab bar overflow for proper layout
  const bottom = useBottomTabOverflow();

  // Create animated style for header based on scroll position
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // Translate header based on scroll position
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        // Scale header based on scroll position
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  // Render the component
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}  // Optimize scroll performance
        scrollIndicatorInsets={{ bottom }}  // Adjust scroll indicator for tab bar
        contentContainerStyle={{ paddingBottom: bottom }}> 
        {/* Animated header with parallax effect */}
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        {/* Main content area */}
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

// Style definitions for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Take up all available space
  },
  header: {
    height: HEADER_HEIGHT,  // Fixed header height
    overflow: 'hidden',     // Clip content outside bounds
  },
  content: {
    flex: 1,
    padding: 32,           // Content padding
    gap: 16,               // Space between child elements
    overflow: 'hidden',    // Clip content outside bounds
  },
});