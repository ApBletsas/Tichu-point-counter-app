/**
 * Settings Screen Component
 * 
 * This screen provides configuration options for the Tichu Point Counter app.
 * Users can:
 * - Customize team names
 * - Adjust the winning score threshold
 * - Toggle between light and dark themes
 * - Reset the current game
 * - View app information and version
 */

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { NumberInput } from '../../components/NumberInput';
import { BorderRadius, FontSizes, Shadows, Spacing, useColors, useDarkMode, useToggleDarkMode } from '../../constants/theme';
import { useGameStore } from '../../store/gameStore';

export default function SettingsScreen() {
  const colors = useColors();
  const darkMode = useDarkMode();
  const toggleDarkMode = useToggleDarkMode();
  
  const { 
    teams, 
    winningScore, 
    setTeamName,
    setWinningScore, 
    resetGame 
  } = useGameStore();
  
  // Local state for form inputs
  const [teamAName, setTeamAName] = useState(teams.A.name);
  const [teamBName, setTeamBName] = useState(teams.B.name);
  const [targetScore, setTargetScore] = useState(winningScore);
  
  // Update local state when game store changes
  useEffect(() => {
    setTeamAName(teams.A.name);
    setTeamBName(teams.B.name);
    setTargetScore(winningScore);
  }, [teams.A.name, teams.B.name, winningScore]);
  
  const handleSaveSettings = () => {
    // Update team names
    setTeamName('A', teamAName);
    setTeamName('B', teamBName);
    
    // Update winning score
    setWinningScore(targetScore);
    
    Alert.alert('Settings Saved', 'Your settings have been saved successfully.');
  };
  
  const handleResetGame = () => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to reset the entire game? This will:\n\n• Clear all rounds and history\n• Reset scores to zero\n• Reset team names to defaults\n• Reset winning score to 1000',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Reset Game', 
          onPress: () => {
            // Reset game including team names and winning score
            resetGame();
            
            // Update local state to match the reset defaults
            setTeamAName('Team A');
            setTeamBName('Team B');
            setTargetScore(1000);
            
            Alert.alert(
              'Game Reset Complete',
              'All game data has been cleared and settings reset to defaults.',
              [
                { 
                  text: 'OK',
                  style: 'default'
                }
              ]
            );
          },
          style: 'destructive',
        }
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Team Names</Text>
          
          <View style={styles.teamSection}>
            <View style={styles.inputContainer}>
              <Text style={[styles.teamTitle, { color: colors.teamA }]}>Team A Name</Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.surface,
                  color: colors.text
                }]}
                value={teamAName}
                onChangeText={setTeamAName}
                placeholder="Enter team name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.teamSection}>
            <View style={styles.inputContainer}>
              <Text style={[styles.teamTitle, { color: colors.teamB }]}>Team B Name</Text>
              <TextInput
                style={[styles.textInput, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.surface,
                  color: colors.text
                }]}
                value={teamBName}
                onChangeText={setTeamBName}
                placeholder="Enter team name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Game Settings</Text>
          
          <View style={styles.pointsSettingContainer}>
            <NumberInput
              label="Winning Score"
              value={targetScore}
              onChange={setTargetScore}
              min={100}
              max={2000}
              step={100}
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Default: 1000 points. The first team to reach this score wins the game.
            </Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={styles.themeRow}>
            <Text style={[styles.themeLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={darkMode ? colors.secondary : "#f4f3f4"}
            />
          </View>
          
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            Toggle between light and dark theme.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            variant="primary"
            size="large"
            fullWidth
            style={styles.saveButton}
          />
          
          <Button
            title="Reset Game Data"
            onPress={handleResetGame}
            variant="error"
            size="large"
            fullWidth
            style={styles.resetButton}
          />
        </View>
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
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.md,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  teamSection: {
    marginBottom: Spacing.md,
  },
  teamTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: FontSizes.md,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  pointsSettingContainer: {
    marginBottom: Spacing.md,
  },
  helperText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  themeLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '500',
  },
  buttonContainer: {
    marginVertical: Spacing.md,
  },
  saveButton: {
    marginBottom: Spacing.md,
  },
  resetButton: {
    marginTop: Spacing.md,
  },
}); 