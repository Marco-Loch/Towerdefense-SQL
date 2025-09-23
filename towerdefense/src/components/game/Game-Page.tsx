import React, {useState, useEffect} from "react";
import {Box} from "@mui/material";
import MainScreen from "../Main-Screen/Main-Screen";
import TowerDevelopment from "./Tower-Development";
import type {ProgressData} from "../../types/progress";

// TypeScript-Schnittstelle für die Props der Komponente
interface GamePageProps {
  userId: number | null;
  onLogout: () => void;
}

function GamePage({userId, onLogout}: GamePageProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [message, setMessage] = useState("");
  const [currentScreen, setCurrentScreen] = useState<"loading" | "main" | "game" | "development">("loading");
  const [username, setUsername] = useState<string>("");

  const handleSaveProgress = async (updatedProgress: any) => {
    setProgress(updatedProgress);
    // Sende die Daten an das Backend
    try {
      const response = await fetch("https://towerdefense.marco-loch.de/api/save-progress.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          user_id: userId,
          xp: updatedProgress.xp,
          currency: updatedProgress.currency,
          highscore: updatedProgress.highscore,
          completed_levels: updatedProgress.completed_levels,
          tower_levels: updatedProgress.tower_levels, // Füge die neuen Daten hinzu
        }),
      });
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      setMessage("Fehler beim Speichern.");
    }
  };

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
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({user_id: userId}),
        });

        const result = await response.json();
        if (result.success) {
          setProgress(result.progress);
          setMessage(result.message);
          // <-- Benutzernamen hier setzen
          if (result.username) {
            setUsername(result.username);
          }
        } else {
          setMessage(result.message);
        }
      } catch (error) {
        console.error("Fehler beim Laden des Fortschritts:", error);
        setMessage("Fehler beim Laden des Fortschritts.");
      } finally {
        setCurrentScreen("main");
        setTimeout(() => {
          setMessage("");
        }, 3000);
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <p>{message || "Lade Spielfortschritt..."}</p>
        </Box>
      );
    }

    switch (currentScreen) {
      case "main":
        return <MainScreen username={username} progress={progress} onStartGame={handleStartGame} onShowDevelopment={handleShowDevelopment} />;
      case "game":
        return (
          <div>
            <h1>Das Spiel wird hier gerendert</h1>
            <button onClick={handleBackToMain}>Zurück zum Hauptmenü</button>
            {/* Hier wird später die eigentliche Game-Komponente gerendert */}
          </div>
        );
      case "development":
        return <TowerDevelopment username={username} progress={progress} onBackToMain={handleBackToMain} onSaveProgress={handleSaveProgress} />;
      default:
        return <div>Unerwarteter Fehler.</div>;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {renderScreen()}
      <button onClick={onLogout}>Abmelden</button>
    </Box>
  );
}

export default GamePage;
