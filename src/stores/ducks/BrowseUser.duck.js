import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

const duckName = 'BROWSE_USER';
const actionTypes = createActionTypes(
  {
    FETCH_BROWSED_USER_REQUEST: 'FETCH_BROWSED_USER_REQUEST',
    FETCH_BROWSED_USER_SUCCESS: 'FETCH_BROWSED_USER_SUCCESS',
    FETCH_BROWSED_USER_FAILURE: 'FETCH_BROWSED_USER_FAILURE',

    CHANGE_LISTING_SELECTION: 'CHANGE_LISTING_SELECTION',
  },
  duckName,
);

const initialState = {
  user: null,
  listingSelection: 'shop',
};

const fetchCurrentBrowsedUser = username => dispatch => {
  dispatch(fetchBrowsedUserRequest());

  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          query {
            fetchCurrentBrowsedUser(username: "${username}") {
                  id
                  name
                  email
                  authCode
                  username
                  address
                  _geoloc {
                    lat
                    lng
                  }
                  createdAt
                  profilePictureURL
                  resellItems {
                    id
                    askingPrice
                    condition
                    availability
                    size
                    product {
                      id
                      name
                    }
                    images
                  }
              }
          }
          `)
      .then(res => {
        console.log(res);
        if (
          res !== null &&
          res !== undefined &&
          res.fetchCurrentBrowsedUser !== undefined
        ) {
          dispatch(fetchBrowsedUserSuccess(res.fetchCurrentBrowsedUser));
          resolve({
            success: true,
          });
        } else {
          dispatch(fetchBrowsedUserFailure());
          resolve({ success: false });
        }
      })
      .catch(e => {
        dispatch(fetchBrowsedUserFailure());
        resolve({ success: false });
      });
  });
};

const toggleListingSelection = selection => dispatch => {
  dispatch(changeListingSelection(selection));
};

const fetchBrowsedUserRequest = () => {
  return {
    type: actionTypes.FETCH_BROWSED_USER_REQUEST,
  };
};

const fetchBrowsedUserSuccess = user => {
  return {
    type: actionTypes.FETCH_BROWSED_USER_SUCCESS,
    payload: { user },
  };
};

const fetchBrowsedUserFailure = () => {
  return {
    type: actionTypes.FETCH_BROWSED_USER_FAILURE,
  };
};

const changeListingSelection = selection => {
  return {
    type: actionTypes.CHANGE_LISTING_SELECTION,
    payload: selection,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BROWSED_USER_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
      });
    case actionTypes.FETCH_BROWSED_USER_SUCCESS:
      console.log(action);
      return Object.assign({}, state, {
        isSaving: false,
        user: action.payload.user,
      });
    case actionTypes.FETCH_BROWSED_USER_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
      });
    case actionTypes.CHANGE_LISTING_SELECTION:
      return Object.assign({}, state, {
        listingSelection: action.payload,
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    fetchCurrentBrowsedUser,
    toggleListingSelection,
  },
};
