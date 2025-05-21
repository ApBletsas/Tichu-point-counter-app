// Import React for component definition
import React from 'react';
// Import React Native components for building the UI
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Import theme constants and hooks for consistent styling
import { BorderRadius, FontSizes, Shadows, Spacing, useColors } from '../constants/theme';
// Import Material Icons for the cancel button
import { MaterialIcons } from '@expo/vector-icons';

// Define the props interface for the TichuCallToggle component
interface TichuCallToggleProps {
  type: 'tichu' | 'grandTichu' | 'oneTwo';  // Type of special call
  teamName: string;                         // Name of the team making the call
  teamColor?: string;                       // Team's theme color
  selected: boolean;                        // Whether the call is selected
  successful: boolean | null;               // Call outcome (null if not yet determined)
  onToggle: () => void;                     // Callback for toggling selection
  onSuccess: (success: boolean) => void;    // Callback for setting success/failure
  disabled?: boolean;                       // Whether the toggle is disabled
  failedOnly?: boolean;                     // Whether only "Failed" is allowed
}

// TichuCallToggle component definition with default props
export const TichuCallToggle: React.FC<TichuCallToggleProps> = ({
  type,
  teamName,
  teamColor,
  selected,
  successful,
  onToggle,
  onSuccess,
  disabled = false,
  failedOnly = false,
}) => {
  // Get theme colors for styling
  const colors = useColors();
  
  // Helper function to get the display title based on call type
  const getTitle = () => {
    if (type === 'tichu') return 'Tichu';
    if (type === 'grandTichu') return 'Grand Tichu';
    if (type === 'oneTwo') return '1-2';
    return '';
  };

  // Helper function to determine container style based on state
  const getContainerStyle = () => {
    // Handle disabled state
    if (disabled) return [styles.container, { borderColor: colors.border, backgroundColor: colors.border, opacity: 0.6 }];
    // Handle unselected state
    if (!selected) return [styles.container, { borderColor: colors.border, backgroundColor: colors.surface }];
    
    // Handle 1-2 call style
    if (type === 'oneTwo') return [styles.container, { borderColor: colors.success, backgroundColor: colors.success }];

    // Handle Tichu and Grand Tichu styles
    const baseStyle = [styles.container, { borderColor: colors.primary, backgroundColor: colors.primary }];
    
    // Apply success/failure colors
    if (successful === true) {
      return [...baseStyle, { borderColor: colors.success, backgroundColor: colors.success }];
    } else if (successful === false) {
      return [...baseStyle, { borderColor: colors.error, backgroundColor: colors.error }];
    }
    
    return baseStyle;
  };

  // Handle press events on the toggle
  const handlePress = () => {
    if (disabled) return;
    
    // Handle failed-only calls
    if (failedOnly && !selected && type !== 'oneTwo') {
      onToggle();
      onSuccess(false);
      return;
    }
    
    onToggle();
  };

  return (
    <View style={styles.wrapper}>
      {/* Team name display */}
      {teamName ? <Text style={[styles.teamName, teamColor ? { color: teamColor } : { color: colors.text }]}>{teamName}</Text> : null}
      
      {/* Main toggle button */}
      <TouchableOpacity 
        style={getContainerStyle()} 
        onPress={handlePress}
        disabled={disabled}
      >
        <Text style={[
          styles.title, 
          { color: colors.text },
          (selected || (type === 'oneTwo' && selected)) ? { color: colors.surface } : null,
          disabled ? { color: colors.textSecondary } : null,
          failedOnly && !disabled ? { color: colors.error } : null
        ]}>
          {getTitle()}
          {failedOnly && !disabled && !selected ? " (Failed)" : ""}
        </Text>
        
        {/* Cancel button for selected state */}
        {selected && !disabled && (
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.error }]}
            onPress={onToggle}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialIcons name="cancel" size={18} color={colors.surface} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      {/* Success/Failure buttons for Tichu and Grand Tichu */}
      {selected && !disabled && !failedOnly && type !== 'oneTwo' && successful === null && (
        <View style={styles.outcomeContainer}>
          <TouchableOpacity 
            style={[styles.outcomeButton, { backgroundColor: colors.success }]} 
            onPress={() => onSuccess(true)}
          >
            <Text style={[styles.outcomeText, { color: colors.surface }]}>Success</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.outcomeButton, { backgroundColor: colors.error }]} 
            onPress={() => onSuccess(false)}
          >
            <Text style={[styles.outcomeText, { color: colors.surface }]}>Failure</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Failed-only state display */}
      {selected && !disabled && failedOnly && type !== 'oneTwo' && (
        <Text style={[styles.outcomeLabel, { color: colors.error }]}>
          Failure
        </Text>
      )}
      
      {/* Success/Failure outcome display */}
      {selected && !disabled && !failedOnly && type !== 'oneTwo' && successful !== null && (
        <Text style={[
          styles.outcomeLabel,
          successful ? { color: colors.success } : { color: colors.error }
        ]}>
          {successful ? 'Success' : 'Failure'}
        </Text>
      )}
      
      {/* Points display for 1-2 calls */}
      {selected && !disabled && type === 'oneTwo' && (
        <Text style={[styles.outcomeLabel, { color: colors.success }]}>
          +200 points
        </Text>
      )}
    </View>
  );
};

// Style definitions for the component
const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.sm,
    alignItems: 'center',
    width: '30%',
    minWidth: 100,
  },
  teamName: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
    ...Shadows.sm,
    position: 'relative',
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  outcomeContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  outcomeButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
    minWidth: 80,
    alignItems: 'center',
  },
  outcomeText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  outcomeLabel: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  cancelButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
});