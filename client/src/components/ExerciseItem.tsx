import { useState, memo } from "react";
import { ExerciseInput } from "../services/moduls";
import CardMedia from "@mui/material/CardMedia";
import CachedIcon from "@mui/icons-material/Cached";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

interface ExerciseProps {
  exercise: ExerciseInput;
  index: number;
  onClick: (val: { id?: string; exerciseIdx?: number }) => void;
}
export default memo(function ExerciseItem({
  exercise,
  index,
  onClick,
}: ExerciseProps) {
  const [hover, setHover] = useState(false);

  const handleUpdateClick = () => {
    onClick({ id: exercise.uuid, exerciseIdx: index });
  };

  const handleAddClick = () => {
    onClick({ exerciseIdx: index + 1 });
  };
  return (
    <div
      className="exercise-wrapper column mb-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-full row">
        <CardMedia
          component="img"
          height="150"
          image={exercise.img}
          alt={exercise.title}
          className="exercise-img"
        />
        <div className="exercise-content column justify-between">
          <p className="bold">{exercise.title}</p>
          <CachedIcon
            className="update-icon pointer"
            onClick={handleUpdateClick}
          />
        </div>
      </div>
      {hover && (
        <IconButton
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#00000085",
            },
          }}
          className="add-btn bold"
          onClick={handleAddClick}
        >
          <AddIcon />
        </IconButton>
      )}
    </div>
  );
});
