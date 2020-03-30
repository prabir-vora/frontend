import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as immutable from 'object-path-immutable';

// Style
import Style from '../style.module.scss';

// Fields
import { Button, CheckBox, RadioButton, TextInput } from 'fields';

import Select from 'react-select';

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
    fieldKind: 'dropdown',
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
    label: 'Asking Price $',
    placeholder: '',
    required: true,
  },
  {
    fieldKind: 'dropdown',
    id: 'size',
    label: 'Select size',
  },
  {
    fieldKind: 'dropdown',
    id: 'resellers',
    label: 'Select Reseller',
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
];

export default class ResellItemsFormFields extends Component {
  state = {
    resellItemInfo: {
      productType: 'sneakers',
      product: '',
      condition: 'new',
      askingPrice: '',
      reseller: '',
      size: '',
      availability: [],
    },
    submitBtnStatus: 'inactive',
  };

  componentDidMount() {
    if (this.props.isInEditMode) {
      this.setState(
        {
          resellItemInfo: this.props.resellItemInfo,
        },
        this.onGetButtonStatus,
      );
    }
  }

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

  onGetButtonStatus = () => {
    console.log(this.state);
    const {
      productType,
      askingPrice,
      product,
      condition,
      reseller,
      size,
    } = this.state.resellItemInfo;

    productType !== '' &&
    askingPrice !== '' &&
    product !== '' &&
    condition !== '' &&
    reseller !== '' &&
    size !== ''
      ? this.setState({ submitBtnStatus: 'active' })
      : this.setState({ submitBtnStatus: 'inactive' });
  };

  onSelectProduct = selectedOption => {
    this.setState(
      {
        resellItemInfo: immutable.set(
          this.state.resellItemInfo,
          'product',
          selectedOption,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onSelectSize = selectedOption => {
    this.setState({
      resellItemInfo: immutable.set(
        this.state.resellItemInfo,
        'size',
        selectedOption,
      ),
    });
  };

  onSelectReseller = selectedOption => {
    this.setState(
      {
        resellItemInfo: immutable.set(
          this.state.resellItemInfo,
          'reseller',
          selectedOption,
        ),
      },
      this.onGetButtonStatus,
    );
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
      case 'radio':
        return (
          <div key={id}>
            <div>
              <h4>{field.label}</h4>
              {this.renderRadioButtons(id, options)}
            </div>
          </div>
        );
      case 'text':
      case 'textarea':
        return (
          <div key={id} style={{ marginBottom: '20px', marginTop: '20px' }}>
            <TextInput
              {...field}
              hasMultipleLines={fieldKind === 'textarea' ? true : false}
              name={id}
              onChange={value => this.onChangeTextInputValue(id, value)}
              value={this.state.resellItemInfo[id] || ''}
            />
          </div>
        );
      case 'dropdown':
        return (
          <div key={id}>
            <h4>{field.label}</h4>
            {this.renderDropdown(id)}
          </div>
        );
      case 'checkboxes':
        return (
          <div key={id}>
            <h2>{field.label}</h2>
            {this.renderCheckBoxes(options)}
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

  renderDropdown = id => {
    switch (id) {
      case 'selectProduct':
        return this.renderSelectProductDropDown();
      case 'resellers':
        return this.renderResellersDropDown();
      case 'size':
        return this.renderSizeDropDown();
      default:
        return null;
    }
  };

  renderSelectProductDropDown = () => {
    const { productType, product } = this.state.resellItemInfo;
    const productList = this.props[productType].map(product => {
      return { value: product.id, label: product.name };
    });
    return (
      <Select
        options={productList}
        value={product}
        onChange={this.onSelectProduct}
      />
    );
  };

  renderSizeDropDown = () => {
    const { productType, product, size } = this.state.resellItemInfo;

    if (product === '') {
      return <div> Select Product first </div>;
    }
    const filteredProduct = this.props[productType].filter(
      item => item.id === product.value,
    );

    const selectedProduct = filteredProduct[0];

    console.log(selectedProduct);

    const { size_brand, gender } = selectedProduct;

    const size_list = this.props.sizing[productType][gender][size_brand.value][
      'us'
    ];

    console.log(size_list);

    const sizeDropDownValues = size_list.map(size => {
      return { value: `${size}`, label: `${size}` };
    });

    console.log(sizeDropDownValues);

    return (
      <Select
        options={sizeDropDownValues}
        value={size}
        onChange={this.onSelectSize}
      />
    );
  };

  renderResellersDropDown = () => {
    const { reseller } = this.state.resellItemInfo;
    const resellersList = this.props.resellers.map(reseller => {
      return { value: reseller.id, label: reseller.name };
    });
    return (
      <Select
        options={resellersList}
        value={reseller}
        onChange={this.onSelectReseller}
      />
    );
  };

  renderCheckBoxes = options => {
    return Object.keys(options).map(optionID => {
      return (
        <div key={optionID} className={Style.checkboxContainer}>
          <CheckBox
            checked={this.state.resellItemInfo.availability.includes(optionID)}
            id={optionID}
            label={options[optionID].label}
            onClick={this.onSelectAvailability}
          />
        </div>
      );
    });
  };

  renderDefaultRadioButtons = (id, options) => {
    return Object.keys(options).map(optionID => {
      return (
        <div key={optionID} style={{ marginBottom: '10px' }}>
          <RadioButton
            checked={optionID === this.state.resellItemInfo[id]}
            id={optionID}
            label={options[optionID].label}
            onClick={() =>
              this.setState(
                {
                  resellItemInfo: immutable.set(
                    this.state.resellItemInfo,
                    id,
                    optionID,
                  ),
                },
                this.onGetButtonStatus,
              )
            }
          />
        </div>
      );
    });
  };

  renderSubmitButton = () => {
    return (
      <Button
        className={Style.saveButton}
        name="Save"
        onClick={() => this.props.onSubmit(this.state.resellItemInfo)}
        status={this.state.submitBtnStatus}
      >
        {this.props.isInEditMode ? 'Save' : 'Create'}
      </Button>
    );
  };

  render() {
    return (
      <div>
        {RESELL_ITEM_FIELDS.map(this.renderField)}
        {this.renderSubmitButton()}
      </div>
    );
  }
}

ResellItemsFormFields.propTypes = {
  isInEditMode: PropTypes.bool,
  resellItemInfo: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
