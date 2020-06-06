import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import Style from './style.module.scss';

// Fields
import { Button, CenterModal, TextInput } from 'fields';

class ConfirmOrderStatusModal extends Component {
  state = { name: '' };

  onInputChange = name => this.setState({ name });

  onGetSubmitBtnStatus = () =>
    this.state.name.toLowerCase() === this.props.name.toLowerCase()
      ? 'active'
      : 'inactive';

  onSubmit = e => {
    e.preventDefault();
    this.props.onCloseModal();
    this.props.onUpdateOrderStatus();
  };

  render() {
    return (
      <CenterModal
        contentLabel="Confirm update status item modal"
        modalBoxClassname={Style.confirmOrderStatusModalBox}
        contentContainerClassname={Style.confirmOrderStatusModalContainer}
        onCloseModal={this.props.onCloseModal}
      >
        <div className={Style.confirmOrderStatusTitle}>
          Re-type <strong>{this.props.name}</strong> to update status
        </div>
        <form onSubmit={this.onSubmit}>
          <TextInput
            name="type item name to confirm archiving"
            value={this.state.itemName}
            onChange={this.onInputChange}
          />
          <Button
            className={Style.confirmOrderStatusButton}
            name="Comfirm update status item button"
            status={this.onGetSubmitBtnStatus()}
            type="submit"
          >
            Update Order status
          </Button>
        </form>
      </CenterModal>
    );
  }
}

ConfirmOrderStatusModal.propTypes = {
  name: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onUpdateOrderStatus: PropTypes.func.isRequired,
};

export default ConfirmOrderStatusModal;
