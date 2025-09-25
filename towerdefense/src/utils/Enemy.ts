import {EnemyInfo} from "../data/enemies/Enemy-Data";

export class Enemy {
  public id: number;
  public enemyInfo: EnemyInfo;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public status: "flying" | "attacking" | "destroyed";
  public health: number;

  constructor(enemyInfo: EnemyInfo, startX: number, canvasWidth: number, canvasHeight: number) {
    this.id = Math.random();
    this.enemyInfo = enemyInfo;
    this.x = startX;
    this.y = -50;
    this.health = enemyInfo.health;
    this.status = "flying";

    if (this.enemyInfo.attackType === "Melee") {
      const angle = -90 + (Math.random() * 4 - 2);
      const speed = this.enemyInfo.movementSpeed;
      this.vx = speed * Math.cos((angle * Math.PI) / 180);
      this.vy = speed * Math.sin((angle * Math.PI) / 180);
    } else {
      const angle = -150 + (Math.random() * 20 - 10);
      const speed = this.enemyInfo.movementSpeed;
      this.vx = speed * Math.cos((angle * Math.PI) / 180);
      this.vy = speed * Math.sin((angle * Math.PI) / 180);
    }
  }

  // Die Methode akzeptiert nun ein drittes Argument: deltaTime
  update(canvasWidth: number, canvasHeight: number, deltaTime: number) {
    if (this.status === "flying") {
      // Position basierend auf deltaTime aktualisieren
      this.x += this.vx * deltaTime;
      this.y -= this.vy * deltaTime;

      // Reflexion am Rand für Alien Scout
      if (this.enemyInfo.attackType === "Ranged") {
        if (this.x < 0 || this.x > canvasWidth) {
          this.vx *= -1;
        }
        if (this.y < 0) {
          this.vy *= -1;
        }
      }

      // Prüfen, ob der Boden erreicht ist
      const groundLevel = canvasHeight;
      if (this.y >= groundLevel) {
        this.status = "destroyed";
      }
    }
  }
}
