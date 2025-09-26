import React from "react";
import {Box, Paper, Typography, Button} from "@mui/material";
import {Card} from "../../data/cards/Card-Data";

interface CardSelectionProps {
  availableCards: Card[];
  onCardSelected: (card: Card) => void;
}

const CardSelection: React.FC<CardSelectionProps> = ({availableCards, onCardSelected}) => {
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
        alignItems: "center",
        bgcolor: "rgba(0, 0, 0, 0.7)",
        zIndex: 10,
      }}
    >
      <Box sx={{display: "flex", gap: 4, p: 4, bgcolor: "rgba(50, 50, 50, 0.9)", borderRadius: 4}}>
        {availableCards.map((card) => (
          <Paper key={card.id} elevation={10} sx={{width: 200, p: 2, textAlign: "center", cursor: "pointer"}}>
            <img src={card.img} alt={card.name} style={{width: "100%", height: 150, objectFit: "contain", borderRadius: 8}} />
            <Typography variant="h6" sx={{mt: 1, color: "white"}}>
              {card.name}
            </Typography>
            <Typography variant="body2" sx={{color: "grey.400"}}>
              {card.type === "tower" ? "New Tower" : card.type === "upgrade" ? "Tower Upgrade" : "Milestone"}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => onCardSelected(card)} sx={{mt: 2}}>
              Wählen
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default CardSelection;
