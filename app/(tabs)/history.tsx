// Import StatusBar for controlling the device's status bar appearance
import { StatusBar } from 'expo-status-bar';
// Import React for component creation
import React from 'react';
// Import core React Native components for building the UI
import { StyleSheet, Text, View } from 'react-native';
// Import the RoundHistory component for displaying round details
import { RoundHistory } from '../../components/RoundHistory';
// Import theme constants and hooks for styling
import { BorderRadius, FontSizes, Shadows, Spacing, useColors, useDarkMode } from '../../constants/theme';
// Import game store hook for accessing game state
import { useGameStore } from '../../store/gameStore';

// History screen component for displaying game history
export default function HistoryScreen() {
  // Get game state and actions from the store
  const { rounds, undoLastRound, teams } = useGameStore();
  // Get theme colors and dark mode state
  const colors = useColors();
  const darkMode = useDarkMode();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Set status bar style based on dark mode */}
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      {/* Header section */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Game History</Text>
      </View>
      
      {/* Conditional rendering based on whether there are any rounds */}
      {rounds.length === 0 ? (
        // Empty state message when no rounds have been played
        <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No rounds played yet</Text>
        </View>
      ) : (
        // Round history display when rounds exist
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

// Styles for the history screen
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