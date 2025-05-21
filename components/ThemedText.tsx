// Import necessary components and types from React Native
import { StyleSheet, Text, type TextProps } from 'react-native';

// Import custom hook for theme color management
import { useThemeColor } from '@/hooks/useThemeColor';

// Define the props interface extending TextProps with theme-specific properties
export type ThemedTextProps = TextProps & {
  lightColor?: string;    // Custom color for light theme
  darkColor?: string;     // Custom color for dark theme
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';  // Text style variants
};

// ThemedText component definition with default props
export function ThemedText({
  style,                // Additional custom styles
  lightColor,           // Light theme color override
  darkColor,            // Dark theme color override
  type = 'default',     // Default text type
  ...rest              // Rest of Text component props
}: ThemedTextProps) {
  // Get the appropriate text color based on current theme
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      // Apply styles in order of precedence
      style={[
        { color },      // Base theme color
        // Apply type-specific styles based on the type prop
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,          // Custom styles override defaults
      ]}
      {...rest}        // Pass through remaining Text props
    />
  );
}

// Style definitions for different text types
const styles = StyleSheet.create({
  // Default text style with standard size and line height
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  // Semi-bold variant of default text
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  // Large title text with bold weight
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  // Medium-sized subtitle text
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Link style with specific color and line height
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',  // Default link color
  },
});