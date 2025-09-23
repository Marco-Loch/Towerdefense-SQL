import React, {useState} from "react";
import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import PlayerHeader from "../Main-Screen/Player-Header";
import type {ProgressData} from "../../types/progress";

// TypeScript-Schnittstelle für die Props der Komponente

interface TowerDevelopmentProps {
  username: string;
  progress: ProgressData;
  onBackToMain: () => void;
  onSaveProgress: (updatedProgress: any) => void;
}

// TODO: Turm-Daten auslagern
const TOWER_DATA = [
  {id: 1, name: "Schnellfeuerturm", baseCost: 50},
  {id: 2, name: "Raketenturm", baseCost: 100},
];

function TowerDevelopment({username, progress, onBackToMain, onSaveProgress}: TowerDevelopmentProps) {
  const [selectedTower, setSelectedTower] = useState<number | null>(null);

  // Turm-Level aus dem JSON-String parsen
  const towerLevels = progress.tower_levels ? JSON.parse(progress.tower_levels) : {};

  const getUpgradeCost = (towerId: number, currentLevel: number): number => {
    const towerInfo = TOWER_DATA.find((t) => t.id === towerId);
    if (!towerInfo) return Infinity; // Turm nicht gefunden
    return towerInfo.baseCost * (currentLevel + 1);
  };

  const handleUpgrade = (towerId: number) => {
    const currentLevel = towerLevels[towerId] || 0;
    const upgradeCost = getUpgradeCost(towerId, currentLevel);

    if (progress.currency >= upgradeCost) {
      const newCurrency = progress.currency - upgradeCost;
      const newTowerLevels = {...towerLevels, [towerId]: currentLevel + 1};
      const updatedProgress = {
        ...progress,
        currency: newCurrency,
        tower_levels: JSON.stringify(newTowerLevels),
      };
      onSaveProgress(updatedProgress);
      alert("Upgrade erfolgreich gekauft!");
      setSelectedTower(towerId);
    } else {
      alert("Nicht genug Währung.");
    }
  };

  return (
    <Box sx={{display: "flex", flexDirection: "column", height: "100vh"}}>
      {/* Spieler-Header */}
      <PlayerHeader
        playerName={username}
        currency={progress.currency}
        playerLevel={Math.floor(progress.xp / 1000) + 1}
        highscore={progress.highscore}
        ranking="N/A"
      />

      {/* Mitte: Türme */}
      <Box sx={{flexGrow: 1, p: 2, display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Grid container spacing={2} justifyContent="center">
          {TOWER_DATA.map((tower) => (
            <Grid item key={tower.id} xs={12} sm={6} md={4} lg={2}>
              <Paper
                elevation={selectedTower === tower.id ? 8 : 2}
                onClick={() => setSelectedTower(tower.id)}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  textAlign: "center",
                  border: selectedTower === tower.id ? "2px solid" : "none",
                  borderColor: "primary.main",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Typography variant="h6">{tower.name}</Typography>
                <Typography variant="body2">Level: {towerLevels[tower.id] || 0}</Typography>
                <Typography variant="body2">Kosten: {getUpgradeCost(tower.id, towerLevels[tower.id] || 0)}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Roter Footer-Bereich für ausgewählten Turm */}
      {selectedTower && (
        <Paper
          elevation={4}
          sx={{
            p: 2,
            bgcolor: "error.main",
            color: "white",
            textAlign: "center",
            mt: "auto", // Schiebt den Footer ganz nach unten
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">{TOWER_DATA.find((t) => t.id === selectedTower)?.name}</Typography>
            <Typography variant="body1">Aktuelles Level: {towerLevels[selectedTower] || 0}</Typography>
          </Box>
          <Box>
            <Typography variant="body1">Kosten: {getUpgradeCost(selectedTower, towerLevels[selectedTower] || 0)}</Typography>
            <Button variant="contained" color="secondary" onClick={() => handleUpgrade(selectedTower)} sx={{mt: 1}}>
              UPGRADE
            </Button>
          </Box>
        </Paper>
      )}

      {/* Zurück-Button */}
      <Box sx={{p: 2, display: "flex", justifyContent: "center"}}>
        <Button variant="outlined" color="primary" onClick={onBackToMain}>
          ZURÜCK
        </Button>
      </Box>
    </Box>
  );
}

export default TowerDevelopment;
