import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Colors, Spacing, FontSizes } from '../constants/theme';

interface CollapsibleProps {
  title: string;
  initiallyExpanded?: boolean;
}

export function Collapsible({ children, title, initiallyExpanded = false }: PropsWithChildren<CollapsibleProps>) {
  const [isOpen, setIsOpen] = useState(initiallyExpanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <Text style={[
          styles.chevron, 
          { transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }
        ]}>›</Text>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 24,
    marginRight: Spacing.sm,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    marginTop: Spacing.sm,
    marginLeft: Spacing.lg,
  },
});
