import { memo } from "react";
import { ExerciseInput } from "../services/moduls";
import { Card, CardMedia } from "@mui/material";

interface ExerciseProps {
  exercise: ExerciseInput;
  isSelected: boolean;
  onClick: (id: string) => void;
}
export default memo(function ExerciseItem({
  exercise,
  isSelected,
  onClick,
}: ExerciseProps) {
  const handleClick = () => {
    onClick(exercise.uuid);
  };

  return (
    <Card
      className={`select-exercise pointer column justify-between mb-md ${
        isSelected ? "selected" : ""
      }`}
      onClick={handleClick}
    >
      <div className="w-full column">
        <CardMedia
          component="img"
          width="120"
          image={exercise.img}
          alt={exercise.title}
          className="select-img"
        />
        <p className="select-title ellipsis">{exercise.title}</p>
        {isSelected}
      </div>
    </Card>
  );
});
