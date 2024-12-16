import { fetchDays, fetchExercises,  updateCourse, mapExercises } from '../services/DataService'
import { CourseInput, ExerciseInput, UpdateExerciseInput, SearchInput } from "../services/moduls";
import {RootState} from './index'
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  courseId: string;
  days: CourseInput[] | null;
  exercises: ExerciseInput[] | null;
  filterExercises: ExerciseInput[] | [];
  init: boolean
}

const initialState: CourseState = {
    courseId: '',
    days: null,
    exercises: null,
    filterExercises: [],
    init: true
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
    getFilterExercises: (state, action: PayloadAction<SearchInput>) => {
      const { search, idx} = action.payload;
      const fullList = state.exercises;
      const currentList = state.filterExercises;
      if (!fullList?.length) {
        return
      }
      if (fullList.length === currentList.length) {
        return
      }
      // if (currentList.length && idx === 0 && !search) {
      //   return
      // }
      let lastIdx = idx;
      if (idx > fullList.length) {
        lastIdx = fullList.length;
      }
      const filterList = search ? fullList.filter((item) => item.title.startsWith(search)) : fullList;
      console.log('search', filterList.length)
      const extractList = filterList.slice(0, lastIdx)
        state.filterExercises = [...extractList]
        // state.filterExercises = [...currentList, ...extractList]
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
        console.log('init exe')
      }) 
      .addCase(updateExercise.fulfilled, (state, action) => {
        const result = action.payload;
        console.log('update', result)
      })
  },
});

export const { getFilterExercises } = courseSlice.actions;
export default courseSlice.reducer;
export const selectUser = (state: RootState) => state.course