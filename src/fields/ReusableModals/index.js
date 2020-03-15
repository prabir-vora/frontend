import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Icons
import { CloseIcon } from "assets/Icons";

const FullPageModal = props => {
  const { onCloseModal } = props;

  const renderCloseModalButton = () => (
    <button
      className={cx(Style.closeModalButton, props.closeModalContainerClassname)}
      onClick={onCloseModal}
    >
      {props.closeModalButtonLabel || <CloseIcon className={Style.closeIcon} />}
    </button>
  );
  return (
    <Modal
      onCloseModal={onCloseModal}
      overlayClassName={cx(Style.overlay, props.overlayClassname)}
      className={cx(Style.fullPageModal, props.modalClassname)}
      contentLabel={props.contentLabel}
      isOpen={true}
      onRequestClose={onCloseModal}
      shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
    >
      <div
        className={cx(Style.contentContainer, props.contentContainerClassname)}
      >
        {props.showCloseButton && renderCloseModalButton()}
        {props.children}
      </div>
    </Modal>
  );
};

FullPageModal.propTypes = {
  contentLabel: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  showCloseButton: PropTypes.bool,
  shouldCloseOnOverlayClick: PropTypes.bool
};

FullPageModal.defaultProps = {
  showCloseButton: true,
  shouldCloseOnOverlayClick: false
};

const CenterModal = props => {
  const { onCloseModal } = props;

  const renderCloseModalButton = () => (
    <button className={Style.closeModalButton} onClick={onCloseModal}>
      {props.closeModalButtonLabel || <CloseIcon className={Style.closeIcon} />}
    </button>
  );

  return (
    <Modal
      overlayClassName={cx(Style.overlay, props.overlayClassname)}
      className={cx(Style.centerPageModal, props.modalBoxClassname)}
      contentLabel={props.contentLabel}
      isOpen={true}
      onRequestClose={onCloseModal}
      shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
    >
      <div
        className={cx(Style.contentContainer, props.contentContainerClassname)}
      >
        {props.showCloseButton && renderCloseModalButton()}
        {props.children}
      </div>
    </Modal>
  );
};

CenterModal.propTypes = {
  contentLabel: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  showCloseButton: PropTypes.bool,
  shouldCloseOnOverlayClick: PropTypes.bool
};

CenterModal.defaultProps = {
  showCloseButton: true,
  shouldCloseOnOverlayClick: true
};

export { CenterModal, FullPageModal };
