import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const dialogStyles = {
  backgroundColor: "black",
  color: "white",
  textAlign: "center" as const,
};

const buttonStyles = {
  border: "2px solid white",
  color: "white",
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  margin: "10px 0",
  textTransform: "none" as const,
  transition: "background-color 0.3s",
};

const easyButtonStyles = {
  ...buttonStyles,
  "&:hover": {
    backgroundColor: "lightgreen",
    color: "black",
  },
};

const mediumButtonStyles = {
  ...buttonStyles,
  "&:hover": {
    backgroundColor: "yellow",
    color: "black",
  },
};

const hardButtonStyles = {
  ...buttonStyles,
  "&:hover": {
    backgroundColor: "red",
    color: "white",
  },
};

const DifficultyDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (value: number) => void;
}> = ({ open, onClose, onSelect }) => {
  const handleSelect = (level: number) => {
    onSelect(level);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: dialogStyles }}>
      <DialogTitle>
        <Typography variant="h6" style={{ color: "white" }}>
          Choose Your Difficulty Level
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Button onClick={() => handleSelect(1)} sx={easyButtonStyles}>
            Easy
          </Button>

          <Button onClick={() => handleSelect(2)} sx={mediumButtonStyles}>
            Medium
          </Button>

          <Button onClick={() => handleSelect(3)} sx={hardButtonStyles}>
            Hard
          </Button>
        </Box>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: "white" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DifficultyDialog;
