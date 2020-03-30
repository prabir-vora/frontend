import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as immutable from 'object-path-immutable';

// Style
import Style from '../style.module.scss';

// Fields
import { Button, RadioButton, TextInput } from 'fields';
import Select from 'react-select';

// Date Picker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const NEW_APPAREL_FIELDS = [
  {
    fieldKind: 'dropdown',
    id: 'productType',
    label: 'Select Product Type',
    options: {
      hoodies: { label: 'Hoodies' },
      sweatshirts: { label: 'Sweatshirts' },
      shorts: { label: 'Shorts' },
      pants: { label: 'Pants' },
      tshirts: { label: 'T-shirts' },
      sweatpants: { label: 'Sweatpants' },
    },
  },
  {
    fieldKind: 'text',
    id: 'name',
    label: 'Name',
    placeholder: 'Eg. Supreme Box Logo',
    required: true,
  },
  {
    fieldKind: 'text',
    id: 'nickName',
    label: 'Nick Name',
    placeholder: '',
    required: false,
  },
  {
    fieldKind: 'textarea',
    id: 'description',
    label: 'Description',
    placeholder: 'Enter Description',
    required: false,
  },
  {
    fieldKind: 'text',
    id: 'colorway',
    label: 'Colorway',
    placeholder: 'Eg. BLACK/PINE GREEN/ RED',
    required: true,
  },
  {
    fieldKind: 'text',
    id: 'sku',
    label: 'Apparel SKU',
    placeholder: '',
    required: true,
  },
  {
    fieldKind: 'dropdown',
    id: 'brand',
    label: 'Select Brand',
    required: true,
    options: {},
  },
  {
    fieldKind: 'dropdown',
    id: 'designer',
    label: 'Select Designer',
    required: true,
    options: {},
  },
  {
    fieldKind: 'radio',
    id: 'gender',
    label: 'Select Gender',
    options: {
      men: { label: 'Men' },
      women: { label: 'Women' },
      unisex: { label: 'Unisex' },
    },
  },
  {
    fieldKind: 'radio',
    id: 'hasSizing',
    label: 'Does have sizing?',
    options: {
      yes: { label: 'Yes' },
      no: { label: 'No' },
    },
  },
  {
    fieldKind: 'dropdown',
    id: 'size_brand',
    label: 'Select Sizing Brand',
  },
  {
    fieldKind: 'datepicker',
    id: 'releaseDate',
    label: 'Release Date',
  },
];

export default class ApparelFormFields extends Component {
  state = {
    brands: [],
    designers: [],
    apparelInfo: {
      productType: '',
      name: '',
      nickName: '',
      brand: '',
      designer: '',
      description: '',
      gender: '',
      sku: '',
      colorway: '',
      hasSizing: 'no',
      size_brand: '',
      releaseDate: new Date(),
    },
    submitBtnStatus: 'inactive',
  };

  componentDidMount() {
    const releaseDate = this.props.apparelInfo.releaseDate
      ? new Date(this.props.apparelInfo.releaseDate)
      : new Date();

    this.setState(
      {
        apparelInfo: immutable.set(
          this.props.apparelInfo,
          'releaseDate',
          releaseDate,
        ),
        brands: this.props.brands,
        designers: this.props.designers,
        sizing: this.props.sizing,
      },
      this.onGetButtonStatus,
    );
  }

  // On action methods

  onGetButtonStatus = () => {
    console.log(this.state);
    const {
      productType,
      name,
      sku,
      brand,
      designer,
      gender,
      colorway,
      releaseDate,
      size_brand,
    } = this.state.apparelInfo;
    productType !== '' &&
    name !== '' &&
    sku !== '' &&
    brand !== '' &&
    designer !== '' &&
    gender !== '' &&
    colorway !== '' &&
    releaseDate !== '' &&
    size_brand !== ''
      ? this.setState({ submitBtnStatus: 'active' })
      : this.setState({ submitBtnStatus: 'inactive' });
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      { apparelInfo: immutable.set(this.state.apparelInfo, fieldID, value) },
      this.onGetButtonStatus,
    );
  };

  onChangeDatePicker = date => {
    this.setState(
      {
        apparelInfo: immutable.set(this.state.apparelInfo, 'releaseDate', date),
      },
      this.onGetButtonStatus,
    );
  };

  onSelectProductType = selectedOption => {
    this.setState(
      {
        apparelInfo: immutable.set(
          this.state.apparelInfo,
          'productType',
          selectedOption,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onSelectBrand = selectedOption => {
    this.setState(
      {
        apparelInfo: immutable.set(
          this.state.apparelInfo,
          'brand',
          selectedOption,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onSelectDesigner = selectedOption => {
    this.setState(
      {
        apparelInfo: immutable.set(
          this.state.apparelInfo,
          'designer',
          selectedOption,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onSelectSizeBrand = selectedOption => {
    this.setState(
      {
        apparelInfo: immutable.set(
          this.state.apparelInfo,
          'size_brand',
          selectedOption,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  //  render methods

  renderRadioButtons = (id, options) => {
    console.log(id);
    switch (id) {
      default:
        return this.renderDefaultRadioButtons(id, options);
    }
  };

  renderDefaultRadioButtons = (id, options) => {
    return Object.keys(options).map(optionID => {
      return (
        <div key={optionID} style={{ marginBottom: '10px' }}>
          <RadioButton
            checked={optionID === this.state.apparelInfo[id]}
            id={optionID}
            label={options[optionID].label}
            onClick={() =>
              this.setState(
                {
                  apparelInfo: immutable.set(
                    this.state.apparelInfo,
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

  renderDropdown = (id, options = {}) => {
    switch (id) {
      case 'productType':
        return this.renderProductTypeDropDown(options);
      case 'brand':
        return this.renderBrandsDropDown();
      case 'designer':
        return this.renderDesignersDropDown();
      case 'size_brand':
        return this.renderSizeBrandDropDown();
      default:
        return null;
    }
  };

  renderProductTypeDropDown = options => {
    console.log(options);
    const { apparelInfo } = this.state;
    const { productType } = apparelInfo;
    const productTypes = [];
    Object.keys(options).forEach(option => {
      productTypes.push({ value: option, label: options[option].label });
    });
    console.log(productTypes);
    return (
      <Select
        options={productTypes}
        value={productType}
        onChange={this.onSelectProductType}
      />
    );
  };

  renderBrandsDropDown = () => {
    const { brands, apparelInfo } = this.state;
    const { brand } = apparelInfo;
    const brandsList = brands.map(brand => {
      return { value: brand.id, label: brand.name };
    });
    return (
      <Select
        options={brandsList}
        value={brand}
        onChange={this.onSelectBrand}
      />
    );
  };

  renderDesignersDropDown = () => {
    const { designers, apparelInfo } = this.state;
    const { designer } = apparelInfo;
    const designersList = designers.map(designer => {
      return { value: designer.id, label: designer.name };
    });
    return (
      <Select
        options={designersList}
        value={designer}
        onChange={this.onSelectDesigner}
      />
    );
  };

  renderSizeBrandDropDown = () => {
    const { sizing, apparelInfo } = this.state;
    const { size_brand, gender, hasSizing } = apparelInfo;
    if (gender === '') {
      return <div>Select Gender first</div>;
    }

    if (hasSizing === 'no') {
      return <div>Product Sizing turned off</div>;
    }
    var value = '';
    if (size_brand !== '') {
      value = size_brand;
    }
    const apparelSizingList = sizing['apparel'];
    const genderBasedList = apparelSizingList[gender];

    const sizeBrandsList = Object.keys(genderBasedList).map(size_brand => {
      return { value: size_brand, label: size_brand };
    });
    return (
      <Select
        options={sizeBrandsList}
        value={value}
        onChange={this.onSelectSizeBrand}
      />
    );
  };

  renderField = (field = {}) => {
    const { fieldKind, id, options = {} } = field;
    switch (fieldKind) {
      case 'radio':
        return (
          <div key={id}>
            <div>
              <h2>{field.label}</h2>
              {this.renderRadioButtons(id, options)}
            </div>
          </div>
        );
      case 'text':
      case 'textarea':
        return (
          <div key={id} style={{ marginBottom: '20px' }}>
            <TextInput
              {...field}
              hasMultipleLines={fieldKind === 'textarea' ? true : false}
              name={id}
              onChange={value => this.onChangeTextInputValue(id, value)}
              value={this.state.apparelInfo[id] || ''}
            />
          </div>
        );
      case 'dropdown':
        return (
          <div key={id} style={{ marginBottom: '20px' }}>
            <h2>{field.label}</h2>
            {this.renderDropdown(id, options)}
          </div>
        );
      case 'datepicker':
        return (
          <div key={id} style={{ marginBottom: '20px' }}>
            <h2>{field.label}</h2>
            <DatePicker
              selected={this.state.apparelInfo[id] || ''}
              onChange={this.onChangeDatePicker}
            />
          </div>
        );
      default:
        return null;
    }
  };

  renderSubmitButton = () => {
    return (
      <Button
        className={Style.saveButton}
        name="Save"
        onClick={() => this.props.onSubmit(this.state.apparelInfo)}
        status={this.state.submitBtnStatus}
      >
        {this.props.isInEditMode ? 'Save' : 'Create'}
      </Button>
    );
  };

  render() {
    return (
      <div>
        {NEW_APPAREL_FIELDS.map(this.renderField)}
        {this.renderSubmitButton()}
      </div>
    );
  }
}

ApparelFormFields.propTypes = {
  isInEditMode: PropTypes.bool,
  apparelInfo: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  brands: PropTypes.array,
  designers: PropTypes.array,
};

ApparelFormFields.defaultProps = {
  brands: [],
  designers: [],
  isInEditMode: false,
  apparelInfo: {
    productType: '',
    name: '',
    nickName: '',
    brand: '',
    designer: '',
    description: '',
    colorway: '',
    gender: '',
    sku: '',
    hasSizing: 'no',
    releaseDate: '',
  },
};
