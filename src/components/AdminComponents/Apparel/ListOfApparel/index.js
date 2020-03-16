import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// // Components
import ApparelItem from "../ApparelItem";

// Fields
import { PageMsg } from "fields";

class ListOfApparel extends Component {
    renderApparel = (apparel = []) => 
        apparel.map((apparelInfo) => {
            const { id } = apparelInfo;
            return (
                <div className={Style.itemContainer} key={id}>
                  <ApparelItem
                    apparelD={id}
                    apparelInfo={apparelInfo}
                    onRefreshAfterChanges={this.props.onRefreshAfterChanges}
                  />
                </div>
              );
        })

    render() {
        const { apparel } = this.props;
        console.log(apparel);
        if (Object.keys(apparel).length === 0)
          return <PageMsg>No Items Found</PageMsg>;
        return (
          <div
            className={cx(Style.listContainer, this.props.listContainerClassname)}
          >
            {this.renderApparel(apparel)}
          </div>
        );
      }
}

export default ListOfApparel;

ListOfApparel.propTypes = {
  apparel: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func
};

ListOfApparel.defaultProps = {
  apparel: {},
};