import React from "react";
import {Box, Paper, Typography, Button} from "@mui/material";
import {TOWER_DATA} from "../../data/towers/Regular-Tower-Data";

interface TowerStats {
  slot: string;
  towerId: number;
  level: number;
  upgrades: any[];
}

interface StatisticsProps {
  roundStats: {
    totalDamage: number;
    totalDamageTaken: number;
    totalKills: number;
    totalGold: number;
    totalPlayerXP: number;
    roundXP: number;
  };
  builtTowers: TowerStats[];
}

function Statistics({roundStats, builtTowers}: StatisticsProps) {
  const score = roundStats.totalDamageTaken > 0 ? Math.floor(roundStats.totalDamage / roundStats.totalDamageTaken) : roundStats.totalDamage;

  return (
    <Box
      sx={{
        width: "33.33%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%", // ganze Spalte füllt Höhe
      }}
    >
      {/* Überschrift */}
      <Paper
        elevation={4}
        sx={{
          p: 2,
          bgcolor: "rgba(145, 145, 145, 1)",
          borderRadius: 2,
          borderBottom: "1px solid black",
          width: "95%",
        }}
      >
        <Typography variant="h5" align="center">
          STATISTICS
        </Typography>
      </Paper>

      {/* Hauptstatistiken */}
      <Paper
        elevation={4}
        sx={{
          p: 2,
          bgcolor: "rgba(145, 145, 145, 1)",
          borderRadius: 2,
          width: "95%",
        }}
      >
        <Box sx={{display: "flex", gap: 2, mb: 1}}>
          {/* Linke Spalte */}
          <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Typography variant="body2">Damage:</Typography>
              <Typography variant="body2">{roundStats.totalDamage}</Typography>
            </Box>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Typography variant="body2">Round XP:</Typography>
              <Typography variant="body2">{roundStats.roundXP}</Typography>
            </Box>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Typography variant="body2">Gold earned:</Typography>
              <Typography variant="body2">{roundStats.totalGold}</Typography>
            </Box>
          </Box>

          {/* Rechte Spalte */}
          <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Typography variant="body2">Damage Taken:</Typography>
              <Typography variant="body2">{roundStats.totalDamageTaken}</Typography>
            </Box>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Typography variant="body2">Player XP:</Typography>
              <Typography variant="body2">{roundStats.totalPlayerXP}</Typography>
            </Box>
            <Box />
          </Box>
        </Box>
      </Paper>

      {/* Turm-Statistiken mit Scroll */}
      <Box sx={{flexGrow: 1, overflowY: "auto", pr: 1}}>
        {builtTowers.map((tower) => {
          const towerInfo = TOWER_DATA.find((data) => data.id === tower.towerId);
          if (!towerInfo) return null;
          return (
            <Paper
              key={tower.slot}
              elevation={4}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "rgba(145, 145, 145, 1)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Turmbild im Kreis */}
              <Box
                sx={{
                  flexShrink: 0,
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  border: "1px solid grey",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  bgcolor: "white",
                }}
              >
                <img src={towerInfo.img} alt={towerInfo.name} style={{width: "70%", height: "70%", objectFit: "contain"}} />
              </Box>

              {/* Textinfos */}
              <Box sx={{flexGrow: 1}}>
                <Typography variant="subtitle1" align="center">
                  {towerInfo.name}
                </Typography>
                <Box sx={{display: "flex", justifyContent: "space-between", mt: 1}}>
                  <Typography variant="body2">Damage: {towerInfo.damage}</Typography>
                  <Typography variant="body2">Kills: -</Typography>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* SCORE + EXIT fixiert unten */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: "auto",
          gap: 2,
          width: "100%",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 2,
            width: "95%",
            bgcolor: "rgba(145, 145, 145, 1)",
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5">SCORE</Typography>
          <Typography variant="h4">{score}</Typography>
        </Paper>
        <Button variant="contained" color="primary" sx={{borderRadius: 2, width: "100%", bgcolor: "rgba(40, 40, 40, 1)"}}>
          EXIT
        </Button>
      </Box>
    </Box>
  );
}

export default Statistics;
