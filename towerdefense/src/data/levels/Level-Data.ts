// data/levels/Level-Data.ts

export interface SpawningConfig {
  enemyId: number;
  spawnDelay: number; // Zeit in Sekunden, bis der erste Gegner dieses Typs spawnt
  spawnInterval: number; // Zeit in Sekunden bis ein neuer Gegner spawnt
  spawnIncrease: number; // Wert zur Verringerung des spawnIntervals
}

export interface Level {
  level: number;
  maxRounds: number; // z.B. 20
  spawns: SpawningConfig[];
}

export const LEVEL_DATA: Level[] = [
  {
    level: 1,
    maxRounds: 20,
    spawns: [
      {
        enemyId: 1, // Kleiner Meteorit
        spawnDelay: 5,
        spawnInterval: 5,
        spawnIncrease: 0.1,
      },
      {
        enemyId: 2, // Großer Meteorit
        spawnDelay: 30, // Erscheint erst nach 30 Sekunden
        spawnInterval: 10,
        spawnIncrease: 0.2,
      },
    ],
  },
  {
    level: 2,
    maxRounds: 20,
    spawns: [
      {
        enemyId: 1,
        spawnDelay: 2,
        spawnInterval: 4,
        spawnIncrease: 0.1,
      },
      {
        enemyId: 2,
        spawnDelay: 15,
        spawnInterval: 8,
        spawnIncrease: 0.2,
      },
      {
        enemyId: 3, // Alien Scout
        spawnDelay: 45,
        spawnInterval: 15,
        spawnIncrease: 0.5,
      },
    ],
  },
];
