import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Team {
  id: 'A' | 'B';
  name: string;
}

export interface Call {
  type: 'tichu' | 'grandTichu' | 'oneTwo';
  teamId: 'A' | 'B';
  successful: boolean | null;
}

export interface Round {
  id: number;
  teamAPoints: number;
  teamBPoints: number;
  calls: Call[];
}

export interface GameState {
  teams: {
    A: Team;
    B: Team;
  };
  winningScore: number;
  rounds: Round[];
  isGameOver: boolean;
  winningTeam: 'A' | 'B' | null;

  // Actions
  setTeamName: (teamId: 'A' | 'B', name: string) => void;
  setWinningScore: (score: number) => void;
  addRound: (teamAPoints: number, teamBPoints: number, calls: Call[]) => void;
  undoLastRound: () => void;
  resetGame: () => void;
  getTotalScore: (teamId: 'A' | 'B') => number;
  loadGame: () => Promise<void>;
  saveGame: () => Promise<void>;
}

// Initialize with default values
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

export const useGameStore = create<GameState>((set, get) => ({
  ...defaultState,

  setTeamName: (teamId, name) => {
    set((state) => {
      const newTeams = { ...state.teams };
      newTeams[teamId].name = name;
      return { teams: newTeams };
    });
    get().saveGame();
  },

  setWinningScore: (score) => {
    set({ winningScore: score });
    get().saveGame();
  },

  addRound: (teamAPoints, teamBPoints, calls) => {
    set((state) => {
      // Adjust points based on Tichu calls
      let adjustedTeamAPoints = teamAPoints;
      let adjustedTeamBPoints = teamBPoints;
      
      // Process each call to adjust points
      calls.forEach(call => {
        const teamId = call.teamId;
        
        if (call.type === 'oneTwo') {
          // For oneTwo, always add exactly 200 points if selected
          if (teamId === 'A') {
            adjustedTeamAPoints += 200;
          } else if (teamId === 'B') {
            adjustedTeamBPoints += 200;
          }
        } else if (call.successful === true) {
          // Add points for successful calls (tichu or grandTichu)
          const points = call.type === 'tichu' ? 100 : 200;
          if (teamId === 'A') {
            adjustedTeamAPoints += points;
          } else if (teamId === 'B') {
            adjustedTeamBPoints += points;
          }
        } else if (call.successful === false) {
          // Subtract points for failed calls (tichu or grandTichu)
          const points = call.type === 'tichu' ? 100 : 200;
          if (teamId === 'A') {
            adjustedTeamAPoints -= points;
          } else if (teamId === 'B') {
            adjustedTeamBPoints -= points;
          }
        }
      });
      
      const newRound: Round = {
        id: state.rounds.length + 1,
        teamAPoints: adjustedTeamAPoints,
        teamBPoints: adjustedTeamBPoints,
        calls,
      };
      
      const newRounds = [...state.rounds, newRound];
      
      // Calculate new totals
      const teamATotal = newRounds.reduce((total, round) => total + round.teamAPoints, 0);
      const teamBTotal = newRounds.reduce((total, round) => total + round.teamBPoints, 0);
      
      // Check if any team reached winning score
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

  getTotalScore: (teamId) => {
    const { rounds } = get();
    return rounds.reduce((total, round) => {
      return total + (teamId === 'A' ? round.teamAPoints : round.teamBPoints);
    }, 0);
  },

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