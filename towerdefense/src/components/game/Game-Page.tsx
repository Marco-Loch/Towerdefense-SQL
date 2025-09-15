import React, {useState, useEffect} from "react";
import MainScreen from "../Main-Screen/Main-Screen";

// TypeScript-Schnittstelle für die Props der Komponente
interface GamePageProps {
  userId: number | null;
  onLogout: () => void;
}

// TypeScript-Schnittstelle für die Spielfortschrittsdaten
interface ProgressData {
  xp: number;
  currency: number;
  highscore: number;
  completed_levels: string | null;
}

function GamePage({userId, onLogout}: GamePageProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [message, setMessage] = useState("");
  const [currentScreen, setCurrentScreen] = useState<"loading" | "main" | "game" | "development">("loading");

  useEffect(() => {
    const loadProgress = async () => {
      if (userId === null) {
        setMessage("Benutzer-ID nicht gefunden.");
        setCurrentScreen("main");
        return;
      }

      try {
        const response = await fetch("https://towerdefense.marco-loch.de/api/load-progress.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({user_id: userId}),
        });

        const result = await response.json();

        if (result.success) {
          setProgress(result.progress);
          setMessage(result.message);
        } else {
          setMessage(result.message);
        }
      } catch (error) {
        console.error("Fehler beim Laden des Fortschritts:", error);
        setMessage("Fehler beim Laden des Fortschritts.");
      } finally {
        // Unabhängig vom Ergebnis zum Hauptbildschirm wechseln
        setCurrentScreen("main");
      }
    };

    loadProgress();
  }, [userId]);

  const handleStartGame = () => {
    setCurrentScreen("game");
  };

  const handleShowDevelopment = () => {
    setCurrentScreen("development");
  };

  const handleBackToMain = () => {
    setCurrentScreen("main");
  };

  const renderScreen = () => {
    if (!progress) {
      return (
        <div>
          <p>{message || "Lade Spielfortschritt..."}</p>
        </div>
      );
    }

    switch (currentScreen) {
      case "main":
        return <MainScreen progress={progress} onStartGame={handleStartGame} onShowDevelopment={handleShowDevelopment} />;
      case "game":
        return (
          <div>
            <h1>Das Spiel wird hier gerendert</h1>
            <button onClick={handleBackToMain}>Zurück zum Hauptmenü</button>
            {/* Hier wird später die eigentliche Game-Komponente gerendert */}
          </div>
        );
      case "development":
        return (
          <div>
            <h1>Hier kommt der Turm-Entwicklungs-Bildschirm</h1>
            <button onClick={handleBackToMain}>Zurück zum Hauptmenü</button>
            {/* Hier wird die TowerDevelopment-Komponente gerendert */}
          </div>
        );
      default:
        return <div>Unerwarteter Fehler.</div>;
    }
  };

  return (
    <div>
      <p>{message}</p>
      {renderScreen()}
      <button onClick={onLogout}>Abmelden</button>
    </div>
  );
}

export default GamePage;
