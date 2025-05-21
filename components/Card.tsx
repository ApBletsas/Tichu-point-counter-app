// Import React for component definition
import React from 'react';
// Import necessary React Native components and types
import { StyleSheet, View, ViewStyle } from 'react-native';
// Import theme constants for consistent styling
import { BorderRadius, Shadows } from '../constants/theme';

// Define the props interface for the Card component
interface CardProps {
  children: React.ReactNode;    // Content to be rendered inside the card
  style?: ViewStyle;           // Additional container styles
  backgroundColor?: string;     // Custom background color (defaults to transparent)
}

// Card component definition with default prop values
const Card: React.FC<CardProps> = ({ 
  children,                    // Content to be rendered
  style,                      // Custom styles
  backgroundColor = 'transparent'  // Default background color
}) => {
  return (
    // View component that combines base styles, background color, and custom styles
    <View style={[
      styles.card,            // Base card styles
      { backgroundColor },    // Background color style
      style                   // Custom styles
    ]}>
      {children}              {/* Render the card's content */}
    </View>
  );
};

// Style definitions for the card component
const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,  // Rounded corners using theme constant
    padding: 16,                   // Internal spacing
    ...Shadows.md,                 // Shadow effect from theme constants
  },
});

// Export the Card component
export { Card };
