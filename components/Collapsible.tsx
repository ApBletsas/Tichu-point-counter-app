// Import React and necessary hooks for component functionality
import React, { PropsWithChildren, useState } from 'react';
// Import React Native components for building the UI
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Import theme constants for consistent styling
import { Colors, FontSizes, Spacing } from '../constants/theme';

// Define the props interface for the Collapsible component
interface CollapsibleProps {
  title: string;                // The title text to display in the header
  initiallyExpanded?: boolean;  // Whether the component starts expanded (defaults to false)
}

// Collapsible component definition
export function Collapsible({ 
  children,                    // Content to be shown/hidden
  title,                      // Title text
  initiallyExpanded = false   // Default to collapsed state
}: PropsWithChildren<CollapsibleProps>) {
  // State to track whether the component is expanded or collapsed
  const [isOpen, setIsOpen] = useState(initiallyExpanded);

  return (
    // Main container with consistent spacing and styling
    <View style={styles.container}>
      {/* Touchable header that toggles the expanded state */}
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        {/* Rotating chevron indicator */}
        <Text style={[
          styles.chevron, 
          { transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }
        ]}>›</Text>
        {/* Title text */}
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {/* Conditionally render content when expanded */}
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

// Style definitions for the component
const styles = StyleSheet.create({
  // Main container with margins, background, and rounded corners
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
  },
  // Header layout with horizontal alignment
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Chevron styling with primary color and bold weight
  chevron: {
    fontSize: 24,
    marginRight: Spacing.sm,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  // Title text styling with large font size and semi-bold weight
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  // Content container with top margin and left indentation
  content: {
    marginTop: Spacing.sm,
    marginLeft: Spacing.lg,
  },
});