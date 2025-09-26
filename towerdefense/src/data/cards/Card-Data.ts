// src/data/cards/Card-Data.ts
import {RegularTowerData} from "../towerdata/Regular-Tower-Data";

// Base interface for all cards
export interface BaseCard {
  id: number;
  name: string;
  img: string;
}

// Interface for a Tower Card
export interface TowerCard extends BaseCard {
  type: "tower";
  towerId: number;
}

// Interface for an Upgrade Card
export interface UpgradeCard extends BaseCard {
  type: "upgrade";
  upgradeType: "damage" | "attackSpeed" | "range" | "penetration" | "aoe" | "extraProjectile";
  towerId: number;
  value: number;
}

export interface MilestoneCard extends BaseCard {
  type: "milestone";
  towerId: number;
  level: 5 | 10;
  effectDescription: string;
}

export type Card = TowerCard | UpgradeCard | MilestoneCard;

// --- Card Data  ---

export const TOWER_CARDS: TowerCard[] = [
  {id: 1, name: "Rapid Fire Tower", img: "/img/cards/rft_card.png", type: "tower", towerId: 1},
  {id: 2, name: "Rocket Tower", img: "/img/cards/rt_card.png", type: "tower", towerId: 2},
];

export const UPGRADE_CARDS: UpgradeCard[] = [
  // RFT Upgrades
  {id: 3, name: "RFT Damage", img: "/img/cards/rft_dmg.png", type: "upgrade", upgradeType: "damage", towerId: 1, value: 0.3},
  {id: 4, name: "RFT Attack Speed", img: "/img/cards/rft_as.png", type: "upgrade", upgradeType: "attackSpeed", towerId: 1, value: 0.15},
  {id: 5, name: "RFT Range", img: "/img/cards/rft_range.png", type: "upgrade", upgradeType: "range", towerId: 1, value: 0.1},
  {id: 6, name: "RFT Penetration", img: "/img/cards/rft_penetration.png", type: "upgrade", upgradeType: "penetration", towerId: 1, value: 1},

  // RT Upgrades
  {id: 7, name: "RT Damage", img: "/img/cards/rt_dmg.png", type: "upgrade", upgradeType: "damage", towerId: 2, value: 0.2},
  {id: 8, name: "RT Attack Speed", img: "/img/cards/rt_as.png", type: "upgrade", upgradeType: "attackSpeed", towerId: 2, value: 0.2},
  {id: 9, name: "RT Range", img: "/img/cards/rt_range.png", type: "upgrade", upgradeType: "range", towerId: 2, value: 0.05},
  {id: 10, name: "RT AoE", img: "/img/cards/rt_aoe.png", type: "upgrade", upgradeType: "aoe", towerId: 2, value: 0.1},
  {id: 11, name: "RT Extra Rocket", img: "/img/cards/rt_extra_rocket.png", type: "upgrade", upgradeType: "extraProjectile", towerId: 2, value: -0.15},
];

export const MILESTONE_CARDS: MilestoneCard[] = [
  // RFT Milestones
  {
    id: 12,
    name: "RFT Turret (Lvl 5)",
    img: "/img/cards/rft_turret.png",
    type: "milestone",
    towerId: 1,
    level: 5,
    effectDescription: "Feuert ein weiteres Projektil ab.",
  },
  {
    id: 13,
    name: "RFT Explosion (Lvl 10)",
    img: "/img/cards/rft_explosion.png",
    type: "milestone",
    towerId: 1,
    level: 10,
    effectDescription: "Jeder Treffer verursacht eine kleine Explosion.",
  },

  // RT Milestones
  {
    id: 14,
    name: "RT Fragments (Lvl 5)",
    img: "/img/cards/rt_fragments.png",
    type: "milestone",
    towerId: 2,
    level: 5,
    effectDescription: "Schießt Fragmente im Kreis ab.",
  },
  {
    id: 15,
    name: "RT Enhanced Fragments (Lvl 10)",
    img: "/img/cards/rt_enhanced_fragments.png",
    type: "milestone",
    towerId: 2,
    level: 10,
    effectDescription: "Erhöht Fragmente auf 12 und fügt Penetration hinzu.",
  },
];

export const ALL_CARDS: Card[] = [...TOWER_CARDS, ...UPGRADE_CARDS, ...MILESTONE_CARDS];
