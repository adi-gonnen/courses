import { useState, useEffect, useCallback } from "react";
import { CourseInput, DaysInput, ExerciseInput } from "../services/moduls";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import {
  getCourses,
  getExercises,
  updateExercise,
  getFilterExercises,
} from "../store/courseSlice";
import DaysList from "./DaysList";
import EditExercise from "./EditExerciseModal";
import { debounce } from "lodash";

function CourseController() {
  const dispatch = useDispatch<AppDispatch>();
  const { days, exercises, filterExercises } = useSelector(
    (state: RootState) => state.course
  );

  const [listIdx, setListIdx] = useState(20);
  const [selected, setSelected] = useState(null);
  const [selectIdx, setSelectIdx] = useState("");
  const [dayIdx, setDayIdx] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getExercises());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFilterExercises({ search, idx: listIdx }));
  }, [listIdx, search, exercises]);

  const debouncedFetch = useCallback(
    debounce((searchQuery: string) => {
      setSearch(searchQuery);
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

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

  const onSearch = (val: string) => {
    debouncedFetch(val);
  };

  return (
    <div className="">
      <h1 className="">Course Exercises</h1>
      {days ? <DaysList days={days} onOpen={onOpen} /> : <p>...loading</p>}
      {dayIdx && (
        <EditExercise
          selected={selected}
          exercises={filterExercises}
          onClose={handleClose}
          onSelect={onSelect}
          onScroll={handleScroll}
          onSearch={onSearch}
        />
      )}
    </div>
  );
}

export default CourseController;
