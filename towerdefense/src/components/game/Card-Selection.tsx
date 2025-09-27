import React from "react";
import {Box, Paper, useTheme, Typography} from "@mui/material";
import {Card} from "../../data/cards/Card-Data";

interface CardSelectionProps {
  availableCards: Card[];
  onCardSelected: (card: Card) => void;
}

const CardSelection: React.FC<CardSelectionProps> = ({availableCards, onCardSelected}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Hintergrundabdeckung
        bgcolor: "rgba(0, 0, 0, 0.95)",
        zIndex: 10,
      }}
    >
           {" "}
      <Box
        sx={{
          display: "flex",
          gap: 4, // Etwas Abstand zwischen den Karten
          p: 4,
          bgcolor: theme.palette.grey[900],
          borderRadius: 4,
          border: `2px solid ${theme.palette.primary.dark}`,
          boxShadow: theme.shadows[24],
        }}
      >
               {" "}
        {availableCards.map((card) => (
          <Paper
            key={card.id}
            elevation={15}
            onClick={() => onCardSelected(card)} // Auswahl bei Klick auf die Karte
            sx={{
              // Feste Kartengröße für Konsistenz
              width: 200,
              height: 300,
              p: 0, // Kein Padding im Paper
              cursor: "pointer",
              bgcolor: "transparent",
              position: "relative",
              overflow: "hidden", // border: `4px solid ${theme.palette.grey[700]}`, <-- ENTFERNT
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)", // Grünes Leuchten beim Hover
                boxShadow: `0 0 15px 5px ${theme.palette.success.main}`,
              },
            }}
          >
                        {/* Mitte: Das Kartenbild füllt die gesamte Paper-Komponente aus */}
                       {" "}
            <img
              src={card.img}
              alt={card.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // Stellt sicher, dass das gesamte Bild angezeigt wird
                borderRadius: 0, // Keine abgerundeten Ecken
              }}
            />
                        {/* Optional: Ein Overlay-Text, der beim Hover den Namen anzeigt, um die Klickfläche nicht zu stören */}           {" "}
            <Typography
              variant="caption" // Kleinere Schriftart
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                bgcolor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                p: 0.5,
                opacity: 0,
                transition: "opacity 0.2s",
                "&:hover": {
                  opacity: 1, // Zeigt den Namen beim Hover an
                },
              }}
            >
                            {card.name}           {" "}
            </Typography>
                     {" "}
          </Paper>
        ))}
             {" "}
      </Box>
         {" "}
    </Box>
  );
};

export default CardSelection;
