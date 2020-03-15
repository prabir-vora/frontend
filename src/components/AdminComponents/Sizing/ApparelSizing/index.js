import React, { Component } from 'react';
import { Button } from 'fields';
// import PropTypes from 'prop-types';

// Style
import Style from '../style.module.scss';

// Components
import ListOfSizing from '../ListOfSizing';

export default class ApparelSizing extends Component {

    renderGenderSections = () => {
       const { productCategory, data } = this.props; 
       console.log(data);
       const { gender } = this.props.sizingInfo;
       console.log(gender);
       return Object.keys(gender).map(genderID => {
           return (
               <div key={genderID} className={Style.genderSectionContainer}>
                   <div className={Style.genderSectionTitle}>
                        <h2 className={Style.genderSectionLabel}>{gender[genderID].label}</h2>
                        <Button
                            className={Style.addButton}
                            name="Create new sizing"
                            onClick={() => this.props.onShowCreateSizingModal(productCategory, gender[genderID])}
                        > Add New Sizing </Button>
                   </div>
                    
                    <ListOfSizing data={this.props.data[genderID]}/>
               </div>
           )
       })
    } 

    render() {
        return (
            <div >
                {this.renderGenderSections()}
            </div>
        )
    }
}


ApparelSizing.defaultProps = {
    data: {}
}