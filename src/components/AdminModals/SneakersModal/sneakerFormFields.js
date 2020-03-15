import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as immutable from 'object-path-immutable';

// Style
import Style from "../style.module.scss";

// Fields
import { Button, RadioButton, TextInput } from 'fields';

const NEW_SNEAKER_FIELDS = [
    {
        fieldKind: "text",
        id: "name",
        label: "Name",
        placeholder: "Eg. Air Jordan 3", 
        required: true
    },
    {
        fieldKind: "text",
        id: "nickName",
        label: "Nick Name",
        placeholder: "Eg. UNC",
        required: false 
    },
    {
        fieldKind: "textarea",
        id: "description",
        label: "Description",
        placeholder: "Enter Sneaker Description",
        required: true
    },
    {
        fieldKind: "text",
        id: "sku",
        label: "Sneaker SKU",
        placeholder: "",
        required: true
    },
    {
        fieldKind: "radio",
        id: "brand",
        label: "Select Brand",
        options: {},
        required: true
    },
    {
        fieldKind: "radio",
        id: "designer",
        label: "Select Designer",
        options: {},
        required: true
    },
    {
        fieldKind: "radio",
        id: "gender",
        label: "Select Gender",
        options: {
            men: { label: "Men" },
            women: { label: "Women" },
            infant: { label: "Infant" }
        }
    }

]

export default class SneakerFormFields extends Component {

    state={
        brands: [],
        designers: [],
        sneakerInfo: {
            name: "",
            nickName: "",
            brand: "",
            designer: "",
            description: "",
            gender: "",
            sku: ""
        },
        submitBtnStatus: "inactive"
    }
    
    componentDidMount() {
        this.setState({ 
            sneakerInfo: this.props.sneakerInfo,
            brands: this.props.brands,
            designers: this.props.designers
    
        }, this.onGetButtonStatus)
    }

    // On action methods

    onGetButtonStatus = () => {
        console.log(this.state);
        (this.state.sneakerInfo.name !== "" && this.state.sneakerInfo.description !== ""
        && this.state.sneakerInfo.sku !== "" && this.state.sneakerInfo.brand !== "" && this.state.sneakerInfo.designer !== "" && this.state.sneakerInfo.gender !== "" ) ? 
        this.setState({ submitBtnStatus:"active" }) : this.setState({ submitBtnStatus: "inactive"});
}
    onChangeTextInputValue = (fieldID, value) => {
        this.setState({ sneakerInfo: immutable.set(this.state.sneakerInfo, fieldID, value) }, this.onGetButtonStatus);
    }

    //  render methods

    renderRadioButtons = (id, options) => {
        console.log(id);
        switch(id) {
            case "brand": 
                console.log("render brand");
                return this.renderBrandRadioButtons(); 
            case "designer":
                return this.renderDesignerRadioButtons();
            default:
                return this.renderDefaultRadioButtons(id, options);
        }
    }

    renderBrandRadioButtons = () => {
        const { brands } = this.state;
        console.log(brands);
        return brands.map(brand => {
            const { slug, name } = brand;
            return (
                <div key={slug} style={{ marginBottom: '10px' }} >
                    <RadioButton 
                        checked={this.state.sneakerInfo["brand"] === slug}
                        id={slug}
                        label={name}
                        onClick={() => this.setState({ sneakerInfo: immutable.set(this.state.sneakerInfo, "brand", slug)}, this.onGetButtonStatus)}
                    />
                </div>
            )
        })
    }

    renderDesignerRadioButtons = () => {
        const { designers } = this.state;
        return designers.map(brand => {
            const { slug, name } = brand;
            return (
                <div key={slug} style={{ marginBottom: '10px' }} >
                    <RadioButton 
                        checked={this.state.sneakerInfo["designer"] === slug}
                        id={slug}
                        label={name}
                        onClick={() => this.setState({ sneakerInfo: immutable.set(this.state.sneakerInfo, "designer", slug)}, this.onGetButtonStatus)}
                    />
                </div>
            )
        })
    }



    renderDefaultRadioButtons = (id, options) => {
        return Object.keys(options).map(optionID => {
            return (
                <div key={optionID} style={{ marginBottom: '10px' }} >
                    <RadioButton
                        checked={optionID === this.state.sneakerInfo[id]}
                        id={optionID}
                        label={options[optionID].label}
                        onClick={() => this.setState({ sneakerInfo: immutable.set(this.state.sneakerInfo, id, optionID )}, this.onGetButtonStatus)}
                    />
                </div>
            )
        })
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
                        value={this.state.sneakerInfo[id] || ""}
                        />
                    </div>
                )
        }
    }

    renderSubmitButton = () => {
        return <Button
            className={Style.saveButton}
            name="Save"
            onClick={() => this.props.onSubmit(this.state.sneakerInfo)}
            status={this.state.submitBtnStatus}
        >
            {this.props.isInEditMode ? "Save" : "Create"}
        </Button>
    }

    render() {
        return (
            <div>
                {NEW_SNEAKER_FIELDS.map(this.renderField)}
                {this.renderSubmitButton()}
            </div>
        )
    }

}

SneakerFormFields.propTypes = {
    isInEditMode: PropTypes.bool,
    sneakerInfo: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    brands: PropTypes.array,
    designers: PropTypes.array
};
  
SneakerFormFields.defaultProps = {
    brands: [],
    designers: [],
    isInEditMode: false,
    sneakerInfo: {
        name: "",
        nickName: "",
        brand: "",
        designer: "",
        description: "",
        gender: "",
        sku: ""
    }
};
