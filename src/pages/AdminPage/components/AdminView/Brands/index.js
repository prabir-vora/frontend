import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Components
import AdminModals from "components/AdminModals";
import { ListOfBrands } from "components/AdminComponents/Brands";

// Style
import Style from "../style.module.scss";

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from "functions";

class Brands extends Component {
    confirmNotif = null;

    state = {
        showCreateItemModal: false
    };

    async componentDidMount() {
        await this.fetchAllBrands();
    }

    //  Action Creator called
    fetchAllBrands = async () => {
      const { actionCreators} = AdminDuck;
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
          type: "error"
        })
      }
    }

    // On Change Actions

    onHideCreateItemModal = () => this.setState({ showCreateItemModal: false });

    onShowCreateItemModal = () => this.setState({ showCreateItemModal: true });

    onUpdateAfterBrandCreated = ({ created, message }) => {
      if (created) {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "success"
        });
        this.setState({ showCreateItemModal: false }, () => this.onRefreshAfterChanges());
      } else {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "error"
        });
        this.setState({ showCreateItemModal: false });
      }
    }

    onRefreshAfterChanges = async () => {
      const { actionCreators} = AdminDuck;
      const { getAllBrands } = actionCreators;
      const { success, message } = await this.props.dispatch(getAllBrands());
      if (success) {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "success"
        })
      } else {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "error"
        })
      }
    }

    // Render methods
    renderCreateModal = () => (
        <AdminModals.BrandsModal
          onCloseModal={this.onHideCreateItemModal}
          onUpdateAfterBrandCreated={this.onUpdateAfterBrandCreated}
        />
      );

    renderAllBrands = () => (
        <ListOfBrands
          brands={this.props.brands}
          onRefreshAfterChanges={this.onRefreshAfterChanges}
        />
      );

    render() {
      const { isFetchingBrands } = this.props;
      if (isFetchingBrands) {
        return (<div style={{ textAlign: "center"}}>
            <ClipLoader color={"#000000"} loading={true} />
          </div>)
        }
      return (
          <div>
              {this.state.showCreateItemModal && this.renderCreateModal()}
              {this.renderAllBrands()}
              <div className={Style.floatingButton}>
                  <button onClick={this.onShowCreateItemModal}>+</button>
              </div>
          </div>
      )
    }
}

// Redux

const mapStateToProps = state => {
    const { duckName } = AdminDuck;
    return {
      brands: state[duckName].brands.data,
      isFetchingBrands: state[duckName].brands.isFetching
    };
  };

export default connect(mapStateToProps)(Brands);

// Prop types

Brands.propTypes = {
  brands: PropTypes.array,
  isFetchingBrands: PropTypes.bool
}