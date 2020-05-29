import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as immutable from 'object-path-immutable';

// Style
import Style from '../style.module.scss';

// Fields
import { Button, RadioButton, LocationSearchInput, TextInput } from 'fields';

const NEW_RESELLER_FIELDS = [
  {
    fieldKind: 'text',
    id: 'name',
    label: 'Name',
    placeholder: 'John Doe',
    required: true,
  },

  // {
  //     fieldKind: "text",
  //     id: "lat",
  //     label: "Latitude",
  //     placeholder: "",
  //     required: true
  // },
  // {
  //     fieldKind: "text",
  //     id: "lng",
  //     label: "Longitude",
  //     placeholder: "",
  //     required: true
  // },

  {
    fieldKind: 'radio',
    id: 'verified',
    label: 'Verified',
    options: {
      yes: { label: 'Yes' },
      no: { label: 'No' },
    },
  },
];

export default class ResellerFormFields extends Component {
  state = {
    user: {},
    submitBtnStatus: 'inactive',
  };

  componentDidMount() {
    this.setState({ user: this.props.user }, this.onGetButtonStatus);
  }

  // On action methods
  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      { user: immutable.set(this.state.user, fieldID, value) },
      this.onGetButtonStatus,
    );
  };

  onGetButtonStatus = () => {};

  //  render methods
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
          <RadioButton
            checked={optionID === this.state.user[id]}
            id={optionID}
            label={options[optionID].label}
            onClick={() =>
              this.setState(
                {
                  user: immutable.set(this.state.user, id, optionID),
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
        onClick={() => this.props.onSubmit(this.state.user)}
        status={this.state.submitBtnStatus}
      >
        {this.props.isInEditMode ? 'Save' : 'Create'}
      </Button>
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
              value={this.state.user[id] || ''}
            />
          </div>
        );
      case 'locationSearchInput':
        console.log(this.state);
        return (
          <div key={id}>
            <h2>Address</h2>
            <LocationSearchInput
              address={this.state.user.address}
              latitude={this.state.user.lat}
              longitude={this.state.user.lng}
              onSelectLocation={this.onSelectLocation}
            />
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <div>
        {NEW_RESELLER_FIELDS.map(this.renderField)}
        {this.renderSubmitButton()}
      </div>
    );
  }
}

ResellerFormFields.propTypes = {
  isInEditMode: PropTypes.bool,
  user: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

ResellerFormFields.defaultProps = {
  isInEditMode: false,
  user: {
    name: '',
    address: '',
    lat: '',
    lng: '',
    shipping: 'no',
    verified: 'no',
  },
};
