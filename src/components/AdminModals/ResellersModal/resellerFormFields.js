import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as immutable from 'object-path-immutable';

// Style
import Style from "../style.module.scss";

// Fields
import { Button, RadioButton, TextInput } from 'fields';

const NEW_RESELLER_FIELDS = [
    {
        fieldKind: "text",
        id: "name",
        label: "Name",
        placeholder: "John Doe", 
        required: true
    },
    {
        fieldKind: "radio",
        id: "shipping",
        label: "Do you ship?",
        options: {
            yes: {label: "Yes"},
            no: {label: "No"}
        }
    },
    {
        fieldKind: "text",
        id: "lat",
        label: "Latitude",
        placeholder: "",
        required: true
    },
    {
        fieldKind: "text",
        id: "lng",
        label: "Longitude",
        placeholder: "",
        required: true
    },
    {
        fieldKind: "radio",
        id: "verified",
        label: "Verified",
        options: {
            yes: {label: "Yes"},
            no: {label: "No"}
        }
    },
]

export default class ResellerFormFields extends Component {

    state={
        resellerInfo: {
            name: "",
            lat: "",
            lng: "",
            shipping: "no",
            verified: "no",
        },
        submitBtnStatus: "inactive"
    }
    
    componentDidMount() {
        if (this.props.resellerInfo._geoloc !== undefined) {
            const { _geoloc } = this.props.resellerInfo;
            const { lat, lng } = _geoloc;
            const resellerInfo = immutable.wrap(this.props.resellerInfo).set('lat', `${lat}`).set("lng", `${lng}`).del("_geoloc").value();
            this.setState({ resellerInfo }, this.onGetButtonStatus)
        } else {
            this.setState({ resellerInfo: this.props.resellerInfo })
        }
        
    }

    // On action methods
    onChangeTextInputValue = (fieldID, value) => {
        this.setState({ resellerInfo: immutable.set(this.state.resellerInfo, fieldID, value) }, this.onGetButtonStatus);
    }


    onGetButtonStatus = () => {
        console.log(this.state);
        const { name, lat, lng, shipping, verified } = this.state.resellerInfo;

        (name !== "" && lat !== "" && lng !== "" && shipping !== "" && verified !== "" ) ?
        this.setState({ submitBtnStatus:"active" }) : this.setState({ submitBtnStatus: "inactive"});
    }


    //  render methods
    renderRadioButtons = (id, options) => {
        console.log(id);
        switch(id) {
            default:
                return this.renderDefaultRadioButtons(id, options);
        }
    }

    renderDefaultRadioButtons = (id, options) => {
        return Object.keys(options).map(optionID => {
            return (
                <div key={optionID} style={{ marginBottom: '10px' }} >
                    <RadioButton
                        checked={optionID === this.state.resellerInfo[id]}
                        id={optionID}
                        label={options[optionID].label}
                        onClick={() => this.setState({ resellerInfo: immutable.set(this.state.resellerInfo, id, optionID )}, this.onGetButtonStatus)}
                    />
                </div>
            )
        })
    }

    renderSubmitButton = () => {
        return <Button
            className={Style.saveButton}
            name="Save"
            onClick={() => this.props.onSubmit(this.state.resellerInfo)}
            status={this.state.submitBtnStatus}
        >
            {this.props.isInEditMode ? "Save" : "Create"}
        </Button>
    }

    renderField = (field = {}) => {
        const { fieldKind, id, options = {} } = field;
        switch(fieldKind) {
            case "radio": 
                return (<div key={id}>
                    <div>
                        <h2>{field.label}</h2>
                        {this.renderRadioButtons(id, options)}
                    </div>
                    
                </div>)
            case "text":
            case "textarea":
                return (
                    <div key={id} style={{ marginBottom: "20px" }}>
                        <TextInput
                        {...field}
                        hasMultipleLines={fieldKind === "textarea" ? true : false}
                        name={id}
                        onChange={value => this.onChangeTextInputValue(id, value)}
                        value={this.state.resellerInfo[id] || ""}
                        />
                    </div>
                )
            default: 
                    return null;
        }
    }

    render() {
        return (
            <div>
                {NEW_RESELLER_FIELDS.map(this.renderField)}
                {this.renderSubmitButton()}
            </div>
        )
    }

}

ResellerFormFields.propTypes = {
    isInEditMode: PropTypes.bool,
    resellerInfo: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
  };
  
ResellerFormFields.defaultProps = {
    isInEditMode: false,
    resellerInfo: {
        name: "",
        lat: "",
        lng: "",
        shipping: "no",
        verified: "no",
    }
};
