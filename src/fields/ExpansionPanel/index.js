import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Icons
import { ArrowIcon } from "assets/Icons";

const ExpansionPanel = props => {
  const onClickArrowIcon = () => props.onClickExpandButton();

  const renderArrowIcon = () => (
    <ArrowIcon
      className={cx(Style.arrowIcon, props.showExpandableContent && Style.flip)}
    />
  );

  const renderExpandableContent = () => (
    <div className={Style.expandableContent}>{props.children}</div>
  );

  const renderModuleTitle = () => (
    <div className={Style.moduleTitleContainer}>
      <div>
        <h2 className={cx(Style.moduleTitle, props.titleClassName)}>
          {props.moduleTitle}
        </h2>
        {props.showTitleUnderline && <div className={Style.titleUnderline} />}
      </div>
      {props.isExpandable && renderArrowIcon()}
    </div>
  );

  return (
    <div className={Style.moduleContainer}>
      <button
        className={cx(!props.isExpandable && Style.unclickable)}
        onClick={onClickArrowIcon}
      >
        {renderModuleTitle()}
        {props.moduleDescription && (
          <p
            className={cx(Style.moduleDescription, props.descriptionClassName)}
          >
            {props.moduleDescription}
          </p>
        )}
      </button>
      {props.showExpandableContent && renderExpandableContent()}
    </div>
  );
};

ExpansionPanel.propTypes = {
  children: PropTypes.any,
  isExpandable: PropTypes.bool,
  moduleDescription: PropTypes.any,
  moduleTitle: PropTypes.any.isRequired,
  onClickExpandButton: PropTypes.func,
  showExpandableContent: PropTypes.bool,
  showTitleUnderline: PropTypes.bool
};

ExpansionPanel.defaultProps = {
  isExpandable: false,
  moduleDescription: "",
  onClickExpandButton: () => {},
  showExpandableContent: false,
  showTitleUnderline: true
};

export default ExpansionPanel;
