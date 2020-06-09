import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as immutable from 'object-path-immutable';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { connect } from 'react-redux';
import SizeDuck from 'stores/ducks/Size.duck';
import UserDuck from 'stores/ducks/User.duck';
import SellDuck from 'stores/ducks/Sell.duck';

import { RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from 'assets/Icons';

// Fields
import {
  Button,
  CheckBox,
  Img,
  MultipleImagesUploader,
  RadioButton,
  TextInput,
} from 'fields';

import Select from 'react-select';

import Autocomplete from './components/Autocomplete';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import { ShowConfirmNotif } from 'functions';
import MainFooter from 'components/MainFooter';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

const RESELL_ITEM_FIELDS = [
  {
    fieldKind: 'radio',
    id: 'productType',
    label: 'Select Product Type',
    options: {
      sneakers: { label: 'Sneakers' },
      apparel: { label: 'Apparel' },
    },
    placeholder: '',
  },
  {
    fieldKind: 'autocomplete',
    id: 'selectProduct',
    label: 'Select Product',
  },
  {
    fieldKind: 'radio',
    id: 'condition',
    label: 'Select Product Condition',
    options: {
      new: { label: 'New- Deadstock' },
      new_opened: { label: 'New - Opened ' },
      new_defects: { label: 'New- with Defects' },
      preowned: { label: 'Preowned' },
    },
    placeholder: '',
  },
  {
    fieldKind: 'text',
    id: 'askingPrice',
    placeholder: '',
    required: true,
  },
  {
    fieldKind: 'dropdown',
    id: 'size',
    label: 'Select size (US)',
  },
  {
    fieldKind: 'checkboxes',
    id: 'availability',
    label: 'Selling Availability',
    options: {
      localMarketplace: { label: 'Local Marketplace' },
      shipping: { label: 'Shipping' },
    },
  },
  {
    fieldKind: 'multipleImagesUploader',
    id: 'multipleImages',
    label: 'Upload Images',
  },
];

class CreateListingPage extends Component {
  confirmNotif = null;

  state = {
    resellItemInfo: {
      productType: 'sneakers',
      product: '',
      condition: 'new',
      askingPrice: '',
      size: '',
      availability: [],
      images: [],
    },
    submitBtnStatus: 'inactive',
    query: '',
  };

  onUploadResellItemImages = imageURLs => {
    console.log(imageURLs);
    this.setState({
      resellItemInfo: immutable.set(
        this.state.resellItemInfo,
        'images',
        imageURLs,
      ),
    });
  };

  onGetButtonStatus = () => {
    console.log(this.state);
    const {
      productType,
      askingPrice,
      product,
      condition,
      size,
      availability,
    } = this.state.resellItemInfo;

    productType !== '' &&
    askingPrice !== '' &&
    product !== '' &&
    condition !== '' &&
    size !== '' &&
    availability.length !== 0
      ? this.setState({ submitBtnStatus: 'active' })
      : this.setState({ submitBtnStatus: 'inactive' });
  };

  onSubmitListing = async () => {
    const reseller = this.props.user;
    const { resellItemInfo } = this.state;
    const { submitListingInfo, showModal } = SellDuck.actionCreators;
    await this.props.dispatch(submitListingInfo(resellItemInfo));
    await this.props.dispatch(showModal('confirmListing'));
    // const { createNewListing } = SellDuck.actionCreators;
    // const { created, message } = await this.props.dispatch(
    //   createNewListing(resellItemInfo, reseller),
    // );

    // if (created) {
    //   this.confirmNotif = ShowConfirmNotif({
    //     message,
    //     type: 'success',
    //   });

    //   this.props.history.goBack();
    // } else {
    //   this.confirmNotif = ShowConfirmNotif({
    //     message,
    //     type: 'error',
    //   });
    // }
  };

  onProductSelection = selection => {
    console.log(selection);
    this.setState(
      {
        resellItemInfo: immutable.set(
          this.state.resellItemInfo,
          'product',
          selection,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onSelectSize = selectedOption => {
    this.setState(
      {
        resellItemInfo: immutable.set(
          this.state.resellItemInfo,
          'size',
          selectedOption,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onSuggestionCleared = () => {
    this.setState({
      resellItemInfo: immutable.set(this.state.resellItemInfo, 'product', ''),
    });
  };

  onSelectAvailability = id => {
    const { resellItemInfo } = this.state;
    const { availability } = resellItemInfo;

    const updatedAvailability = availability.includes(id)
      ? availability.filter(store => store !== id)
      : availability.concat(id);

    this.setState(
      {
        resellItemInfo: immutable.set(
          this.state.resellItemInfo,
          'availability',
          updatedAvailability,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  renderField = (field = {}) => {
    const { fieldKind, id, options = {} } = field;
    switch (fieldKind) {
      case 'autocomplete':
        return (
          <InstantSearch
            indexName="test_PRODUCTS"
            searchClient={searchClient}
            className={Style.formFieldContainer}
          >
            <div className={Style.formFieldContainer}>
              <h4 className={Style.formFieldTitle}>{field.label}</h4>
              <Configure
                hitsPerPage={8}
                distinct={true}
                filters={`productCategory:${this.state.resellItemInfo.productType}`}
              />
              {!this.state.resellItemInfo.product ? (
                <Autocomplete
                  onProductSelection={this.onProductSelection}
                  onSuggestionCleared={this.onSuggestionCleared}
                />
              ) : (
                <div style={{ width: '100%', display: 'flex' }}>
                  <Img
                    src={this.state.resellItemInfo.product.original_image_url}
                    className={Style.selectedItemImage}
                  />
                  <div className={Style.selectedItemTitle}>
                    {this.state.resellItemInfo.product.name}
                    <Button
                      className={Style.removeProductSelection}
                      onClick={() => {
                        this.setState(
                          {
                            resellItemInfo: immutable.set(
                              this.state.resellItemInfo,
                              'product',
                              '',
                            ),
                          },
                          this.onGetButtonStatus,
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </InstantSearch>
        );
      case 'radio':
        return (
          <div className={Style.formFieldContainer} key={id}>
            <div>
              <h4 className={Style.formFieldTitle}>{field.label}</h4>
              {this.renderRadioButtons(id, options)}
            </div>
          </div>
        );
      case 'text':
      case 'textarea':
        return (
          <div key={id} className={Style.formFieldContainer}>
            <h4 className={Style.formFieldTitle}>Asking Price $ (USD)</h4>
            <TextInput
              {...field}
              hasMultipleLines={fieldKind === 'textarea' ? true : false}
              name={id}
              onChange={value => this.onChangeTextInputValue(id, value)}
              value={this.state.resellItemInfo[id] || ''}
              type={'number'}
            />
          </div>
        );
      case 'dropdown':
        return (
          <div key={id} className={Style.formFieldContainer}>
            <h4 className={Style.formFieldTitle}>{field.label}</h4>
            {this.renderDropdown(id)}
          </div>
        );
      case 'checkboxes':
        return (
          <div key={id} className={Style.formFieldContainer}>
            <h4 className={Style.formFieldTitle}>{field.label}</h4>
            {this.renderCheckBoxes(options)}
          </div>
        );
      case 'multipleImagesUploader':
        return (
          <div key={id} className={Style.formFieldContainer}>
            <h4 className={Style.formFieldTitle}>{field.label}</h4>
            <h6
              style={{
                fontSize: '13px',
                fontWeight: '400',
              }}
            >
              Upload 4 - 5 images from good angles.
              <a
                style={{ textDecoration: 'underline', marginLeft: '5px' }}
                href="/photoGuidelines"
                target="_blank"
                rel="noopener noreferrer"
              >
                {' '}
                Read our photo guidelines.
              </a>
            </h6>

            <MultipleImagesUploader
              imageURLs={this.state.resellItemInfo.images}
              typeOfUpload={'resellItem'}
              onUploadImages={this.onUploadResellItemImages}
              style={{ background: 'none', boxShadow: 'none' }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  renderRadioButtons = (id, options) => {
    switch (id) {
      default:
        return this.renderDefaultRadioButtons(id, options);
    }
  };

  renderDefaultRadioButtons = (id, options) => {
    return Object.keys(options).map(optionID => {
      return (
        <div key={optionID} style={{ marginBottom: '10px' }}>
          <Button
            className={Style.radioButton}
            onClick={() => {
              if (id === 'productType') {
                this.setState({
                  resellItemInfo: immutable
                    .wrap(this.state.resellItemInfo)
                    .set('product', '')
                    .set(id, optionID)
                    .value(),
                });
              } else {
                this.setState(
                  {
                    resellItemInfo: immutable.set(
                      this.state.resellItemInfo,
                      id,
                      optionID,
                    ),
                  },
                  this.onGetButtonStatus,
                );
              }
            }}
          >
            {optionID === this.state.resellItemInfo[id] ? (
              <RadioButtonCheckedIcon />
            ) : (
              <RadioButtonUncheckedIcon />
            )}
            {options[optionID].label}
          </Button>
          {/* <RadioButton
            checked={optionID === this.state.resellItemInfo[id]}
            id={optionID}
            label={options[optionID].label}
            onClick={() => {
              if (id === 'productType') {
                this.setState({
                  resellItemInfo: immutable
                    .wrap(this.state.resellItemInfo)
                    .set('product', '')
                    .set(id, optionID)
                    .value(),
                });
              } else {
                this.setState(
                  {
                    resellItemInfo: immutable.set(
                      this.state.resellItemInfo,
                      id,
                      optionID,
                    ),
                  },
                  this.onGetButtonStatus,
                );
              }
            }}
          /> */}
        </div>
      );
    });
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      {
        resellItemInfo: immutable.set(
          this.state.resellItemInfo,
          fieldID,
          value,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  renderDropdown = id => {
    switch (id) {
      case 'selectProduct':
        return this.renderSelectProductDropDown();
      case 'size':
        return this.renderSizeDropDown();
      default:
        return null;
    }
  };

  renderSubmitButton = () => {
    return (
      <Button
        className={Style.submitBtn}
        status={this.state.submitBtnStatus}
        onClick={() => this.onSubmitListing()}
      >
        Submit
      </Button>
    );
  };

  renderSizeDropDown = () => {
    const { productType, product, size } = this.state.resellItemInfo;

    if (!product) {
      return (
        <p style={{ fontSize: '15px', color: 'white' }}>Select product first</p>
      );
    }
    const { size_brand, gender } = product;

    const size_list =
      this.props.sizing[productType][gender][size_brand]['us'] || [];

    const sizeDropDownValues = size_list.map(size => {
      return { value: `${size}`, label: `${size}` };
    });
    return (
      <Select
        options={sizeDropDownValues}
        value={size}
        onChange={this.onSelectSize}
        styles={{
          // Fixes the overlapping problem of the component
          menu: provided => ({
            ...provided,
            zIndex: 9999,
            fontFamily: 'Arial',
            border: '0 !important',
            color: 'black',
            maxWidth: '400px',
            width: '400px',
          }),
        }}
      />
    );
  };

  renderCheckBoxes = options => {
    return Object.keys(options).map(optionID => {
      return (
        <div
          key={optionID}
          style={{ marginBottom: '10px' }}
          className={Style.checkboxContainer}
        >
          <CheckBox
            checked={this.state.resellItemInfo.availability.includes(optionID)}
            id={optionID}
            label={options[optionID].label}
            onClick={this.onSelectAvailability}
            className={Style.availabilityCheckbox}
          />
        </div>
      );
    });
  };

  render() {
    return (
      <div className={Style.pageWrapper}>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h2 className={Style.titleLarge}>Create Listing</h2>
            </div>

            <div className={Style.createListingForm}>
              {RESELL_ITEM_FIELDS.map(this.renderField)}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {this.renderSubmitButton()}
              </div>
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
    sizing: state[SizeDuck.duckName].sizing.data,
  };
};

const x = withRouter(CreateListingPage);

export default connect(mapStateToProps)(x);
