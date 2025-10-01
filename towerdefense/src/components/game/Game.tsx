import React, {useState} from "react";
import {Box} from "@mui/material";
import GameCanvas from "./Game-Canvas";
import LevelInfo from "./Level-Info";
import Statistics from "./Statistics";
import CardSelection from "./Card-Selection";

import {LEVEL_DATA} from "../../data/levels/Level-Data";
import {ENEMY_DATA, EnemyInfo} from "../../data/enemies/Enemy-Data";
import {TOWER_DATA_MAP} from "../../data/towers/Regular-Tower-Data";
import type {ProgressData} from "../../types/progress";
import {Card} from "../../data/cards/Card-Data";

import {useRoundState} from "../../hooks/useRoundState";
import {useCardSelection} from "../../hooks/useCardSelection";
import {useGameLoop} from "../../hooks/useGameLoop";

interface GameProps {
  progress: ProgressData;
}

const CANVAS_SLOTS = ["B", "D", "A", "E", "C"];

export default function Game({progress}: GameProps) {
  const {roundState, handleCardSelected} = useRoundState(progress);
  const {showCardSelection, cardsToChoose, openCardSelection, closeCardSelection} = useCardSelection(roundState);

  const [isPaused, setIsPaused] = useState(false);

  const {gameTime, activeEnemies} = useGameLoop({
    roundState,
    isPaused,
    onLevelUp: () => {
      setIsPaused(true);
      openCardSelection();
    },
  });

  const onCardSelected = (card: Card) => {
    handleCardSelected(card);
    closeCardSelection();
    setIsPaused(false);
  };

  // Enemy-Infos fürs aktuelle Level
  const currentLevelData = LEVEL_DATA.find((l) => l.level === roundState.currentRoundLevel);
  const enemiesInThisLevel: EnemyInfo[] = currentLevelData
    ? (currentLevelData.spawns.map((s) => ENEMY_DATA.find((e) => e.id === s.enemyId)).filter(Boolean) as EnemyInfo[])
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#000",
        p: 2,
      }}
    >
      <Box sx={{flexGrow: 1, display: "flex", gap: 2, height: "100%"}}>
        <Statistics roundStats={roundState.roundStats} builtTowers={roundState.builtTowers} />

        <Box
          sx={{
            width: "33.33%",
            height: "100%",
            position: "relative",
            border: "1px solid black",
            borderRadius: 2,
          }}
        >
          <GameCanvas
            playerHP={roundState.playerHP}
            towerSlots={CANVAS_SLOTS}
            activeEnemies={activeEnemies}
            builtTowers={roundState.builtTowers}
            towerDataMap={TOWER_DATA_MAP}
          />
        </Box>

        <LevelInfo currentRoundLevel={roundState.currentRoundLevel} enemyTypes={enemiesInThisLevel} />
      </Box>

      {showCardSelection && <CardSelection availableCards={cardsToChoose} onCardSelected={onCardSelected} />}
    </Box>
  );
}
