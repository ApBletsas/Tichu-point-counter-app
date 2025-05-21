/**
 * Tabs Layout Component
 * 
 * This component defines the bottom tab navigation structure of the app.
 * It includes:
 * - Game screen (main gameplay)
 * - History screen (round history)
 * - Stats screen (game statistics)
 * - Settings screen (app configuration)
 * - Info screen (game rules and help)
 */

// Import FontAwesome icons for tab bar
import FontAwesome from '@expo/vector-icons/FontAwesome';
// Import tab navigation component
import { Tabs } from 'expo-router';
// Import useEffect for side effects
import { useEffect } from 'react';
// Import useColorScheme for theme detection
import { useColorScheme } from 'react-native';
// Import game store for state management
import { useGameStore } from '../../store/gameStore';

// Import theme colors
import { Colors } from '../../constants/theme';

/**
 * TabBarIcon Component
 * 
 * Reusable component for rendering tab bar icons
 * @param props - Component props including icon name and color
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * TabLayout Component
 * 
 * Main tab navigation component that sets up the bottom tab bar
 * and handles initial game data loading
 */
export default function TabLayout() {
  // Get current color scheme for theme-aware styling
  const colorScheme = useColorScheme();
  // Get loadGame function from game store
  const loadGame = useGameStore(state => state.loadGame);

  // Load game data when app starts
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    // Tab navigator with theme-aware styling
    <Tabs
      screenOptions={{
        // Active tab color
        tabBarActiveTintColor: Colors.primary,
        // Inactive tab color
        tabBarInactiveTintColor: Colors.textSecondary,
        // Tab bar background color based on theme
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        // Header styling
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
      }}>
      {/* Game Screen Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
        }}
      />
      {/* History Screen Tab */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
      {/* Stats Screen Tab */}
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      {/* Settings Screen Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
      {/* Info Screen Tab */}
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
