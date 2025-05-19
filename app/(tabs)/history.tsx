import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RoundHistory } from '../../components/RoundHistory';
import { BorderRadius, FontSizes, Shadows, Spacing, useColors, useDarkMode } from '../../constants/theme';
import { useGameStore } from '../../store/gameStore';

export default function HistoryScreen() {
  const { rounds, undoLastRound, teams } = useGameStore();
  const colors = useColors();
  const darkMode = useDarkMode();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Game History</Text>
      </View>
      
      {rounds.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No rounds played yet</Text>
        </View>
      ) : (
        <View style={styles.historyContainer}>
          <RoundHistory 
            rounds={rounds} 
            teamNames={{ A: teams.A.name, B: teams.B.name }}
            onUndoLastRound={undoLastRound} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontStyle: 'italic',
  },
  historyContainer: {
    flex: 1,
  },
}); 