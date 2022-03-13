import { useAppDispatch } from "../hooks/reduxHooks";
import { fetchDataFailure, fetchDataSuccess, fetchingData } from "../reducers/fetchLastApiSlice";
import { Stock } from "../types";

export function fetchLastApi() {

  const dispatch = useAppDispatch();

  return fetch('https://indecon.space/last')
    .then(res => res.json())
    .then(json => {
      const stockList: Stock[] = [];
      for (let key in json) {
        stockList.push(json[key]);
      }
      return stockList;
    })
    .then((json: Stock[]) => dispatch(fetchDataSuccess(json)))
    .catch(() => dispatch(fetchDataFailure()));
}