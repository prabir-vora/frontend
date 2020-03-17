import React, { Component } from 'react';
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import TestObjectsDuck from "stores/ducks/Admin/TestObjects.duck";

// Components
import AdminModals from "components/AdminModals";
import { ListOfResellers } from "components/AdminComponents/Resellers";

// Style
import Style from "../style.module.scss";

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from "functions";

class Resellers extends Component {
    confirmNotif = null;

    state = {
        showCreateItemModal: false
    };

    async componentDidMount() {
        //  Fetch Resellers, Brands and Designers

        await this.fetchAllResellers();

    }

    // Action Creator called
    fetchAllResellers = async () => {
        const { actionCreators} = TestObjectsDuck;
        const { getAllResellers } = actionCreators;
        const { success, message } = await this.props.dispatch(getAllResellers());
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

    // On Change Actions 

    onHideCreateItemModal = () => this.setState({ showCreateItemModal: false });

    onShowCreateItemModal = () => this.setState({ showCreateItemModal: true });

    onUpdateAfterResellerCreated = ({ created, message }) => {
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
        const { actionCreators} = TestObjectsDuck;
        const { getAllResellers } = actionCreators;
        const { success, message } = await this.props.dispatch(getAllResellers());
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
  
    //  Render Methods
    renderCreateModal = () => (
        <AdminModals.ResellersModal
          onCloseModal={this.onHideCreateItemModal}
          onUpdateAfterResellerCreated={this.onUpdateAfterResellerCreated}
        />
      );
    
    renderAllResellers = () => (
      <ListOfResellers
          resellers={this.props.resellers}
          onRefreshAfterChanges={this.onRefreshAfterChanges}
      />
    )

    render() {
        const { isFetchingResellers } = this.props;
        if (isFetchingResellers) {
            return (<div style={{ textAlign: "center"}}>
                <ClipLoader color={"#000000"} loading={true} />
            </div>)
        }
        return (
          <div>
              {this.state.showCreateItemModal && this.renderCreateModal()}
              {this.renderAllResellers()}
              <div className={Style.floatingButton}>
                  <button onClick={this.onShowCreateItemModal}>+</button>
              </div>
          </div>
        )
    }
}

const mapStateToProps = state => {
  const { duckName } = TestObjectsDuck;
  return {
    isFetchingResellers:  state[duckName].resellers.isFetching, 
    resellers: state[duckName].resellers.data 
  }
}

export default connect(mapStateToProps)(Resellers);

Resellers.propTypes = {
  isFetchingResellers: PropTypes.bool,
  resellers: PropTypes.array
}