import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useGameStore } from '../../store/gameStore';

import { Colors } from '../../constants/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const loadGame = useGameStore(state => state.loadGame);

  // Load game data when app starts
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
