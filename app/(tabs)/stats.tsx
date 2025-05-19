import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { useColors, useDarkMode } from '../../constants/theme';
import { useGameStore } from '../../store/gameStore';

export default function StatsScreen() {
  const { rounds, teams, winningTeam } = useGameStore();
  const colors = useColors();
  const isDark = useDarkMode();

  // Calculate statistics
  const totalGames = rounds.length > 0 ? Math.ceil(rounds.length / 10) : 0; // Assuming 10 rounds per game
  
  const teamAStats = {
    wins: rounds.reduce((wins, round) => {
      const teamATotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamAPoints, 0);
      const teamBTotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamBPoints, 0);
      return teamATotal >= 1000 ? wins + 1 : wins;
    }, 0),
    tichuSuccessRate: (() => {
      const totalTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'tichu').length, 0);
      const successfulTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'tichu' && call.successful).length, 0);
      return totalTichus > 0 ? (successfulTichus / totalTichus * 100).toFixed(1) : '0.0';
    })(),
    grandTichuSuccessRate: (() => {
      const totalGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'grandTichu').length, 0);
      const successfulGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'A' && call.type === 'grandTichu' && call.successful).length, 0);
      return totalGrandTichus > 0 ? (successfulGrandTichus / totalGrandTichus * 100).toFixed(1) : '0.0';
    })(),
  };

  const teamBStats = {
    wins: rounds.reduce((wins, round) => {
      const teamATotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamAPoints, 0);
      const teamBTotal = rounds.slice(0, round.id).reduce((sum, r) => sum + r.teamBPoints, 0);
      return teamBTotal >= 1000 ? wins + 1 : wins;
    }, 0),
    tichuSuccessRate: (() => {
      const totalTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'tichu').length, 0);
      const successfulTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'tichu' && call.successful).length, 0);
      return totalTichus > 0 ? (successfulTichus / totalTichus * 100).toFixed(1) : '0.0';
    })(),
    grandTichuSuccessRate: (() => {
      const totalGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'grandTichu').length, 0);
      const successfulGrandTichus = rounds.reduce((sum, round) => 
        sum + round.calls.filter(call => call.teamId === 'B' && call.type === 'grandTichu' && call.successful).length, 0);
      return totalGrandTichus > 0 ? (successfulGrandTichus / totalGrandTichus * 100).toFixed(1) : '0.0';
    })(),
  };

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: isDark ? colors.primary + 'CC' : colors.primary }]}>Game Statistics</Text>
      
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statCard: {
    marginBottom: 16,
    padding: 16,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 