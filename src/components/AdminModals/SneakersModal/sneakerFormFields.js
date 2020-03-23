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

const NEW_SNEAKER_FIELDS = [
  {
    fieldKind: 'text',
    id: 'name',
    label: 'Name',
    placeholder: 'Eg. Air Jordan 3',
    required: true,
  },
  {
    fieldKind: 'text',
    id: 'nickName',
    label: 'Nick Name',
    placeholder: 'Eg. UNC',
    required: false,
  },
  {
    fieldKind: 'textarea',
    id: 'description',
    label: 'Description',
    placeholder: 'Enter Sneaker Description',
    required: true,
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
    label: 'Sneaker SKU',
    placeholder: '',
    required: true,
  },
  {
    fieldKind: 'dropdown',
    id: 'brand',
    label: 'Select Brand',
    required: true,
  },
  {
    fieldKind: 'dropdown',
    id: 'designer',
    label: 'Select Designer',
    required: true,
  },
  {
    fieldKind: 'radio',
    id: 'gender',
    label: 'Select Gender',
    options: {
      men: { label: 'Men' },
      women: { label: 'Women' },
      infant: { label: 'Infant' },
    },
  },
  {
    fieldKind: 'datepicker',
    id: 'releaseDate',
    label: 'Release Date',
  },
];

export default class SneakerFormFields extends Component {
  state = {
    brands: [],
    designers: [],
    sneakerInfo: {
      name: '',
      nickName: '',
      brand: '',
      designer: '',
      description: '',
      gender: '',
      sku: '',
      colorway: '',
      releaseDate: new Date(),
    },
    submitBtnStatus: 'inactive',
  };

  componentDidMount() {
    const releaseDate = this.props.sneakerInfo.releaseDate
      ? new Date(this.props.sneakerInfo.releaseDate)
      : new Date();

    this.setState(
      {
        sneakerInfo: immutable.set(
          this.props.sneakerInfo,
          'releaseDate',
          releaseDate,
        ),
        brands: this.props.brands,
        designers: this.props.designers,
      },
      this.onGetButtonStatus,
    );
  }

  // On action methods

  onGetButtonStatus = () => {
    console.log(this.state);
    const {
      name,
      sku,
      brand,
      designer,
      gender,
      colorway,
      releaseDate,
    } = this.state.sneakerInfo;

    name !== '' &&
    sku !== '' &&
    brand !== '' &&
    designer !== '' &&
    gender !== '' &&
    colorway !== '' &&
    releaseDate !== ''
      ? this.setState({ submitBtnStatus: 'active' })
      : this.setState({ submitBtnStatus: 'inactive' });
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      { sneakerInfo: immutable.set(this.state.sneakerInfo, fieldID, value) },
      this.onGetButtonStatus,
    );
  };

  onChangeDatePicker = date => {
    this.setState(
      {
        sneakerInfo: immutable.set(this.state.sneakerInfo, 'releaseDate', date),
      },
      this.onGetButtonStatus,
    );
  };

  onSelectBrand = selectedOption => {
    this.setState(
      {
        sneakerInfo: immutable.set(
          this.state.sneakerInfo,
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
        sneakerInfo: immutable.set(
          this.state.sneakerInfo,
          'designer',
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
            checked={optionID === this.state.sneakerInfo[id]}
            id={optionID}
            label={options[optionID].label}
            onClick={() =>
              this.setState(
                {
                  sneakerInfo: immutable.set(
                    this.state.sneakerInfo,
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

  renderDropdown = id => {
    switch (id) {
      case 'brand':
        return this.renderBrandsDropDown();
      case 'designer':
        return this.renderDesignersDropDown();
      default:
        return null;
    }
  };

  renderBrandsDropDown = () => {
    const { brands, sneakerInfo } = this.state;
    const { brand } = sneakerInfo;
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
    const { designers, sneakerInfo } = this.state;
    const { designer } = sneakerInfo;
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
              value={this.state.sneakerInfo[id] || ''}
            />
          </div>
        );
      case 'dropdown':
        return (
          <div key={id}>
            <h2>{field.label}</h2>
            {this.renderDropdown(id)}
          </div>
        );
      case 'datepicker':
        return (
          <div key={id} style={{ marginBottom: '20px' }}>
            <h2>{field.label}</h2>
            <DatePicker
              selected={this.state.sneakerInfo[id]}
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
        onClick={() => this.props.onSubmit(this.state.sneakerInfo)}
        status={this.state.submitBtnStatus}
      >
        {this.props.isInEditMode ? 'Save' : 'Create'}
      </Button>
    );
  };

  render() {
    return (
      <div>
        {NEW_SNEAKER_FIELDS.map(this.renderField)}
        {this.renderSubmitButton()}
      </div>
    );
  }
}

SneakerFormFields.propTypes = {
  isInEditMode: PropTypes.bool,
  sneakerInfo: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  brands: PropTypes.array,
  designers: PropTypes.array,
};

SneakerFormFields.defaultProps = {
  brands: [],
  designers: [],
  isInEditMode: false,
  sneakerInfo: {
    name: '',
    nickName: '',
    brand: '',
    designer: '',
    description: '',
    colorway: '',
    gender: '',
    sku: '',
    releaseDate: '',
  },
};
