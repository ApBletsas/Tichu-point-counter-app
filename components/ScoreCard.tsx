// Import React for component definition
import React from 'react';
// Import React Native components for building the UI
import { StyleSheet, Text, View } from 'react-native';
// Import theme constants and hooks for consistent styling
import { BorderRadius, FontSizes, Shadows, Spacing, useColors } from '../constants/theme';
// Import Call type for special calls data
import { Call } from '../store/gameStore';

// Define the props interface for the ScoreCard component
interface ScoreCardProps {
  label: string;          // Team label (e.g., "Team A")
  score: number;          // Current team score
  teamColor: string;      // Team's theme color
  calls?: Call[];         // Array of special calls made by the team
}

// ScoreCard component definition with default props
export const ScoreCard: React.FC<ScoreCardProps> = ({
  label,
  score,
  teamColor,
  calls = [],            // Default to empty array if no calls provided
}) => {
  // Get theme colors for styling
  const colors = useColors();
  
  // Helper function to generate summary of special calls
  const getCallSummary = (calls: Call[], teamId: 'A' | 'B') => {
    // Filter calls for the specific team
    const teamCalls = calls.filter(call => call.teamId === teamId);
    if (teamCalls.length === 0) return null;
    
    // Map through team's calls and create visual indicators
    return teamCalls.map((call, index) => {
      if (call.type === 'oneTwo') {
        // Display 1-2 call with fixed points
        return (
          <Text key={index} style={[styles.callText, { color: colors.success }]}>
            1-2 +200
          </Text>
        );
      }
      
      // Handle Tichu and Grand Tichu calls
      let callType = '';
      if (call.type === 'tichu') callType = 'T';
      else if (call.type === 'grandTichu') callType = 'GT';
      
      // Show success (✓) or failure (✗) indicator
      const callStatus = call.successful ? '✓' : '✗';
      return (
        <Text key={index} style={[
          styles.callText, 
          call.successful ? { color: colors.success } : { color: colors.error }
        ]}>
          {callType} {callStatus}
        </Text>
      );
    });
  };

  return (
    <View style={[styles.container, { borderColor: teamColor, backgroundColor: colors.surface }]}>
      {/* Team header with team color background */}
      <View style={[styles.header, { backgroundColor: teamColor }]}>
        <Text style={[styles.label, { color: colors.surface }]}>{label}</Text>
      </View>
      
      {/* Card content with score and calls */}
      <View style={styles.content}>
        {/* Display team score */}
        <Text style={[styles.score, { color: colors.text }]}>{score}</Text>
        
        {/* Display special calls if any exist */}
        {calls.length > 0 && (
          <View style={styles.callsContainer}>
            {getCallSummary(calls, label === 'Team A' ? 'A' : 'B')}
          </View>
        )}
      </View>
    </View>
  );
};

// Style definitions for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    ...Shadows.md,
  },
  header: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  label: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  content: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  score: {
    fontSize: FontSizes.xxxl * 1.2,  // Large score display
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  callsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  callText: {
    marginHorizontal: Spacing.sm,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
});