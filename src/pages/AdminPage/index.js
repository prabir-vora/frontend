import React, { Component } from 'react';
import AdminNavBar from 'components/AdminNavBar';
import AdminPageContainer from './components/AdminPageContainer';
import Style from './style.module.scss';

// Redux
import { connect } from 'react-redux';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';
import AdminUIDuck from 'stores/ducks/Admin/UI.duck';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';

//  Import components
import AdminView from './components/AdminView';

import { ShowConfirmNotif } from 'functions';

const mapNavBarIDs = {
  brands: <AdminView.Brands />,
  designers: <AdminView.Designers />,
  apparel: <AdminView.Apparel />,
  sneakers: <AdminView.Sneakers />,
  sizing: <AdminView.Sizing />,
  users: <AdminView.Users />,
  resellItems: <AdminView.ResellItems />,
  orders: <AdminView.Orders />,
};

class Admin extends Component {
  confirmNotif = null;

  componentDidMount() {
    // Fetch everything over here
    Promise.all([
      this.fetchAllBrands(),
      this.fetchAllDesigners(),
      this.fetchAllSneakers(),
      this.fetchAllApparel(),
      this.fetchAllResellers(),
      this.fetchAllResellItems(),
      this.fetchAllSizing(),
      this.fetchAllOrders(),
    ]);
  }

  fetchAllBrands = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllBrands } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllBrands());
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllDesigners = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllDesigners } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllDesigners());
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllSneakers = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllSneakers } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllSneakers());
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllApparel = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllApparel } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllApparel());
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllResellers = async () => {
    const { actionCreators } = TestObjectsDuck;
    const { getAllUsers } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllUsers());
    if (success) {
      //   this.confirmNotif = ShowConfirmNotif({
      //     message,
      //     type: 'success',
      //   });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllResellItems = async () => {
    const { actionCreators } = TestObjectsDuck;
    const { getAllResellItems } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllResellItems());
    if (success) {
      //   this.confirmNotif = ShowConfirmNotif({
      //     message,
      //     type: 'success',
      //   });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllOrders = async () => {
    const { getPurchasedOrders } = TestObjectsDuck.actionCreators;
    const { success, message } = await this.props.dispatch(
      getPurchasedOrders(),
    );
    if (success) {
      //   this.confirmNotif = ShowConfirmNotif({
      //     message,
      //     type: 'success',
      //   });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllSizing = async () => {
    const { actionCreators } = AdminDuck;
    const { getSizing } = actionCreators;
    const { success, message } = await this.props.dispatch(getSizing());
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  fetchAllOrders = async () => {
    const { actionCreators } = TestObjectsDuck;
    const { getPurchasedOrders } = actionCreators;
    const { success, message } = await this.props.dispatch(
      getPurchasedOrders(),
    );
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  renderPageContent = () => {
    const { activeNavbarItemId } = this.props;
    return mapNavBarIDs[activeNavbarItemId];
  };

  render() {
    return (
      <div className={Style.container}>
        <AdminNavBar />
        <AdminPageContainer>{this.renderPageContent()}</AdminPageContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = AdminUIDuck;
  return {
    activeNavbarItemId: state[duckName].activeNavbarItemId,
  };
};

export default connect(mapStateToProps)(Admin);
