import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface TichuCallToggleProps {
  type: 'tichu' | 'grandTichu' | 'oneTwo';
  teamName: string;
  teamColor?: string;
  selected: boolean;
  successful: boolean | null;
  onToggle: () => void;
  onSuccess: (success: boolean) => void;
  disabled?: boolean;
  failedOnly?: boolean;  // New prop to indicate that only "Failed" is allowed
}

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
  const colors = useColors();
  
  const getTitle = () => {
    if (type === 'tichu') return 'Tichu';
    if (type === 'grandTichu') return 'Grand Tichu';
    if (type === 'oneTwo') return '1-2';
    return '';
  };

  const getContainerStyle = () => {
    if (disabled) return [styles.container, { borderColor: colors.border, backgroundColor: colors.border, opacity: 0.6 }];
    if (!selected) return [styles.container, { borderColor: colors.border, backgroundColor: colors.surface }];
    
    // For oneTwo, use success style when selected
    if (type === 'oneTwo') return [styles.container, { borderColor: colors.success, backgroundColor: colors.success }];

    // For tichu and grandTichu
    const baseStyle = [styles.container, { borderColor: colors.primary, backgroundColor: colors.primary }];
    
    if (successful === true) {
      return [...baseStyle, { borderColor: colors.success, backgroundColor: colors.success }];
    } else if (successful === false) {
      return [...baseStyle, { borderColor: colors.error, backgroundColor: colors.error }];
    }
    
    return baseStyle;
  };

  const handlePress = () => {
    if (disabled) return;
    
    // If this is a failed-only call and it's not selected yet,
    // automatically mark it as failed when selected
    if (failedOnly && !selected && type !== 'oneTwo') {
      onToggle();
      onSuccess(false);
      return;
    }
    
    // For all call types, just toggle the selected state
    onToggle();
  };

  return (
    <View style={styles.wrapper}>
      {teamName ? <Text style={[styles.teamName, teamColor ? { color: teamColor } : { color: colors.text }]}>{teamName}</Text> : null}
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
        
        {/* Cancel button when selected */}
        {selected && !disabled && (
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.error }]}
            onPress={onToggle} // Same as toggle, will unselect it
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialIcons name="cancel" size={18} color={colors.surface} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      {/* Only show success/failure options for tichu and grandTichu */}
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
      
      {/* Auto-set to Failed for failedOnly - just show Failed state */}
      {selected && !disabled && failedOnly && type !== 'oneTwo' && (
        <Text style={[styles.outcomeLabel, { color: colors.error }]}>
          Failure
        </Text>
      )}
      
      {/* Normal outcome label for non-failedOnly */}
      {selected && !disabled && !failedOnly && type !== 'oneTwo' && successful !== null && (
        <Text style={[
          styles.outcomeLabel,
          successful ? { color: colors.success } : { color: colors.error }
        ]}>
          {successful ? 'Success' : 'Failure'}
        </Text>
      )}
      
      {/* For oneTwo, always show +200 points when selected */}
      {selected && !disabled && type === 'oneTwo' && (
        <Text style={[styles.outcomeLabel, { color: colors.success }]}>
          +200 points
        </Text>
      )}
    </View>
  );
};

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
    position: 'relative', // Add this for absolute positioning of cancel button
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