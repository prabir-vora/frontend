import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { set } from 'object-path-immutable';

// Style
import Style from "../style.module.scss";

// Fields
import { Button, TextInput } from 'fields';

export default class BrandFormFields extends Component {

    state={
        brandInfo: {
            name: ""
        },
        submitBtnStatus: "inactive"
    }
    
    componentDidMount() {
        this.setState({ brandInfo: this.props.brandInfo }, this.onGetButtonStatus)
    }

    // On action methods

    onGetButtonStatus = () => this.state.brandInfo.name !== "" ? 
        this.setState({ submitBtnStatus:"active" }) : this.setState({ submitBtnStatus:"inactive"});

    onChangeTextInputValue = (fieldID, value) => {
        const brandInfo = set(this.state.brandInfo, fieldID, value);
        this.setState({ brandInfo }, this.onGetButtonStatus);
    }

    //  render methods

    renderField = () => {
        return <div className={Style.formField}>
            <TextInput
                label={"Name"}
                name={"name"}
                onChange={value => this.onChangeTextInputValue("name", value)}
                value={this.state.brandInfo["name"]}
            />
        </div>
    }

    renderSubmitButton = () => {
        return <Button
            className={Style.saveButton}
            name="Save"
            onClick={() => this.props.onSubmit(this.state.brandInfo)}
            status={this.state.submitBtnStatus}
        >
            {this.props.isInEditMode ? "Save" : "Create"}
        </Button>
    }

    render() {
        return (
            <div>
                {this.renderField()}
                {this.renderSubmitButton()}
            </div>
        )
    }

}

BrandFormFields.propTypes = {
    isInEditMode: PropTypes.bool,
    brandInfo: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
  };
  
  BrandFormFields.defaultProps = {
    isInEditMode: false,
    brandInfo: {
        name: ""
    }
  };
