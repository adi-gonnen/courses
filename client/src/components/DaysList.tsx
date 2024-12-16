import { memo } from "react";
import { DayInput } from "../services/moduls";
import DayContent from "./DayContent";

interface DaysProps {
  days: DayInput[];
  onOpen: (val: { id?: string; exerciseIdx?: number; dayIdx: number }) => void;
}

export default memo(function DaysLiost({ days, onOpen }: DaysProps) {
  return (
    <div className="days-container row">
      {days.map((day: DayInput, idx: number) => (
        <DayContent key={idx} day={day} idx={idx} onOpen={onOpen} />
      ))}
    </div>
  );
});
