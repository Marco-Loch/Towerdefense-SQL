import React, {useRef, useEffect} from "react";

// Wir definieren die Props, die die Komponente von ihrem Elternteil erhalten wird
interface GameCanvasProps {
  playerHP: number;
  towerSlots: string[];
}

const TOWER_HEIGHT = 60;
const GROUND_HEIGHT = 150;
const HEALTH_BAR_HEIGHT = 20;

function GameCanvas({playerHP, towerSlots}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasDimensions = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Zeichne den Himmel und den Boden
      ctx.fillStyle = "#ADD8E6";
      ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

      // Zeichne die Lebensanzeige
      const hpBarWidth = canvas.width * 0.4;
      const hpBarX = (canvas.width - hpBarWidth) / 2;
      const hpBarY = canvas.height - GROUND_HEIGHT + GROUND_HEIGHT / 2 - HEALTH_BAR_HEIGHT / 2;
      ctx.fillStyle = "lightgreen";
      ctx.fillRect(hpBarX, hpBarY, hpBarWidth, HEALTH_BAR_HEIGHT);

      // Zeichne die Türme
      const towerSpacing = canvas.width / (towerSlots.length + 1);
      towerSlots.forEach((slot, index) => {
        const towerX = (index + 1) * towerSpacing;
        const towerY = canvas.height - GROUND_HEIGHT - TOWER_HEIGHT / 2;

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

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => window.removeEventListener("resize", setCanvasDimensions);
  }, [towerSlots]); // Abhängigkeit von towerSlots, damit die Türme sich bei Änderungen aktualisieren

  return <canvas ref={canvasRef} style={{width: "100%", height: "100%", display: "block", borderRadius: 10}} />;
}

export default GameCanvas;
