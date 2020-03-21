import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as immutable from 'object-path-immutable';

// Style
import Style from "../style.module.scss";

// Fields
import { Button, RadioButton, TextInput } from 'fields';

import Select from 'react-select';

const RESELL_ITEM_FIELDS = [
    {
        fieldKind: "radio",
        id: "productType",
        label: "Select Product Type",
        options: {
            sneakers: { label: "Sneakers" },
            apparel: { label: "Apparel" }
        },
        placeholder: "", 
    },
    {
        fieldKind: "dropdown",
        id: "selectProduct",
        label: "Select Product",
    },
    {
        fieldKind: "radio",
        id: "productCondition",
        label: "Select Product Condition",
        options: {
            new: { label: "New- Deadstock" },
            new_defects: {label: "New- with Defects"},
            used_good: { label: "Used- Good"},
            used_defects: { label: "Used- Defects"}
        },
        placeholder: "",
    },
    {
        fieldKind: "text",
        id: "askingPrice",
        label: "Asking Price $",
        placeholder: "",
        required: true
    },
    {
        fieldKind: "dropdown",
        id: "resellers",
        label: "Select Reseller",
    },
]

export default class  ResellItemsFormFields extends Component {

    state = {
        resellItemInfo: {
            productType: "sneakers",
            selectedProduct: "",
            productCondition: "new",
            askingPrice: "",
            createdBy: "",
        },
        submitBtnStatus: "inactive",
    }

    onChangeTextInputValue = (fieldID, value) => {
        this.setState({ resellItemInfo: immutable.set(this.state.resellItemInfo, fieldID, value) }, this.onGetButtonStatus);
    }

    onGetButtonStatus = () => {
        console.log(this.state);
        const { productType, askingPrice, selectedProduct, productCondition, createdBy  } = this.state.resellItemInfo;

        (productType !== "" && askingPrice !== "" && selectedProduct !== "" && productCondition !== "" && createdBy !== "" ) ?
        this.setState({ submitBtnStatus:"active" }) : this.setState({ submitBtnStatus: "inactive"});
    }

    onSelectProduct = (selectedOption) => {
        this.setState({
            resellItemInfo: immutable.set(this.state.resellItemInfo, 'selectedProduct', selectedOption)
        }, this.onGetButtonStatus)
    }

    onSelectReseller = (selectedOption) => {
        this.setState({
            resellItemInfo: immutable.set(this.state.resellItemInfo, 'createdBy', selectedOption)
        }, this.onGetButtonStatus)
    }

    renderField = (field = {}) => {
        const { fieldKind, id, options = {} } = field;
        switch(fieldKind) {
            case "radio": 
                return (<div key={id}>
                    <div>
                        <h4>{field.label}</h4>
                        {this.renderRadioButtons(id, options)}
                    </div>
                    
                </div>)
            case "text":
            case "textarea":
                return (
                    <div key={id} style={{ marginBottom: "20px", marginTop: "20px" }}>
                        <TextInput
                        {...field}
                        hasMultipleLines={fieldKind === "textarea" ? true : false}
                        name={id}
                        onChange={value => this.onChangeTextInputValue(id, value)}
                        value={this.state.resellItemInfo[id] || ""}
                        />
                    </div>
                )
            case "dropdown": 
                return (
                    <div key={id}>
                        <h4>{field.label}</h4>
                        {this.renderDropdown(id)}
                    </div>
                )
            default: 
                return null;
        }
    }

    renderRadioButtons = (id, options) => {
        switch(id) {
            default:
                return this.renderDefaultRadioButtons(id, options);
        }
    }

    renderDropdown = (id) => {
        switch(id) {
            case "selectProduct": 
                return this.renderSelectProductDropDown();
            case "resellers":
                return this.renderResellersDropDown()
            default: 
                return null;
        }
    }

    renderSelectProductDropDown = () => {
        const { productType, selectedProduct } = this.state.resellItemInfo;
        const productList = this.props[productType].map(product => {
            return { value: product.id, label: product.name }
        })
        return <Select
            options={productList}
            value={selectedProduct}
            onChange={this.onSelectProduct}
        />
    }

    renderResellersDropDown = () => {
        const {  createdBy } = this.state.resellItemInfo;
        const resellersList = this.props.resellers.map(reseller => {
            return { value: reseller.id, label: reseller.name }
        })
        return <Select
            options={resellersList}
            value={createdBy}
            onChange={this.onSelectReseller}
        />
    }

    renderDefaultRadioButtons = (id, options) => {
        return Object.keys(options).map(optionID => {
            return (
                <div key={optionID} style={{ marginBottom: '10px' }} >
                    <RadioButton
                        checked={optionID === this.state.resellItemInfo[id]}
                        id={optionID}
                        label={options[optionID].label}
                        onClick={() => this.setState({ resellItemInfo: immutable.set(this.state.resellItemInfo, id, optionID )}, this.onGetButtonStatus)}
                    />
                </div>
            )
        })
    }

    renderSubmitButton = () => {
        return <Button
            className={Style.saveButton}
            name="Save"
            onClick={() => this.props.onSubmit(this.state.resellItemInfo)}
            status={this.state.submitBtnStatus}
        >
            {this.props.isInEditMode ? "Save" : "Create"}
        </Button>
    }
    
    render() {
        return <div>
            {RESELL_ITEM_FIELDS.map(this.renderField)}
            {this.renderSubmitButton()}
        </div>
    }

}

ResellItemsFormFields.propTypes = {
    isInEditMode: PropTypes.bool,
    resellItemInfo: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
  };
  