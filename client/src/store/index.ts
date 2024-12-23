import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import courseSlice from './courseSlice';

export const store = configureStore({
  reducer: {
    course: courseSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;