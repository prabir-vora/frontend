import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from './style.module.scss';

import { CloseIcon } from 'assets/Icons';

import { Button, TextInput, Img } from 'fields';

export default class ConfirmListingModal extends Component {
  onCloseModal = () => {
    this.props.onCloseModal();
  };

  onSubmitListing = () => {
    this.props.onSubmitListing();
  };

  renderMessageContainer() {
    const { listingInfo } = this.props;
    const { askingPrice, availability, condition, product, size } = listingInfo;
    const { original_image_url, name } = product;

    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    return (
      <div>
        <div>
          <div className={ModalStyle.ListingSummary}>
            <Img
              className={ModalStyle.ProductImage}
              src={original_image_url}
              alt={name}
            />
            <h1 className={ModalStyle.productName}>{name}</h1>
            <div className={ModalStyle.detailsContainer}>
              <div className={ModalStyle.detailsBlock}>
                <div className={ModalStyle.detailsTitle}>Size</div>
                <div className={ModalStyle.detailsContent}>{size.label}</div>
              </div>
              <div className={ModalStyle.detailsBlock}>
                <div className={ModalStyle.detailsTitle}>Condition</div>
                <div className={ModalStyle.detailsContent}>
                  {conditionMap[condition].label}
                </div>
              </div>
              <div className={ModalStyle.detailsBlock}>
                <div className={ModalStyle.detailsTitle}>Price (USD)</div>
                <div className={ModalStyle.detailsContent}>{askingPrice}</div>
              </div>
            </div>
          </div>
          <Button
            className={ModalStyle.ModalButton}
            onClick={this.onSubmitListing}
          >
            CREATE LISTING
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <ReactModal
        isOpen={true}
        className={ModalStyle.Modal}
        overlayClassName={ModalStyle.Overlay}
        contentLabel="Example Modal"
      >
        <button
          className={ModalStyle.close}
          onClick={() => this.props.onClose()}
        >
          <CloseIcon />
        </button>
        <div className={ModalStyle.header}>
          <h2 className={ModalStyle.title}>CONFIRM LISTING</h2>
        </div>
        <div className={ModalStyle.body}>{this.renderMessageContainer()}</div>
      </ReactModal>
    );
  }
}
