import { useState } from "react";
import { ExerciseInput } from "../services/moduls";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SelectExercise from "./SelectExercise";

interface ModalProps {
  selected: string;
  exercises: ExerciseInput[] | null;
  onClose: () => void;
  onSelect: (id: string) => void;
  onScroll: (ev: React.ChangeEvent) => void;
  onSearch: (val: string) => void;
}

export default function EditExercise({
  exercises,
  selected,
  onClose,
  onSelect,
  onScroll,
  onSearch,
}: ModalProps) {
  const [id, setId] = useState("");

  return (
    <div>
      <Dialog open={true} onClose={onClose} className="select-dialog">
        <div className="dialog-title row justify-between mb-sm">
          <p>Exercise List</p>
          <Button onClick={onClose}>X</Button>
        </div>
        <DialogContent className="exercise-container">
          <TextField
            label="search"
            variant="outlined"
            className="search-input"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onSearch(event.target.value);
            }}
          />
          <div className="exercise-body row wrap" onScroll={onScroll}>
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
