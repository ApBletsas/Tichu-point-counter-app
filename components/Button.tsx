import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useColors, BorderRadius, Spacing, FontSizes } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outlined' | 'error' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  titleStyle,
  fullWidth = false,
}) => {
  const colors = useColors();
  
  const getButtonStyles = () => {
    const baseStyles: ViewStyle[] = [styles.button, styles[size]];

    if (fullWidth) {
      baseStyles.push(styles.fullWidth);
    }

    // Add the appropriate background color based on variant
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

    if (disabled) {
      baseStyles.push({ opacity: 0.5 });
    }

    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  const getTextStyles = () => {
    const baseStyles: TextStyle[] = [styles.title, styles[`${size}Text`]];

    if (variant === 'outlined') {
      baseStyles.push({ color: colors.primary });
    } else {
      baseStyles.push({ color: colors.surface });
    }

    if (disabled) {
      baseStyles.push({ color: colors.textSecondary });
    }

    if (titleStyle) {
      baseStyles.push(titleStyle);
    }

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outlined' ? colors.primary : colors.surface} 
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  fullWidth: {
    width: '100%',
  },
  title: {
    fontWeight: '600',
  },
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