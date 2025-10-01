// src/hooks/useGameLoop.ts
import {useEffect, useRef, useState} from "react";
import {Enemy} from "../utils/Enemy";
import {LEVEL_DATA} from "../data/levels/Level-Data";
import {ENEMY_DATA} from "../data/enemies/Enemy-Data";
import type {RoundState} from "./useRoundState";

const GAME_CANVAS_WIDTH = 500;
const GAME_CANVAS_HEIGHT = 700;

interface UseGameLoopProps {
  roundState: RoundState;
  isPaused: boolean;
  onLevelUp: () => void; // callback, z.B. Kartenwahl öffnen
}

export function useGameLoop({roundState, isPaused, onLevelUp}: UseGameLoopProps) {
  const [gameTime, setGameTime] = useState<number>(0);
  const [activeEnemies, setActiveEnemies] = useState<Enemy[]>([]);
  const [roundXP, setRoundXP] = useState(0);
  const [roundLevel, setRoundLevel] = useState(1);

  const lastUpdateTime = useRef(performance.now());
  const gameLoopRef = useRef<number>();

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (isPaused) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = (timestamp - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = timestamp;

      setGameTime((prev) => prev + deltaTime);

      const currentLevelData = LEVEL_DATA.find((l) => l.level === roundState.currentRoundLevel);
      if (!currentLevelData) return;

      // XP Check → Level-Up
      const xpNeededForNextLevel = roundLevel * 100;
      if (roundXP >= xpNeededForNextLevel && roundLevel < 20) {
        setRoundLevel((prev) => prev + 1);
        setRoundXP((prev) => prev - xpNeededForNextLevel);
        onLevelUp();
      }

      // Gegner-Spawns
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
              setActiveEnemies((prev) => [...prev, newEnemy]);
            }
          }
        }
      });

      // Gegner bewegen / updaten
      setActiveEnemies((prevEnemies) =>
        prevEnemies
          .map((enemy) => {
            enemy.update(GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT, deltaTime);
            return enemy;
          })
          .filter((enemy) => enemy.status !== "destroyed")
      );

      // Loop weiterführen
      if (roundState.currentRoundLevel < (currentLevelData.maxRounds || Infinity)) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPaused, roundState.currentRoundLevel, roundXP, roundLevel, onLevelUp]);

  return {gameTime, activeEnemies, roundXP, roundLevel, setRoundXP};
}
