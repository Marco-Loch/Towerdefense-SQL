import {useState} from "react";
import {Card, TowerCard, UpgradeCard, MilestoneCard} from "../data/cards/Card-Data";
import type {ProgressData} from "../types/progress";

export interface BuiltTower {
  slot: string;
  towerId: number;
  level: number;
  cooldown: number;

  cardUpgrades: {
    damageMultiplier: number;
    speedMultiplier: number;
    rangeMultiplier: number;
    aoeMultiplier: number;
    penetrationBonus: number;
    extraProjectiles: number;
  };

  milestones: {
    lvl5: boolean;
    lvl10: boolean;
  };

  upgrades: any[];
}

export interface RoundState {
  builtTowers: BuiltTower[];
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

const BUILD_PRIORITY_SLOTS = ["A", "B", "C", "D", "E"];

/** Spieler-HP wächst mit Level */
function calculatePlayerHP(baseHP: number, playerLevel: number): number {
  return playerLevel <= 1 ? baseHP : baseHP * Math.pow(1.05, playerLevel - 1);
}

/** freien Slot für neuen Tower suchen */
function findFreeSlot(towers: BuiltTower[]): string | undefined {
  const occupiedSlots = new Set(towers.map((t) => t.slot));
  return BUILD_PRIORITY_SLOTS.find((slot) => !occupiedSlots.has(slot));
}

/** Hook für RoundState-Management */
export function useRoundState(progress: ProgressData) {
  const playerLevel = Math.floor(progress.xp / 1000) + 1;
  const initialPlayerHP = calculatePlayerHP(1000, playerLevel);

  const [roundState, setRoundState] = useState<RoundState>({
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
  });

  /** Karten-Effekte anwenden */
  function applyCardEffect(card: Card, prevRoundState: RoundState): RoundState {
    switch (card.type) {
      case "tower": {
        const towerCard = card as TowerCard;
        const freeSlot = findFreeSlot(prevRoundState.builtTowers);
        if (!freeSlot) return prevRoundState;

        const newTower: BuiltTower = {
          slot: freeSlot,
          towerId: towerCard.towerId,
          level: 1,
          cooldown: 1,
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

        return {
          ...prevRoundState,
          builtTowers: [...prevRoundState.builtTowers, newTower],
        };
      }

      case "upgrade": {
        const upgradeCard = card as UpgradeCard;
        const targetIndex = prevRoundState.builtTowers.findIndex((t) => t.towerId === upgradeCard.towerId);
        if (targetIndex === -1) return prevRoundState;

        const updatedTowers = [...prevRoundState.builtTowers];
        const targetTower = updatedTowers[targetIndex];

        switch (upgradeCard.upgradeType) {
          case "damage":
            targetTower.cardUpgrades.damageMultiplier += upgradeCard.value;
            break;
          case "attackSpeed":
            targetTower.cardUpgrades.speedMultiplier += upgradeCard.value;
            break;
          case "range":
            targetTower.cardUpgrades.rangeMultiplier += upgradeCard.value;
            break;
          case "aoe":
            targetTower.cardUpgrades.aoeMultiplier += upgradeCard.value;
            break;
          case "penetration":
            targetTower.cardUpgrades.penetrationBonus += upgradeCard.value;
            break;
          case "extraProjectile":
            targetTower.cardUpgrades.extraProjectiles += 1;
            targetTower.cardUpgrades.damageMultiplier += upgradeCard.value;
            break;
        }

        return {...prevRoundState, builtTowers: updatedTowers};
      }

      case "milestone": {
        const milestoneCard = card as MilestoneCard;
        const targetIndex = prevRoundState.builtTowers.findIndex((t) => t.towerId === milestoneCard.towerId);
        if (targetIndex === -1) return prevRoundState;

        const updatedTowers = [...prevRoundState.builtTowers];
        const targetTower = updatedTowers[targetIndex];
        const isLvl5 = milestoneCard.level === 5;
        const isLvl10 = milestoneCard.level === 10;

        if (targetTower.level < milestoneCard.level) return prevRoundState;

        if ((isLvl5 && targetTower.milestones.lvl5) || (isLvl10 && targetTower.milestones.lvl10)) {
          return prevRoundState;
        }

        if (isLvl5) targetTower.milestones.lvl5 = true;
        if (isLvl10) targetTower.milestones.lvl10 = true;

        return {...prevRoundState, builtTowers: updatedTowers};
      }

      default:
        return prevRoundState;
    }
  }

  /** Wird aufgerufen, wenn Spieler eine Karte auswählt */
  function handleCardSelected(selectedCard: Card) {
    setRoundState((prevRoundState) => applyCardEffect(selectedCard, prevRoundState));
  }

  return {
    roundState,
    setRoundState,
    handleCardSelected,
  };
}
