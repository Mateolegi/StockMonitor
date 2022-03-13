export type Stock = {
  key: string;
  name: string;
  unit: string;
  date: number;
  value: number;
};

export type StockHistory = {
  key: string;
  name: string;
  unit: string;
  values: {
    [timestamp: number]: number;
  }
};

export type StockState = {
  data: Stock[];
  isFetching: boolean;
  error: boolean;
};