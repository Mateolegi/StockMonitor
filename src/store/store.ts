import { configureStore } from '@reduxjs/toolkit';
import fetchLastApiSlice from '../reducers/fetchLastApiSlice';
import fetchValuesPerKeyApiSlice from '../reducers/fetchValuesPerKeyApiSlice';

export const store = configureStore({
  reducer: {
    last: fetchLastApiSlice,
    valuesPerKey: fetchValuesPerKeyApiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;