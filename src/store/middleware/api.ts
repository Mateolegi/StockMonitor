import { BASE_URL } from "../../constants/Endpoints";
import * as actions from "../api";

//TODO: Reemplazar por esta nueva API
const api = ({ dispatch }) =>
  (next) =>
    async (action) => {
      if (action.type !== actions.apiCallBegan.type) return next(action);

      const { url, method, data, onStart, onSuccess, onError } =
        action.payload;

      if (onStart) dispatch({ type: onStart });

      next(action);

      try {
        const response = await fetch(BASE_URL);
        const json = await response.json();
        // const response = await axios.request({
        //   baseURL: BASE_URL,
        //   url,
        //   method,
        //   data,
        // });
        // General
        dispatch(actions.apiCallSucess(json));
        // Specific
        if (onSuccess)
          dispatch({ type: onSuccess, payload: response.data });
      } catch (error) {
        // General
        dispatch(actions.apiCallFailed(error.message));
        // Specific
        if (onError) dispatch({ type: onError, payload: error.message });
      }
    };

export default api;