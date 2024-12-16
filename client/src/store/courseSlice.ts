import { fetchDays, fetchExercises,  updateCourse, mapExercises } from '../services/DataService'
import { CourseInput, ExerciseInput, UpdateExerciseInput} from "../services/moduls";
import {RootState} from './index'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface CourseState {
  courseId: string;
  days: CourseInput[] | null;
  exercises: ExerciseInput[] | null;
}

const initialState: CourseState = {
    courseId: '',
    days: null,
    exercises: null,
};

export const getCourses = createAsyncThunk('course/fetchDays', async () => {
    const response = await fetchDays();
    return response;
  }
);
export const getExercises = createAsyncThunk('course/fetchExercises', async () => {
    const response = await fetchExercises();
    return response;
  }
);

export const updateExercise = createAsyncThunk('course/updateCourse', async (data: UpdateExerciseInput, { getState }) => {
    const state = getState() as RootState;
    const courseId = state.course.courseId;
    const response = await updateCourse(courseId, data);
    return response;
  }
)

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.fulfilled, (state, action) => {
        const result = action.payload;
        state.courseId = result.uuid;
        const dataArray = Object.values(result.days).map((day) => {
            return mapExercises(day);
          });
       state.days = [...dataArray]
      }) 
      .addCase(getExercises.fulfilled, (state, action) => {
        const result = action.payload;
        state.courseId = result.uuid;
        const mapResults = mapExercises(result);
        state.exercises = [...mapResults]
      }) 
      .addCase(updateExercise.fulfilled, (state, action) => {
        const result = action.payload;
        console.log('update', result)
      })
  },
});

export default courseSlice.reducer;
export const selectUser = (state: RootState) => state.course