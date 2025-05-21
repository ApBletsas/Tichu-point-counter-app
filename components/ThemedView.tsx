// Import View component and its type definition from React Native
import { View, type ViewProps } from 'react-native';

// Import custom hook for theme color management
import { useThemeColor } from '@/hooks/useThemeColor';

// Define the props interface extending ViewProps with theme-specific properties
export type ThemedViewProps = ViewProps & {
  lightColor?: string;    // Custom background color for light theme
  darkColor?: string;     // Custom background color for dark theme
};

// ThemedView component definition
export function ThemedView({ 
  style,                // Additional custom styles
  lightColor,           // Light theme color override
  darkColor,            // Dark theme color override
  ...otherProps         // Rest of View component props
}: ThemedViewProps) {
  // Get the appropriate background color based on current theme
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    'background'
  );

  // Return a View with theme-aware background color and custom styles
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}