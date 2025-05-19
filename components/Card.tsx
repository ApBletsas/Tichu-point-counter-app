import React from 'react';
import { StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

export function Card({ children, style, backgroundColor }: CardProps) {
  const colorScheme = useColorScheme();
  const defaultBackgroundColor = colorScheme === 'dark' ? '#1c1c1e' : '#fff';
  const borderColor = colorScheme === 'dark' ? '#2c2c2e' : '#e5e5e5';

  return (
    <View style={[styles.card, { backgroundColor: backgroundColor || defaultBackgroundColor, borderColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 