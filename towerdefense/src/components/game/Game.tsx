import React, {useState, useEffect, useRef} from "react";
import {Box} from "@mui/material";
import GameCanvas from "./Game-Canvas";
import LevelInfo from "./Level-Info";
import Statistics from "./Statistics";
import {LEVEL_DATA, SpawningConfig} from "../../data/levels/Level-Data";
import {ENEMY_DATA, EnemyInfo} from "../../data/enemies/Enemy-Data";
import {Enemy} from "../../utils/Enemy";
import {Card, ALL_CARDS} from "../../data/cards/Card-Data";
import CardSelection from "./Card-Selection";
import type {ProgressData} from "../../types/progress";

// Funktion zur Berechnung der Spieler-HP
function calculatePlayerHP(baseHP: number, playerLevel: number): number {
  if (playerLevel <= 1) {
    return baseHP;
  }
  return baseHP * Math.pow(1.05, playerLevel - 1);
}

const TOWER_SLOTS = ["B", "D", "A", "E", "C"];
const GAME_CANVAS_WIDTH = 500;
const GAME_CANVAS_HEIGHT = 700;

interface GameProps {
  progress: ProgressData;
}

function Game({progress}: GameProps) {
  const playerLevel = Math.floor(progress.xp / 1000) + 1;
  const initialPlayerHP = calculatePlayerHP(1000, playerLevel);

  const initialRoundState = {
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
    playerHP: initialPlayerHP,
  };

  const [roundState, setRoundState] = useState<typeof initialRoundState>(initialRoundState);
  const [gameTime, setGameTime] = useState<number>(0);
  const [activeEnemies, setActiveEnemies] = useState<Enemy[]>([]);
  const lastUpdateTime = useRef(performance.now());
  const gameLoopRef = useRef<number>();

  // Neue Zustände für das Kartensystem
  const [roundXP, setRoundXP] = useState(0);
  const [roundLevel, setRoundLevel] = useState(1);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [cardsToChoose, setCardsToChoose] = useState<Card[]>([]);
  const [isPaused, setIsPaused] = useState(false); // NEU: Spiel Pausen-Zustand

  // Funktion zum Ziehen von 3 zufälligen Karten
  const drawRandomCards = (): Card[] => {
    const shuffled = [...ALL_CARDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Wird aufgerufen, wenn der Spieler eine Karte wählt
  const handleCardSelected = (selectedCard: Card) => {
    console.log(`Karte "${selectedCard.name}" ausgewählt!`);
    // TODO: Hier die Logik zum Anwenden des Karteneffekts implementieren
    // ...
    // Nachdem die Karte verarbeitet wurde, das Spiel fortsetzen
    setShowCardSelection(false);
    setIsPaused(false);
  };

  useEffect(() => {
    // Initiales Karten-Modal bei Spielstart anzeigen
    setShowCardSelection(true);
    setCardsToChoose(drawRandomCards());
    setIsPaused(true); // Spiel sofort pausieren
  }, []);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      // Wenn das Spiel pausiert ist, einfach den nächsten Frame anfordern und die Logik überspringen
      if (isPaused) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = (timestamp - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = timestamp;

      setGameTime((prevTime) => prevTime + deltaTime);

      const currentLevelData = LEVEL_DATA.find((level) => level.level === roundState.currentRoundLevel);
      if (!currentLevelData) return;

      // Logik für Level-Aufstieg basierend auf XP
      const xpNeededForNextLevel = roundLevel * 100; // Beispiel: 100 XP pro Level
      if (roundXP >= xpNeededForNextLevel && roundLevel < 20) {
        setRoundLevel((prevLevel) => prevLevel + 1);
        setRoundXP((prevXP) => prevXP - xpNeededForNextLevel);
        setShowCardSelection(true);
        setCardsToChoose(drawRandomCards());
        setIsPaused(true); // Spiel pausieren, um Kartenauswahl zu ermöglichen
      }

      // Gegnerspawning-Logik
      currentLevelData.spawns.forEach((spawnConfig) => {
        if (gameTime >= spawnConfig.spawnDelay) {
          const currentSpawnInterval = Math.max(1, spawnConfig.spawnInterval - Math.floor(gameTime / 15) * spawnConfig.spawnIncrease);

          if (
            gameTime - spawnConfig.spawnDelay > 0 &&
            Math.floor((gameTime - spawnConfig.spawnDelay) / currentSpawnInterval) !==
              Math.floor((gameTime - spawnConfig.spawnDelay - deltaTime) / currentSpawnInterval)
          ) {
            const enemyInfo = ENEMY_DATA.find((e) => e.id === spawnConfig.enemyId);
            if (enemyInfo) {
              const startX = Math.random() * (GAME_CANVAS_WIDTH - 20) + 10;
              const newEnemy = new Enemy(enemyInfo, startX, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
              setActiveEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
            }
          }
        }
      });

      // Update der Gegnerpositionen
      setActiveEnemies((prevEnemies) => {
        const updatedEnemies = prevEnemies
          .map((enemy) => {
            enemy.update(GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT, deltaTime);
            return enemy;
          })
          .filter((enemy) => enemy.status !== "destroyed");
        return updatedEnemies;
      });

      if (roundState.currentRoundLevel < (currentLevelData.maxRounds || Infinity)) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      } else {
        console.log("Maximum rounds reached. Remaining enemies must be defeated.");
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameTime, roundState.currentRoundLevel, isPaused]); // Abhängigkeit von isPaused hinzufügen

  const currentLevelData = LEVEL_DATA.find((level) => level.level === roundState.currentRoundLevel);
  const enemiesInThisLevel = currentLevelData
    ? (currentLevelData.spawns.map((spawn) => ENEMY_DATA.find((e) => e.id === spawn.enemyId)).filter(Boolean) as EnemyInfo[])
    : [];

  return (
    <Box sx={{display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#000000ff", p: 2, boxSizing: "border-box"}}>
      <Box sx={{flexGrow: 1, display: "flex", gap: 2}}>
        <Statistics roundStats={roundState.roundStats} builtTowers={roundState.builtTowers} />

        <Box
          sx={{
            width: "33.33%",
            position: "relative",
            border: "1px solid black",
            borderRadius: 2,
          }}
        >
          <GameCanvas playerHP={roundState.playerHP} towerSlots={TOWER_SLOTS} activeEnemies={activeEnemies} />
        </Box>

        <LevelInfo currentRoundLevel={roundState.currentRoundLevel} enemyTypes={enemiesInThisLevel} />
      </Box>
      {showCardSelection && <CardSelection availableCards={cardsToChoose} onCardSelected={handleCardSelected} />}
    </Box>
  );
}

export default Game;
