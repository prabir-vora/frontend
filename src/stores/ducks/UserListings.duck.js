import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

// Duck Name
const duckName = 'USER_LISTINGS';

const actionTypes = createActionTypes(
  {
    FETCH_USER_LISTINGS_REQUEST: 'FETCH_USER_LISTINGS_REQUEST',
    FETCH_USER_LISTINGS_SUCCESS: 'FETCH_USER_LISTINGS_SUCCESS',
    FETCH_USER_LISTINGS_FAILURE: 'FETCH_USER_LISTINGS_FAILURE',

    CLEAR_LISTINGS: 'CLEAR_LISTINGS',
  },
  duckName,
);

const initialState = {
  listings: [],
  nextPage: 1,
  loadingListings: false,
  hasMoreListings: true,
};

const fetchUserListings = page => dispatch => {
  dispatch(fetchUserListingsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
        fetchUserListings(page: ${page}) {
            data {
              id
              askingPrice
              condition
              availability
              size
              slug
              product {
                id
                name
                original_image_url
                brand {
                  id
                  name
                }
              }
              images
              purchased_at
            }
          }
          
      }`)
      .then(res => {
        if (
          res !== undefined &&
          res !== null &&
          res.fetchUserListings !== null
        ) {
          dispatch(fetchUserListingsSuccess(res.fetchUserListings));
          resolve({ success: true });
        } else {
          dispatch(fetchUserListingsFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        dispatch(fetchUserListingsFailure());
        resolve({ success: false });
      });
  });
};

const clearListings = () => dispatch => {
  dispatch(clearAllListings());
};

const fetchUserListingsRequest = () => {
  return {
    type: actionTypes.FETCH_USER_LISTINGS_REQUEST,
  };
};

const fetchUserListingsSuccess = ({ data }) => {
  const hasMoreListings = data.length === 6 ? true : false;
  return {
    type: actionTypes.FETCH_USER_LISTINGS_SUCCESS,
    payload: { data, hasMoreListings },
  };
};

const fetchUserListingsFailure = () => {
  return {
    type: actionTypes.FETCH_USER_LISTINGS_FAILURE,
  };
};

const clearAllListings = () => {
  return {
    type: actionTypes.CLEAR_LISTINGS,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_LISTINGS_REQUEST:
      return Object.assign({}, state, {
        loadingListings: true,
      });
    case actionTypes.FETCH_USER_LISTINGS_SUCCESS:
      const listings = [...state.listings, ...action.payload.data];
      const updatedNextPage = state.nextPage + 1;
      return Object.assign({}, state, {
        listings,
        hasMoreListings: action.payload.hasMoreListings,
        loadingListings: false,
        nextPage: updatedNextPage,
      });
    case actionTypes.FETCH_USER_LISTINGS_FAILURE:
      return Object.assign({}, state, {
        loadingListings: false,
      });

    case actionTypes.CLEAR_LISTINGS: {
      return Object.assign({}, state, {
        listings: [],
        hasMoreListings: true,
        loadingListings: false,
        nextPage: 1,
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
    fetchUserListings,
    clearListings,
  },
};
