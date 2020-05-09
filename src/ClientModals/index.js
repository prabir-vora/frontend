import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ConversationDuck from 'stores/ducks/Conversation.duck';
import SellDuck from 'stores/ducks/Sell.duck';
import UserDuck from 'stores/ducks/User.duck';

import MessageModal from './MessageModal';
import ReplyModal from './ReplyModal';
import HowSellingWorksModal from './HowSellingWorksModal';
import ConfirmListingModal from './ConfirmListingModal';

import { ShowConfirmNotif } from 'functions';

class ClientModals extends Component {
  confirmNotif = null;

  onCloseMessageModal = () => {
    const { actionCreators } = ConversationDuck;
    const { hideMessageModal } = actionCreators;
    this.props.dispatch(hideMessageModal());
  };

  onCloseReplyModal = () => {
    const { actionCreators } = ConversationDuck;
    const { undisplayReplyModal } = actionCreators;
    this.props.dispatch(undisplayReplyModal());
  };

  onSendMessage = async message => {
    const { actionCreators } = ConversationDuck;
    const { newMessage, hideMessageModal } = actionCreators;

    const { listingID, listingContext } = this.props;

    const { success } = await this.props.dispatch(
      newMessage(message, listingID, listingContext),
    );

    console.log(success);

    if (success) {
      this.props.dispatch(hideMessageModal());
      this.confirmNotif = ShowConfirmNotif({
        message: 'Message sent',
        type: 'success',
      });
    }

    return { success };
  };

  onSendReply = async message => {
    const { actionCreators } = ConversationDuck;
    const { newReply, undisplayReplyModal } = actionCreators;

    const { replyConversationID } = this.props;

    const { success } = await this.props.dispatch(
      newReply(replyConversationID, message),
    );

    console.log(success);

    if (success) {
      this.props.dispatch(undisplayReplyModal());
      this.confirmNotif = ShowConfirmNotif({
        message: 'Message sent',
        type: 'success',
      });
    }

    return { success };
  };

  onCloseHowSellingWorksModal = () => {
    const { hideModal } = SellDuck.actionCreators;
    this.props.dispatch(hideModal('howSellingWorks'));
  };

  onCloseConfirmListingModal = () => {
    const { hideModal } = SellDuck.actionCreators;
    this.props.dispatch(hideModal('confirmListing'));
  };

  onCreateListing = async () => {
    const reseller = this.props.user;
    const resellItemInfo = this.props.listingInfo;
    const { createNewListing } = SellDuck.actionCreators;
    const { created, message } = await this.props.dispatch(
      createNewListing(resellItemInfo, reseller),
    );

    if (created) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });

      this.props.history.goBack();
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  render() {
    console.log(this.props);
    const {
      showMessageModal,
      showReplyModal,
      showHowSellingWorksModal,
      showConfirmListingModal,
      listingInfo,
    } = this.props;
    return (
      <React.Fragment>
        {showMessageModal && (
          <MessageModal
            onClose={this.onCloseMessageModal}
            onSendMessage={this.onSendMessage}
          />
        )}
        {showReplyModal && (
          <ReplyModal
            onClose={this.onCloseReplyModal}
            onSendReply={this.onSendReply}
          />
        )}
        {showHowSellingWorksModal && (
          <HowSellingWorksModal
            onCloseModal={this.onCloseHowSellingWorksModal}
          />
        )}
        {showConfirmListingModal && (
          <ConfirmListingModal
            listingInfo={listingInfo}
            onClose={this.onCloseConfirmListingModal}
            onSubmitListing={this.onCreateListing}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    showMessageModal: state[ConversationDuck.duckName].showMessageModal,
    listingID: state[ConversationDuck.duckName].listingID,
    listingContext: state[ConversationDuck.duckName].currentListingContext,
    showReplyModal: state[ConversationDuck.duckName].showReplyModal,
    replyConversationID: state[ConversationDuck.duckName].replyConversationID,
    showHowSellingWorksModal: state[SellDuck.duckName].showHowSellingWorksModal,
    showConfirmListingModal: state[SellDuck.duckName].showConfirmListingModal,
    listingInfo: state[SellDuck.duckName].listingInfo,
    user: state[UserDuck.duckName].user,
  };
};

const x = withRouter(ClientModals);
export default connect(mapStateToProps)(x);
