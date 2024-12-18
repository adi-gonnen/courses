import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { OpenInput } from "../services/moduls";
import { RootState, AppDispatch } from "../store/index";
import {
  setError,
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
  const { days, exercises, filterExercises, error } = useSelector(
    (state: RootState) => state.course
  );

  const [listIdx, setListIdx] = useState(20);
  const [selected, setSelected] = useState("");
  const [selectIdx, setSelectIdx] = useState("");
  const [dayIdx, setDayIdx] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // load course plan
    dispatch(getCourses());
  }, [dispatch]);

  useEffect(() => {
    // load full exercise list
    dispatch(getExercises());
  }, [dispatch]);

  useEffect(() => {
    // get exercise by idx and search input
    dispatch(getFilterExercises({ search, idx: listIdx }));
  }, [listIdx, search, exercises]);

  const debouncedFetch = useCallback(
    // wait 300ms after typing, before call
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

  const onOpen = useCallback((val: OpenInput) => {
    const { id, exerciseIdx, dayIdx } = val;
    if (id) {
      // replace case
      setSelected(id);
    }
    // keep dayIdx and exercise idx for both cases
    setSelectIdx(`${exerciseIdx}`);
    setDayIdx(`${dayIdx}`);
  }, []);

  const handleClose = () => {
    setSelected("");
    setSelectIdx("");
    setDayIdx("");
    dispatch(setError(null));
    setSearch("");
    // setListIdx(20);
  };

  const onSelect = (id: string) => {
    const data = {
      day_number: +dayIdx,
      exercise_uuid: id,
      insert: true,
      order_in_day: +selectIdx,
    };
    dispatch(updateExercise(data));
    // handleClose();
  };

  const handleScroll = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = ev.target;
    // load more only if reach bottom
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      setListIdx(listIdx + 20);
    }
  };

  const onSearch = (val: string) => {
    debouncedFetch(val);
    dispatch(setError(null));
  };

  return (
    <div className="">
      <h1 className="">Course Exercises</h1>
      {days ? <DaysList days={days} onOpen={onOpen} /> : <p>...loading</p>}
      {dayIdx && (
        <EditExercise
          selected={selected}
          exercises={filterExercises}
          error={error}
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
