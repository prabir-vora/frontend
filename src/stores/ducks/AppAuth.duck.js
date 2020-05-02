import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

// Duck Name
const duckName = 'APP_AUTH';

const actionTypes = createActionTypes(
  {
    //
    SHOW_LOGIN_MODAL: 'SHOW_LOGIN_MODAL',
    HIDE_LOGIN_MODAL: 'HIDE_LOGIN_MODAL',

    SHOW_SIGN_UP_MODAL: 'SHOW_SIGN_UP_MODAL',
    HIDE_SIGN_UP_MODAL: 'HIDE_SIGN_UP_MODAL',

    SHOW_SETUP_MODAL: 'SHOW_SETUP_MODAL',
    HIDE_SETUP_MODAL: 'HIDE_SETUP_MODAL',

    SHOW_VERIFICATION_MODAL: 'SHOW_VERIFICATION_MODAL',
    HIDE_VERIFICATION_MODAL: 'HIDE_VERIFICATION_MODAL',

    SIGN_UP_REQUEST: 'SIGN_UP_REQUEST',
    SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
    SIGN_UP_FAILURE: 'SIGN_UP_FAILURE',

    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
  },
  duckName,
);

const initialState = {
  showLoginModal: false,
  showSignUpModal: false,
  showSetupModal: false,
  showVerificationModal: false,
  isSigningUp: false,
  isLoggingIn: false,
};

//  ------------> Action Creators

//  Modals

const showModal = type => dispatch => {
  switch (type) {
    case 'login':
      dispatch(showLoginModal());
      return;
    case 'signUp':
      dispatch(showSignUpModal());
      return;
    case 'setup':
      dispatch(showSetupModal());
      return;
    case 'verification':
      dispatch(showVerificationModal());
    default:
      return;
  }
};

const hideModal = type => dispatch => {
  switch (type) {
    case 'login':
      dispatch(hideLoginModal());
      return;
    case 'signUp':
      dispatch(hideSignUpModal());
      return;
    case 'setup':
      dispatch(hideSetupModal());
      return;
    case 'verification':
      dispatch(hideVerificationModal());
    default:
      return;
  }
};

// Sign Up + Login

const signUpWithEmailInput = () => {
  return `
  mutation($signUpInput: SignUpInput) {
    signUpWithEmail(signUpInput: $signUpInput)
  }
`;
};

const signUpWithEmail = signUpInfo => dispatch => {
  dispatch(signUpRequest());
  return new Promise((resolve, reject) => {
    console.log(signUpInfo);
    fetchGraphQL(signUpWithEmailInput(), undefined, {
      signUpInput: signUpInfo,
    })
      .then(res => {
        const token = res.signUpWithEmail;
        if (token) {
          resolve({ success: true, token });
          dispatch(signUpSuccess());
        } else {
          resolve({ success: false, token: '' });
          dispatch(signUpFailure());
        }
        console.log(res);
      })
      .catch(e => {
        console.log(e);
        resolve({ success: false, token: '' });
        dispatch(signUpFailure());
      });
  });
};

const signUpWithGoogle = accessToken => dispatch => {
  dispatch(signUpRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        signUpWithGoogle(accessToken: "${accessToken}") 
      }
    `)
      .then(res => {
        const token = res.signUpWithGoogle;
        if (token) {
          resolve({ success: true, token });
          dispatch(signUpSuccess());
        } else {
          resolve({ success: false, token: '' });
          dispatch(signUpFailure());
        }
        console.log(res);
      })
      .catch(e => {
        console.log(e);
        resolve({ success: false, token: '' });
        dispatch(signUpFailure());
      });
  });
};

const loginWithEmailInput = () => {
  return `
  mutation($loginInput: LoginInput) {
    loginWithEmail(loginInput: $loginInput)
  }
`;
};

const loginWithEmail = loginInfo => dispatch => {
  dispatch(loginRequest());
  return new Promise((resolve, reject) => {
    console.log(loginInfo);
    fetchGraphQL(loginWithEmailInput(), undefined, {
      loginInput: loginInfo,
    })
      .then(res => {
        const token = res.loginWithEmail;
        if (token) {
          resolve({ success: true, token });
          dispatch(loginSuccess());
        } else {
          resolve({ success: false, token: '' });
          dispatch(loginFailure());
        }
        console.log(res);
      })
      .catch(e => {
        console.log(e);
        resolve({ success: false, token: '' });
        dispatch(loginFailure());
      });
  });
};

const loginWithGoogle = accessToken => dispatch => {
  dispatch(loginRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        loginWithGoogle(accessToken: "${accessToken}") 
      }
    `)
      .then(res => {
        const token = res.loginWithGoogle;
        if (token) {
          resolve({ success: true, token });
          dispatch(loginSuccess());
        } else {
          resolve({ success: false, token: '' });
          dispatch(loginFailure());
        }
        console.log(res);
      })
      .catch(e => {
        console.log(e);
        resolve({ success: false, token: '' });
        dispatch(loginFailure());
      });
  });
};

// ----------------> Actions

const showLoginModal = () => {
  return {
    type: actionTypes.SHOW_LOGIN_MODAL,
  };
};

const showSignUpModal = () => {
  return {
    type: actionTypes.SHOW_SIGN_UP_MODAL,
  };
};

const hideLoginModal = () => {
  return {
    type: actionTypes.HIDE_LOGIN_MODAL,
  };
};

const hideSignUpModal = () => {
  return {
    type: actionTypes.HIDE_SIGN_UP_MODAL,
  };
};

const showSetupModal = () => {
  return {
    type: actionTypes.SHOW_SETUP_MODAL,
  };
};

const hideSetupModal = () => {
  return {
    type: actionTypes.HIDE_SETUP_MODAL,
  };
};

const showVerificationModal = () => {
  return {
    type: actionTypes.SHOW_VERIFICATION_MODAL,
  };
};

const hideVerificationModal = () => {
  return {
    type: actionTypes.HIDE_VERIFICATION_MODAL,
  };
};

const signUpRequest = () => {
  return {
    type: actionTypes.SIGN_UP_REQUEST,
  };
};

const signUpSuccess = () => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS,
  };
};

const signUpFailure = () => {
  return {
    type: actionTypes.SIGN_UP_FAILURE,
  };
};

const loginRequest = () => {
  return {
    type: actionTypes.LOGIN_REQUEST,
  };
};

const loginSuccess = () => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
  };
};

const loginFailure = () => {
  return {
    type: actionTypes.LOGIN_FAILURE,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_LOGIN_MODAL:
      return Object.assign({}, state, {
        showLoginModal: true,
      });
    case actionTypes.SHOW_SIGN_UP_MODAL:
      return Object.assign({}, state, {
        showSignUpModal: true,
      });

    case actionTypes.SHOW_SETUP_MODAL:
      return Object.assign({}, state, {
        showSetupModal: true,
      });
    case actionTypes.SHOW_VERIFICATION_MODAL:
      return Object.assign({}, state, {
        showVerificationModal: true,
      });
    case actionTypes.HIDE_LOGIN_MODAL:
      return Object.assign({}, state, {
        showLoginModal: false,
      });
    case actionTypes.HIDE_SIGN_UP_MODAL:
      return Object.assign({}, state, {
        showSignUpModal: false,
      });
    case actionTypes.HIDE_SETUP_MODAL:
      return Object.assign({}, state, {
        showSetupModal: false,
      });
    case actionTypes.HIDE_VERIFICATION_MODAL:
      return Object.assign({}, state, {
        showVerificationModal: false,
      });
    case actionTypes.SIGN_UP_REQUEST:
      return Object.assign({}, state, {
        isSigningUp: true,
      });
    case actionTypes.SIGN_UP_SUCCESS:
      return Object.assign({}, state, {
        isSigningUp: false,
      });
    case actionTypes.SIGN_UP_FAILURE:
      return Object.assign({}, state, {
        isSigningUp: false,
      });
    case actionTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoggingIn: true,
      });
    case actionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggingIn: false,
      });
    case actionTypes.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isLoggingIn: false,
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    showModal,
    hideModal,
    signUpWithEmail,
    signUpWithGoogle,
    loginWithEmail,
    loginWithGoogle,
  },
};
