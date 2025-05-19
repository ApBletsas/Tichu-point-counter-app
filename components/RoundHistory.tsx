import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, FontSizes, Shadows, Spacing, useColors } from '../constants/theme';
import { Call, Round } from '../store/gameStore';

interface RoundHistoryProps {
  rounds: Round[];
  teamNames: { A: string, B: string };
  onUndoLastRound: () => void;
}

export const RoundHistory: React.FC<RoundHistoryProps> = ({
  rounds,
  teamNames,
  onUndoLastRound,
}) => {
  const colors = useColors();
  
  const renderCallsInfo = (calls: Call[]) => {
    if (calls.length === 0) return null;
    
    return (
      <View style={styles.callsContainer}>
        {calls.map((call, index) => {
          let callType = 'Unknown';
          let callDisplay = '';
          
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
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {rounds.length === 0 ? (
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>No rounds played yet</Text>
        ) : (
          rounds.map((round, index) => (
            <View key={index} style={[styles.roundItem, { borderColor: colors.border }]}>
              <View style={[styles.roundHeader, { backgroundColor: colors.primary }]}>
                <Text style={[styles.roundNumber, { color: colors.surface }]}>Round {round.id}</Text>
              </View>
              
              <View style={styles.roundContent}>
                <View style={styles.scoreRow}>
                  <View style={[styles.teamScore, { backgroundColor: colors.teamA }]}>
                    <Text style={[styles.scoreText, { color: colors.surface }]}>{teamNames.A}: {round.teamAPoints}</Text>
                  </View>
                  <View style={[styles.teamScore, { backgroundColor: colors.teamB }]}>
                    <Text style={[styles.scoreText, { color: colors.surface }]}>{teamNames.B}: {round.teamBPoints}</Text>
                  </View>
                </View>
                
                {renderCallsInfo(round.calls)}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

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