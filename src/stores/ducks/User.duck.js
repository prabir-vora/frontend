import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';
import * as immutable from 'object-path-immutable';

const duckName = 'USER';
const actionTypes = createActionTypes(
  {
    USER_SETUP_REQUEST: 'USER_SETUP_REQUEST',
    USER_SETUP_SUCCESS: 'USER_SETUP_SUCCESS',
    USER_SETUP_FAILURE: 'USER_SETUP_FAILURE',

    RESELLER_SETUP_REQUEST: 'RESELLER_SETUP_REQUEST',
    RESELLER_SETUP_SUCCESS: 'RESELLER_SETUP_SUCCESS',
    RESELLER_SETUP_FAILURE: 'RESELLER_SETUP_FAILURE',

    FETCH_CURRENT_USER_REQUEST: 'FETCH_CURRENT_USER_REQUEST',
    FETCH_CURRENT_USER_SUCCESS: 'FETCH_CURRENT_USER_SUCCESS',
    FETCH_CURRENT_USER_FAILURE: 'FETCH_CURRENT_USER_FAILURE',

    LOG_OUT_USER: 'LOG_OUT_USER',
  },
  duckName,
);

const initialState = {
  user: null,
};

const userSetupWithInput = () => {
  return `
    mutation($setupInfo: UserSetupInfo!) {
      userSetup(setupInfo: $setupInfo) 
    }
  `;
};

const userSetup = setupInfo => dispatch => {
  // dispatch(userSetupRequest());
  const { lat, lng } = setupInfo;
  const updatedSetupInfo = immutable
    .wrap(setupInfo)
    .set('_geoloc', { lat, lng })
    .del('lat')
    .del('lng')
    .value();

  return new Promise((resolve, reject) => {
    fetchGraphQL(userSetupWithInput(), undefined, {
      setupInfo: updatedSetupInfo,
    })
      .then(res => {
        if (res !== null && res !== undefined && res.userSetup !== undefined) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      })
      .catch(e => {
        resolve({ success: false });
      });
  });
};

const resellerSetupWithInput = () => {
  return `
    mutation($resellerInfo: ResellerSetupInfo!) {
      resellerSetup(resellerSetupInfo: $resellerInfo) 
    }
  `;
};

const resellerSetup = resellerInfo => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(resellerSetupWithInput(), undefined, {
      resellerInfo,
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.resellerSetup !== undefined
        ) {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      })
      .catch(e => {
        resolve({ success: false });
      });
  });
};

const fetchCurrentUser = () => dispatch => {
  dispatch(fetchCurrentUserRequest());

  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            fetchUser {
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
        if (res !== null && res !== undefined && res.fetchUser !== undefined) {
          dispatch(fetchCurrentUserSuccess(res.fetchUser));
          resolve({
            success: true,
            isSetup:
              res.fetchUser.username !== null &&
              res.fetchUser.username !== undefined,
          });
        } else {
          dispatch(fetchCurrentUserFailure());
          resolve({ success: false, isSetup: false });
        }
      })
      .catch(e => {
        dispatch(fetchCurrentUserFailure());
        resolve({ success: false, isSetup: false });
      });
  });
};

const fetchIsUsernameValid = username => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
        fetchIsUsernameValid(username: "${username}") 
      }
    `)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.fetchIsUsernameValid !== null
        ) {
          resolve({ success: true, isUsernameValid: res.fetchIsUsernameValid });
        } else {
          resolve({ success: false, isUsernameValid: false });
        }
      })
      .catch(e => {
        resolve({ success: false, isUsernameValid: false });
      });
  });
};

const logOutUser = () => dispatch => {
  dispatch(logOutUserAction());
};

const fetchCurrentUserRequest = () => {
  return {
    type: actionTypes.FETCH_CURRENT_USER_REQUEST,
  };
};

const fetchCurrentUserSuccess = user => {
  return {
    type: actionTypes.FETCH_CURRENT_USER_SUCCESS,
    payload: { user },
  };
};

const fetchCurrentUserFailure = () => {
  return {
    type: actionTypes.FETCH_CURRENT_USER_FAILURE,
  };
};

const logOutUserAction = () => {
  return {
    type: actionTypes.LOG_OUT_USER,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CURRENT_USER_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
      });
    case actionTypes.FETCH_CURRENT_USER_SUCCESS:
      console.log(action);
      return Object.assign({}, state, {
        isSaving: false,
        user: action.payload.user,
        isVerified: action.payload.user.authCode === 0,
      });
    case actionTypes.FETCH_CURRENT_USER_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
      });
    case actionTypes.LOG_OUT_USER: {
      return Object.assign({}, state, {
        user: null,
        isVerified: false,
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
    fetchCurrentUser,
    logOutUser,
    fetchIsUsernameValid,
    userSetup,
    resellerSetup,
  },
};
