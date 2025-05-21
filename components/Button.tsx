// Import React for component definition
import React from 'react';
// Import necessary React Native components and types
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
// Import theme constants and hooks for consistent styling
import { BorderRadius, FontSizes, Spacing, useColors } from '../constants/theme';

// Define the props interface for the Button component
interface ButtonProps {
  title: string;                // Button text content
  onPress: () => void;         // Function to call when button is pressed
  variant?: 'primary' | 'secondary' | 'outlined' | 'error' | 'success';  // Button style variant
  size?: 'small' | 'medium' | 'large';  // Button size
  disabled?: boolean;          // Whether the button is disabled
  loading?: boolean;           // Whether to show loading indicator
  style?: ViewStyle;           // Additional container styles
  titleStyle?: TextStyle;      // Additional text styles
  fullWidth?: boolean;         // Whether the button should take full width
}

// Button component definition with default prop values
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',         // Default to primary variant
  size = 'medium',            // Default to medium size
  disabled = false,           // Default to enabled
  loading = false,            // Default to not loading
  style,
  titleStyle,
  fullWidth = false,          // Default to not full width
}) => {
  // Get theme colors for styling
  const colors = useColors();
  
  // Function to generate button container styles
  const getButtonStyles = () => {
    // Start with base button styles and size-specific styles
    const baseStyles: ViewStyle[] = [styles.button, styles[size]];

    // Add full width style if specified
    if (fullWidth) {
      baseStyles.push(styles.fullWidth);
    }

    // Add variant-specific styles
    if (variant === 'outlined') {
      baseStyles.push({ 
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      });
    } else if (variant === 'primary') {
      baseStyles.push({ backgroundColor: colors.primary });
    } else if (variant === 'secondary') {
      baseStyles.push({ backgroundColor: colors.secondary });
    } else if (variant === 'error') {
      baseStyles.push({ backgroundColor: colors.error });
    } else if (variant === 'success') {
      baseStyles.push({ backgroundColor: colors.success });
    }

    // Add disabled state style
    if (disabled) {
      baseStyles.push({ opacity: 0.5 });
    }

    // Add custom styles if provided
    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  // Function to generate button text styles
  const getTextStyles = () => {
    // Start with base text styles and size-specific styles
    const baseStyles: TextStyle[] = [styles.title, styles[`${size}Text`]];

    // Add variant-specific text color
    if (variant === 'outlined') {
      baseStyles.push({ color: colors.primary });
    } else {
      baseStyles.push({ color: colors.surface });
    }

    // Add disabled state text color
    if (disabled) {
      baseStyles.push({ color: colors.textSecondary });
    }

    // Add custom text styles if provided
    if (titleStyle) {
      baseStyles.push(titleStyle);
    }

    return baseStyles;
  };

  // Render the button component
  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        // Show loading indicator when loading
        <ActivityIndicator 
          size="small" 
          color={variant === 'outlined' ? colors.primary : colors.surface} 
        />
      ) : (
        // Show button text when not loading
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Style definitions for the button component
const styles = StyleSheet.create({
  // Base button style with rounded corners and centered content
  button: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Size-specific styles with different padding and minimum widths
  small: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    minWidth: 80,
  },
  medium: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minWidth: 120,
  },
  large: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minWidth: 160,
  },
  // Full width style
  fullWidth: {
    width: '100%',
  },
  // Base text style with semi-bold weight
  title: {
    fontWeight: '600',
  },
  // Size-specific text styles with different font sizes
  smallText: {
    fontSize: FontSizes.xs,
  },
  mediumText: {
    fontSize: FontSizes.md,
  },
  largeText: {
    fontSize: FontSizes.lg,
  },
});