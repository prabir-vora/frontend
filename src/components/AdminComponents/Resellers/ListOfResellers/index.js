import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Components
import ResellerItem from "../ResellerItem";

// Fields
import { PageMsg } from "fields";

class ListOfResellers extends Component {

    renderResellers = (resellers = []) =>
      resellers.map((resellerInfo) => {
        const { id } = resellerInfo;
      return (
          <div className={Style.itemContainer} key={id}>
            <ResellerItem
              resellerID={id}
              resellerInfo={resellerInfo}
              onRefreshAfterChanges={this.props.onRefreshAfterChanges}
            />
          </div>
        );
      });


    render() {
        const { resellers } = this.props;
        if (Object.keys(resellers).length === 0)
          return <PageMsg>No Items Found</PageMsg>;
        return (
          <div
            className={cx(Style.listContainer, this.props.listContainerClassname)}
          >
            {this.renderResellers(resellers)}
          </div>
        );
      }
}

export default ListOfResellers;

ListOfResellers.propTypes = {
  resellers: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func
};

ListOfResellers.defaultProps = {
  resellers: {},
};