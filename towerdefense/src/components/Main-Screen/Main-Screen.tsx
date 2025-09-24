import React from "react";
import {Box, Typography, Button, Paper} from "@mui/material";
import PlayerHeader from "./Player-Header";
import type {ProgressData} from "../../types/progress";
import levelImage from "../../assets/img/level/Level1.png";

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
            maxWidth: "70%",
            maxHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#e0e0e0",
            mb: 2,
          }}
        >
          <img src={levelImage} alt="Level 1" style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}} />
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
          bgcolor: "#e3e3e3ff",
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
