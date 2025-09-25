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
        bgcolor: "rgba(145, 145, 145, 1)",
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
          bgcolor: "rgba(40, 40, 40, 1)",
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
            bgcolor: "rgba(145, 145, 145, 1)",
            mb: 2,
            borderRadius: "20%",
            overflow: "hidden",
          }}
        >
          <img src={levelImage} alt="Level" style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}} />
        </Paper>
        <Typography variant="h6">LEVEL {currentLevel}</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          paddingTop: 2,
          paddingBottom: 2,
          width: "100%",
          bgcolor: "rgba(145, 145, 145, 1)",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={onShowDevelopment}
          sx={{mx: 1, borderRadius: 2, bgcolor: "rgba(40, 40, 40, 1)", width: "20%"}}
        >
          Upgrades
        </Button>
        <Button variant="contained" size="large" onClick={onStartGame} sx={{mx: 1, borderRadius: 2, bgcolor: "rgba(40, 40, 40, 1)", width: "20%"}}>
          Play
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            /* TODO: Logik für Level-Auswahl */
          }}
          sx={{mx: 1, borderRadius: 2, bgcolor: "rgba(40, 40, 40, 1)", width: "20%"}}
        >
          Level
        </Button>
      </Box>
    </Box>
  );
}

export default MainScreen;
