import { fetchDays, fetchExercises,  updateCourse, mapExercises } from '../services/DataService'
import { DayInput, ExerciseInput, UpdateExerciseInput, SearchInput } from "../services/moduls";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './index'

interface CourseState {
  courseId: string;
  days: DayInput[] | null;
  exercises: ExerciseInput[] | null;
  filterExercises: ExerciseInput[] | [];
  loading: boolean
}

const initialState: CourseState = {
    courseId: '',
    days: null,
    exercises: null,
    filterExercises: [],
    loading: false
};

export const getCourses = createAsyncThunk('course/fetchDays', async () => {
    const response = await fetchDays();
    return response && response[0];   // in this case, got 1 item
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
    return response
  }
);


const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    getFilterExercises: (state, action: PayloadAction<SearchInput>) => {
      const { search, idx} = action.payload;
      const fullList = state.exercises;
      if (!fullList?.length) {
        // case no exercises to look for
        return 
      }
      if (!search && fullList.length === state.filterExercises.length) {
        // load max items, no search mode 
        return
      }
      let lastIdx = idx;
      if (idx > fullList.length) {
        lastIdx = fullList.length;
      }
      const filterList = fullList.filter((item) => item.title.toLowerCase().startsWith(search.toLowerCase())) 
      const extractList = filterList.slice(0, lastIdx)
      state.filterExercises = [...extractList]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.fulfilled, (state, action) => {
        const result = action.payload;
        if (result && !result?.error) {
          state.courseId = result.uuid; 
          const dataArray = Object.values(result.days).map((day) => {
            return mapExercises(day);
          });
          state.days = [...dataArray]
        }
      }) 
      .addCase(getExercises.fulfilled, (state, action) => {
        const result = action.payload;
        if (!result?.error) {
          const mapResults = mapExercises(result).sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
          state.exercises = [...mapResults]
        }
      }) 
      .addCase(updateExercise.pending, (state) => {
        state.loading = true
      })
      .addCase(updateExercise.fulfilled, (state) => {
        state.loading = false
      })
  },
});

export const { getFilterExercises } = courseSlice.actions;
export default courseSlice.reducer;
export const selectUser = (state: RootState) => state.course