import reducer, { fetchingData, fetchDataSuccess, fetchDataFailure } from './fetchLastApiSlice';

const data = [
  {
    "key": "cobre",
    "name": "Precio del Cobre, dólares por libra",
    "unit": "dolar",
    "date": 1584489600,
    "value": 2.39
  }, {
    "key": "dolar",
    "name": "Dólar observado",
    "unit": "pesos",
    "date": 1598832000,
    "value": 779.92
  }, {
    "key": "euro",
    "name": "Euro",
    "unit": "pesos",
    "date": 1584489600,
    "value": 938.42
  },
];

test('should return initial state', () => {
  expect(reducer(undefined, {})).toEqual({
    data: [],
    isFetching: false,
    error: false
  });
});

test('should handle a data fetch', () => {
  const previousState = {
    data: [],
    isFetching: false,
    error: false
  };
  expect(reducer(previousState, fetchDataSuccess(data))).toEqual({
    data: data,
    isFetching: false,
    error: false
  });
});

test('should handle a data fetch error', () => {
  const previousState = {
    data: [],
    isFetching: false,
    error: false
  };
  expect(reducer(previousState, fetchDataFailure())).toEqual({
    data: [],
    isFetching: false,
    error: true
  });
});