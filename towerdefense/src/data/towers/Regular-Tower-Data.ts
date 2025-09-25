import rapidFireTowerImg from "../../assets/img/towers/rapid-fire-tower.png";
import rocketTowerImg from "../../assets/img/towers/rocket-tower.png";

export interface TowerInfo {
  id: number;
  name: string;
  img: string;
  projectile: string;
  speed: number;
  range: number;
  targetPriority: string;
  damageType: string;
  damage: number;
  aoe: number | string;
  baseCost: number;
  image: string;
}

export interface UpgradeRates {
  id: number;
  damageIncrease: number; // in Prozent, z.B. 0.05 für 5%
  rangeIncrease: number;
  speedIncrease: number;
  aoeIncrease: number;
}

export const TOWER_DATA: TowerInfo[] = [
  {
    id: 1,
    name: "Rapid Fire Tower",
    img: rapidFireTowerImg,
    projectile: "Bullets that fly quickly and directly at the target.",
    speed: 2, // shots per second
    range: 500,
    targetPriority: "Closest",
    damageType: "Physical Damage",
    damage: 10.0,
    aoe: "None",
    baseCost: 50,
    image: rapidFireTowerImg,
  },
  {
    id: 2,
    name: "Rocket Tower",
    img: rocketTowerImg,
    projectile: "Rockets that slowly fly on a homing arc towards the target.",
    speed: 0.3,
    range: 800,
    targetPriority: "Random",
    damageType: "Explosive Damage",
    damage: 300.0,
    aoe: 20,
    baseCost: 50,
    image: rocketTowerImg,
  },
  // Hier kannst du die restlichen Türme hinzufügen
];

export const UPGRADE_RATES: UpgradeRates[] = [
  {
    id: 1,
    damageIncrease: 0.05,
    rangeIncrease: 0.01,
    speedIncrease: 0.01,
    aoeIncrease: 0.0,
  },
  {
    id: 2,
    damageIncrease: 0.1,
    rangeIncrease: 0.01,
    speedIncrease: 0.05,
    aoeIncrease: 0.05,
  },
];
