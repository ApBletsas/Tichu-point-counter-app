import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useColors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: string;
  style?: ViewStyle;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = -25,
  max = 125,
  step = 5,
  disabled = false,
  error,
  style,
}) => {
  const colors = useColors();
  const [inputValue, setInputValue] = useState(value.toString());
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (text: string) => {
    // Allow empty string, negative sign, or numbers only
    if (text === '' || text === '-' || /^-?\d+$/.test(text)) {
      setInputValue(text);
      
      if (text === '' || text === '-') {
        setInputError('Value cannot be empty');
        return;
      }
      
      const numValue = parseInt(text, 10);
      
      if (isNaN(numValue)) {
        setInputError('Invalid number');
        return;
      }
      
      if (numValue < min) {
        setInputError(`Value must be at least ${min}`);
        return;
      }
      
      if (numValue > max) {
        setInputError(`Value must be at most ${max}`);
        return;
      }
      
      if (numValue % step !== 0) {
        setInputError(`Value must be a multiple of ${step}`);
        return;
      }
      
      // If we got here, the input is valid
      setInputError(null);
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // When input loses focus, ensure the value is valid
    if (inputValue === '' || inputValue === '-') {
      setInputValue('0');
      onChange(0);
      setInputError(null);
      return;
    }
    
    const numValue = parseInt(inputValue, 10);
    
    if (isNaN(numValue)) {
      setInputValue('0');
      onChange(0);
      setInputError(null);
      return;
    }
    
    // Ensure the value is within bounds
    let validValue = Math.max(min, Math.min(max, numValue));
    
    // Ensure the value is a multiple of step
    validValue = Math.round(validValue / step) * step;
    
    setInputValue(validValue.toString());
    onChange(validValue);
    setInputError(null);
  };

  const increment = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: colors.border, 
          backgroundColor: colors.surface 
        },
        (error || inputError) ? { borderColor: colors.error } : null, 
        disabled ? { opacity: 0.5, backgroundColor: colors.border } : null
      ]}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={decrement} 
          disabled={disabled || value <= min}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>-</Text>
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          editable={!disabled}
          selectTextOnFocus
          placeholderTextColor={colors.textSecondary}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={increment}
          disabled={disabled || value >= max}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>
      {(error || inputError) ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error || inputError}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 50,
    ...Shadows.sm,
  },
  button: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: '100%',
  },
  buttonText: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: FontSizes.lg,
    paddingVertical: Spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
}); 