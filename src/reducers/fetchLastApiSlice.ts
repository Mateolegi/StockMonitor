import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { StockState } from '../types';

const initialState: StockState = {
  data: [],
  isFetching: false,
  error: false
};

export const fetchLastApiSlice = createSlice({
  name: 'last',
  initialState,
  reducers: {
    fetchingData: (state) => {
      return {
        ...state,
        isFetching: true
      }
    },
    fetchDataSuccess: (state, action) => {
      return {
        ...state,
        isFetching: false,
        data: action.payload
      }
    },
    fetchDataFailure: (state) => {
      return {
        ...state,
        isFetching: false,
        error: true
      }
    },
  },
});

export const { fetchingData, fetchDataSuccess, fetchDataFailure } = fetchLastApiSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const stocksSelector = (state: RootState) => state.last.data;

export default fetchLastApiSlice.reducer;
