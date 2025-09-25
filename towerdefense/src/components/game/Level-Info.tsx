import React from "react";
import {Box, Paper, Typography, Grid} from "@mui/material";
import type {EnemyInfo} from "../../data/enemies/Enemy-Data";

interface LevelInfoProps {
  currentRoundLevel: number;
  enemyTypes: EnemyInfo[];
}

function LevelInfo({currentRoundLevel, enemyTypes}: LevelInfoProps) {
  return (
    <Box sx={{width: "33.33%", display: "flex", flexDirection: "column", gap: 2}}>
      {/* Überschrift für Level-Info */}
      <Paper elevation={4} sx={{p: 2, bgcolor: "rgba(145, 145, 145, 1)", borderRadius: 2, borderBottom: "1px solid black"}}>
        <Typography variant="h5" align="center">
          LEVEL {currentRoundLevel}
        </Typography>
      </Paper>

      {/* Gegner-Infos */}
      {enemyTypes.map((enemy) => (
        <Paper
          key={enemy.name}
          elevation={4}
          sx={{p: 2, bgcolor: "rgba(145, 145, 145, 1)", borderRadius: 2, display: "flex", alignItems: "center", gap: 2}}
        >
          {/* Gegnerbild */}
          <Box
            sx={{
              flexShrink: 0,
              width: 100,
              height: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img src={enemy.img} alt={enemy.name} style={{width: "100%", height: "100%", objectFit: "contain"}} />
          </Box>

          {/* Textinfos */}
          <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
            <Typography variant="h6" sx={{textAlign: "center", mb: 1}}>
              {enemy.name}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Hitpoints: {enemy.health}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"></Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Damage dealt: {enemy.damageDealt}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Killcount: {enemy.killcount}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default LevelInfo;
