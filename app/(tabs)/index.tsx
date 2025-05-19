import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { NumberInput } from '../../components/NumberInput';
import { ScoreCard } from '../../components/ScoreCard';
import { TichuCallToggle } from '../../components/TichuCallToggle';
import { BorderRadius, FontSizes, Shadows, Spacing, useColors, useDarkMode } from '../../constants/theme';
import { Call, useGameStore } from '../../store/gameStore';

export default function GameScreen() {
  const colors = useColors();
  const darkMode = useDarkMode();
  
  const { 
    teams, 
    rounds, 
    isGameOver, 
    winningTeam,
    getTotalScore,
    addRound,
    undoLastRound 
  } = useGameStore();
  
  const [teamAPoints, setTeamAPoints] = useState(0);
  const [teamBPoints, setTeamBPoints] = useState(0);
  const [currentCalls, setCurrentCalls] = useState<Call[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [lockPointsSync, setLockPointsSync] = useState(false);

  // Reset form after submitting a round
  useEffect(() => {
    if (!submitting) return;
    
    setTeamAPoints(0);
    setTeamBPoints(0);
    setCurrentCalls([]);
    setSubmitting(false);
  }, [rounds.length, submitting]);

  // Handle team A points change
  const handleTeamAPointsChange = (value: number) => {
    setTeamAPoints(value);
    
    // If not locked, automatically update team B points to maintain sum of 100
    if (!lockPointsSync) {
      // Calculate complementary points for team B
      const complementaryPoints = 100 - value;
      
      // Ensure the value is within bounds and a multiple of 5
      const validBPoints = Math.max(-25, Math.min(125, complementaryPoints));
      const roundedBPoints = Math.round(validBPoints / 5) * 5;
      
      // Temporarily lock to prevent recursive updates
      setLockPointsSync(true);
      setTeamBPoints(roundedBPoints);
      
      // Release lock after a short delay
      setTimeout(() => setLockPointsSync(false), 50);
    }
  };

  // Handle team B points change
  const handleTeamBPointsChange = (value: number) => {
    setTeamBPoints(value);
    
    // If not locked, automatically update team A points to maintain sum of 100
    if (!lockPointsSync) {
      // Calculate complementary points for team A
      const complementaryPoints = 100 - value;
      
      // Ensure the value is within bounds and a multiple of 5
      const validAPoints = Math.max(-25, Math.min(125, complementaryPoints));
      const roundedAPoints = Math.round(validAPoints / 5) * 5;
      
      // Temporarily lock to prevent recursive updates
      setLockPointsSync(true);
      setTeamAPoints(roundedAPoints);
      
      // Release lock after a short delay
      setTimeout(() => setLockPointsSync(false), 50);
    }
  };

  const handleCall = (teamId: 'A' | 'B', type: 'tichu' | 'grandTichu' | 'oneTwo') => {
    setCurrentCalls(prev => {
      // Check if this call already exists
      const existingCallIndex = prev.findIndex(
        call => call.teamId === teamId && call.type === type
      );
      
      if (existingCallIndex >= 0) {
        // Remove the call if it exists
        return prev.filter((_, index) => index !== existingCallIndex);
      } else {
        // Add new call with appropriate success value
        // For oneTwo, always set success to null (handled differently in gameStore)
        const successful = type === 'oneTwo' ? null : null;
        return [...prev, { teamId, type, successful }];
      }
    });
  };

  const handleCallOutcome = (teamId: 'A' | 'B', type: 'tichu' | 'grandTichu' | 'oneTwo', successful: boolean) => {
    // Skip for oneTwo type since it doesn't have success/failure state
    if (type === 'oneTwo') return;
    
    setCurrentCalls(prev => {
      return prev.map(call => {
        if (call.teamId === teamId && call.type === type) {
          return { ...call, successful };
        }
        return call;
      });
    });
  };

  const isCallSelected = (teamId: 'A' | 'B', type: 'tichu' | 'grandTichu' | 'oneTwo'): boolean => {
    return currentCalls.some(call => call.teamId === teamId && call.type === type);
  };

  const getCallOutcome = (teamId: 'A' | 'B', type: 'tichu' | 'grandTichu' | 'oneTwo'): boolean | null => {
    const call = currentCalls.find(call => call.teamId === teamId && call.type === type);
    return call ? call.successful : null;
  };

  // Helper function to check if a call should be disabled
  const isCallDisabled = (teamId: 'A' | 'B', type: 'tichu' | 'grandTichu' | 'oneTwo'): boolean => {
    const oppositeTeam = teamId === 'A' ? 'B' : 'A';
    
    // Find existing calls
    const tichuCall = currentCalls.find(call => call.type === 'tichu' && call.teamId === teamId);
    const oppositeTeamTichuCall = currentCalls.find(call => call.type === 'tichu' && call.teamId === oppositeTeam);
    const grandTichuCall = currentCalls.find(call => call.type === 'grandTichu' && call.teamId === teamId);
    const oppositeTeamGrandTichuCall = currentCalls.find(call => call.type === 'grandTichu' && call.teamId === oppositeTeam);
    const oppositeTeamOneTwoCall = currentCalls.find(call => call.type === 'oneTwo' && call.teamId === oppositeTeam);
    
    // Check if this team already has a successful call
    const hasSuccessfulTichu = currentCalls.some(call => 
      call.teamId === teamId && call.type === 'tichu' && call.successful === true
    );
    
    const hasSuccessfulGrandTichu = currentCalls.some(call => 
      call.teamId === teamId && call.type === 'grandTichu' && call.successful === true
    );
    
    // Check if opposite team has a successful call
    const oppositeTeamHasSuccessfulTichu = currentCalls.some(call => 
      call.teamId === oppositeTeam && call.type === 'tichu' && call.successful === true
    );
    
    const oppositeTeamHasSuccessfulGrandTichu = currentCalls.some(call => 
      call.teamId === oppositeTeam && call.type === 'grandTichu' && call.successful === true
    );
    
    // Check current call state
    const currentCall = currentCalls.find(call => call.teamId === teamId && call.type === type);
    const isCurrentCallSelected = !!currentCall;
    const isCurrentCallSuccessful = currentCall?.successful;
    
    // If opposite team has 1-2 selected, disable 1-2 for this team
    if (type === 'oneTwo' && oppositeTeamOneTwoCall) {
      return true;
    }
    
    // If this team already has a failed tichu, disable grand tichu
    if (tichuCall && tichuCall.successful === false && type === 'grandTichu') {
      return true;
    }
    
    // If this team already has a failed grand tichu, disable tichu
    if (grandTichuCall && grandTichuCall.successful === false && type === 'tichu') {
      return true;
    }
    
    // If this team has a successful tichu or grand tichu, disable the other type
    if ((hasSuccessfulTichu && type === 'grandTichu') || 
        (hasSuccessfulGrandTichu && type === 'tichu')) {
      return true;
    }
    
    // If opposing team has successful calls, disable new successful calls but allow failed calls
    if ((oppositeTeamHasSuccessfulTichu || oppositeTeamHasSuccessfulGrandTichu)) {
      // For 1-2 button, completely disable
      if (type === 'oneTwo') {
        return true;
      }
      
      // For Tichu/Grand Tichu, don't disable if already selected as failed
      if (isCurrentCallSelected && isCurrentCallSuccessful === false) {
        return false;
      }
    }
    
    return false;
  };

  // Helper function to check if a call should be failed-only
  const isFailedOnly = (teamId: 'A' | 'B', type: 'tichu' | 'grandTichu' | 'oneTwo'): boolean => {
    const oppositeTeam = teamId === 'A' ? 'B' : 'A';
    
    // Check if opposite team has a successful call
    const oppositeTeamHasSuccessfulTichu = currentCalls.some(call => 
      call.teamId === oppositeTeam && call.type === 'tichu' && call.successful === true
    );
    
    const oppositeTeamHasSuccessfulGrandTichu = currentCalls.some(call => 
      call.teamId === oppositeTeam && call.type === 'grandTichu' && call.successful === true
    );
    
    // If opposite team has a successful call, this team can only fail their calls
    if (oppositeTeamHasSuccessfulTichu || oppositeTeamHasSuccessfulGrandTichu) {
      // Only applies to tichu and grand tichu calls
      return type === 'tichu' || type === 'grandTichu';
    }
    
    return false;
  };

  // Calculate adjusted points based on Tichu calls
  const calculateAdjustedPoints = () => {
    let adjustedTeamAPoints = teamAPoints;
    let adjustedTeamBPoints = teamBPoints;
    
    currentCalls.forEach(call => {
      const teamId = call.teamId;
      
      if (call.type === 'oneTwo') {
        // For oneTwo, always add exactly 200 points if selected
        if (teamId === 'A') adjustedTeamAPoints += 200;
        if (teamId === 'B') adjustedTeamBPoints += 200;
      } else if (call.successful === null) {
        // Skip incomplete calls
        return;
      } else {
        // Handle tichu and grandTichu calls with success/failure
        const points = call.type === 'tichu' ? 100 : 200;
        
        if (call.successful) {
          if (teamId === 'A') adjustedTeamAPoints += points;
          if (teamId === 'B') adjustedTeamBPoints += points;
        } else {
          if (teamId === 'A') adjustedTeamAPoints -= points;
          if (teamId === 'B') adjustedTeamBPoints -= points;
        }
      }
    });
    
    return { adjustedTeamAPoints, adjustedTeamBPoints };
  };

  const handleSubmitRound = () => {
    // Validate that points are multiples of 5, between -25 and 125, and not empty
    if (teamAPoints === null || teamBPoints === null) {
      Alert.alert('Invalid Points', 'Points cannot be empty.');
      return;
    }
    
    if (teamAPoints < -25 || teamAPoints > 125 || teamBPoints < -25 || teamBPoints > 125) {
      Alert.alert('Invalid Points', 'Points must be between -25 and 125.');
      return;
    }
    
    if (teamAPoints % 5 !== 0 || teamBPoints % 5 !== 0) {
      Alert.alert('Invalid Points', 'Points must be multiples of 5.');
      return;
    }
    
    // Check if all non-oneTwo calls have an outcome
    const allCallsComplete = currentCalls.every(call => 
      call.type === 'oneTwo' || call.successful !== null
    );
    
    if (!allCallsComplete) {
      Alert.alert('Incomplete Information', 'Please mark all Tichu calls as successful or failed.');
      return;
    }

    // Check if the points add up to 100 (Tichu rule)
    const totalPoints = teamAPoints + teamBPoints;
    if (totalPoints !== 100 && totalPoints !== 0) {
      Alert.alert(
        'Invalid Points',
        'The sum of both teams\' points must equal 100.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Submit Anyway', 
            onPress: () => {
              addRound(teamAPoints, teamBPoints, currentCalls);
              setSubmitting(true);
            },
            style: 'destructive',
          }
        ]
      );
      return;
    }
    
    // Submit the round
    addRound(teamAPoints, teamBPoints, currentCalls);
    setSubmitting(true);
  };

  // Get information about Tichu point adjustments
  const { adjustedTeamAPoints, adjustedTeamBPoints } = calculateAdjustedPoints();
  const teamADifference = adjustedTeamAPoints - teamAPoints;
  const teamBDifference = adjustedTeamBPoints - teamBPoints;

  // Quick point presets for common distributions
  const handleQuickPointPreset = (teamAValue: number, teamBValue: number) => {
    setTeamAPoints(teamAValue);
    setTeamBPoints(teamBValue);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <ScoreCard 
            label={teams.A.name}
            score={getTotalScore('A')}
            teamColor={colors.teamA}
          />
          
          <ScoreCard 
            label={teams.B.name}
            score={getTotalScore('B')}
            teamColor={colors.teamB}
          />
        </View>
        
        {/* Game Over Banner */}
        {isGameOver && (
          <View style={styles.gameOverContainer}>
            <View style={[styles.gameOverBanner, { backgroundColor: colors.success }]}>
              <Text style={[styles.gameOverText, { color: colors.surface }]}>
                Game Over! {winningTeam === 'A' ? teams.A.name : teams.B.name} Wins!
              </Text>
            </View>
            <Button
              title="New Game"
              onPress={() => useGameStore.getState().startNewGame()}
              style={styles.newGameButton}
            />
          </View>
        )}
        
        {/* Input for new round */}
        {!isGameOver && (
          <View style={[styles.roundInputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>New Round</Text>
            
            <View style={styles.pointsInputContainer}>
              <View style={styles.inputRow}>
                <NumberInput
                  label={`${teams.A.name} Points`}
                  value={teamAPoints}
                  onChange={handleTeamAPointsChange}
                  min={-25}
                  max={125}
                  step={5}
                  style={styles.largerInput}
                />
                
                <NumberInput
                  label={`${teams.B.name} Points`}
                  value={teamBPoints}
                  onChange={handleTeamBPointsChange}
                  min={-25}
                  max={125}
                  step={5}
                  style={styles.largerInput}
                />
              </View>
              
              <Text style={[styles.pointsSum, { color: colors.textSecondary }]}>
                Total: {teamAPoints + teamBPoints} {teamAPoints + teamBPoints !== 100 && teamAPoints + teamBPoints !== 0 ? '(should be 100)' : ''}
              </Text>
              
              {/* Quick point presets */}
              <View style={styles.quickPresetsContainer}>
                <Text style={[styles.quickPresetTitle, { color: colors.text }]}>Quick Points:</Text>
                <View style={styles.quickPresetButtons}>
                  <TouchableOpacity
                    style={[styles.quickPresetButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleQuickPointPreset(100, 0)}
                  >
                    <Text style={[styles.quickPresetText, { color: colors.surface }]}>100-0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickPresetButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleQuickPointPreset(75, 25)}
                  >
                    <Text style={[styles.quickPresetText, { color: colors.surface }]}>75-25</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickPresetButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleQuickPointPreset(50, 50)}
                  >
                    <Text style={[styles.quickPresetText, { color: colors.surface }]}>50-50</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickPresetButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleQuickPointPreset(25, 75)}
                  >
                    <Text style={[styles.quickPresetText, { color: colors.surface }]}>25-75</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickPresetButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleQuickPointPreset(0, 100)}
                  >
                    <Text style={[styles.quickPresetText, { color: colors.surface }]}>0-100</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Game Calls */}
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>Game Calls</Text>
            
            <View style={styles.tichuContainer}>
              <View style={styles.teamCallsContainer}>
                <View style={[styles.teamBanner, { backgroundColor: colors.teamA }]}>
                  <Text style={[styles.teamBannerText, { color: colors.surface }]}>{teams.A.name}</Text>
                </View>
                <View style={styles.teamCallsRow}>
                  <TichuCallToggle
                    type="tichu"
                    teamName=""
                    teamColor={colors.teamA}
                    selected={isCallSelected('A', 'tichu')}
                    successful={getCallOutcome('A', 'tichu')}
                    onToggle={() => handleCall('A', 'tichu')}
                    onSuccess={(success) => handleCallOutcome('A', 'tichu', success)}
                    disabled={isCallDisabled('A', 'tichu')}
                    failedOnly={isFailedOnly('A', 'tichu')}
                  />
                  <TichuCallToggle
                    type="grandTichu"
                    teamName=""
                    teamColor={colors.teamA}
                    selected={isCallSelected('A', 'grandTichu')}
                    successful={getCallOutcome('A', 'grandTichu')}
                    onToggle={() => handleCall('A', 'grandTichu')}
                    onSuccess={(success) => handleCallOutcome('A', 'grandTichu', success)}
                    disabled={isCallDisabled('A', 'grandTichu')}
                    failedOnly={isFailedOnly('A', 'grandTichu')}
                  />
                  <TichuCallToggle
                    type="oneTwo"
                    teamName=""
                    teamColor={colors.teamA}
                    selected={isCallSelected('A', 'oneTwo')}
                    successful={null}
                    onToggle={() => handleCall('A', 'oneTwo')}
                    onSuccess={() => {}}
                    disabled={isCallDisabled('A', 'oneTwo')}
                    failedOnly={false}
                  />
                </View>
              </View>
              
              <View style={styles.teamCallsContainer}>
                <View style={[styles.teamBanner, { backgroundColor: colors.teamB }]}>
                  <Text style={[styles.teamBannerText, { color: colors.surface }]}>{teams.B.name}</Text>
                </View>
                <View style={styles.teamCallsRow}>
                  <TichuCallToggle
                    type="tichu"
                    teamName=""
                    teamColor={colors.teamB}
                    selected={isCallSelected('B', 'tichu')}
                    successful={getCallOutcome('B', 'tichu')}
                    onToggle={() => handleCall('B', 'tichu')}
                    onSuccess={(success) => handleCallOutcome('B', 'tichu', success)}
                    disabled={isCallDisabled('B', 'tichu')}
                    failedOnly={isFailedOnly('B', 'tichu')}
                  />
                  <TichuCallToggle
                    type="grandTichu"
                    teamName=""
                    teamColor={colors.teamB}
                    selected={isCallSelected('B', 'grandTichu')}
                    successful={getCallOutcome('B', 'grandTichu')}
                    onToggle={() => handleCall('B', 'grandTichu')}
                    onSuccess={(success) => handleCallOutcome('B', 'grandTichu', success)}
                    disabled={isCallDisabled('B', 'grandTichu')}
                    failedOnly={isFailedOnly('B', 'grandTichu')}
                  />
                  <TichuCallToggle
                    type="oneTwo"
                    teamName=""
                    teamColor={colors.teamB}
                    selected={isCallSelected('B', 'oneTwo')}
                    successful={null}
                    onToggle={() => handleCall('B', 'oneTwo')}
                    onSuccess={() => {}}
                    disabled={isCallDisabled('B', 'oneTwo')}
                    failedOnly={false}
                  />
                </View>
              </View>
            </View>
            
            {/* Point adjustment info */}
            {(teamADifference !== 0 || teamBDifference !== 0) && (
              <View style={[styles.adjustmentContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.adjustmentTitle, { color: colors.text }]}>Game Score Adjustments:</Text>
                {teamADifference !== 0 && (
                  <Text style={[
                    styles.adjustmentText,
                    teamADifference > 0 ? { color: colors.success } : { color: colors.error }
                  ]}>
                    {teams.A.name}: {teamADifference > 0 ? '+' : ''}{teamADifference} points
                  </Text>
                )}
                {teamBDifference !== 0 && (
                  <Text style={[
                    styles.adjustmentText,
                    teamBDifference > 0 ? { color: colors.success } : { color: colors.error }
                  ]}>
                    {teams.B.name}: {teamBDifference > 0 ? '+' : ''}{teamBDifference} points
                  </Text>
                )}
                <Text style={[styles.finalScoreText, { color: colors.primary }]}>
                  Final round score: {teams.A.name} {adjustedTeamAPoints} - {teams.B.name} {adjustedTeamBPoints}
                </Text>
              </View>
            )}
            
            <Button 
              title="Submit Round" 
              onPress={handleSubmitRound} 
              size="large"
              fullWidth
              variant="primary"
              style={styles.submitButton}
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
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  gameOverContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  gameOverBanner: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 8,
    width: '100%',
  },
  gameOverText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newGameButton: {
    width: '50%',
  },
  roundInputContainer: {
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
  subSectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginVertical: Spacing.md,
    textAlign: 'center',
  },
  pointsInputContainer: {
    marginBottom: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  largerInput: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  pointsSum: {
    textAlign: 'right',
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
  },
  tichuContainer: {
    marginBottom: Spacing.md,
  },
  teamCallsContainer: {
    marginBottom: Spacing.lg,
  },
  teamCallsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  teamBanner: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    ...Shadows.md,
  },
  teamBannerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  adjustmentContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  adjustmentTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  adjustmentText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  finalScoreText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  quickPresetsContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  quickPresetTitle: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  quickPresetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickPresetButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    margin: Spacing.xs,
    ...Shadows.sm,
  },
  quickPresetText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
