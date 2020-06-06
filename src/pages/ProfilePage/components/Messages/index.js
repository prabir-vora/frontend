import React, { Component } from 'react';

import Style from './style.module.scss';
import cx from 'classnames';

import { connect } from 'react-redux';

import { Img } from 'fields';

import moment from 'moment';

import ConversationDuck from 'stores/ducks/Conversation.duck';
import UserDuck from 'stores/ducks/User.duck';

import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';

class Messages extends Component {
  componentDidMount() {
    const { actionCreators } = ConversationDuck;
    const {
      clearMessages,
      fetchBuyMessages,
      fetchSellMessages,
    } = actionCreators;
    this.props.dispatch(clearMessages());
    this.props.dispatch(fetchBuyMessages(1));
    this.props.dispatch(fetchSellMessages(1));
  }

  fetchMoreBuyMessages = () => {
    const { data } = this.props;
    const { buying } = data;
    const { nextPage } = buying;
    const { actionCreators } = ConversationDuck;
    const { fetchBuyMessages } = actionCreators;
    this.props.dispatch(fetchBuyMessages(nextPage));
  };

  fetchMoreSellMessages = () => {
    const { data } = this.props;
    const { selling } = data;
    const { nextPage } = selling;
    const { actionCreators } = ConversationDuck;
    const { fetchSellMessages } = actionCreators;
    this.props.dispatch(fetchSellMessages(nextPage));
  };

  onClickReply = conversationID => {
    const { actionCreators } = ConversationDuck;
    const { displayReplyModal } = actionCreators;
    this.props.dispatch(displayReplyModal(conversationID));
  };

  onConversationClick = conversationID => {
    const { actionCreators } = ConversationDuck;
    const { onClickConversation } = actionCreators;

    const { data } = this.props;
    const { messageSelection } = data;
    console.log(messageSelection);

    this.props.dispatch(onClickConversation(conversationID, messageSelection));
  };

  onMarkAsRead = async conversationID => {
    const { actionCreators } = ConversationDuck;
    const { markAsRead } = actionCreators;

    const { data } = this.props;
    const { messageSelection } = data;
    console.log(messageSelection);

    const { success } = await this.props.dispatch(
      markAsRead(conversationID, messageSelection),
    );

    const { fetchNotifCount } = UserDuck.actionCreators;

    if (success) {
      await this.props.dispatch(fetchNotifCount());
    }
  };

  toggleSelection = selection => {
    const { data } = this.props;
    const { messageSelection } = data;
    const { actionCreators } = ConversationDuck;
    const { toggleMessageView } = actionCreators;

    if (messageSelection !== selection) {
      this.props.dispatch(toggleMessageView(selection));
    }
  };

  renderMessages = () => {
    const { data } = this.props;
    const { messageSelection } = data;

    return (
      <div>
        {messageSelection === 'buying'
          ? this.renderBuyMessages()
          : this.renderSellMessages()}
      </div>
    );
  };

  renderConversationItem = conversation => {
    const {
      id,
      listing,
      seller,
      buyer,
      listingContext,
      activityLog,
      buyerRead,
      sellerRead,
    } = conversation;
    const { slug, images, product } = listing;

    const { data } = this.props;
    const { messageSelection } = data;

    let senderUsername =
      messageSelection === 'buying' ? seller.username : buyer.username;

    console.log(senderUsername);

    let isRead = messageSelection === 'buying' ? buyerRead : sellerRead;

    const { message, createdAt } = activityLog[0];

    return (
      <div
        key={id}
        className={Style.conversationItem}
        onClick={() => {
          this.onConversationClick(id);
          if (!isRead) {
            this.onMarkAsRead(id);
          }
        }}
      >
        <div className={Style.listingDetails}>
          <a
            href={
              listingContext === 'shop'
                ? `/${listingContext}/listing/${slug}`
                : `/${listingContext}/${slug}`
            }
          >
            <div style={{ cursor: 'pointer', display: 'flex' }}>
              <Img
                src={images[0]}
                style={{ width: '100px', height: '100px' }}
              />
              <div className={Style.listingInfo}>
                <h4 style={{ width: '120px', fontSize: '12px' }}>
                  {product.name}
                </h4>
              </div>
            </div>
          </a>
        </div>
        <div className={Style.lastMessage}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: '14px',
                marginRight: '10px',
              }}
            >
              {message}
            </p>
            {!isRead && <div className={Style.unreadAlert} />}
          </div>
        </div>
        <div className={Style.conversationDetails}>
          <p style={{ marginBottom: '20px', fontSize: '12px' }}>
            {moment(createdAt).fromNow()}
          </p>
          <p style={{ fontSize: '12px' }}>{senderUsername}</p>
        </div>
      </div>
    );
  };

  renderActiveConversationItem = conversation => {
    const {
      id,
      listing,
      seller,
      buyer,
      listingContext,
      activityLog,
    } = conversation;
    const { slug, images, product } = listing;

    const { data } = this.props;
    const { messageSelection } = data;

    const username =
      messageSelection === 'buying' ? seller.username : buyer.username;

    console.log(username);

    const { user } = this.props;

    return (
      <div key={id} className={Style.conversationItemActive}>
        <div
          className={Style.conversationHeader}
          onClick={() => this.onConversationClick(id)}
        >
          <div className={Style.listingDetailsActive}>
            <a
              href={
                listingContext === 'shop'
                  ? `/${listingContext}/listing/${slug}`
                  : `/${listingContext}/${slug}`
              }
            >
              <div style={{ cursor: 'pointer', display: 'flex' }}>
                <Img
                  src={images[0]}
                  style={{ width: '100px', height: '100px' }}
                />
                <div className={Style.listingInfo}>
                  <h4 style={{ fontSize: '12px' }}>{product.name}</h4>
                </div>
              </div>
            </a>
          </div>
          <button
            className={Style.replyButton}
            onClick={() => this.onClickReply(id)}
          >
            Reply
          </button>
        </div>
        <div className={Style.ActivityLog}>
          {activityLog.map(log => {
            const { senderID, createdAt, message } = log;
            let senderUsername = senderID === user.id ? 'me' : username;
            return (
              <div className={Style.logItem}>
                <div className={Style.logSender}>
                  <Img src={''} className={Style.profilePictureURL} />
                  <div className={Style.senderDetails}>
                    <p style={{ fontSize: '12px' }}>{senderUsername}</p>
                    <p style={{ fontSize: '12px', fontWeight: '400' }}>
                      {moment(createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <div className={Style.logItemContent}>{message}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderBuyMessages = () => {
    const { data } = this.props;
    const { buying } = data;
    const {
      conversations,
      openConversations,
      hasMoreMessages,
      loadingConversations,
    } = buying;

    if (loadingConversations) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <ClipLoader color={'#ffffff'} />
        </div>
      );
    }

    return (
      <InfiniteScroll
        dataLength={conversations.length}
        next={this.fetchMoreBuyMessages}
        hasMore={hasMoreMessages && !loadingConversations}
        loader={
          <h4 style={{ color: 'white', fontSize: '12px' }}>Loading...</h4>
        }
      >
        {conversations.length === 0 && (
          <div className={Style.noMessages}>No Messages</div>
        )}
        {conversations.map(conversation => {
          const { id } = conversation;
          return (
            <React.Fragment>
              {!openConversations.includes(id)
                ? this.renderConversationItem(conversation)
                : this.renderActiveConversationItem(conversation)}
            </React.Fragment>
          );
        })}
      </InfiniteScroll>
    );
  };

  renderSellMessages = () => {
    const { data } = this.props;
    const { selling } = data;
    console.log(selling);
    const {
      conversations,
      openConversations,
      hasMoreMessages,
      loadingConversations,
    } = selling;
    if (loadingConversations) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <ClipLoader color={'#ffffff'} />
        </div>
      );
    }

    return (
      <InfiniteScroll
        dataLength={conversations.length}
        next={this.fetchMoreSellMessages}
        hasMore={hasMoreMessages && !loadingConversations}
      >
        {conversations.length === 0 && (
          <div className={Style.noMessages}>No Messages</div>
        )}
        {conversations.map(conversation => {
          const { id } = conversation;
          return (
            <React.Fragment>
              {!openConversations.includes(id)
                ? this.renderConversationItem(conversation)
                : this.renderActiveConversationItem(conversation)}
            </React.Fragment>
          );
        })}
      </InfiniteScroll>
    );
  };

  render() {
    console.log(this.props);
    const { data } = this.props;
    const { messageSelection } = data;
    return (
      <div className={Style.conversationsContainer}>
        <div style={{ width: '80%' }}>
          <div className={Style.messageSelectionContainer}>
            <span
              className={
                messageSelection === 'buying'
                  ? cx(Style.selectionButton, Style.activeSelection)
                  : Style.selectionButton
              }
              onClick={() => this.toggleSelection('buying')}
            >
              BUY MESSAGES
            </span>
            <span className={Style.seperator}></span>
            <span
              className={
                messageSelection === 'selling'
                  ? cx(Style.selectionButton, Style.activeSelection)
                  : Style.selectionButton
              }
              onClick={() => this.toggleSelection('selling')}
            >
              SELL MESSAGES
            </span>
          </div>
          <div>{this.renderMessages()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state[ConversationDuck.duckName],
  };
};

export default connect(mapStateToProps)(Messages);
