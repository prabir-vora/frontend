import React, { Component } from "react";
import PropTypes from "prop-types";

// Style
import Style from "./style.module.scss";

// Fields
import { Button, CenterModal, TextInput } from "fields";

class ConfirmArchiveModal extends Component {
  state = { name: "" };

  onInputChange = name => this.setState({ name });

  onGetSubmitBtnStatus = () =>
    this.state.name.toLowerCase() === this.props.name.toLowerCase()
      ? "active"
      : "inactive";

  onSubmit = e => {
    e.preventDefault();
    this.props.onCloseModal();
    this.props.onArchive();
  };

  render() {
    return (
      <CenterModal
        contentLabel="Confirm archive item modal"
        modalBoxClassname={Style.confirmArchiveModalBox}
        contentContainerClassname={
          Style.confirmArchiveModalContainer
        }
        onCloseModal={this.props.onCloseModal}
      >
        <div className={Style.confirmArchiveTitle}>
          Re-type <strong>{this.props.name}</strong> to archive
        </div>
        <form onSubmit={this.onSubmit}>
          <TextInput
            name="type item name to confirm archiving"
            value={this.state.itemName}
            onChange={this.onInputChange}
          />
          <Button
            className={Style.confirmArchiveButton}
            name="Comfirm archive item button"
            status={this.onGetSubmitBtnStatus()}
            type="submit"
          >
            Archive Item
          </Button>
        </form>
      </CenterModal>
    );
  }
}

ConfirmArchiveModal.propTypes = {
  name: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired
};

export default ConfirmArchiveModal;
