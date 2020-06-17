import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as immutable from 'object-path-immutable';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { connect } from 'react-redux';
import SizeDuck from 'stores/ducks/Size.duck';
import UserDuck from 'stores/ducks/User.duck';
import SellDuck from 'stores/ducks/Sell.duck';

import isEqual from 'lodash.isequal';

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

// import Autocomplete from './components/Autocomplete';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import { ShowConfirmNotif } from 'functions';
import MainFooter from 'components/MainFooter';
import { LoadingScreen } from 'components';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

const RESELL_ITEM_FIELDS = [
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
    fieldKind: 'textarea',
    id: 'conditionDetails',
    label: 'Additional Condition Details',
    placeholder:
      'List down specific condition details including marks, tears, discoloration, box condition, etc.',
    required: true,
    type: 'text',
  },
  {
    fieldKind: 'text',
    id: 'askingPrice',
    label: 'Asking Price $ (USD)',
    placeholder: '',
    required: true,
    type: 'number',
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

class ListingPage extends Component {
  confirmNotif = null;

  state = {
    resellItemInfo: null,
    submitBtnStatus: 'inactive',
    query: '',
    error: '',
  };

  async componentDidMount() {
    const { listingID } = this.props.match.params;
    console.log(listingID);

    const { actionCreators } = SellDuck;
    const { getListing } = actionCreators;
    const res = await this.props.dispatch(getListing(listingID));
    console.log(res);
    console.log('Success');
    if (res.success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: 'success',
      // });
      if (this.props.listing !== null && this.props.listing !== undefined) {
        console.log(this.props.listing);
        const { currentSlug, listingsMap } = this.props.listing;
        const resellItem = listingsMap[currentSlug];
        console.log(resellItem);

        const {
          id,
          condition,
          conditionDetails,
          askingPrice,
          product,
          size,
          availability,
          images,
          sold,
        } = resellItem;

        if (sold) {
          return this.setState({
            error: 'cannot edit sold listing',
            resellItemInfo: null,
          });
        }
        this.setState(
          {
            resellItemInfo: immutable
              .wrap({})
              .set('id', id)
              .set('condition', condition)
              .set('conditionDetails', conditionDetails)
              .set('askingPrice', askingPrice)
              .set('size', {
                label: size,
                value: size,
              })
              .set('product', product)
              .set('availability', availability)
              .set('images', images)
              .value(),
          },
          this.onGetButtonStatus,
        );
        // console.log(this.props.listing);
      }
    } else {
      this.setState({
        error: 'No listing found',
        resellItemInfo: null,
      });
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.listing !== this.props.listing) {
  //     console.log(this.props.listing);
  //   }
  // }

  onUploadResellItemImages = imageURLs => {
    // console.log(imageURLs);
    this.setState(
      {
        resellItemInfo: immutable.set(
          this.state.resellItemInfo,
          'images',
          imageURLs,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onGetButtonStatus = () => {
    console.log(this.state);
    const {
      askingPrice,
      condition,
      size,
      availability,
      conditionDetails,
      images,
    } = this.state.resellItemInfo;

    const { currentSlug, listingsMap } = this.props.listing;
    const data = listingsMap[currentSlug];
    console.log(this.state.resellItemInfo);
    console.log(data);

    const conditionBased =
      (condition !== 'new' && conditionDetails !== '' && images.length !== 0) ||
      condition === 'new';

    const difference =
      askingPrice !== data.askingPrice ||
      condition !== data.condition ||
      size.value !== data.size ||
      !isEqual(availability.sort(), data.availability.sort()) ||
      !isEqual(images.sort(), data.images.sort());

    console.log('difference', difference);

    console.log('condition based', conditionBased);
    askingPrice !== '' &&
    condition !== '' &&
    size !== '' &&
    availability.length !== 0 &&
    conditionBased &&
    difference
      ? this.setState({ submitBtnStatus: 'active' })
      : this.setState({ submitBtnStatus: 'inactive' });
  };

  onSubmitListing = async () => {
    const reseller = this.props.user;
    const { resellItemInfo } = this.state;
    const { submitEditListingInfo, showModal } = SellDuck.actionCreators;
    await this.props.dispatch(submitEditListingInfo(resellItemInfo));
    await this.props.dispatch(showModal('confirmEditListing'));
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
          <div style={{ width: '100%', display: 'flex' }}>
            <Img
              src={this.state.resellItemInfo.product.original_image_url}
              className={Style.selectedItemImage}
            />
            <div className={Style.selectedItemTitle}>
              {this.state.resellItemInfo.product.name}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  margin: '20px 0px',
                }}
              >
                <p>{this.state.resellItemInfo.product.brand.name}</p>
                <p>{this.state.resellItemInfo.product.colorway}</p>
              </div>
            </div>
          </div>
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
        return (
          <div key={id} className={Style.formFieldContainer}>
            <h4 className={Style.formFieldTitle}>{field.label}</h4>
            <TextInput
              {...field}
              label=""
              hasMultipleLines={false}
              name={id}
              onChange={value => this.onChangeTextInputValue(id, value)}
              value={this.state.resellItemInfo[id] || ''}
              type={field.type}
            />
          </div>
        );
      case 'textarea':
        if (this.state.resellItemInfo['condition'] === 'new') {
          return null;
        }
        return (
          <div key={id} className={Style.formFieldContainer}>
            <h4 className={Style.formFieldTitle}>{field.label}</h4>
            <TextInput
              {...field}
              label=""
              hasMultipleLines={true}
              name={id}
              onChange={value => this.onChangeTextInputValue(id, value)}
              value={this.state.resellItemInfo[id] || ''}
              type={field.type}
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
            <h4 className={Style.formFieldTitle}>
              {field.label}{' '}
              {this.state.resellItemInfo['condition'] !== 'new' && '(required)'}
            </h4>
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
    const { product, size } = this.state.resellItemInfo;

    const { productCategory, gender, size_brand } = product;

    if (!product) {
      return (
        <p style={{ fontSize: '15px', color: 'white' }}>Select product first</p>
      );
    }
    const size_list =
      this.props.sizing[productCategory][gender][size_brand]['us'] || [];

    const sizeDropDownValues = size_list.map(size => {
      return { value: `${size}`, label: `${size}` };
    });
    return (
      <div className={Style.dropdownSizeMenu}>
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
            }),
          }}
        />
      </div>
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
    console.log(this.props);
    const { currentSlug, listingsMap } = this.props.listing;
    const data = listingsMap[currentSlug];

    if (this.state.error) {
      return (
        <div
          style={{
            background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
          }}
        >
          <MainNavBar />
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              minHeight: '100vh',
              padding: '5% 0',
              height: '100%',
            }}
          >
            <h1 className={Style.noResultsTitle}>Sorry, {this.state.error}</h1>
            <a style={{ textDecoration: 'underline' }} href="/user/listings">
              Go back
            </a>
          </div>

          <MainFooter />
        </div>
      );
    }

    if (this.state.resellItemInfo === null || this.props.sizing === undefined) {
      return <LoadingScreen />;
    }

    console.log(this.state);

    return (
      <div className={Style.pageWrapper}>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h2 className={Style.titleLarge}>Edit Listing</h2>
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
    listing: state[SellDuck.duckName],
    sizing: state[SizeDuck.duckName].sizing.data,
  };
};

const x = withRouter(ListingPage);

export default connect(mapStateToProps)(x);
