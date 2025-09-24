import React, {useState} from "react";
import {Box, Button, Grid, Paper, Typography, Divider} from "@mui/material";
import PlayerHeader from "../Main-Screen/Player-Header";
import {ProgressData} from "../../types/progress";
import {TOWER_DATA, UPGRADE_RATES, TowerInfo, UpgradeRates} from "../../data/towerdata/Regular-Tower-Data";

interface TowerDevelopmentProps {
  username: string;
  progress: ProgressData;
  onBackToMain: () => void;
  onSaveProgress: (updatedProgress: any) => void;
}

// Calculates the compounded value after a certain number of upgrades
const calculateCurrentValue = (baseValue: number, increaseRate: number, currentLevel: number): number => {
  if (typeof baseValue !== "number" || isNaN(baseValue)) {
    return 0;
  }
  return baseValue * Math.pow(1 + increaseRate, currentLevel);
};

function TowerDevelopment({username, progress, onBackToMain, onSaveProgress}: TowerDevelopmentProps) {
  const [selectedTower, setSelectedTower] = useState<TowerInfo | null>(null);
  const towerLevels = progress.tower_levels ? JSON.parse(progress.tower_levels) : {};

  const getUpgradeCost = (towerId: number, currentLevel: number): number => {
    const towerInfo = TOWER_DATA.find((t) => t.id === towerId);
    if (!towerInfo) return Infinity;
    return towerInfo.baseCost * (currentLevel + 1);
  };

  const handleUpgrade = () => {
    if (!selectedTower) return;
    const currentLevel = towerLevels[selectedTower.id] || 0;
    const upgradeCost = getUpgradeCost(selectedTower.id, currentLevel);
    if (progress.currency >= upgradeCost) {
      const newCurrency = progress.currency - upgradeCost;
      const newTowerLevels = {...towerLevels, [selectedTower.id]: currentLevel + 1};
      const updatedProgress = {
        ...progress,
        currency: newCurrency,
        tower_levels: JSON.stringify(newTowerLevels),
      };
      onSaveProgress(updatedProgress);
      alert("Upgrade successful!");
      setSelectedTower(selectedTower);
    } else {
      alert("Not enough currency.");
    }
  };

  const getTowerUpgradeRates = (towerId: number): UpgradeRates | undefined => {
    return UPGRADE_RATES.find((rate) => rate.id === towerId);
  };

  return (
    <Box sx={{display: "flex", flexDirection: "column", height: "100vh", p: 2, boxSizing: "border-box"}}>
      <PlayerHeader
        playerName={username}
        currency={progress.currency}
        playerLevel={Math.floor(progress.xp / 1000) + 1}
        highscore={progress.highscore}
        ranking="N/A"
      />
      <Grid container spacing={4} sx={{mt: 2, flexGrow: 1}}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {TOWER_DATA.map((tower) => (
              <Grid item xs={12} sm={6} md={6} key={tower.id}>
                <Paper
                  elevation={selectedTower?.id === tower.id ? 8 : 2}
                  onClick={() => setSelectedTower(tower)}
                  sx={{
                    cursor: "pointer",
                    p: 2,
                    textAlign: "center",
                    border: selectedTower?.id === tower.id ? "2px solid" : "none",
                    borderColor: "primary.main",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <Typography variant="h6">{tower.name}</Typography>
                  <Typography variant="body2">Level: {towerLevels[tower.id] || 0}</Typography>
                  <Typography variant="body2">Cost: {getUpgradeCost(tower.id, towerLevels[tower.id] || 0)}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{p: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            {selectedTower ? (
              <>
                {/* Header Section */}
                <Box sx={{p: 2, bgcolor: "#f0f0f0", textAlign: "center"}}>
                  <Typography variant="h5" component="h2">
                    {selectedTower.name}
                  </Typography>
                </Box>
                {/* Projectile Description */}
                <Typography variant="body1" sx={{mt: 2, textAlign: "center"}}>
                  {selectedTower.projectile}
                </Typography>
                <Divider sx={{my: 2}} />
                {/* Stats Grid */}
                <Grid container spacing={2} sx={{p: 2}}>
                  <Grid item xs={12}>
                    <Paper sx={{p: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <Typography variant="body1">Damage:</Typography>
                      <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography variant="body1" sx={{mr: 1}}>
                          {calculateCurrentValue(
                            selectedTower.damage,
                            getTowerUpgradeRates(selectedTower.id)?.damageIncrease || 0,
                            towerLevels[selectedTower.id] || 0
                          ).toFixed(2)}
                        </Typography>
                        <Typography variant="body1" sx={{color: "success.main"}}>
                          {`+${(
                            calculateCurrentValue(
                              selectedTower.damage,
                              getTowerUpgradeRates(selectedTower.id)?.damageIncrease || 0,
                              towerLevels[selectedTower.id] || 0
                            ) * (getTowerUpgradeRates(selectedTower.id)?.damageIncrease || 0)
                          ).toFixed(2)}`}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  {/* ... weitere Stats nach dem gleichen Muster */}
                  <Grid item xs={12}>
                    <Paper sx={{p: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <Typography variant="body1">Speed:</Typography>
                      <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography variant="body1" sx={{mr: 1}}>
                          {calculateCurrentValue(
                            selectedTower.speed,
                            getTowerUpgradeRates(selectedTower.id)?.speedIncrease || 0,
                            towerLevels[selectedTower.id] || 0
                          ).toFixed(2)}
                        </Typography>
                        <Typography variant="body1" sx={{color: "success.main"}}>
                          {`+${(
                            calculateCurrentValue(
                              selectedTower.speed,
                              getTowerUpgradeRates(selectedTower.id)?.speedIncrease || 0,
                              towerLevels[selectedTower.id] || 0
                            ) * (getTowerUpgradeRates(selectedTower.id)?.speedIncrease || 0)
                          ).toFixed(2)}`}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{p: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <Typography variant="body1">Range:</Typography>
                      <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography variant="body1" sx={{mr: 1}}>
                          {calculateCurrentValue(
                            selectedTower.range,
                            getTowerUpgradeRates(selectedTower.id)?.rangeIncrease || 0,
                            towerLevels[selectedTower.id] || 0
                          ).toFixed(2)}
                        </Typography>
                        <Typography variant="body1" sx={{color: "success.main"}}>
                          {`+${(
                            calculateCurrentValue(
                              selectedTower.range,
                              getTowerUpgradeRates(selectedTower.id)?.rangeIncrease || 0,
                              towerLevels[selectedTower.id] || 0
                            ) * (getTowerUpgradeRates(selectedTower.id)?.rangeIncrease || 0)
                          ).toFixed(2)}`}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{p: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <Typography variant="body1">AoE:</Typography>
                      <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography variant="body1" sx={{mr: 1}}>
                          {typeof selectedTower.aoe === "number"
                            ? calculateCurrentValue(
                                selectedTower.aoe,
                                getTowerUpgradeRates(selectedTower.id)?.aoeIncrease || 0,
                                towerLevels[selectedTower.id] || 0
                              ).toFixed(2)
                            : selectedTower.aoe}
                        </Typography>
                        <Typography variant="body1" sx={{color: "success.main"}}>
                          {typeof selectedTower.aoe === "number"
                            ? `+${(
                                calculateCurrentValue(
                                  selectedTower.aoe,
                                  getTowerUpgradeRates(selectedTower.id)?.aoeIncrease || 0,
                                  towerLevels[selectedTower.id] || 0
                                ) * (getTowerUpgradeRates(selectedTower.id)?.aoeIncrease || 0)
                              ).toFixed(2)}`
                            : ""}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                <Divider sx={{my: 2}} />
                {/* Other Stats Section */}
                <Box sx={{p: 2, textAlign: "center"}}>
                  <Typography variant="h6">{selectedTower.damageType}</Typography>
                  <Typography variant="body2" sx={{mt: 1}}>
                    Target Priority: {selectedTower.targetPriority}
                  </Typography>
                </Box>
                {/* Cost Button */}
                <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      bgcolor: "green",
                      "&:hover": {bgcolor: "darkgreen"},
                    }}
                    onClick={handleUpgrade}
                  >
                    {getUpgradeCost(selectedTower.id, towerLevels[selectedTower.id] || 0)}
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Typography variant="h5" color="text.secondary">
                  CHOOSE TOWER
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{display: "flex", justifyContent: "center", p: 2}}>
        <Button variant="outlined" color="primary" onClick={onBackToMain}>
          BACK
        </Button>
      </Box>
    </Box>
  );
}
export default TowerDevelopment;
