import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { OpenInput } from "../services/moduls";
import { RootState, AppDispatch } from "../store/index";
import { CircularProgress } from "@mui/material";
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
  const { days, exercises, filterExercises, loading } = useSelector(
    (state: RootState) => state.course
  );

  const [listIdx, setListIdx] = useState(20);
  const [selected, setSelected] = useState("");
  const [selectIdx, setSelectIdx] = useState("");
  const [dayIdx, setDayIdx] = useState("");
  const [search, setSearch] = useState("");

  // load course plan
  useEffect(() => {
    if (!loading) {
      dispatch(getCourses());
    }
  }, [dispatch, loading]);

  // load full exercise list, only once
  useEffect(() => {
    dispatch(getExercises());
  }, [dispatch]);

  // get filter exercises by idx and search input
  useEffect(() => {
    dispatch(getFilterExercises({ search, idx: listIdx }));
  }, [listIdx, search, exercises]);

  // wait 300ms after typing, before call
  const debouncedFetch = useCallback(
    debounce((searchQuery: string) => {
      setSearch(searchQuery);
    }, 300),
    [dispatch]
  );

  // cancel debounce when unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // open dialog (add or replace) and keep selected params
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

  // close dialog and reset params
  const handleClose = () => {
    setSelected("");
    setSelectIdx("");
    setDayIdx("");
    setSearch("");
  };

  // select exercise from dialog and add/replace it
  const onSelect = async (id: string, done: (val: string) => void) => {
    const data = {
      day_number: +dayIdx,
      exercise_uuid: id,
      insert: !selected,
      order_in_day: +selectIdx,
    };
    const result = await dispatch(updateExercise(data)).unwrap();
    if (result.error) {
      // show error locally in case of failure
      done(result.error);
    } else {
      // close dialog in case of success
      handleClose();
    }
  };

  // scroll exercises list
  const handleScroll = (ev: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = ev.target;
    // load more only if reach bottom
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      setListIdx((prevVal) => prevVal + 20);
    }
  };

  const onSearch = (val: string) => {
    debouncedFetch(val);
  };

  return (
    <div>
      <h1 className="">Course Exercises</h1>
      {days ? <DaysList days={days} onOpen={onOpen} /> : <CircularProgress />}
      {dayIdx && (
        <EditExercise
          loading={loading}
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
