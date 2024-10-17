// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   Slider,
// } from "@mui/material";

// // Define a custom theme for the black and white design
// const dialogStyles = {
//   backgroundColor: "black",
//   color: "white",
// };

// const buttonStyles = {
//   borderColor: "white",
//   color: "white",
// };

// const sliderStyles = {
//   "& .MuiSlider-track": {
//     backgroundColor: "white",
//   },
//   "& .MuiSlider-thumb": {
//     backgroundColor: "white",
//     border: "2px solid black",
//   },
//   "& .MuiSlider-rail": {
//     backgroundColor: "gray",
//   },
// };

// const marks = [
//   {
//     value: 1,
//     label: "Easy",
//   },
//   {
//     value: 2,
//     label: "Medium",
//   },
//   {
//     value: 3,
//     label: "Hard",
//   },
// ];

// const DifficultyDialog: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   onSelect: (value: number) => void;
// }> = ({ open, onClose, onSelect }) => {
//   const [difficulty, setDifficulty] = useState<number>(2); // Default to medium

//   const handleSliderChange = (event: Event, newValue: number | number[]) => {
//     setDifficulty(newValue as number);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} PaperProps={{ style: dialogStyles }}>
//       <DialogTitle>
//         <Typography variant="h6" style={{ color: "white" }}>
//           Choose Question Difficulty
//         </Typography>
//       </DialogTitle>
//       <DialogContent>
//         <Box>
//           <Slider
//             value={difficulty}
//             onChange={handleSliderChange}
//             marks={marks}
//             step={1}
//             min={1}
//             max={3}
//             style={{ width: 300, marginTop: 50 }}
//             sx={sliderStyles}
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions style={{ justifyContent: "flex-end" }}>
//         <Button onClick={onClose} variant="outlined" sx={buttonStyles}>
//           Cancel
//         </Button>
//         <Button
//           onClick={() => onSelect(difficulty)}
//           variant="contained"
//           style={{ backgroundColor: "white", color: "black" }}
//         >
//           Select
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DifficultyDialog;
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

// Define custom styles for the dialog and buttons
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
    onSelect(level); // Automatically communicate the difficulty
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
          {/* Easy Difficulty Button */}
          <Button onClick={() => handleSelect(1)} sx={easyButtonStyles}>
            Easy
          </Button>

          {/* Medium Difficulty Button */}
          <Button onClick={() => handleSelect(2)} sx={mediumButtonStyles}>
            Medium
          </Button>

          {/* Hard Difficulty Button */}
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
