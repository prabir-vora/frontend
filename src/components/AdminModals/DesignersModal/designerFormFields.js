import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { set } from 'object-path-immutable';

// Style
import Style from "../style.module.scss";

// Fields
import { Button, TextInput } from 'fields';

export default class DesignerFormFields extends Component {

    state={
        designerInfo: {
            name: ""
        },
        submitBtnStatus: "inactive"
    }
    
    componentDidMount() {
        this.setState({ designerInfo: this.props.designerInfo }, this.onGetButtonStatus)
    }

    // On action methods

    onGetButtonStatus = () => this.state.designerInfo.name !== "" ? 
        this.setState({ submitBtnStatus:"active" }) : this.setState({ submitBtnStatus:"inactive"});

    onChangeTextInputValue = (fieldID, value) => {
        const designerInfo = set(this.state.designerInfo, fieldID, value);
        this.setState({ designerInfo }, this.onGetButtonStatus);
    }

    //  render methods

    renderField = () => {
        return <div className={Style.formField}>
            <TextInput
                label={"Name"}
                name={"name"}
                onChange={value => this.onChangeTextInputValue("name", value)}
                value={this.state.designerInfo["name"]}
            />
        </div>
    }

    renderSubmitButton = () => {
        return <Button
            className={Style.saveButton}
            name="Save"
            onClick={() => this.props.onSubmit(this.state.designerInfo)}
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

DesignerFormFields.propTypes = {
    isInEditMode: PropTypes.bool,
    designerInfo: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
  };
  
  DesignerFormFields.defaultProps = {
    isInEditMode: false,
    designerInfo: {
        name: ""
    }
  };
