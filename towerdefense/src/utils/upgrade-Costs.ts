export default function calculateUpgradeCost(baseCost: number, currentLevel: number): number {
  const increaseFactor = 1.1; // Beispiel: 10 % Preiserhöhung pro Level
  return baseCost * Math.pow(increaseFactor, currentLevel);
}
