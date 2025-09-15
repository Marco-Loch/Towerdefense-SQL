import React from "react";

// TypeScript-Schnittstelle
interface ProgressData {
  xp: number;
  currency: number;
  highscore: number;
  completed_levels: string | null;
}

interface MainScreenProps {
  progress: ProgressData;
  onStartGame: () => void;
  onShowDevelopment: () => void;
}
//////////////////////

function MainScreen({progress, onStartGame, onShowDevelopment}: MainScreenProps) {
  return (
    <div>
      <h1>Hauptmenü</h1>

      <h3>Dein Spielfortschritt:</h3>
      <p>Erfahrungspunkte (XP): {progress.xp}</p>
      <p>Währung: {progress.currency}</p>
      <p>Highscore: {progress.highscore}</p>
      <p>Abgeschlossene Level: {progress.completed_levels ? progress.completed_levels : "Keine"}</p>

      <button onClick={onStartGame}>Spielen</button>
      <button onClick={onShowDevelopment}>Türme entwickeln</button>

      {/* Hier kann später ein Level-Auswahl-Menü hinzugefügt werden */}
    </div>
  );
}

export default MainScreen;
