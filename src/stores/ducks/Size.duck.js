import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';
import axios from 'axios';
import slugify from 'slugify';

// Duck Name
const duckName = 'SIZE';

const actionTypes = createActionTypes(
  {
    GET_SIZING_REQUEST: 'GET_SIZING_REQUEST',
    GET_SIZING_SUCCESS: 'GET_SIZING_SUCCESS',
    GET_SIZING_ERROR: 'GET_SIZING_ERROR',
  },
  duckName,
);

const initialState = {
  sizing: {
    data: {},
    errorMessage: {},
    isFetching: false,
    isMutating: true,
  },
};

// <---------------- Sizing ------------------>
const getSizing = () => dispatch => {
  dispatch(getSizingRequest());
  return new Promise((resolve, reject) => {
    axios
      .get('http://localhost:4000/sizing', {})
      .then(res => {
        console.log(res.data);
        if (
          res !== null &&
          res !== undefined &&
          res.data !== null &&
          res.data !== undefined
        ) {
          dispatch(getSizingSuccess(res.data));
          resolve({ success: true, message: 'Fetched Sizing successfully' });
        } else {
          dispatch(getSizingError('Could not fetch Sizing'));
          resolve({ success: false, message: 'Failed to fetch Sizing' });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(getSizingError(err.response));
        resolve({ success: false, message: 'Failed to fetch Sizing' });
      });
  });
};

const getSizingRequest = () => {
  return {
    type: actionTypes.GET_SIZING_REQUEST,
  };
};

const getSizingSuccess = data => {
  return {
    type: actionTypes.GET_SIZING_SUCCESS,
    payload: { data },
  };
};

const getSizingError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_SIZING_ERROR,
    payload: { errorMessage },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Sizing
    case actionTypes.GET_SIZING_REQUEST: {
      return Object.assign({}, state, {
        sizing: Object.assign({}, state.sizing, { isFetching: true }),
      });
    }
    case actionTypes.GET_SIZING_SUCCESS: {
      return Object.assign({}, state, {
        sizing: Object.assign({}, state.sizing, {
          data: action.payload.data || [],
          isFetching: false,
        }),
      });
    }
    case actionTypes.GET_SIZING_ERROR: {
      return Object.assign({}, state, {
        sizing: Object.assign({}, state.sizing, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    }
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    getSizing,
  },
};
