// Import AsyncStorage for persistent storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import Zustand for state management
import { create } from 'zustand';

// Interface defining team structure
export interface Team {
  id: 'A' | 'B';        // Team identifier
  name: string;         // Team name
}

// Interface defining special call structure
export interface Call {
  type: 'tichu' | 'grandTichu' | 'oneTwo';  // Type of special call
  teamId: 'A' | 'B';                        // Team making the call
  successful: boolean | null;                // Call outcome (null if not yet determined)
}

// Interface defining round structure
export interface Round {
  id: number;           // Round number
  teamAPoints: number;  // Points for Team A in this round
  teamBPoints: number;  // Points for Team B in this round
  calls: Call[];        // Special calls made in this round
}

// Interface defining the complete game state and actions
export interface GameState {
  teams: {
    A: Team;
    B: Team;
  };
  winningScore: number;     // Score needed to win
  rounds: Round[];          // Array of completed rounds
  isGameOver: boolean;      // Whether the game has ended
  winningTeam: 'A' | 'B' | null;  // Winning team identifier

  // Action methods
  setTeamName: (teamId: 'A' | 'B', name: string) => void;
  setWinningScore: (score: number) => void;
  addRound: (teamAPoints: number, teamBPoints: number, calls: Call[]) => void;
  undoLastRound: () => void;
  resetGame: () => void;
  startNewGame: () => void;
  getTotalScore: (teamId: 'A' | 'B') => number;
  loadGame: () => Promise<void>;
  saveGame: () => Promise<void>;
}

// Default state values
const defaultState = {
  teams: {
    A: {
      id: 'A' as const,
      name: 'Team A',
    },
    B: {
      id: 'B' as const,
      name: 'Team B',
    },
  },
  winningScore: 1000,
  rounds: [] as Round[],
  isGameOver: false,
  winningTeam: null as ('A' | 'B' | null),
};

// Create the game store with Zustand
export const useGameStore = create<GameState>((set, get) => ({
  ...defaultState,

  // Action to update team name
  setTeamName: (teamId, name) => {
    set((state) => {
      const newTeams = { ...state.teams };
      newTeams[teamId].name = name;
      return { teams: newTeams };
    });
    get().saveGame();
  },

  // Action to update winning score
  setWinningScore: (score) => {
    set({ winningScore: score });
    get().saveGame();
  },

  // Action to add a new round
  addRound: (teamAPoints, teamBPoints, calls) => {
    set((state) => {
      // Initialize adjusted points
      let adjustedTeamAPoints = teamAPoints;
      let adjustedTeamBPoints = teamBPoints;
      
      // Process special calls and adjust points
      calls.forEach(call => {
        const teamId = call.teamId;
        
        if (call.type === 'oneTwo') {
          // Handle 1-2 call (always +200 points)
          if (teamId === 'A') {
            adjustedTeamAPoints += 200;
          } else if (teamId === 'B') {
            adjustedTeamBPoints += 200;
          }
        } else if (call.successful === true) {
          // Handle successful Tichu/Grand Tichu
          const points = call.type === 'tichu' ? 100 : 200;
          if (teamId === 'A') {
            adjustedTeamAPoints += points;
          } else if (teamId === 'B') {
            adjustedTeamBPoints += points;
          }
        } else if (call.successful === false) {
          // Handle failed Tichu/Grand Tichu
          const points = call.type === 'tichu' ? 100 : 200;
          if (teamId === 'A') {
            adjustedTeamAPoints -= points;
          } else if (teamId === 'B') {
            adjustedTeamBPoints -= points;
          }
        }
      });
      
      // Create new round
      const newRound: Round = {
        id: state.rounds.length + 1,
        teamAPoints: adjustedTeamAPoints,
        teamBPoints: adjustedTeamBPoints,
        calls,
      };
      
      const newRounds = [...state.rounds, newRound];
      
      // Calculate total scores
      const teamATotal = newRounds.reduce((total, round) => total + round.teamAPoints, 0);
      const teamBTotal = newRounds.reduce((total, round) => total + round.teamBPoints, 0);
      
      // Check for game over condition
      let isGameOver = false;
      let winningTeam: 'A' | 'B' | null = null;
      
      if (teamATotal >= state.winningScore) {
        isGameOver = true;
        winningTeam = 'A';
      } else if (teamBTotal >= state.winningScore) {
        isGameOver = true;
        winningTeam = 'B';
      }
      
      return {
        rounds: newRounds,
        isGameOver,
        winningTeam,
      };
    });
    get().saveGame();
  },

  // Action to undo the last round
  undoLastRound: () => {
    set((state) => {
      if (state.rounds.length === 0) return state;
      
      const newRounds = [...state.rounds];
      newRounds.pop();
      
      return {
        rounds: newRounds,
        isGameOver: false,
        winningTeam: null,
      };
    });
    get().saveGame();
  },

  // Action to reset the game to initial state
  resetGame: () => {
    set(() => ({
      teams: {
        A: {
          id: 'A' as const,
          name: 'Team A',
        },
        B: {
          id: 'B' as const,
          name: 'Team B',
        },
      },
      winningScore: 1000,
      rounds: [],
      isGameOver: false,
      winningTeam: null
    }));
    get().saveGame();
  },

  // Action to start a new game while keeping team settings
  startNewGame: () => {
    set((state) => ({
      rounds: [],
      isGameOver: false,
      winningTeam: null
    }));
    get().saveGame();
  },

  // Helper to calculate total score for a team
  getTotalScore: (teamId) => {
    const { rounds } = get();
    return rounds.reduce((total, round) => {
      return total + (teamId === 'A' ? round.teamAPoints : round.teamBPoints);
    }, 0);
  },

  // Action to load game state from storage
  loadGame: async () => {
    try {
      const gameData = await AsyncStorage.getItem('tichuGameState');
      if (gameData) {
        const parsedData = JSON.parse(gameData);
        set(parsedData);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  },

  // Action to save game state to storage
  saveGame: async () => {
    try {
      const state = get();
      const dataToSave = {
        teams: state.teams,
        winningScore: state.winningScore,
        rounds: state.rounds,
        isGameOver: state.isGameOver,
        winningTeam: state.winningTeam,
      };
      await AsyncStorage.setItem('tichuGameState', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  },
}));