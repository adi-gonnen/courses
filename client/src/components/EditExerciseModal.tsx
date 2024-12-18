import { useState, forwardRef } from "react";
import { ExerciseInput, Status } from "../services/moduls";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import SelectExercise from "./SelectExercise";

interface ModalProps {
  selected: string;
  error: string | null;
  exercises: ExerciseInput[] | null;
  onClose: () => void;
  onSelect: (id: string) => void;
  onScroll: (ev: React.ChangeEvent) => void;
  onSearch: (val: string) => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function EditExercise({
  exercises,
  selected,
  error,
  onClose,
  onSelect,
  onScroll,
  onSearch,
}: ModalProps) {
  const [id, setId] = useState("");

  return (
    <div className="slide-in">
      <Dialog
        open={true}
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted
        className="select-dialog"
      >
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
        <DialogActions className="row justify-between">
          {error === Status.UPDATE ? (
            <p className="error-text">Error! Data was not saved</p>
          ) : (
            <div />
          )}
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
