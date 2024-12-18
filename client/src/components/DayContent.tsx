import { useCallback, memo } from "react";
import { ExerciseInput } from "../services/moduls";
import ExerciseItem from "./ExerciseItem";

interface DayProps {
  day: ExerciseInput[];
  idx: number;
  onOpen: (val: { id?: string; exerciseIdx?: number; dayIdx: number }) => void;
}

export default memo(function DayContent({ day, idx, onOpen }: DayProps) {
  const onClick = useCallback((val: { id?: string; exerciseIdx?: number }) => {
    onOpen({ ...val, dayIdx: idx });
  }, []);
  return (
    <div className="day-wrapper">
      <p className="mb-xs bold">{`Day ${idx + 1}`}</p>
      {day.map((exercise: ExerciseInput, index: number) => (
        <ExerciseItem
          key={exercise.uuid}
          exercise={exercise}
          index={index}
          onClick={onClick}
        />
      ))}
    </div>
  );
});
