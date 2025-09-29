import React, {useRef, useEffect} from "react";
import {Enemy} from "../../utils/Enemy";

interface TowerInfo {
  id: number;
  name: string;
  img: string;
}

interface BuiltTower {
  slot: string;
  towerId: number;
  level: number;
  // ... andere BuiltTower Felder
}

interface GameCanvasProps {
  playerHP: number;
  towerSlots: string[];
  activeEnemies: Enemy[];
  builtTowers: BuiltTower[];
  towerDataMap: Record<number, TowerInfo>;
}

const TOWER_WIDTH = 60;
const TOWER_HEIGHT = 80;
const GROUND_HEIGHT = 150;
const HEALTH_BAR_HEIGHT = 20;

function GameCanvas({playerHP, towerSlots, activeEnemies, builtTowers = [], towerDataMap}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const assetImagesRef = useRef<Record<string, HTMLImageElement>>({});

  const towerXMap = useRef<Record<string, number>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasDimensions = () => {
      if (canvas.parentElement) {
        const dpr = window.devicePixelRatio || 1;

        const displayWidth = canvas.parentElement.clientWidth;
        const displayHeight = canvas.parentElement.clientHeight;

        // interne Zeichenfläche in physikalischen Pixeln
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        // CSS-Größe in logischen Pixeln
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        // Skalierung zurück auf "logische" Einheiten
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        // Aktualisiere das X-Position-Mapping bei Größenänderung
        const towerSpacing = displayWidth / (towerSlots.length + 1);
        towerSlots.forEach((slot, index) => {
          towerXMap.current[slot] = (index + 1) * towerSpacing;
        });
      }
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const loadImages = (towers: BuiltTower[], dataMap: Record<number, TowerInfo>) => {
      if (!activeEnemies) return;

      // 1. Lade Gegnerbilder
      activeEnemies.forEach((enemy) => {
        const imgPath = enemy.enemyInfo.img;
        if (!assetImagesRef.current[imgPath]) {
          const img = new Image();
          img.src = imgPath;
          img.onload = () => {
            assetImagesRef.current[imgPath] = img;
          };
        }
      });

      // 2. Lade Turmbilder
      if (towers) {
        towers.forEach((tower) => {
          const info = dataMap[tower.towerId];
          const imgPath = info?.img;

          if (imgPath && !assetImagesRef.current[imgPath]) {
            const img = new Image();
            img.src = imgPath;
            img.onload = () => {
              assetImagesRef.current[imgPath] = img;
            };
          }
        });
      }
    };

    loadImages(builtTowers, towerDataMap);

    const gameLoop = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Himmel + Boden
      ctx.fillStyle = "#ADD8E6";
      ctx.fillRect(0, 0, displayWidth, displayHeight - GROUND_HEIGHT);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, displayHeight - GROUND_HEIGHT, displayWidth, GROUND_HEIGHT);

      // Lebensbalken
      const hpBarWidth = displayWidth * 0.4;
      const hpBarX = (displayWidth - hpBarWidth) / 2;
      const hpBarY = displayHeight - GROUND_HEIGHT + GROUND_HEIGHT / 2 - HEALTH_BAR_HEIGHT / 2;
      ctx.fillStyle = "lightgreen";
      ctx.fillRect(hpBarX, hpBarY, hpBarWidth, HEALTH_BAR_HEIGHT);

      // Türme
      const towerY = displayHeight - GROUND_HEIGHT - TOWER_HEIGHT + 10;

      towerSlots.forEach((slot) => {
        // KORREKTUR: Nutze die X-Position aus dem XMap, die in setCanvasDimensions berechnet wird
        const towerX = towerXMap.current[slot];
        if (!towerX) return;

        const builtTower = builtTowers.find((t) => t.slot === slot);

        if (builtTower) {
          // TURM IST GEBAUT: Bild und Level zeichnen
          const info = towerDataMap[builtTower.towerId];
          const img = info ? assetImagesRef.current[info.img] : null;

          if (img && img.complete && img.naturalWidth !== 0) {
            ctx.drawImage(
              img,
              towerX - TOWER_WIDTH / 2, // X-Mitte minus halbe Breite
              towerY,
              TOWER_WIDTH,
              TOWER_HEIGHT
            );

            // Turm-Level
            ctx.fillStyle = "yellow";
            ctx.textAlign = "center";
            ctx.font = "bold 14px Arial";
            ctx.fillText(`Lv${builtTower.level}`, towerX, towerY - 5);
          }
        } else {
          // SLOT IST LEER: Platzhalter und Slot-Namen zeichnen

          // Platzhalterkreis
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.beginPath();
          // Der Kreis ist zentriert um towerX, towerY + TOWER_HEIGHT / 2 und hat den Radius TOWER_WIDTH / 2
          ctx.arc(towerX, towerY + TOWER_HEIGHT / 2, TOWER_WIDTH / 2, 0, 2 * Math.PI);
          ctx.fill();

          // Gestrichelter Rand
          ctx.strokeStyle = "grey";
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);

          // Slot-Namen
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "16px Arial";
          ctx.fillText(slot, towerX, towerY + TOWER_HEIGHT / 2);
        }
      });

      // Gegner
      activeEnemies.forEach((enemy) => {
        const img = assetImagesRef.current[enemy.enemyInfo.img];
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.drawImage(img, enemy.x, enemy.y, 50, 50);

          const maxHP = enemy.enemyInfo.health;
          const currentHP = enemy.health;

          const healthRatio = maxHP > 0 ? currentHP / maxHP : 0;

          const barWidth = 40;
          const barHeight = 4;
          const barX = enemy.x + 5;
          const barY = enemy.y - barHeight - 2;

          ctx.fillStyle = "red";
          ctx.fillRect(barX, barY, barWidth, barHeight);

          ctx.fillStyle = "lime";
          ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);
        }
      });

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, [towerSlots, activeEnemies, builtTowers, towerDataMap]);

  return <canvas ref={canvasRef} style={{display: "block", borderRadius: 10}} />;
}

export default GameCanvas;
