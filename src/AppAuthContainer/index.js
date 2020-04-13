import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import UserDuck from 'stores/ducks/User.duck';

import { SignUpModal, LoginModal, UserSetupModal } from './components';

import { withCookies } from 'react-cookie';

class AppAuthContainer extends Component {
  async componentDidMount() {
    const jwt = this.props.cookies.get('jwt');
    if (jwt) {
      const { actionCreators } = UserDuck;
      const { fetchCurrentUser } = actionCreators;

      const { success, isSetup } = await this.props.dispatch(
        fetchCurrentUser(),
      );

      console.log(isSetup);

      const { showModal } = AppAuthDuck.actionCreators;

      if (success && !isSetup) {
        this.props.dispatch(showModal('setup'));
      }
    }
  }

  onCloseSignUpModal = () => {
    const { actionCreators } = AppAuthDuck;
    const { hideModal } = actionCreators;
    this.props.dispatch(hideModal('signUp'));
  };

  onCloseLoginModal = () => {
    const { actionCreators } = AppAuthDuck;
    const { hideModal } = actionCreators;
    this.props.dispatch(hideModal('login'));
  };

  onSignUpWithEmail = async signUpInfo => {
    console.log(signUpInfo);
    const {
      signUpWithEmail,
      hideModal,
      showModal,
    } = AppAuthDuck.actionCreators;

    const { success, token } = await this.props.dispatch(
      signUpWithEmail(signUpInfo),
    );

    if (success) {
      const { fetchCurrentUser } = UserDuck.actionCreators;

      this.props.cookies.set('jwt', token, { path: '/' });
      this.props.dispatch(hideModal('signUp'));
      const { success, isSetup } = await this.props.dispatch(
        fetchCurrentUser(),
      );

      if (success && !isSetup) {
        this.props.dispatch(showModal('setup'));
      }
    }
  };

  onSignUpWithGoogle = async accessToken => {
    const {
      signUpWithGoogle,
      hideModal,
      showModal,
    } = AppAuthDuck.actionCreators;

    console.log(accessToken);

    const { success, token } = await this.props.dispatch(
      signUpWithGoogle(accessToken),
    );

    if (success) {
      const { fetchCurrentUser } = UserDuck.actionCreators;

      this.props.cookies.set('jwt', token, { path: '/' });
      this.props.dispatch(hideModal('signUp'));
      const { success, isSetup } = await this.props.dispatch(
        fetchCurrentUser(),
      );

      if (success && !isSetup) {
        this.props.dispatch(showModal('setup'));
      }
    }
  };

  onLoginWithEmail = async loginInfo => {
    const { loginWithEmail, hideModal, showModal } = AppAuthDuck.actionCreators;

    const { success, token } = await this.props.dispatch(
      loginWithEmail(loginInfo),
    );

    if (success) {
      const { fetchCurrentUser } = UserDuck.actionCreators;

      this.props.cookies.set('jwt', token, { path: '/' });
      this.props.dispatch(hideModal('login'));
      const { success, isSetup } = await this.props.dispatch(
        fetchCurrentUser(),
      );

      if (success && !isSetup) {
        this.props.dispatch(showModal('setup'));
      }
    } else {
      return null;
    }
  };

  onLoginWithGoogle = async accessToken => {
    const {
      loginWithGoogle,
      hideModal,
      showModal,
    } = AppAuthDuck.actionCreators;

    console.log(accessToken);

    const { success, token } = await this.props.dispatch(
      loginWithGoogle(accessToken),
    );

    if (success) {
      const { fetchCurrentUser } = UserDuck.actionCreators;

      this.props.cookies.set('jwt', token, { path: '/' });
      this.props.dispatch(hideModal('login'));
      const { success, isSetup } = await this.props.dispatch(
        fetchCurrentUser(),
      );

      if (success && !isSetup) {
        this.props.dispatch(showModal('setup'));
      }
    }
  };

  onChangeUsername = async username => {
    const { fetchIsUsernameValid } = UserDuck.actionCreators;
    const { success, isUsernameValid } = await this.props.dispatch(
      fetchIsUsernameValid(username),
    );
    return { success, isUsernameValid };
  };

  onSubmitUserSetup = async setupInfo => {
    const { userSetup } = UserDuck.actionCreators;
    const { hideModal } = AppAuthDuck.actionCreators;
    const { success } = await this.props.dispatch(userSetup(setupInfo));
    if (success) {
      this.props.dispatch(hideModal('setup'));
    }
  };

  toggleToLogin = () => {
    const { showModal, hideModal } = AppAuthDuck.actionCreators;
    this.props.dispatch(hideModal('signUp'));
    this.props.dispatch(showModal('login'));
  };

  toggleToSignUp = () => {
    const { showModal, hideModal } = AppAuthDuck.actionCreators;
    this.props.dispatch(hideModal('login'));
    this.props.dispatch(showModal('signUp'));
  };

  render() {
    const { showSignUpModal, showLoginModal, showSetupModal } = this.props;
    return (
      <React.Fragment>
        {showSignUpModal && (
          <SignUpModal
            onSignUpWithEmail={this.onSignUpWithEmail}
            onSignUpWithGoogle={this.onSignUpWithGoogle}
            onClose={this.onCloseSignUpModal}
            toggleToLogin={this.toggleToLogin}
          />
        )}
        {showSetupModal && (
          <UserSetupModal
            user={this.props.user}
            onChangeUsername={this.onChangeUsername}
            onSubmitUserSetup={this.onSubmitUserSetup}
          />
        )}
        {showLoginModal && (
          <LoginModal
            onLoginWithEmail={this.onLoginWithEmail}
            onLoginWithGoogle={this.onLoginWithGoogle}
            onClose={this.onCloseLoginModal}
            toggleToSignUp={this.toggleToSignUp}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    showLoginModal: state[AppAuthDuck.duckName].showLoginModal,
    showSignUpModal: state[AppAuthDuck.duckName].showSignUpModal,
    showSetupModal: state[AppAuthDuck.duckName].showSetupModal,
    user: state[UserDuck.duckName].user,
  };
};

const x = withCookies(AppAuthContainer);
export default connect(mapStateToProps)(x);
