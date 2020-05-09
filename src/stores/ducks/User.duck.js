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

    EDIT_PROFILE_REQUEST: 'EDIT_PROFILE_REQUEST',
    EDIT_PROFILE_SUCCESS: 'EDIT_PROFILE_SUCCESS',
    EDIT_PROFILE_FAILURE: 'EDIT_PROFILE_FAILURE',

    SAVE_STRIPE_CONNECT_AUTH_REQUEST: 'SAVE_STRIPE_CONNECT_AUTH_REQUEST',
    SAVE_STRIPE_CONNECT_AUTH_SUCCESS: 'SAVE_STRIPE_CONNECT_AUTH_SUCCESS',
    SAVE_STRIPE_CONNECT_AUTH_FAILURE: 'SAVE_STRIPE_CONNECT_AUTH_FAILURE',

    FOLLOW_PRODUCT: 'FOLLOW_PRODUCT',
    UNFOLLOW_PRODUCT: 'UNFOLLOW_PRODUCT',

    ADD_TO_SHOP_LIST: 'ADD_TO_SHOP_LIST',
    REMOVE_FROM_SHOP_LIST: 'REMOVE_FROM_SHOP_LIST',

    ADD_TO_LOCAL_LIST: 'ADD_TO_LOCAL_LIST',
    REMOVE_FROM_LOCAL_LIST: 'REMOVE_FROM_LOCAL_LIST',

    USER_VERIFICATION_SUCCESS: 'USER_VERIFICATION_SUCCESS',

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

const editProfileWithInput = () => {
  return `
    mutation($profile: UserEditProfile!) {
      editProfile(profile: $profile) {
        user {
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
          resellItems 
          likedProducts
          myShopList
          myLocalList
          stripe_connect_user_id
          stripe_connect_access_token
          stripe_connect_account_status
        }
        success
      }
    }
  `;
};

const editProfile = profile => dispatch => {
  dispatch(editProfileRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(editProfileWithInput(), undefined, {
      profile,
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.editProfile !== undefined
        ) {
          dispatch(editProfileSuccess(res.editProfile));
          resolve({ success: res.editProfile.success });
        } else {
          dispatch(editProfileFailure());
          resolve({ success: false });
        }
      })
      .catch(e => {
        dispatch(editProfileFailure());
        resolve({ success: false });
      });
  });
};

const changePassword = (currentPassword, newPassword) => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        changePassword(currentPassword: "${currentPassword}", newPassword: "${newPassword}")
      }
    `)
      .then(res => {
        console.log(res);
        if (
          res !== null &&
          res !== undefined &&
          res.changePassword !== null &&
          res.changePassword !== undefined
        ) {
          resolve({
            success: true,
          });
        } else {
          resolve({ success: false });
        }
      })
      .catch(err => {
        resolve({ success: false });
      });
  });
};

const saveStripeConnectAuthCode = code => dispatch => {
  dispatch(saveStripeConnectAuthCodeRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
    mutation {
      stripeConnectAccountSetup(code: "${code}") {
        user {
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
          resellItems 
          likedProducts
          myShopList
          myLocalList
          stripe_connect_user_id
          stripe_connect_access_token
          stripe_connect_account_status
        }
        success
        message
      }
    }
  `)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.saveStripeConnectAuthCode !== undefined
        ) {
          dispatch(
            saveStripeConnectAuthCodeSuccess(res.saveStripeConnectAuthCode),
          );
          resolve({
            success: res.saveStripeConnectAuthCode.success,
            message: res.saveStripeConnectAuthCode.message,
          });
        } else {
          dispatch(saveStripeConnectAuthCodeFailure());
          resolve({
            success: res.saveStripeConnectAuthCode.success,
            message: res.saveStripeConnectAuthCode.message,
          });
        }
      })
      .catch(e => {
        dispatch(saveStripeConnectAuthCodeFailure());
        resolve({
          success: false,
          message: 'Error setting up merchant account',
        });
      });
  });
};

const followProduct = productID => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        followProduct(productID: "${productID}")
      }
    `).then(res => {
      console.log(res);
      if (
        res !== null &&
        res !== undefined &&
        res.followProduct !== null &&
        res.followProduct !== undefined
      ) {
        dispatch(followProductSuccess(productID));
        resolve({
          success: true,
          message: 'Followed product successfully',
        });
      } else {
        resolve({ success: false, message: 'Followed product unsuccessfully' });
      }
    });
  });
};

const unfollowProduct = productID => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        unfollowProduct(productID: "${productID}")
      }
    `).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.unfollowProduct !== null &&
        res.unfollowProduct !== undefined
      ) {
        dispatch(unfollowProductSuccess(productID));
        resolve({
          success: true,
          message: 'Unfollowed product successfully',
        });
      } else {
        resolve({
          success: false,
          message: 'Unfollowed product unsuccessfully',
        });
      }
    });
  });
};

const addToShopList = listingID => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        addToShopList(listingID: "${listingID}")
      }
    `).then(res => {
      console.log(res);
      if (
        res !== null &&
        res !== undefined &&
        res.addToShopList !== null &&
        res.addToShopList !== undefined
      ) {
        dispatch(addToShopListSuccess(listingID));
        resolve({
          success: true,
          message: 'Added to list successfully',
        });
      } else {
        resolve({ success: false, message: 'Added to list unsuccessfully' });
      }
    });
  });
};

const removeFromShopList = listingID => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        removeFromShopList(listingID: "${listingID}")
      }
    `).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.removeFromShopList !== null &&
        res.removeFromShopList !== undefined
      ) {
        dispatch(removeFromShopListSuccess(listingID));
        resolve({
          success: true,
          message: 'Removed from list successfully',
        });
      } else {
        resolve({
          success: false,
          message: 'Removed from list unsuccessfully',
        });
      }
    });
  });
};

const addToLocalList = listingID => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        addToLocalList(listingID: "${listingID}")
      }
    `).then(res => {
      console.log(res);
      if (
        res !== null &&
        res !== undefined &&
        res.addToLocalList !== null &&
        res.addToLocalList !== undefined
      ) {
        dispatch(addToLocalListSuccess(listingID));
        resolve({
          success: true,
          message: 'Added to list successfully',
        });
      } else {
        resolve({ success: false, message: 'Added to list unsuccessfully' });
      }
    });
  });
};

const removeFromLocalList = listingID => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        removeFromLocalList(listingID: "${listingID}")
      }
    `).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.removeFromLocalList !== null &&
        res.removeFromLocalList !== undefined
      ) {
        dispatch(removeFromLocalListSuccess(listingID));
        resolve({
          success: true,
          message: 'Removed from list successfully',
        });
      } else {
        resolve({
          success: false,
          message: 'Removed from list unsuccessfully',
        });
      }
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
                serviceName
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
                resellItems 
                likedProducts
                myShopList
                myLocalList
                stripe_connect_user_id
                stripe_connect_access_token
                stripe_connect_account_status
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
            isVerified: res.fetchUser.authCode === 0,
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

const userVerification = authCode => dispatch => {
  const verificationCode = parseInt(authCode);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        userVerification(verificationCode: ${verificationCode}) 
      }
    `)
      .then(res => {
        if (res !== null && res !== undefined && res.userVerification) {
          resolve({ success: true });
          dispatch(userVerificationSuccess());
        } else {
          resolve({ success: false });
        }
      })
      .catch(e => {
        resolve({ success: false });
      });
  });
};

const userVerificationSuccess = () => {
  return {
    type: actionTypes.USER_VERIFICATION_SUCCESS,
  };
};

const followProductSuccess = productID => {
  return {
    type: actionTypes.FOLLOW_PRODUCT,
    payload: { productID },
  };
};

const unfollowProductSuccess = productID => {
  return {
    type: actionTypes.UNFOLLOW_PRODUCT,
    payload: { productID },
  };
};

const addToShopListSuccess = listingID => {
  return {
    type: actionTypes.ADD_TO_SHOP_LIST,
    payload: { listingID },
  };
};

const removeFromShopListSuccess = listingID => {
  return {
    type: actionTypes.REMOVE_FROM_SHOP_LIST,
    payload: { listingID },
  };
};

const addToLocalListSuccess = listingID => {
  return {
    type: actionTypes.ADD_TO_LOCAL_LIST,
    payload: { listingID },
  };
};

const removeFromLocalListSuccess = listingID => {
  return {
    type: actionTypes.REMOVE_FROM_LOCAL_LIST,
    payload: { listingID },
  };
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

const editProfileRequest = () => {
  return {
    type: actionTypes.EDIT_PROFILE_REQUEST,
  };
};

const editProfileSuccess = ({ user, success }) => {
  return {
    type: actionTypes.EDIT_PROFILE_SUCCESS,
    payload: { user },
  };
};

const editProfileFailure = () => {
  return {
    type: actionTypes.EDIT_PROFILE_FAILURE,
  };
};

const saveStripeConnectAuthCodeRequest = () => {
  return {
    type: actionTypes.SAVE_STRIPE_CONNECT_AUTH_REQUEST,
  };
};

const saveStripeConnectAuthCodeSuccess = ({ user, success }) => {
  return {
    type: actionTypes.SAVE_STRIPE_CONNECT_AUTH_SUCCESS,
    payload: { user },
  };
};

const saveStripeConnectAuthCodeFailure = () => {
  return {
    type: actionTypes.SAVE_STRIPE_CONNECT_AUTH_FAILURE,
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
    case actionTypes.EDIT_PROFILE_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
      });
    case actionTypes.EDIT_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        user: action.payload.user,
        isVerified: action.payload.user.authCode === 0,
      });
    case actionTypes.EDIT_PROFILE_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
      });
    case actionTypes.SAVE_STRIPE_CONNECT_AUTH_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
      });
    case actionTypes.SAVE_STRIPE_CONNECT_AUTH_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        user: action.payload.user,
        isVerified: action.payload.user.authCode === 0,
      });
    case actionTypes.SAVE_STRIPE_CONNECT_AUTH_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
      });
    case actionTypes.LOG_OUT_USER: {
      return Object.assign({}, state, {
        user: null,
        isVerified: false,
      });
    }
    case actionTypes.FOLLOW_PRODUCT: {
      const { user } = state;
      const { likedProducts } = user;
      const updatedLikeProducts = [...likedProducts, action.payload.productID];
      return Object.assign({}, state, {
        user: immutable.set(user, 'likedProducts', updatedLikeProducts),
      });
    }
    case actionTypes.UNFOLLOW_PRODUCT: {
      const { user } = state;
      const { likedProducts } = user;
      const updatedLikeProducts = likedProducts.filter(
        productID => productID !== action.payload.productID,
      );
      return Object.assign({}, state, {
        user: immutable.set(user, 'likedProducts', updatedLikeProducts),
      });
    }
    case actionTypes.ADD_TO_SHOP_LIST: {
      const { user } = state;
      const { myShopList } = user;
      const updatedShopList = [...myShopList, action.payload.listingID];
      return Object.assign({}, state, {
        user: immutable.set(user, 'myShopList', updatedShopList),
      });
    }
    case actionTypes.REMOVE_FROM_SHOP_LIST: {
      const { user } = state;
      const { myShopList } = user;
      const updatedShopList = myShopList.filter(
        listingID => listingID !== action.payload.listingID,
      );
      return Object.assign({}, state, {
        user: immutable.set(user, 'myShopList', updatedShopList),
      });
    }
    case actionTypes.ADD_TO_LOCAL_LIST: {
      const { user } = state;
      const { myLocalList } = user;
      const updatedLocalList = [...myLocalList, action.payload.listingID];
      return Object.assign({}, state, {
        user: immutable.set(user, 'myLocalList', updatedLocalList),
      });
    }
    case actionTypes.REMOVE_FROM_LOCAL_LIST: {
      const { user } = state;
      const { myLocalList } = user;
      const updatedLocalList = myLocalList.filter(
        listingID => listingID !== action.payload.listingID,
      );
      return Object.assign({}, state, {
        user: immutable.set(user, 'myLocalList', updatedLocalList),
      });
    }
    case actionTypes.USER_VERIFICATION_SUCCESS: {
      return Object.assign({}, state, {
        user: immutable.set(state.user, 'authCode', 0),
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
    followProduct,
    unfollowProduct,
    fetchIsUsernameValid,
    userSetup,
    resellerSetup,
    addToShopList,
    removeFromShopList,
    addToLocalList,
    removeFromLocalList,
    userVerification,
    editProfile,
    changePassword,
    saveStripeConnectAuthCode,
  },
};
