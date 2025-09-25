import React, {useState} from "react";
import {Box} from "@mui/material";
import GameCanvas from "./Game-Canvas";
import LevelInfo from "./Level-Info";
import Statistics from "./Statistics";

import smallMeteoriteImg from "../../assets/img/enemies/small-meteorite.png";
import bigMeteoriteImg from "../../assets/img/enemies/big-meteorite.png";
import alienScoutImg from "../../assets/img/enemies/alien-scout.png";
// Tower-Bilder werden hier nicht mehr benötigt, da sie in TowerData sind.
import {TOWER_DATA} from "../../data/towerdata/Regular-Tower-Data";

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
  builtTowers: [], // Leeres Array, keine Türme zu Beginn
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
const ENEMY_TYPES = [
  {name: "Small Meteorite", hp: 1000, img: smallMeteoriteImg, damage: 0, killcount: 0},
  {name: "Big Meteorite", hp: 2500, img: bigMeteoriteImg, damage: 0, killcount: 0},
  {name: "Alien Scout", hp: 5000, img: alienScoutImg, damage: 0, killcount: 0},
];

function Game() {
  const [roundState, setRoundState] = useState<RoundState>(initialRoundState);

  // Beispiel: Hinzufügen eines Turms, um das neue Layout zu testen
  //   setRoundState({
  //     ...initialRoundState,
  //     builtTowers: [{slot: "A", towerId: 1, level: 1, upgrades: []}],
  //   });

  return (
    <Box sx={{display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#000000ff", p: 2, boxSizing: "border-box"}}>
      <Box sx={{flexGrow: 1, display: "flex", gap: 2}}>
        {/* Linke Spalte: Statistik als separate Komponente */}
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

        {/* Rechte Spalte: Level-Info als separate Komponente */}
        <LevelInfo currentRoundLevel={roundState.currentRoundLevel} enemyTypes={ENEMY_TYPES} />
      </Box>
    </Box>
  );
}

export default Game;
