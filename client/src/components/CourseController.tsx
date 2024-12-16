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

  const [listIdx, setListIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [selectIdx, setSelectIdx] = useState("");
  const [dayIdx, setDayIdx] = useState("");
  const [exerciseList, setExerciseList] = useState([]);

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getExercises());
  }, [dispatch]);

  useEffect(() => {
    if (exercises?.length === exerciseList.length) {
      return;
    }
    if (exercises) {
      let lastIdx = listIdx + 20;
      if (lastIdx > exercises.length) {
        lastIdx = exercises.length;
      }
      const sliceList = exercises.slice(listIdx, lastIdx);
      setExerciseList([...exerciseList, ...sliceList]);
    }
  }, [listIdx, exercises]);

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

  const handleScroll = (ev) => {
    const { scrollTop, scrollHeight, clientHeight } = ev.target;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      setListIdx(listIdx + 20);
    }
  };

  return (
    <div className="">
      <h1 className="">Course Exercises</h1>
      {days ? <DaysList days={days} onOpen={onOpen} /> : <p>...loading</p>}
      {dayIdx && (
        <EditExercise
          selected={selected}
          exercises={exerciseList}
          onClose={handleClose}
          onSelect={onSelect}
          onScroll={handleScroll}
        />
      )}
    </div>
  );
}

export default CourseController;
