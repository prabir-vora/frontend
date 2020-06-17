import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainNavBar, MainFooter, LoadingScreen } from 'components';
import * as immutable from 'object-path-immutable';

import UserDuck from 'stores/ducks/User.duck';
import Style from './style.module.scss';

import { Button, TextInput } from 'fields';

import { withCookies } from 'react-cookie';

class ContactUsPage extends Component {
  state = {
    contactInfo: {
      name: '',
      email: '',
      message: '',
    },
    isUserPresent: false,
    submitBtnStatus: 'inactive',
    messageSubmitted: false,
    error: '',
    isSubmitting: false,
  };

  componentDidMount() {
    const jwt = this.props.cookies.get('jwt');
    if (jwt) {
      this.setState({ isUserPresent: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const jwt = this.props.cookies.get('jwt');
    if (jwt && !prevState.isUserPresent) {
      this.setState({ isUserPresent: true });
    }

    if (!jwt && prevState.isUserPresent) {
      this.setState({ isUserPresent: false });
    }
  }

  onSubmitContactInfo = async () => {
    const { contactInfo, isUserPresent } = this.state;

    this.setState(
      {
        isSubmitting: true,
      },
      this.onGetButtonStatus,
    );
    const user = this.props;
    console.log(this.props);

    const { sendQuery } = UserDuck.actionCreators;

    const res = await sendQuery(contactInfo, isUserPresent, user);

    console.log(res);

    if (res.success) {
      this.setState(
        {
          messageSubmitted: true,
        },
        this.onGetButtonStatus,
      );
      this.setState(
        {
          isSubmitting: false,
        },
        this.onGetButtonStatus,
      );
    } else {
      this.setState({
        error: 'Failed to send message',
      });
      this.setState(
        {
          isSubmitting: false,
        },
        this.onGetButtonStatus,
      );
    }
  };

  onGetButtonStatus = () => {
    console.log(this.state);
    const { isUserPresent, contactInfo, isSubmitting } = this.state;
    const { name, email, message } = contactInfo;

    if (isUserPresent) {
      return message !== '' && !isSubmitting
        ? this.setState({ submitBtnStatus: 'active' })
        : this.setState({ submitBtnStatus: 'inactive' });
    } else {
      return name !== '' && email !== '' && message !== '' && !isSubmitting
        ? this.setState({ submitBtnStatus: 'active' })
        : this.setState({ submitBtnStatus: 'inactive' });
    }
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      {
        contactInfo: immutable.set(this.state.contactInfo, fieldID, value),
      },
      this.onGetButtonStatus,
    );
  };

  render() {
    const { user } = this.props;

    if (this.state.isUserPresent && !user) {
      return <LoadingScreen />;
    }

    return (
      <div
        style={{
          background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
          minHeight: '100vh',
        }}
      >
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1 className={Style.titleLarge}>Contact Us</h1>
            </div>
            <div className={Style.contactUsForm}>
              {!user && (
                <div className={Style.formFieldContainer}>
                  <h4 className={Style.formFieldTitle}>Name</h4>
                  <TextInput
                    label=""
                    hasMultipleLines={false}
                    name={'name'}
                    onChange={value =>
                      this.onChangeTextInputValue('name', value)
                    }
                    value={this.state.contactInfo['name'] || ''}
                  />
                </div>
              )}
              {!user && (
                <div className={Style.formFieldContainer}>
                  <h4 className={Style.formFieldTitle}>Email</h4>
                  <TextInput
                    label=""
                    hasMultipleLines={false}
                    name={'email'}
                    onChange={value =>
                      this.onChangeTextInputValue('email', value)
                    }
                    value={this.state.contactInfo['email'] || ''}
                  />
                </div>
              )}

              <div className={Style.formFieldContainer}>
                <h4 className={Style.formFieldTitle}>Message</h4>
                <TextInput
                  label=""
                  hasMultipleLines={true}
                  name={'message'}
                  placeholder={'How can we help?'}
                  onChange={value =>
                    this.onChangeTextInputValue('message', value)
                  }
                  value={this.state.contactInfo['message'] || ''}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {!this.state.messageSubmitted ? (
                  <Button
                    className={Style.submitBtn}
                    status={this.state.submitBtnStatus}
                    onClick={() => this.onSubmitContactInfo()}
                  >
                    Submit
                  </Button>
                ) : (
                  <div className={Style.messageSent}>Message sent</div>
                )}
              </div>
              <div className={Style.errorMessage}>{this.state.error}</div>
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
  };
};

const x = withCookies(ContactUsPage);

export default connect(mapStateToProps)(x);
