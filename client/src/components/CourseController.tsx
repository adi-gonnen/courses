import { useState, useEffect, useCallback } from "react";
import { CourseInput, DaysInput, ExerciseInput } from "../services/moduls";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import { getCourses, getExercises, updateExercise } from "../store/courseSlice";
import DaysList from "./DaysList";
import EditExercise from "./EditExerciseModal";

function CourseController() {
  const dispatch = useDispatch<AppDispatch>();
  const { days, exercises } = useSelector((state: RootState) => state.course);

  const [position, setPosition] = useState(0);
  const [listIdx, setListIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [selectIdx, setSelectIdx] = useState("");
  const [dayIdx, setDayIdx] = useState("");

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getExercises());
  }, [dispatch]);

  const onOpen = useCallback((val) => {
    const { id, exerciseIdx, dayIdx } = val;
    if (id) {
      setSelected(id);
    }
    setSelectIdx(`${exerciseIdx}`);
    setDayIdx(`${dayIdx}`);
  }, []);

  const handleClose = () => {
    setSelected(null);
    setSelectIdx("");
    setDayIdx("");
  };

  const onSelect = (id: string) => {
    const data = {
      day_number: +dayIdx,
      exercise_uuid: id,
      insert: true,
      order_in_day: +selectIdx,
    };
    dispatch(updateExercise(data));
    handleClose();
  };

  return (
    <div className="">
      <h1 className="">Course Exercises</h1>
      {days ? <DaysList days={days} onOpen={onOpen} /> : <p>...loading</p>}
      {dayIdx && (
        <EditExercise
          selected={selected}
          exercises={exercises}
          onClose={handleClose}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

export default CourseController;
