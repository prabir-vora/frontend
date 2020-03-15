import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Components
import AdminModals from "components/AdminModals";
import { ListOfDesigners } from "components/AdminComponents/Designers";

// Style
import Style from "../style.module.scss";

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from "functions";

class Designers extends Component {
    confirmNotif = null;

    state = {
        showCreateItemModal: false
    };

    async componentDidMount() {
        await this.fetchAllDesigners();
    }

    //  Action Creator called
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
          type: "error"
        })
      }
    }

    // On Change Actions

    onHideCreateItemModal = () => this.setState({ showCreateItemModal: false });

    onShowCreateItemModal = () => this.setState({ showCreateItemModal: true });

    onUpdateAfterDesignerCreated = ({ created, message }) => {
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
      const { getAllDesigners } = actionCreators;
      const { success, message } = await this.props.dispatch(getAllDesigners());
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
        <AdminModals.DesignersModal
          onCloseModal={this.onHideCreateItemModal}
          onUpdateAfterDesignerCreated={this.onUpdateAfterDesignerCreated}
        />
      );

    renderAllDesigners = () => (
        <ListOfDesigners
          designers={this.props.designers}
          onRefreshAfterChanges={this.onRefreshAfterChanges}
        />
      );

    render() {
      const { isFetchingDesigners } = this.props;
      if (isFetchingDesigners) {
        return (<div style={{ textAlign: "center"}}>
            <ClipLoader color={"#000000"} loading={true} />
          </div>)
        }
      return ( <div>
              {this.state.showCreateItemModal && this.renderCreateModal()}
              {this.renderAllDesigners()}
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
      designers: state[duckName].designers.data,
      isFetchingDesigners: state[duckName].designers.isFetching
    };
  };

export default connect(mapStateToProps)(Designers);

// Prop types

Designers.propTypes = {
  designers: PropTypes.array,
  isFetchingDesigners: PropTypes.bool
}