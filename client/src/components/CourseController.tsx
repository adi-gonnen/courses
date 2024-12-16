import { useState, useEffect, useCallback } from "react";
import { loadDays, loadExercises, updateCourse } from "../services/DataService";
import { CourseInput, DaysInput, ExerciseInput } from "../services/moduls";
import DaysList from "./DaysList";
import EditExercise from "./EditExerciseModal";

function CourseController() {
  const [position, setPosition] = useState(0);
  const [listIdx, setListIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [selectIdx, setSelectIdx] = useState("");
  const [dayIdx, setDayIdx] = useState("");
  const [exercises, setExercises] = useState(null);
  const [days, setDays] = useState<DaysInput | null>(null);

  useEffect(() => {
    fetchDays();
  }, []);

  useEffect(() => {
    fetchExercises();
  });

  const fetchDays = async () => {
    try {
      const response: CourseInput = await loadDays();
      if (response) {
        const daysArray = Object.values(response.days).map((day) => {
          return mapExercises(day);
        });
        setDays(daysArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response: ExerciseInput[] = await loadExercises();
      const mapRes = mapExercises([...response]);
      setExercises(mapRes);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const onOpen = useCallback((val) => {
    const { id, exerciseIdx, dayIdx } = val;
    console.log("exerciseIdx", exerciseIdx, "dayI|Dx: ", dayIdx);
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
    console.log("data", data);
    updateCourse(data);
    handleClose();
  };

  const mapExercises = (exercises: ExerciseInput[]) => {
    return exercises?.map((exercise: ExerciseInput) => {
      const url = exercise.video_url.split(".");
      url.splice(url.length - 1, 1, "jpg");
      return { ...exercise, img: url.join(".") };
    });
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
