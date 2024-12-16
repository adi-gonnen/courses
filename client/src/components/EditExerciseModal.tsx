import { useState } from "react";
import { ExerciseInput } from "../services/moduls";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import SelectExercise from "./SelectExercise";

interface ModalProps {
  selected: string;
  exercises: ExerciseInput[] | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function EditExercise({
  exercises,
  selected,
  onClose,
  onSelect,
}: ModalProps) {
  const [id, setId] = useState("");
  return (
    <div>
      <Dialog open={true} onClose={onClose} className="select-dialog">
        <div className="dialog-title row justify-between mb-sm">
          <p>Exercise List</p>
          <button onClick={onClose}>X</button>
        </div>
        <DialogContent className="exercise-container">
          <div className="exercise-body  row wrap">
            {exercises?.length &&
              exercises.map((exercise) => (
                <SelectExercise
                  key={exercise.uuid}
                  exercise={exercise}
                  isSelected={id === exercise.uuid}
                  onClick={(id) => setId(id)}
                />
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!id}
            variant="contained"
            onClick={() => onSelect(id)}
          >
            {selected ? "Replace" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
