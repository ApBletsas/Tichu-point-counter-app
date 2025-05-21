// Import React and necessary hooks for state management
import React, { useEffect, useState } from 'react';
// Import React Native components for building the UI
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
// Import theme constants and hooks for consistent styling
import { BorderRadius, FontSizes, Shadows, Spacing, useColors } from '../constants/theme';

// Define the props interface for the NumberInput component
interface NumberInputProps {
  label: string;                // Label text above the input
  value: number;               // Current numeric value
  onChange: (value: number) => void;  // Callback for value changes
  min?: number;                // Minimum allowed value (default: -25)
  max?: number;                // Maximum allowed value (default: 125)
  step?: number;               // Increment/decrement step (default: 5)
  disabled?: boolean;          // Whether the input is disabled
  error?: string;              // External error message
  style?: ViewStyle;           // Additional container styles
}

// NumberInput component definition with default prop values
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
  // Get theme colors for styling
  const colors = useColors();
  // State for the input's text value
  const [inputValue, setInputValue] = useState(value.toString());
  // State for internal validation errors
  const [inputError, setInputError] = useState<string | null>(null);

  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Handle text input changes with validation
  const handleInputChange = (text: string) => {
    // Validate input format (empty, negative sign, or numbers only)
    if (text === '' || text === '-' || /^-?\d+$/.test(text)) {
      setInputValue(text);
      
      // Handle empty input
      if (text === '' || text === '-') {
        setInputError('Value cannot be empty');
        return;
      }
      
      const numValue = parseInt(text, 10);
      
      // Validate number format
      if (isNaN(numValue)) {
        setInputError('Invalid number');
        return;
      }
      
      // Validate minimum value
      if (numValue < min) {
        setInputError(`Value must be at least ${min}`);
        return;
      }
      
      // Validate maximum value
      if (numValue > max) {
        setInputError(`Value must be at most ${max}`);
        return;
      }
      
      // Validate step increment
      if (numValue % step !== 0) {
        setInputError(`Value must be a multiple of ${step}`);
        return;
      }
      
      // Clear error and update value if all validations pass
      setInputError(null);
      onChange(numValue);
    }
  };

  // Handle input blur event
  const handleBlur = () => {
    // Handle empty or invalid input on blur
    if (inputValue === '' || inputValue === '-') {
      setInputValue('0');
      onChange(0);
      setInputError(null);
      return;
    }
    
    const numValue = parseInt(inputValue, 10);
    
    // Handle invalid number format
    if (isNaN(numValue)) {
      setInputValue('0');
      onChange(0);
      setInputError(null);
      return;
    }
    
    // Clamp value to min/max bounds
    let validValue = Math.max(min, Math.min(max, numValue));
    
    // Round to nearest step increment
    validValue = Math.round(validValue / step) * step;
    
    // Update value and clear error
    setInputValue(validValue.toString());
    onChange(validValue);
    setInputError(null);
  };

  // Increment value by step
  const increment = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  // Decrement value by step
  const decrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  // Render the component
  return (
    <View style={[styles.container, style]}>
      {/* Label text */}
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {/* Input container with increment/decrement buttons */}
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: colors.border, 
          backgroundColor: colors.surface 
        },
        (error || inputError) ? { borderColor: colors.error } : null, 
        disabled ? { opacity: 0.5, backgroundColor: colors.border } : null
      ]}>
        {/* Decrement button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={decrement} 
          disabled={disabled || value <= min}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>-</Text>
        </TouchableOpacity>
        
        {/* Numeric input field */}
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
        
        {/* Increment button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={increment}
          disabled={disabled || value >= max}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>
      {/* Error message display */}
      {(error || inputError) ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error || inputError}</Text>
      ) : null}
    </View>
  );
};

// Style definitions for the component
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