import { useState, useCallback, forwardRef } from "react";
import { ExerciseInput } from "../services/moduls";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  Slide,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { TransitionProps } from "@mui/material/transitions";
import SelectExercise from "./SelectExercise";

interface ModalProps {
  selected: string;
  loading: boolean;
  exercises: ExerciseInput[] | null;
  onClose: () => void;
  onSelect: (id: string, done: (err: string) => void) => void;
  onScroll: (ev: React.UIEvent<HTMLElement>) => void;
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
  loading,
  onClose,
  onSelect,
  onScroll,
  onSearch,
}: ModalProps) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const handleSelect = useCallback(() => {
    const done = (error: string) => {
      setError(error);
    };
    onSelect(id, done);
  }, [id]);

  const onClick = (id: string) => {
    setId(id);
    setError("");
  };
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
          <div
            className="exercise-body row wrap"
            onScroll={(ev: React.UIEvent<HTMLElement>) => onScroll(ev)}
          >
            {exercises?.length &&
              exercises.map((exercise) => (
                <SelectExercise
                  key={exercise.uuid}
                  exercise={exercise}
                  isSelected={id === exercise.uuid}
                  onClick={onClick}
                />
              ))}
          </div>
        </DialogContent>
        <DialogActions className="row justify-between">
          <p className="error-text">{error}</p>
          <LoadingButton
            loading={loading}
            disabled={!id}
            variant="contained"
            onClick={handleSelect}
          >
            {selected ? "Replace" : "Add"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
