import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors, useDarkMode, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';
import { Collapsible } from '../../components/Collapsible';

export default function TutorialScreen() {
  const colors = useColors();
  const darkMode = useDarkMode();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.headerContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.headerTitle}>Tichu Guide</Text>
          <Text style={styles.headerSubtitle}>Rules, Scoring & Strategy</Text>
        </View>
        
        <Collapsible title="About Tichu" initiallyExpanded={true}>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Tichu is a fast-paced climbing card game for 4 players in fixed partnerships. The goal is to be the first team to reach 1000 points. The game is played with a standard 52-card deck plus 4 special cards.
          </Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            It combines elements of Bridge, Big Two, and other climbing games. Teams sit across from each other and work together to optimize their play.
          </Text>
        </Collapsible>
        
        <Collapsible title="Basic Scoring">
          <View style={styles.ruleContainer}>
            <Text style={[styles.ruleBullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.ruleText, { color: colors.text }]}>
              <Text style={styles.boldText}>Points per round:</Text> In each hand, players earn points from cards: Kings (10), Tens (10), Fives (5), and Dragons (25).
            </Text>
          </View>
          
          <View style={styles.ruleContainer}>
            <Text style={[styles.ruleBullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.ruleText, { color: colors.text }]}>
              <Text style={styles.boldText}>Zero-sum game:</Text> Points in each hand always total 100 (excluding bonuses).
            </Text>
          </View>
          
          <View style={styles.ruleContainer}>
            <Text style={[styles.ruleBullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.ruleText, { color: colors.text }]}>
              <Text style={styles.boldText}>First out:</Text> The first player to play all their cards earns 0 points but gives their remaining cards to their partner.
            </Text>
          </View>
          
          <View style={styles.ruleContainer}>
            <Text style={[styles.ruleBullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.ruleText, { color: colors.text }]}>
              <Text style={styles.boldText}>Last player:</Text> The last player with cards gives all remaining cards to the opposing team.
            </Text>
          </View>
        </Collapsible>
        
        <Collapsible title="Special Calls">
          <View style={[styles.callBox, { backgroundColor: colors.primary, opacity: 0.9 }]}>
            <Text style={styles.callTitle}>Tichu Call</Text>
            <Text style={styles.callDescription}>
              A player can call "Tichu" before playing their first card. If they go out first, their team gets +100 points. If they fail, their team loses 100 points.
            </Text>
          </View>
          
          <View style={[styles.callBox, { backgroundColor: colors.secondary, opacity: 0.9 }]}>
            <Text style={styles.callTitle}>Grand Tichu Call</Text>
            <Text style={styles.callDescription}>
              A player can call "Grand Tichu" before seeing their 9th card. If they go out first, their team gets +200 points. If they fail, their team loses 200 points.
            </Text>
          </View>
          
          <View style={[styles.callBox, { backgroundColor: colors.teamA, opacity: 0.9 }]}>
            <Text style={styles.callTitle}>1-2 Finish (Double Victory)</Text>
            <Text style={styles.callDescription}>
              If both players on a team go out 1-2 (before either opponent plays all cards), they earn +200 additional points, regardless of points in the cards.
            </Text>
          </View>
        </Collapsible>
        
        <Collapsible title="Special Cards">
          <View style={styles.specialCardContainer}>
            <View style={[styles.specialCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.specialCardTitle, { color: colors.teamA }]}>Dragon</Text>
              <Text style={[styles.specialCardDescription, { color: colors.text }]}>
                Highest single card. Worth 25 points. Must give points to the opposing team.
              </Text>
            </View>
            
            <View style={[styles.specialCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.specialCardTitle, { color: colors.teamB }]}>Phoenix</Text>
              <Text style={[styles.specialCardDescription, { color: colors.text }]}>
                Can be played as a wild card with value 0.5 higher than the previous card. Worth -25 points.
              </Text>
            </View>
            
            <View style={[styles.specialCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.specialCardTitle, { color: colors.primary }]}>Dog</Text>
              <Text style={[styles.specialCardDescription, { color: colors.text }]}>
                Can only lead. Gives the lead to your partner. Worth 0 points.
              </Text>
            </View>
            
            <View style={[styles.specialCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.specialCardTitle, { color: colors.secondary }]}>Mah Jong (1)</Text>
              <Text style={[styles.specialCardDescription, { color: colors.text }]}>
                Lowest card. Makes a wish. Worth 0 points.
              </Text>
            </View>
          </View>
        </Collapsible>
        
        <Collapsible title="App Instructions">
          <Text style={[styles.sectionText, { color: colors.text }]}>
            <Text style={styles.boldText}>Entering scores:</Text> For each round, enter the basic trick points (typically adding up to 100) for each team, then mark any special calls.
          </Text>
          
          <Text style={[styles.sectionText, { color: colors.text }]}>
            <Text style={styles.boldText}>Tichu calls:</Text> Select the Tichu or Grand Tichu button for the appropriate team, then mark it as Success or Failure.
          </Text>
          
          <Text style={[styles.sectionText, { color: colors.text }]}>
            <Text style={styles.boldText}>1-2 Finish:</Text> If a team achieves a double victory (both players out first), select the 1-2 button for that team to add 200 bonus points.
          </Text>
          
          <Text style={[styles.sectionText, { color: colors.text }]}>
            <Text style={styles.boldText}>History:</Text> View round history and running totals in the History tab.
          </Text>
          
          <Text style={[styles.sectionText, { color: colors.text }]}>
            <Text style={styles.boldText}>Settings:</Text> Customize team names, winning score, and toggle dark mode in the Settings tab.
          </Text>
        </Collapsible>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Happy Tichu playing!
          </Text>
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
    paddingBottom: Spacing.xl,
  },
  headerContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FontSizes.lg,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
    marginBottom: Spacing.md,
  },
  ruleContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingRight: Spacing.md,
  },
  ruleBullet: {
    fontSize: FontSizes.xl,
    lineHeight: FontSizes.md * 1.5,
    marginRight: Spacing.sm,
  },
  ruleText: {
    flex: 1,
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  callBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  callTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  callDescription: {
    fontSize: FontSizes.md,
    color: 'white',
    lineHeight: FontSizes.md * 1.5,
  },
  specialCardContainer: {
    marginVertical: Spacing.sm,
  },
  specialCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  specialCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  specialCardDescription: {
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
  },
  footer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.md,
    fontStyle: 'italic',
  },
});
