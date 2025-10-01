// src/hooks/useCardSelection.ts
import {useState, useEffect} from "react";
import {Card, ALL_CARDS, UpgradeCard, MilestoneCard} from "../data/cards/Card-Data";
import type {BuiltTower, RoundState} from "./useRoundState";

const CANVAS_SLOTS = ["B", "D", "A", "E", "C"];

function getAvailableCards(builtTowers: BuiltTower[]): Card[] {
  const availableCards: Card[] = [];
  const occupiedSlotCount = builtTowers.length;
  const isMaxTowers = occupiedSlotCount >= CANVAS_SLOTS.length;

  for (const card of ALL_CARDS) {
    switch (card.type) {
      case "tower":
        if (!isMaxTowers) {
          availableCards.push(card);
        }
        break;

      case "upgrade": {
        const upgradeCard = card as UpgradeCard;
        if (builtTowers.some((t) => t.towerId === upgradeCard.towerId)) {
          availableCards.push(card);
        }
        break;
      }

      case "milestone": {
        const milestoneCard = card as MilestoneCard;
        const targetTower = builtTowers.find((t) => t.towerId === milestoneCard.towerId);

        if (targetTower) {
          const levelRequirementMet = targetTower.level >= milestoneCard.level;
          let isMilestoneActive = false;

          if (milestoneCard.level === 5) isMilestoneActive = targetTower.milestones.lvl5;
          if (milestoneCard.level === 10) isMilestoneActive = targetTower.milestones.lvl10;

          if (levelRequirementMet && !isMilestoneActive) {
            availableCards.push(card);
          }
        }
        break;
      }

      default:
        availableCards.push(card);
        break;
    }
  }

  return availableCards;
}

function drawRandomCards(builtTowers: BuiltTower[]): Card[] {
  const availableCards = getAvailableCards(builtTowers);
  const shuffled = [...availableCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export function useCardSelection(roundState: RoundState) {
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [cardsToChoose, setCardsToChoose] = useState<Card[]>([]);

  // beim Start einmal Karten ziehen
  useEffect(() => {
    setShowCardSelection(true);
    setCardsToChoose(drawRandomCards(roundState.builtTowers));
  }, []); // nur beim Mount

  /** Öffnet Kartenauswahl (z. B. nach Level-Up) */
  function openCardSelection() {
    setCardsToChoose(drawRandomCards(roundState.builtTowers));
    setShowCardSelection(true);
  }

  /** Schließt Kartenauswahl */
  function closeCardSelection() {
    setShowCardSelection(false);
  }

  return {
    showCardSelection,
    cardsToChoose,
    openCardSelection,
    closeCardSelection,
  };
}
