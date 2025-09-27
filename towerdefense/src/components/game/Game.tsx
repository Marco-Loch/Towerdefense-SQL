import React, {useState, useEffect, useRef} from "react";
import {Box} from "@mui/material";
import GameCanvas from "./Game-Canvas";
import LevelInfo from "./Level-Info";
import Statistics from "./Statistics";
import {LEVEL_DATA} from "../../data/levels/Level-Data";
import {ENEMY_DATA, EnemyInfo} from "../../data/enemies/Enemy-Data";
import {Enemy} from "../../utils/Enemy";
import {Card, ALL_CARDS, TowerCard, UpgradeCard, MilestoneCard} from "../../data/cards/Card-Data";
import CardSelection from "./Card-Selection";
import type {ProgressData} from "../../types/progress";

// Funktion zur Berechnung der Spieler-HP
function calculatePlayerHP(baseHP: number, playerLevel: number): number {
  if (playerLevel <= 1) {
    return baseHP;
  }
  return baseHP * Math.pow(1.05, playerLevel - 1);
}

// NEUE INTERFACES FÜR KARTEN-UPGRADES
// Struktur für einen gebauten Turm
interface BuiltTower {
  slot: string;
  towerId: number;
  level: number; // Turmlevel durch reguläre Upgrades (später: Persistenter Meta-Upgrade-Stand)

  // Kumulative Boni durch Upgrade-Karten (Temporäre In-Runden-Boni)
  cardUpgrades: {
    damageMultiplier: number; // Startet bei 1.0. +30% Karte setzt auf 1.3
    speedMultiplier: number; // Startet bei 1.0
    rangeMultiplier: number; // Startet bei 1.0
    aoeMultiplier: number; // Startet bei 1.0
    penetrationBonus: number; // Flacher Wert, z.B. 0, +1, +2
    extraProjectiles: number; // Flacher Wert, z.B. 0, +1
  };

  // Meilenstein-Flags (Temporäre In-Runden-Boni)
  milestones: {
    lvl5: boolean;
    lvl10: boolean;
  };

  // Hinzugefügt, um das 'TowerStats'-Interface in Statistics.tsx zu erfüllen und den Fehler zu beheben.
  // Korrigiert von Record<string, any> auf any[], da Statistics.tsx ein Array erwartet.
  upgrades: any[];
}

// Interface für den Runden-Zustand (RoundState)
interface RoundState {
  builtTowers: BuiltTower[]; // Nutzt das neue BuiltTower Interface
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

const TOWER_SLOTS = ["B", "D", "A", "E", "C"];
const GAME_CANVAS_WIDTH = 500;
const GAME_CANVAS_HEIGHT = 700;

interface GameProps {
  progress: ProgressData;
}

function Game({progress}: GameProps) {
  const playerLevel = Math.floor(progress.xp / 1000) + 1;
  const initialPlayerHP = calculatePlayerHP(1000, playerLevel);

  // Initialisierung der builtTowers mit der neuen Struktur
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
    playerHP: initialPlayerHP,
  };

  const [roundState, setRoundState] = useState<RoundState>(initialRoundState);
  const [gameTime, setGameTime] = useState<number>(0);
  const [activeEnemies, setActiveEnemies] = useState<Enemy[]>([]);
  const lastUpdateTime = useRef(performance.now());
  const gameLoopRef = useRef<number>();

  const [roundXP, setRoundXP] = useState(0);
  const [roundLevel, setRoundLevel] = useState(1);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [cardsToChoose, setCardsToChoose] = useState<Card[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // Hilfsfunktion zum Finden eines freien Slots
  const findFreeSlot = (towers: BuiltTower[]): string | undefined => {
    const occupiedSlots = new Set(towers.map((t) => t.slot));
    return TOWER_SLOTS.find((slot) => !occupiedSlots.has(slot));
  };

  // Funktion zur Ermittlung der verfügbaren Karten basierend auf dem Spielzustand
  const getAvailableCards = (builtTowers: BuiltTower[]): Card[] => {
    const availableCards: Card[] = [];
    const occupiedSlotCount = builtTowers.length;
    const isMaxTowers = occupiedSlotCount >= TOWER_SLOTS.length;

    for (const card of ALL_CARDS) {
      switch (card.type) {
        case "tower":
          // Turmkarten: Nur verfügbar, wenn noch ein freier Slot existiert.
          if (!isMaxTowers) {
            availableCards.push(card);
          }
          break;

        case "upgrade":
          const upgradeCard = card as UpgradeCard;
          // Upgrade-Karten: Nur verfügbar, wenn ein Turm des Typs gebaut wurde.
          if (builtTowers.some((t) => t.towerId === upgradeCard.towerId)) {
            availableCards.push(card);
          }
          break;

        case "milestone":
          const milestoneCard = card as MilestoneCard;
          // Meilenstein-Karten: Nur verfügbar, wenn Turm gebaut, Level erreicht und Milestone nicht aktiv.
          const targetTower = builtTowers.find((t) => t.towerId === milestoneCard.towerId);

          if (targetTower) {
            const levelRequirementMet = targetTower.level >= milestoneCard.level;
            let isMilestoneActive = false;

            if (milestoneCard.level === 5) {
              isMilestoneActive = targetTower.milestones.lvl5;
            } else if (milestoneCard.level === 10) {
              isMilestoneActive = targetTower.milestones.lvl10;
            }

            if (levelRequirementMet && !isMilestoneActive) {
              availableCards.push(card);
            }
          }
          break;

        default:
          // Andere Kartentypen (z.B. General Upgrades, die immer verfügbar sind)
          availableCards.push(card);
          break;
      }
    }
    return availableCards;
  };

  const drawRandomCards = (): Card[] => {
    // Ruft die gefilterte Liste ab
    const availableCards = getAvailableCards(roundState.builtTowers);

    // Wählt zufällig maximal 3 Karten aus den verfügbaren Karten
    const shuffled = [...availableCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Logik zur Anwendung des Karteneffekts
  const applyCardEffect = (card: Card, prevRoundState: RoundState): RoundState => {
    switch (card.type) {
      case "tower":
        const towerCard = card as TowerCard;
        const freeSlot = findFreeSlot(prevRoundState.builtTowers);

        if (!freeSlot) {
          console.warn("Kein freier Slot verfügbar, Turmkarte ignoriert.");
          return prevRoundState;
        }

        const newTower: BuiltTower = {
          slot: freeSlot,
          towerId: towerCard.towerId,
          level: 1, // Startet auf Level 1
          cardUpgrades: {
            damageMultiplier: 1.0,
            speedMultiplier: 1.0,
            rangeMultiplier: 1.0,
            aoeMultiplier: 1.0,
            penetrationBonus: 0,
            extraProjectiles: 0,
          },
          milestones: {lvl5: false, lvl10: false},
          upgrades: [],
        };

        // DEBUG: Temporär Level auf 10 setzen, um Milestone-Karten testen zu können
        if (newTower.towerId === 1 && prevRoundState.builtTowers.length === 0) {
          newTower.level = 10;
          console.log("DEBUG: RFT temporär auf Level 10 gesetzt, um Milestone-Test zu ermöglichen.");
        }

        return {
          ...prevRoundState,
          builtTowers: [...prevRoundState.builtTowers, newTower],
        };

      case "upgrade":
        const upgradeCard = card as UpgradeCard;
        // Vorerst nehmen wir den ERSTEN gebauten Turm des Typs.
        // TODO: Später: Spieler muss den Zielturm auswählen können.
        const targetUpgradeIndex = prevRoundState.builtTowers.findIndex((t) => t.towerId === upgradeCard.towerId);

        if (targetUpgradeIndex === -1) {
          console.warn(`Kein Turm des Typs ${upgradeCard.towerId} gebaut. Upgrade ignoriert.`);
          return prevRoundState;
        }

        const updatedTowersUpgrade = [...prevRoundState.builtTowers];
        const targetTowerUpgrade = updatedTowersUpgrade[targetUpgradeIndex];

        // Anwendung des Upgrades (kumulativ)
        switch (upgradeCard.upgradeType) {
          case "damage":
            targetTowerUpgrade.cardUpgrades.damageMultiplier += upgradeCard.value;
            break;
          case "attackSpeed":
            targetTowerUpgrade.cardUpgrades.speedMultiplier += upgradeCard.value;
            break;
          case "range":
            targetTowerUpgrade.cardUpgrades.rangeMultiplier += upgradeCard.value;
            break;
          case "aoe":
            targetTowerUpgrade.cardUpgrades.aoeMultiplier += upgradeCard.value;
            break;
          case "penetration":
            targetTowerUpgrade.cardUpgrades.penetrationBonus += upgradeCard.value;
            break;
          case "extraProjectile":
            // RT Extra Rocket: +1 Projektil, -15% Schaden (value = -0.15)
            targetTowerUpgrade.cardUpgrades.extraProjectiles += 1;
            targetTowerUpgrade.cardUpgrades.damageMultiplier += upgradeCard.value;
            break;
        }

        return {
          ...prevRoundState,
          builtTowers: updatedTowersUpgrade,
        };

      case "milestone":
        const milestoneCard = card as MilestoneCard;
        // Vorerst nehmen wir den ERSTEN gebauten Turm des Typs.
        const targetMilestoneIndex = prevRoundState.builtTowers.findIndex((t) => t.towerId === milestoneCard.towerId);

        if (targetMilestoneIndex === -1) {
          console.warn(`Kein Turm des Typs ${milestoneCard.towerId} gebaut. Milestone ignoriert.`);
          return prevRoundState;
        }

        const updatedTowersMilestone = [...prevRoundState.builtTowers];
        const targetTowerMilestone = updatedTowersMilestone[targetMilestoneIndex];
        const isLvl5 = milestoneCard.level === 5;
        const isLvl10 = milestoneCard.level === 10;

        // 1. Level-Check
        if (targetTowerMilestone.level < milestoneCard.level) {
          console.warn(`Turm-Level ${targetTowerMilestone.level} ist zu niedrig für Milestone Lvl ${milestoneCard.level}.`);
          return prevRoundState;
        }

        // 2. Check, ob Milestone bereits gesetzt
        if ((isLvl5 && targetTowerMilestone.milestones.lvl5) || (isLvl10 && targetTowerMilestone.milestones.lvl10)) {
          console.warn(`Milestone Lvl ${milestoneCard.level} bereits für diesen Turm aktiv.`);
          return prevRoundState;
        }

        // 3. Milestone setzen
        if (isLvl5) {
          targetTowerMilestone.milestones.lvl5 = true;
        } else if (isLvl10) {
          targetTowerMilestone.milestones.lvl10 = true;
        }

        console.log(`Meilenstein Lvl ${milestoneCard.level} erfolgreich für Turm auf Slot ${targetTowerMilestone.slot} aktiviert.`);

        return {
          ...prevRoundState,
          builtTowers: updatedTowersMilestone,
        };

      default:
        return prevRoundState;
    }
  };

  const handleCardSelected = (selectedCard: Card) => {
    console.log(`Karte "${selectedCard.name}" ausgewählt!`);

    setRoundState((prevRoundState) => {
      return applyCardEffect(selectedCard, prevRoundState);
    });

    // Nachdem die Karte verarbeitet wurde, das Spiel fortsetzen
    setShowCardSelection(false);
    setIsPaused(false);
  };

  useEffect(() => {
    // Initiales Karten-Modal bei Spielstart anzeigen
    setShowCardSelection(true);
    setCardsToChoose(drawRandomCards());
    setIsPaused(true);
  }, []);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
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
      const xpNeededForNextLevel = roundLevel * 100;
      if (roundXP >= xpNeededForNextLevel && roundLevel < 20) {
        setRoundLevel((prevLevel) => prevLevel + 1);
        setRoundXP((prevXP) => prevXP - xpNeededForNextLevel);
        setShowCardSelection(true);
        setCardsToChoose(drawRandomCards());
        setIsPaused(true);
      }

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
  }, [gameTime, roundState.currentRoundLevel, isPaused]);

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
