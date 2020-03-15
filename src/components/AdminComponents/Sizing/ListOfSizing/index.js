import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import Style from './style.module.scss';

export default class ListOfSizing extends Component {

    renderSizings = () => {
        const { data } = this.props;
        return Object.keys(data).map(brandID => {
            return (
                <div className={Style.listItem} key={brandID}>
                    <h4>{brandID}: {data[brandID]["us"].join(", ")}</h4> 
                </div> 
            )
        })
    }
    render() {
        return (
            <div>
                {this.renderSizings()}
            </div>
        )
    }
}

ListOfSizing.propTypes = {
    data: PropTypes.object
}

ListOfSizing.defaultProps = {
    data: {}
}