import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Components
import DesignerItem from "../DesignerItem";

// Fields
import { PageMsg } from "fields";

class ListOfDesigners extends Component {

    renderDesigners = (designers = []) =>
      designers.map((designerInfo) => {
        const { id } = designerInfo;
      return (
          <div className={Style.itemContainer} key={id}>
            <DesignerItem
              designerID={id}
              designerInfo={designerInfo}
              onRefreshAfterChanges={this.props.onRefreshAfterChanges}
            />
          </div>
        );
      });


    render() {
        const { designers } = this.props;
        if (Object.keys(designers).length === 0)
          return <PageMsg>No Items Found</PageMsg>;
        return (
          <div
            className={cx(Style.listContainer, this.props.listContainerClassname)}
          >
            {this.renderDesigners(designers)}
          </div>
        );
      }
}

export default ListOfDesigners;

ListOfDesigners.propTypes = {
  designers: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func
};

ListOfDesigners.defaultProps = {
  designers: {},
};