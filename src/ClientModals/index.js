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
import ConfirmEditListingModal from './ConfirmEditListingModal';
import SellerSetupModal from './SellerSetupModal';

import { ShowConfirmNotif } from 'functions';

import qs from 'query-string';

class ClientModals extends Component {
  confirmNotif = null;

  componentDidMount() {
    const { user } = this.props;

    if (!user) {
      return;
    }

    const {
      email,
      username,
      stripe_connect_account_status,
      activeSellerAddressID,
    } = user;

    const queryParameters = {
      client_id: 'ca_HEFQOOaKgt2E08XtNo3uTO5Nu9WI0dMJ',
      scope: 'read_write',
      redirect_uri: 'https://localhost:3000/stripeRedirect',
      response_type: 'code',
      'stripe_user[country]': 'US',
      'stripe_user[business_type]': 'sole_prop',
      'stripe_user[currency]': 'usd',
    };
    const queryString = qs.stringify(queryParameters);
    console.log(queryString);

    this.setState({
      stripeConnectOnboardingUrl: `https://connect.stripe.com/oauth/authorize?${queryString}`,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      const { user } = this.props;

      if (!user) {
        return this.setState({
          stripeConnectOnboardingUrl: '',
        });
      }

      const { email, username } = user;

      const queryParameters = {
        client_id: 'ca_HEFQOOaKgt2E08XtNo3uTO5Nu9WI0dMJ',
        scope: 'read_write',
        redirect_uri: 'https://localhost:3000/stripeRedirect',
        response_type: 'code',
        'stripe_user[country]': 'US',
        'stripe_user[business_type]': 'sole_prop',
        'stripe_user[currency]': 'usd',
      };
      const queryString = qs.stringify(queryParameters);
      console.log(queryString);

      this.setState({
        stripeConnectOnboardingUrl: `https://connect.stripe.com/oauth/authorize?${queryString}`,
      });
    }
  }

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
    const {
      newReply,
      undisplayReplyModal,
      clearMessages,
      fetchBuyMessages,
      fetchSellMessages,
    } = actionCreators;

    const { replyConversationID } = this.props;

    const { success } = await this.props.dispatch(
      newReply(replyConversationID, message),
    );

    const { fetchNotifCount } = UserDuck.actionCreators;

    if (success) {
      this.props.dispatch(undisplayReplyModal());
      this.props.dispatch(fetchNotifCount());
      this.props.dispatch(clearMessages());

      this.props.dispatch(fetchBuyMessages(1));
      this.props.dispatch(fetchSellMessages(1));

      this.confirmNotif = ShowConfirmNotif({
        message: 'Message sent',
        type: 'success',
      });
    }

    return { success };
  };

  onClickStripeButton = () => {};

  onCloseHowSellingWorksModal = () => {
    const { hideModal } = SellDuck.actionCreators;
    this.props.dispatch(hideModal('howSellingWorks'));
  };

  onCloseConfirmListingModal = () => {
    const { hideModal } = SellDuck.actionCreators;
    this.props.dispatch(hideModal('confirmListing'));
  };

  onCloseConfirmEditListingModal = () => {
    const { hideModal } = SellDuck.actionCreators;
    this.props.dispatch(hideModal('confirmEditListing'));
  };

  onCloseSellerSetupModal = () => {
    const { hideModal } = SellDuck.actionCreators;
    this.props.dispatch(hideModal('sellerSetup'));
  };

  onCreateListing = async () => {
    const reseller = this.props.user;
    const resellItemInfo = this.props.listingInfo;
    const { createNewListing, hideModal } = SellDuck.actionCreators;
    const { created, message } = await this.props.dispatch(
      createNewListing(resellItemInfo, reseller),
    );

    if (created) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });

      await this.props.dispatch(hideModal('confirmListing'));

      this.props.history.goBack();
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  onEditListing = async () => {
    const listing = this.props.editListingInfo;
    const { editListing, hideModal } = SellDuck.actionCreators;
    const { success, message } = await this.props.dispatch(
      editListing(listing),
    );

    if (success) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });

      await this.props.dispatch(hideModal('confirmEditListing'));
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
      showConfirmEditListingModal,
      listingInfo,
      editListingInfo,
      showSellerSetupModal,
      user,
    } = this.props;

    if (!user) {
      return null;
    }

    const { stripe_connect_account_status, activeSellerAddressID } = user;

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
        {showConfirmEditListingModal && (
          <ConfirmEditListingModal
            listingInfo={editListingInfo}
            onClose={this.onCloseConfirmEditListingModal}
            onSubmitListing={this.onEditListing}
          />
        )}
        {showSellerSetupModal && (
          <SellerSetupModal
            onClose={this.onCloseSellerSetupModal}
            stripeConnectOnboardingUrl={this.state.stripeConnectOnboardingUrl}
            stripe_connect_account_status={stripe_connect_account_status}
            activeSellerAddressID={activeSellerAddressID}
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
    showSellerSetupModal: state[SellDuck.duckName].showSellerSetupModal,
    showConfirmEditListingModal:
      state[SellDuck.duckName].showConfirmEditListingModal,
    listingInfo: state[SellDuck.duckName].listingInfo,
    editListingInfo: state[SellDuck.duckName].editListingInfo,
    user: state[UserDuck.duckName].user,
  };
};

const x = withRouter(ClientModals);
export default connect(mapStateToProps)(x);
