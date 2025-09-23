// Define the central TypeScript interface for game progress data.
export interface ProgressData {
  xp: number;
  currency: number;
  highscore: number;
  completed_levels: string | null;
  tower_levels: string | null;
}

// Optionally, you can add more types here as your game evolves,
// such as a PlayerData interface.
export interface PlayerData {
  username: string;
}
