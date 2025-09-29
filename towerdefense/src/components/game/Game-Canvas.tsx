import React, {useRef, useEffect} from "react";
import {Enemy} from "../../utils/Enemy";

interface GameCanvasProps {
  playerHP: number;
  towerSlots: string[];
  activeEnemies: Enemy[];
}

const TOWER_HEIGHT = 60;
const GROUND_HEIGHT = 150;
const HEALTH_BAR_HEIGHT = 20;

function GameCanvas({playerHP, towerSlots, activeEnemies}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enemyImagesRef = useRef<Record<string, HTMLImageElement>>({});

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
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Transform
        ctx.scale(dpr, dpr);
      }
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const loadImages = () => {
      activeEnemies.forEach((enemy) => {
        if (!enemyImagesRef.current[enemy.enemyInfo.img]) {
          const img = new Image();
          img.src = enemy.enemyInfo.img;
          img.onload = () => {
            enemyImagesRef.current[enemy.enemyInfo.img] = img;
          };
        }
      });
    };

    loadImages();

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
      const towerSpacing = displayWidth / (towerSlots.length + 1);
      towerSlots.forEach((slot, index) => {
        const towerX = (index + 1) * towerSpacing;
        const towerY = displayHeight - GROUND_HEIGHT - TOWER_HEIGHT / 2;

        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(towerX, towerY + TOWER_HEIGHT / 2, TOWER_HEIGHT / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = "grey";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px Arial";
        ctx.fillText(slot, towerX, towerY + TOWER_HEIGHT / 2);
      });

      // Gegner
      activeEnemies.forEach((enemy) => {
        const img = enemyImagesRef.current[enemy.enemyInfo.img];
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.drawImage(img, enemy.x, enemy.y, 50, 50);
        }
      });

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, [towerSlots, activeEnemies]);

  return <canvas ref={canvasRef} style={{display: "block", borderRadius: 10}} />;
}

export default GameCanvas;
