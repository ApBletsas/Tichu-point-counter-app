/**
 * Stats Screen Component
 * 
 * This screen displays comprehensive game statistics for the Tichu game, including:
 * - Total number of games played
 * - Number of games won by each team
 * - Success rates for Tichu and Grand Tichu calls
 * All statistics are presented in a card-based layout with team-specific comparisons.
 */

// Import core React Native components for building the UI
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// Import Card component for consistent card styling
import { Card } from '../../components/Card';
// Import theme constants and hooks for styling
import { FontSizes, Spacing, useColors, useDarkMode } from '../../constants/theme';
// Import game store for accessing game state
import { useGameStore } from '../../store/gameStore';

export default function StatsScreen() {
  // Get game state from the store
  const { rounds, teams, winningScore } = useGameStore();
  // Get theme colors for consistent styling
  const colors = useColors();
  // Get dark mode status for theme-aware styling
  const isDark = useDarkMode();

  // Calculate total games played (10 rounds per game)
  const totalGames = rounds.length > 0 ? Math.ceil(rounds.length / 10) : 0;
  
  // Calculate statistics for Team A
  const teamAStats = {
    // Count wins by checking when team reached winning score
    wins: rounds.reduce((wins, round) => {
      const teamATotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamAPoints, 0);
      const teamBTotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamBPoints, 0);
      return teamATotal >= winningScore ? wins + 1 : wins;
    }, 0),
    // Calculate Tichu success rate as percentage
    tichuSuccessRate: (() => {
      const totalTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'tichu').length, 0);
      const successfulTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'tichu' && call.successful).length, 0);
      return totalTichus > 0 ? (successfulTichus / totalTichus * 100).toFixed(1) : '0.0';
    })(),
    // Calculate Grand Tichu success rate as percentage
    grandTichuSuccessRate: (() => {
      const totalGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'grandTichu').length, 0);
      const successfulGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'grandTichu' && call.successful).length, 0);
      return totalGrandTichus > 0 ? (successfulGrandTichus / totalGrandTichus * 100).toFixed(1) : '0.0';
    })(),
  };

  // Calculate statistics for Team B (mirrors Team A calculations)
  const teamBStats = {
    // Count wins by checking when team reached winning score
    wins: rounds.reduce((wins, round) => {
      const teamATotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamAPoints, 0);
      const teamBTotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamBPoints, 0);
      return teamBTotal >= winningScore ? wins + 1 : wins;
    }, 0),
    // Calculate Tichu success rate as percentage
    tichuSuccessRate: (() => {
      const totalTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'tichu').length, 0);
      const successfulTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'tichu' && call.successful).length, 0);
      return totalTichus > 0 ? (successfulTichus / totalTichus * 100).toFixed(1) : '0.0';
    })(),
    // Calculate Grand Tichu success rate as percentage
    grandTichuSuccessRate: (() => {
      const totalGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'grandTichu').length, 0);
      const successfulGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'grandTichu' && call.successful).length, 0);
      return totalGrandTichus > 0 ? (successfulGrandTichus / totalGrandTichus * 100).toFixed(1) : '0.0';
    })(),
  };

  // Reusable component for displaying statistics in a card format
  const StatCard = ({ title, teamAValue, teamBValue }: { title: string; teamAValue: number | string; teamBValue: number | string }) => (
    <Card 
      style={styles.statCard} 
      backgroundColor={isDark ? colors.primary + '30' : colors.primary + '20'}
    >
      <Text style={[styles.statTitle, { color: isDark ? colors.primary + 'CC' : colors.primary }]}>{title}</Text>
      <View style={styles.statRow}>
        <Text style={[styles.teamName, { color: colors.text }]}>{teams.A.name}</Text>
        <Text style={[styles.statValue, { color: colors.text }]}>{teamAValue}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={[styles.teamName, { color: colors.text }]}>{teams.B.name}</Text>
        <Text style={[styles.statValue, { color: colors.text }]}>{teamBValue}</Text>
      </View>
    </Card>
  );

  return (
    // Main scrollable container with theme-aware background
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with theme-aware color */}
      <Text style={[styles.header, { color: isDark ? colors.primary + 'CC' : colors.primary }]}>Game Statistics</Text>
      
      {/* Statistics Cards Section */}
      <StatCard 
        title="Games Played" 
        teamAValue={totalGames} 
        teamBValue={totalGames} 
      />
      
      <StatCard 
        title="Games Won" 
        teamAValue={teamAStats.wins} 
        teamBValue={teamBStats.wins} 
      />
      
      <StatCard 
        title="Tichu Success Rate (%)" 
        teamAValue={teamAStats.tichuSuccessRate} 
        teamBValue={teamBStats.tichuSuccessRate} 
      />
      
      <StatCard 
        title="Grand Tichu Success Rate (%)" 
        teamAValue={teamAStats.grandTichuSuccessRate} 
        teamBValue={teamBStats.grandTichuSuccessRate} 
      />
    </ScrollView>
  );
}

// Styles for the stats screen
const styles = StyleSheet.create({
  // Main container that fills the screen with padding
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  // Header text style with center alignment
  header: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  // Card container style with margin and padding
  statCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  // Card title text style
  statTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  // Row layout for team name and value
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  // Team name text style with flex for proper spacing
  teamName: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  // Stat value text style
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
}); 