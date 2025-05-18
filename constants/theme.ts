import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

// Tichu traditional colors are red, green, blue, black
// Light mode palette
export const LightColors = {
  primary: '#C41E3A', // Tichu red
  primaryDark: '#8B0000', // Darker red
  secondary: '#4F7942', // Tichu green
  secondaryDark: '#355E3B', // Darker green
  background: '#F5F5F5', // Light gray background
  surface: '#FFFFFF', // White surface
  error: '#B00020', // Error red
  success: '#4CAF50', // Success green
  text: '#000000', // Black text
  textSecondary: '#757575', // Gray text
  border: '#E0E0E0', // Light gray border
  teamA: '#1E56A0', // Tichu blue for Team A
  teamB: '#D4AF37', // Tichu gold/yellow for Team B
};

// Dark mode palette
export const DarkColors = {
  primary: '#FF4D4D', // Brighter red for visibility
  primaryDark: '#C41E3A', // Tichu red
  secondary: '#6ECB63', // Brighter green for visibility
  secondaryDark: '#4F7942', // Tichu green
  background: '#121212', // Dark background
  surface: '#1E1E1E', // Dark surface
  error: '#CF6679', // Lighter error red for dark theme
  success: '#66BB6A', // Lighter success green for dark theme
  text: '#FFFFFF', // White text
  textSecondary: '#AAAAAA', // Light gray text
  border: '#333333', // Dark gray border
  teamA: '#4B89DC', // Brighter blue for Team A
  teamB: '#FFD700', // Brighter gold/yellow for Team B
};

// Theme store to manage color scheme
interface ThemeState {
  darkMode: boolean;
  colors: typeof LightColors;
  toggleDarkMode: () => void;
  initTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  darkMode: false,
  colors: LightColors,
  
  toggleDarkMode: () => {
    set(state => {
      const newDarkMode = !state.darkMode;
      const newColors = newDarkMode ? DarkColors : LightColors;
      
      // Save the preference
      AsyncStorage.setItem('tichuThemeDarkMode', JSON.stringify(newDarkMode))
        .catch(error => console.error('Failed to save theme preference:', error));
      
      return { darkMode: newDarkMode, colors: newColors };
    });
  },
  
  initTheme: async () => {
    try {
      // Try to get saved preference
      const savedPreference = await AsyncStorage.getItem('tichuThemeDarkMode');
      
      // If no saved preference, use system preference
      if (savedPreference === null) {
        const systemPreference = Appearance.getColorScheme() === 'dark';
        set({ 
          darkMode: systemPreference, 
          colors: systemPreference ? DarkColors : LightColors 
        });
        return;
      }
      
      // Use saved preference
      const savedDarkMode = JSON.parse(savedPreference);
      set({ 
        darkMode: savedDarkMode, 
        colors: savedDarkMode ? DarkColors : LightColors 
      });
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      // Fallback to light mode
      set({ darkMode: false, colors: LightColors });
    }
  }
}));

// Export active colors
export const useColors = () => useThemeStore(state => state.colors);
export const useDarkMode = () => useThemeStore(state => state.darkMode);
export const useToggleDarkMode = () => useThemeStore(state => state.toggleDarkMode);

// For backward compatibility and static access when hooks aren't available
export const Colors = useThemeStore.getState().colors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  title: 40,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
}; 