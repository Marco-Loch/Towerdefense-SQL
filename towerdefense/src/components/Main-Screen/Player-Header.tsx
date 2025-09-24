import React from "react";
import {Box, Typography, Grid, Paper} from "@mui/material";

interface PlayerHeaderProps {
  playerName: string;
  currency: number;
  playerLevel: number;
  highscore: number;
  ranking: string | null;
}

function PlayerHeader({playerName, currency, playerLevel, highscore, ranking}: PlayerHeaderProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        height: "20vh",
        bgcolor: "rgba(0, 0, 0, 0.05)",
        p: 2,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Linke Seite: Gold und Level */}
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
        <Typography variant="body1">Gold: {currency}</Typography>
        <Typography variant="body1">Level: {playerLevel}</Typography>
      </Box>

      {/* Mitte: Spielername */}
      <Box sx={{textAlign: "center"}}>
        <Typography variant="h4" component="h2">
          {playerName}
        </Typography>
      </Box>

      {/* Rechte Seite: Highscore und Ranking */}
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
        <Typography variant="body1">Highscore: {highscore}</Typography>
        <Typography variant="body1">Ranking: {ranking}</Typography>
      </Box>
    </Paper>
  );
}

export default PlayerHeader;
