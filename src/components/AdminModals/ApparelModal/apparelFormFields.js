import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as immutable from 'object-path-immutable';

// Style
import Style from "../style.module.scss";

// Fields
import { Button, RadioButton, TextInput } from 'fields';

// Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NEW_APPAREL_FIELDS = [
    {
        fieldKind: "text",
        id: "name",
        label: "Name",
        placeholder: "Eg. Supreme Box Logo", 
        required: true
    },
    {
        fieldKind: "text",
        id: "nickName",
        label: "Nick Name",
        placeholder: "",
        required: false 
    },
    {
        fieldKind: "textarea",
        id: "description",
        label: "Description",
        placeholder: "Enter Description",
        required: false
    },
    {
        fieldKind: "text",
        id: "colorway",
        label: "Colorway",
        placeholder: "Eg. BLACK/PINE GREEN/ RED",
        required: true
    },
    {
        fieldKind: "text",
        id: "sku",
        label: "Apparel SKU",
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
            unisex: { label: "Unisex" }
        }
    },
    {
        fieldKind: "radio",
        id: "hasSizing",
        label: "Does have sizing?",
        options: {
            yes: { label: "Yes" },
            no: { label: "No" },
        }
    },
    {
        fieldKind: "datepicker",
        id: "releaseDate",
        label: "Release Date",
    }
]

export default class ApparelFormFields extends Component {

    state={
        brands: [],
        designers: [],
        apparelInfo: {
            name: "",
            nickName: "",
            brand: "",
            designer: "",
            description: "",
            gender: "",
            sku: "",
            colorway: "",
            hasSizing: "no",
            releaseDate: new Date()
        },
        submitBtnStatus: "inactive"
    }

    componentDidMount() {

        const releaseDate = this.props.apparelInfo.releaseDate ? new Date(this.props.apparelInfo.releaseDate) : new Date();
        
        this.setState({ 
            apparelInfo: immutable.set(this.props.apparelInfo, "releaseDate", releaseDate),
            brands: this.props.brands,
            designers: this.props.designers
    
        }, this.onGetButtonStatus)
    }

    // On action methods

    onGetButtonStatus = () => {
        console.log(this.state);
        const { name, sku, brand, designer, gender, colorway, releaseDate } = this.state.apparelInfo;

        (name !== "" && sku !== "" && brand !== "" && designer !== "" && gender !== "" && colorway !== "" && releaseDate !== "") ? 
        this.setState({ submitBtnStatus:"active" }) : this.setState({ submitBtnStatus: "inactive"});
    }

    onChangeTextInputValue = (fieldID, value) => {
        this.setState({ apparelInfo: immutable.set(this.state.apparelInfo, fieldID, value) }, this.onGetButtonStatus);
    }

    onChangeDatePicker = date => {
        this.setState({
            apparelInfo: immutable.set(this.state.apparelInfo, "releaseDate", date)
        }, this.onGetButtonStatus);
      };

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
                        checked={this.state.apparelInfo["brand"] === slug}
                        id={slug}
                        label={name}
                        onClick={() => this.setState({ apparelInfo: immutable.set(this.state.apparelInfo, "brand", slug)}, this.onGetButtonStatus)}
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
                        checked={this.state.apparelInfo["designer"] === slug}
                        id={slug}
                        label={name}
                        onClick={() => this.setState({ apparelInfo: immutable.set(this.state.apparelInfo, "designer", slug)}, this.onGetButtonStatus)}
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
                        checked={optionID === this.state.apparelInfo[id]}
                        id={optionID}
                        label={options[optionID].label}
                        onClick={() => this.setState({ apparelInfo: immutable.set(this.state.apparelInfo, id, optionID )}, this.onGetButtonStatus)}
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
                        value={this.state.apparelInfo[id] || ""}
                        />
                    </div>
                )
            case "datepicker": 
                    return (
                        <div key={id} style={{ marginBottom: "20px" }}>
                            <h2>{field.label}</h2>
                            <DatePicker
                                selected={this.state.apparelInfo[id] || ""}
                                onChange={this.onChangeDatePicker}
                            />
                        </div>
                        
                    )
        }
    }

    renderSubmitButton = () => {
        return <Button
            className={Style.saveButton}
            name="Save"
            onClick={() => this.props.onSubmit(this.state.apparelInfo)}
            status={this.state.submitBtnStatus}
        >
            {this.props.isInEditMode ? "Save" : "Create"}
        </Button>
    }

    render() {
        return (
            <div>
                {NEW_APPAREL_FIELDS.map(this.renderField)}
                {this.renderSubmitButton()}
            </div>
        )
    }

}

ApparelFormFields.propTypes = {
    isInEditMode: PropTypes.bool,
    apparelInfo: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    brands: PropTypes.array,
    designers: PropTypes.array
};
  
ApparelFormFields.defaultProps = {
    brands: [],
    designers: [],
    isInEditMode: false,
    apparelInfo: {
        name: "",
        nickName: "",
        brand: "",
        designer: "",
        description: "",
        colorway: "",
        gender: "",
        sku: "",
        hasSizing: "no",
        releaseDate: "",
    }
};