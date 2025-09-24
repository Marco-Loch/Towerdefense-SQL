import React from "react";
import {Box, Typography, Button, Paper} from "@mui/material";
import PlayerHeader from "./Player-Header";
import type {ProgressData} from "../../types/progress";

interface MainScreenProps {
  username: string;
  progress: ProgressData;
  onStartGame: () => void;
  onShowDevelopment: () => void;
}

function MainScreen({username, progress, onStartGame, onShowDevelopment}: MainScreenProps) {
  const PlayerName = "Guest";
  const playerLevel = Math.floor(progress.xp / 1000) + 1;
  const currentLevel = 1;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        bgcolor: "#fff",
      }}
    >
      <PlayerHeader playerName={username} currency={progress.currency} playerLevel={playerLevel} highscore={progress.highscore} ranking="N/A" />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "70%",
            height: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#e0e0e0",
            mb: 2,
          }}
        >
          <Typography variant="h5">Level-Bild (Platzhalter)</Typography>
        </Paper>
        <Typography variant="h6">LEVEL {currentLevel}</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          p: 2,
          width: "100%",
          bgcolor: "#fd8080ff",
        }}
      >
        <Button variant="contained" size="large" onClick={onShowDevelopment} sx={{mx: 1}}>
          Upgrades
        </Button>
        <Button variant="contained" size="large" onClick={onStartGame} sx={{mx: 1}}>
          Play
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            /* TODO: Logik für Level-Auswahl */
          }}
          sx={{mx: 1}}
        >
          Level
        </Button>
      </Box>
    </Box>
  );
}

export default MainScreen;
