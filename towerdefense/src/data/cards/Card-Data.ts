import {RegularTowerData} from "../towers/Tower-Data";

export enum CardType {
  TowerCard = "TowerCard",
  UpgradeCard = "UpgradeCard",
  MilestoneCard = "MilestoneCard",
}

export enum TargetTower {
  RapidFire = "RapidFire",
  Rocket = "Rocket",
}

export interface Card {
  id: string;
  type: CardType;
  name: string;
  description: string;
  image: string;
}

export interface TowerCard extends Card {
  type: CardType.TowerCard;
  towerId: number;
}

export interface UpgradeCard extends Card {
  type: CardType.UpgradeCard;
  target: TargetTower;
  stat: "damage" | "speed" | "range" | "penetration" | "aoe";
  value: number;
  isPercentage: boolean;
}

export interface MilestoneCard extends Card {
  type: CardType.MilestoneCard;
  target: TargetTower;
  level: number;
  effect: "extraProjectile" | "explosion" | "fragments" | "extraFragments";
}
