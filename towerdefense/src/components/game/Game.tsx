import React, {useState, useEffect} from "react";
import {Box} from "@mui/material";
import GameCanvas from "./Game-Canvas";
import LevelInfo from "./Level-Info";
import Statistics from "./Statistics";
import {LEVEL_DATA, SpawningConfig} from "../../data/levels/Level-Data";

import {ENEMY_DATA, EnemyInfo} from "../../data/enemies/Enemy-Data";
// import {TOWER_DATA} from "../../data/towerdata/Regular-Tower-Data";

interface RoundState {
  builtTowers: {slot: string; towerId: number; level: number; upgrades: any[]}[];
  roundStats: {
    totalDamage: number;
    totalDamageTaken: number;
    totalKills: number;
    totalGold: number;
    totalPlayerXP: number;
    roundXP: number;
  };
  currentRoundLevel: number;
  playerHP: number;
}

const initialRoundState: RoundState = {
  builtTowers: [],
  roundStats: {
    totalDamage: 0,
    totalDamageTaken: 0,
    totalKills: 0,
    totalGold: 0,
    totalPlayerXP: 0,
    roundXP: 0,
  },
  currentRoundLevel: 1,
  playerHP: 1000,
};

const TOWER_SLOTS = ["B", "D", "A", "E", "C"];

function Game() {
  const [roundState, setRoundState] = useState<RoundState>(initialRoundState);
  const [gameTime, setGameTime] = useState<number>(0);
  const [spawnCounters, setSpawnCounters] = useState<Record<number, number>>({});

  useEffect(() => {
    // Implementierung der Spielschleife
    const gameLoop = setInterval(() => {
      setGameTime((prevTime) => prevTime + 1);

      const currentLevelData = LEVEL_DATA.find((level) => level.level === roundState.currentRoundLevel);
      if (!currentLevelData) return;

      // Gegner-Spawning-Logik
      currentLevelData.spawns.forEach((spawnConfig: SpawningConfig) => {
        if (gameTime >= spawnConfig.spawnDelay) {
          const currentSpawnInterval = spawnConfig.spawnInterval - Math.floor(gameTime / 15) * spawnConfig.spawnIncrease;

          if ((gameTime - spawnConfig.spawnDelay) % currentSpawnInterval === 0) {
            console.log(`Spawning enemy ${spawnConfig.enemyId} at time ${gameTime}`);
          }
        }
      });

      if (roundState.currentRoundLevel >= currentLevelData.maxRounds) {
        clearInterval(gameLoop);
        console.log("Maximum rounds reached. Remaining enemies must be defeated.");
      }
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [gameTime, roundState.currentRoundLevel]);

  const currentLevelData = LEVEL_DATA.find((level) => level.level === roundState.currentRoundLevel);
  const enemiesInThisLevel = currentLevelData
    ? (currentLevelData.spawns.map((spawn) => ENEMY_DATA.find((e) => e.id === spawn.enemyId)).filter(Boolean) as EnemyInfo[])
    : [];

  return (
    <Box sx={{display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#000000ff", p: 2, boxSizing: "border-box"}}>
      <Box sx={{flexGrow: 1, display: "flex", gap: 2}}>
        {/* Linke Spalte: Statistik */}
        <Statistics roundStats={roundState.roundStats} builtTowers={roundState.builtTowers} />

        {/* Mittlere Spalte: Spielfeld */}
        <Box
          sx={{
            width: "33.33%",
            position: "relative",
            border: "1px solid black",
            borderRadius: 2,
          }}
        >
          <GameCanvas playerHP={roundState.playerHP} towerSlots={TOWER_SLOTS} />
        </Box>

        {/* Rechte Spalte: Level-Info */}
        <LevelInfo currentRoundLevel={roundState.currentRoundLevel} enemyTypes={enemiesInThisLevel} />
      </Box>
    </Box>
  );
}

export default Game;
