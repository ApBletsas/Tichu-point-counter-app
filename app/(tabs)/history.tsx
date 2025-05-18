import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../../store/gameStore';
import { RoundHistory } from '../../components/RoundHistory';
import { useColors, useDarkMode, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

export default function HistoryScreen() {
  const { rounds, undoLastRound, teams } = useGameStore();
  const colors = useColors();
  const darkMode = useDarkMode();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontStyle: 'italic',
  },
  historyContainer: {
    marginBottom: Spacing.lg,
  },
}); 