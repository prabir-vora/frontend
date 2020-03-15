import React from "react";
import MediaQuery from "react-responsive";
import PropTypes from "prop-types";

// Constants
const MOBILE_MAX_WIDTH = 500;
const TABLET_MIN_WIDTH = MOBILE_MAX_WIDTH + 1;
const TABLET_MAX_WIDTH = 900;
const DESKTOP_MIN_WIDTH = TABLET_MAX_WIDTH + 1;

class ScreenSize extends React.Component {
  getScreenSize = deviceType => {
    switch (deviceType) {
      case "mobile":
        return { maxDeviceWidth: MOBILE_MAX_WIDTH };
      case "tablet":
        return {
          maxDeviceWidth: TABLET_MAX_WIDTH,
          minDeviceWidth: TABLET_MIN_WIDTH
        };
      case "desktop":
      default:
        return { minDeviceWidth: DESKTOP_MIN_WIDTH };
    }
  };

  render() {
    const { children, deviceType, orientation } = this.props;
    return (
      <React.Fragment>
        <MediaQuery
          {...this.getScreenSize(deviceType)}
          orientation={orientation}
        >
          {children}
        </MediaQuery>
      </React.Fragment>
    );
  }
}

ScreenSize.propTypes = {
  children: PropTypes.any,
  deviceType: PropTypes.oneOf(["desktop", "tablet", "mobile"]).isRequired,
  orientation: PropTypes.oneOf(["landscape", "portrait", null])
};

ScreenSize.defaultProps = {
  orientation: null
};

export default ScreenSize;
