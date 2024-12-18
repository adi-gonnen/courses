import { fetchDays, fetchExercises,  updateCourse, mapExercises } from '../services/DataService'
import { CourseInput, ExerciseInput, UpdateExerciseInput, SearchInput, Status } from "../services/moduls";
import {RootState} from './index'
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  courseId: string;
  days: CourseInput[] | null;
  exercises: ExerciseInput[] | null;
  filterExercises: ExerciseInput[] | [];
  init: boolean
  error: string | null
  status: string
}

const initialState: CourseState = {
    courseId: '',
    days: null,
    exercises: null,
    filterExercises: [],
    init: true,
    error: null,
    status: ''
};

export const getCourses = createAsyncThunk('course/fetchDays', async () => {
    const response = await fetchDays();
    return response[0];   // in this case, got 1 item
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
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    getFilterExercises: (state, action: PayloadAction<SearchInput>) => {
      const { search, idx} = action.payload;
      const fullList = state.exercises;
      const currentList = state.filterExercises;
      if (!fullList?.length || fullList.length === currentList.length) {
        return
      }
      let lastIdx = idx;
      if (idx > fullList.length) {
        lastIdx = fullList.length;
      }
      const filterList = fullList.filter((item) => item.title.startsWith(search)) 
      const extractList = filterList.slice(0, lastIdx)
      state.filterExercises = [...extractList]
    },
  },
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
        if (result.error) {
          state.error = Status.UPDATE;
        }
      }) 
  },
});

export const { getFilterExercises, setError } = courseSlice.actions;
export default courseSlice.reducer;
export const selectUser = (state: RootState) => state.course