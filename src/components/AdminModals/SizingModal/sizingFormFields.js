import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import Style from "./style.module.scss";

// Fields
import { Button, CheckBox, RadioButton } from 'fields';

export default class SizingFormFields extends Component {

    state={
        brands: [],
        brandChoice: '',
        selectedSizeRange: [],
        submitBtnStatus: "inactive"
    }
    
    onGetButtonStatus = () => this.state.brandChoice !== '' && this.state.selectedSizeRange.length !== 0 ? 
        this.setState({ submitBtnStatus:"active" }) : this.setState({ submitBtnStatus:"inactive"});

    componentDidMount() {
        this.setState({ brands: [...this.props.brands, { name: 'Default', slug: 'default' } ]}, this.onGetButtonStatus);
    }

    //  render methods

    renderBrandRadioButtons = () => {
        const { brands } = this.state;
        return brands.map(brand => {
            const { slug, name } = brand;
            return (
                <div key={slug} className={Style.radioButtonContainer}>
                    <RadioButton 
                        checked={this.state.brandChoice === slug}
                        id={slug}
                        label={name}
                        onClick={() => this.setState({ brandChoice: slug }, this.onGetButtonStatus)}
                    />
                </div>
            )
        })
    }

    onSelectSize = id => {
        const { selectedSizeRange } = this.state;
        this.setState({
            selectedSizeRange: selectedSizeRange.includes(id) ?
            selectedSizeRange.filter(size => size !== id)
            :
            selectedSizeRange.concat(id)
        }, this.onGetButtonStatus)
    }

    renderSizeRange = () => {
        const { size_range } = this.props;
        const { us } = size_range;

        return us.map(size => {
            return <div key={size} className={Style.checkboxContainer}>
                <CheckBox 
                    checked={this.state.selectedSizeRange.includes(size)}
                    id={size}
                    label={`${size}`}
                    onClick={this.onSelectSize}
                />
            </div>
        })
    }

    renderSubmitButton = () => {
        const { brandChoice, selectedSizeRange } = this.state;
        return <Button
            className={Style.saveButton}
            name="Save"
            onClick={() => this.props.onSubmit(brandChoice, selectedSizeRange)}
            status={this.state.submitBtnStatus}
        >
            {this.props.isInEditMode ? "Save" : "Create"}
        </Button>
    }

    render() {
        return (
            <div>
                <div className={Style.brandsContainer}>
                    <h4>Select Brand</h4>
                    {this.renderBrandRadioButtons()}
                </div>
                <div className={Style.sizeRangeContainer}> 
                    <h4>Select Values </h4>
                    <div className={Style.sizeRange}>
                        {this.renderSizeRange()}
                    </div>
                </div>
                {this.renderSubmitButton()}
            </div>
        )
    }

}

SizingFormFields.propTypes = {
    isInEditMode: PropTypes.bool,
    brandInfo: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
  };
  
  SizingFormFields.defaultProps = {
    isInEditMode: false,
    brandInfo: {
        name: ""
    }
  };
