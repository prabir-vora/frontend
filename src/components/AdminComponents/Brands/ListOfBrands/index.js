import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Components
import BrandItem from "../BrandItem";

// Fields
import { PageMsg } from "fields";

class ListOfBrands extends Component {

    renderBrands = (brands = []) =>
      brands.map((brandInfo) => {
        const { id } = brandInfo;
      return (
          <div className={Style.itemContainer} key={id}>
            <BrandItem
              brandID={id}
              brandInfo={brandInfo}
              onRefreshAfterChanges={this.props.onRefreshAfterChanges}
            />
          </div>
        );
      });


    render() {
        const { brands } = this.props;
        if (Object.keys(brands).length === 0)
          return <PageMsg>No Items Found</PageMsg>;
        return (
          <div
            className={cx(Style.listContainer, this.props.listContainerClassname)}
          >
            {this.renderBrands(brands)}
          </div>
        );
      }
}

export default ListOfBrands;

ListOfBrands.propTypes = {
  brands: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func
};

ListOfBrands.defaultProps = {
  brands: {},
};