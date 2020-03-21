import React, { Component } from 'react';
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import TestObjectsDuck from "stores/ducks/Admin/TestObjects.duck";
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Components
import AdminModals from "components/AdminModals";
// import { ListOfResellItems } from "components/AdminComponents/ResellItems";

// Style
import Style from "../style.module.scss";

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from "functions";

class ResellItems extends Component {
    confirmNotif = null;

    state = {
        showCreateItemModal: false
    };

    async componentDidMount() {
        //  Fetch ResellItems, Brands and Designers
        await this.fetchAllSneakers();
        await this.fetchAllApparel();
        await this.fetchAllResellers();

        // await this.fetchAllResellItems();

    }

    // Action Creator called
    fetchAllSneakers = async () => {
      const { actionCreators} = AdminDuck;
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
          type: "error"
          })
      }
    }

    fetchAllApparel = async () => {
      const { actionCreators} = AdminDuck;
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
          type: "error"
          })
      }
    }

    fetchAllResellers = async () => {
      const { actionCreators} = TestObjectsDuck;
      const { getAllResellers } = actionCreators;
      const { success, message } = await this.props.dispatch(getAllResellers());
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

    // Action Creator called
    fetchAllResellItems = async () => {
        // const { actionCreators} = TestObjectsDuck;
        // const { getAllResellItems } = actionCreators;
        // const { success, message } = await this.props.dispatch(getAllResellItems());
        // if (success) {
        //     this.confirmNotif = ShowConfirmNotif({
        //       message,
        //       type: "success"
        //     })
        // } else {
        //     this.confirmNotif = ShowConfirmNotif({
        //     message,
        //     type: "error"
        //     })
        // }
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
        // const { actionCreators} = TestObjectsDuck;
        // const { getAllResellItems } = actionCreators;
        // const { success, message } = await this.props.dispatch(getAllResellItems());
        // if (success) {
        //   this.confirmNotif = ShowConfirmNotif({
        //     message,
        //     type: "success"
        //   })
        // } else {
        //   this.confirmNotif = ShowConfirmNotif({
        //     message,
        //     type: "error"
        //   })
        // }
      }
  
    //  Render Methods
    renderCreateModal = () => (
        <AdminModals.ResellItemsModal
          onCloseModal={this.onHideCreateItemModal}
          onUpdateAfterResellerCreated={this.onUpdateAfterResellerCreated}
        />
      );
    
    renderAllResellItems = () => (
    //   <ListOfResellItems
    //       resellers={this.props.resellers}
    //       onRefreshAfterChanges={this.onRefreshAfterChanges}
    //   />
    null
    )

    render() {
        const { isFetchingResellItems } = this.props;
        if (isFetchingResellItems) {
            return (<div style={{ textAlign: "center"}}>
                <ClipLoader color={"#000000"} loading={true} />
            </div>)
        }
        return (
          <div>
              {this.state.showCreateItemModal && this.renderCreateModal()}
              {this.renderAllResellItems()}
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
    isFetchingResellItems:  state[duckName].resellers.isFetching, 
    resellers: state[duckName].resellers.data 
  }
}

export default connect(mapStateToProps)(ResellItems);

ResellItems.propTypes = {
  isFetchingResellItems: PropTypes.bool,
  resellers: PropTypes.array
}