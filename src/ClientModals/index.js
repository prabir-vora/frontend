import React, { Component } from 'react';
import { connect } from 'react-redux';

import ConversationDuck from 'stores/ducks/Conversation.duck';
import SellDuck from 'stores/ducks/Sell.duck';

import MessageModal from './MessageModal';
import ReplyModal from './ReplyModal';
import HowSellingWorksModal from './HowSellingWorksModal';

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

  render() {
    console.log(this.props);
    const {
      showMessageModal,
      showReplyModal,
      showHowSellingWorksModal,
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
  };
};

export default connect(mapStateToProps)(ClientModals);
