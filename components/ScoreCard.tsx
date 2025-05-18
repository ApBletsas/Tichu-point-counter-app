import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';
import { Call } from '../store/gameStore';

interface ScoreCardProps {
  label: string;
  score: number;
  teamColor: string;
  calls?: Call[];
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  label,
  score,
  teamColor,
  calls = [],
}) => {
  const colors = useColors();
  
  const getCallSummary = (calls: Call[], teamId: 'A' | 'B') => {
    const teamCalls = calls.filter(call => call.teamId === teamId);
    if (teamCalls.length === 0) return null;
    
    return teamCalls.map((call, index) => {
      if (call.type === 'oneTwo') {
        // For 1-2 calls, always show as +200 points
        return (
          <Text key={index} style={[styles.callText, { color: colors.success }]}>
            1-2 +200
          </Text>
        );
      }
      
      // For tichu and grandTichu
      let callType = '';
      if (call.type === 'tichu') callType = 'T';
      else if (call.type === 'grandTichu') callType = 'GT';
      
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
      <View style={[styles.header, { backgroundColor: teamColor }]}>
        <Text style={[styles.label, { color: colors.surface }]}>{label}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.score, { color: colors.text }]}>{score}</Text>
        
        {calls.length > 0 && (
          <View style={styles.callsContainer}>
            {getCallSummary(calls, label === 'Team A' ? 'A' : 'B')}
          </View>
        )}
      </View>
    </View>
  );
};

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
    fontSize: FontSizes.xxxl * 1.2,
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