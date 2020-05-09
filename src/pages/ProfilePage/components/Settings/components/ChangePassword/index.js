import React, { Component } from 'react';
import Style from '../style.module.scss';

import { Button } from 'fields';

import { connect } from 'react-redux';
import UserDuck from 'stores/ducks/User.duck';
import { ShowConfirmNotif } from 'functions';

class ChangePassword extends Component {
  confirmNotif = null;

  state = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  };

  onChangeFieldValue = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    this.setState({
      [fieldName]: fieldValue,
    });
  };

  onGetSubmitBtnStatus = () => {
    const { currentPassword, newPassword, newPasswordConfirm } = this.state;

    if (
      currentPassword === '' ||
      newPassword === '' ||
      newPasswordConfirm === '' ||
      newPassword !== newPasswordConfirm
    ) {
      return 'inactive';
    } else {
      return 'active';
    }
  };

  onCancel = () => {
    this.setState({
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    });
  };

  onChangePassword = async () => {
    const { changePassword } = UserDuck.actionCreators;
    const { success } = await this.props.dispatch(
      changePassword(this.state.currentPassword, this.state.newPassword),
    );

    if (success) {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Password updated Successfully',
        type: 'success',
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Password updated failed. Ensure correct password.',
        type: 'error',
      });
    }

    this.onCancel();
  };

  render() {
    const { currentPassword, newPassword, newPasswordConfirm } = this.state;
    return (
      <div className={Style.container}>
        <div className={Style.title}>Change password</div>
        <div className={Style.form}>
          <p className={Style.formInputLabel}>Current Password</p>
          <input
            className={Style.formInput}
            type="password"
            name="currentPassword"
            value={currentPassword}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <p className={Style.formInputLabel}>New Password</p>
          <input
            className={Style.formInput}
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <p className={Style.formInputLabel}>Retype New Password</p>
          <input
            className={Style.formInput}
            type="password"
            name="newPasswordConfirm"
            value={newPasswordConfirm}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <div className={Style.buttonsRow}>
            <Button
              status={this.onGetSubmitBtnStatus()}
              className={Style.saveButton}
              onClick={() => this.onChangePassword()}
            >
              CHANGE PASSWORD
            </Button>
            <button
              className={Style.cancelButton}
              onClick={() => this.onCancel()}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(ChangePassword);
