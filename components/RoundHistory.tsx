// Import React for component definition
import React from 'react';
// Import React Native components for building the UI
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Import theme constants and hooks for consistent styling
import { BorderRadius, FontSizes, Shadows, Spacing, useColors } from '../constants/theme';
// Import types for game data
import { Call, Round } from '../store/gameStore';

// Define the props interface for the RoundHistory component
interface RoundHistoryProps {
  rounds: Round[];                    // Array of completed rounds
  teamNames: { A: string, B: string };  // Names of both teams
  onUndoLastRound: () => void;       // Callback for undoing the last round
}

// RoundHistory component definition
export const RoundHistory: React.FC<RoundHistoryProps> = ({
  rounds,
  teamNames,
  onUndoLastRound,
}) => {
  // Get theme colors for styling
  const colors = useColors();
  
  // Helper function to render special calls information
  const renderCallsInfo = (calls: Call[]) => {
    if (calls.length === 0) return null;
    
    return (
      <View style={styles.callsContainer}>
        {calls.map((call, index) => {
          let callType = 'Unknown';
          let callDisplay = '';
          
          // Format call information based on type
          if (call.type === 'tichu') {
            callType = 'Tichu';
            const callResult = call.successful ? 'Success' : 'Failure';
            callDisplay = `${callType} - ${callResult}`;
          } else if (call.type === 'grandTichu') {
            callType = 'Grand Tichu';
            const callResult = call.successful ? 'Success' : 'Failure';
            callDisplay = `${callType} - ${callResult}`;
          } else if (call.type === 'oneTwo') {
            callDisplay = '1-2 (+200 points)';
          }
          
          // Get team name based on team ID
          const teamName = call.teamId === 'A' ? teamNames.A : teamNames.B;
          
          return (
            <View key={index} style={[styles.callItem, { borderLeftColor: colors.primary }]}>
              <Text style={[
                styles.callText,
                call.type === 'oneTwo' ? { color: colors.success } : 
                  (call.successful ? { color: colors.success } : { color: colors.error })
              ]}>
                {teamName}: {callDisplay}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header section with title and undo button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Round History</Text>
        {rounds.length > 0 && (
          <TouchableOpacity 
            style={[styles.undoButton, { backgroundColor: colors.error }]} 
            onPress={onUndoLastRound}
          >
            <Text style={[styles.undoButtonText, { color: colors.surface }]}>Undo Last Round</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Scrollable content area */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {rounds.length === 0 ? (
          // Display message when no rounds have been played
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>No rounds played yet</Text>
        ) : (
          // Map through and display each round
          rounds.map((round, index) => (
            <View key={index} style={[styles.roundItem, { borderColor: colors.border }]}>
              {/* Round header with round number */}
              <View style={[styles.roundHeader, { backgroundColor: colors.primary }]}>
                <Text style={[styles.roundNumber, { color: colors.surface }]}>Round {round.id}</Text>
              </View>
              
              {/* Round content with scores and calls */}
              <View style={styles.roundContent}>
                {/* Team scores display */}
                <View style={styles.scoreRow}>
                  <View style={[styles.teamScore, { backgroundColor: colors.teamA }]}>
                    <Text style={[styles.scoreText, { color: colors.surface }]}>{teamNames.A}: {round.teamAPoints}</Text>
                  </View>
                  <View style={[styles.teamScore, { backgroundColor: colors.teamB }]}>
                    <Text style={[styles.scoreText, { color: colors.surface }]}>{teamNames.B}: {round.teamBPoints}</Text>
                  </View>
                </View>
                
                {/* Display special calls for the round */}
                {renderCallsInfo(round.calls)}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Style definitions for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  undoButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  undoButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  emptyMessage: {
    padding: Spacing.lg,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  roundItem: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  roundHeader: {
    padding: Spacing.sm,
    alignItems: 'center',
  },
  roundNumber: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  roundContent: {
    padding: Spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamScore: {
    flex: 1,
    padding: Spacing.sm,
    margin: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  callsContainer: {
    marginTop: Spacing.sm,
  },
  callItem: {
    padding: Spacing.xs,
    borderLeftWidth: 3,
    marginVertical: Spacing.xs,
  },
  callText: {
    fontSize: FontSizes.sm,
  },
});