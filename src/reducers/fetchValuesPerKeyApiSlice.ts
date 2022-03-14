import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { StockHistory } from '../types';

const initialState: StockHistory[] = [];

export const fetchValuesPerKeyApiSlice = createSlice({
  name: 'valuesPerKey',
  initialState,
  reducers: {
    fetchDataSuccess: (state, action) => {
      state.push(action.payload);
      return state;
    },
    fetchDataFailure: (state) => {
      return state;
    },
  },
});

export const { fetchDataSuccess, fetchDataFailure } = fetchValuesPerKeyApiSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const stockHistorySelector = (state: RootState) => state.valuesPerKey;

export default fetchValuesPerKeyApiSlice.reducer;
