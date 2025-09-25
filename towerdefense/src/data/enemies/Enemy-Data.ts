import smallMeteoriteImg from "../../assets/img/enemies/small-meteorite.png";
import bigMeteoriteImg from "../../assets/img/enemies/big-meteorite.png";
import alienScoutImg from "../../assets/img/enemies/alien-scout.png";

export interface EnemyInfo {
  id: number;
  name: string;
  img: string;
  health: number;
  damage: number;
  movementSpeed: number;
  rateOfFire: number;
  range: number;
  goldReward: number;
  xpReward: number;
  attackType: "Melee" | "Ranged";
  killcount: number;
  damageResistance: {
    physical: number;
    explosive: number;
    electric: number;
    energy: number;
    fire: number;
    acid: number;
  };
  damageDealt: number;
}

export const ENEMY_DATA: EnemyInfo[] = [
  {
    id: 1,
    name: "Small Meteorite",
    img: smallMeteoriteImg,
    health: 1000,
    damage: 10,
    movementSpeed: 20,
    rateOfFire: 0,
    range: 0,
    goldReward: 0.1,
    xpReward: 10,
    attackType: "Melee",
    killcount: 0,
    damageResistance: {
      physical: 0.1,
      explosive: 0,
      electric: 0,
      energy: 0,
      fire: 0,
      acid: -0.1,
    },
    damageDealt: 0,
  },
  {
    id: 2,
    name: "Big Meteorite",
    img: bigMeteoriteImg,
    health: 2500,
    damage: 25,
    movementSpeed: 15,
    rateOfFire: 0,
    range: 0,
    goldReward: 0.3,
    xpReward: 25,
    attackType: "Melee",
    killcount: 0,
    damageResistance: {
      physical: 0.2,
      explosive: 0,
      electric: 0,
      energy: 0,
      fire: -0.1,
      acid: 0,
    },
    damageDealt: 0,
  },
  {
    id: 3,
    name: "Alien Scout",
    img: alienScoutImg,
    health: 5000,
    damage: 5,
    movementSpeed: 40,
    rateOfFire: 1,
    range: 50,
    goldReward: 20,
    xpReward: 50,
    attackType: "Ranged",
    killcount: 0,
    damageResistance: {
      physical: -0.1,
      explosive: 0.15,
      electric: 0,
      energy: 0,
      fire: 0,
      acid: 0,
    },
    damageDealt: 0,
  },
];
