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

import Switch from 'react-switch';

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
            <div className={Style.listingDetailsContainer}>
              <Img
                src={images[0] || product.original_image_url}
                className={Style.conversationImage}
              />
              <div className={Style.listingInfo}>
                <h4 className={Style.productName}>{product.name}</h4>
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
            <p className={Style.message}>{message}</p>
            {!isRead && <div className={Style.unreadAlert} />}
          </div>
        </div>
        <div className={Style.conversationDetails}>
          <p style={{ marginBottom: '20px', fontSize: '12px' }}>
            {moment(createdAt).fromNow()}
          </p>
          <p className={Style.senderDetails}>{senderUsername}</p>
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
              <div className={Style.listingDetailsContainer}>
                <Img src={images[0]} className={Style.conversationImage} />
                <div className={Style.listingInfo}>
                  <h4 className={Style.productName}>{product.name}</h4>
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
        <div
          className={Style.ActivityLog}
          onClick={() => this.onConversationClick(id)}
        >
          {activityLog.map(log => {
            const { senderID, createdAt, message } = log;
            let senderUsername = senderID === user.id ? 'me' : username;
            return (
              <div className={Style.logItem}>
                <div className={Style.logSender}>
                  <div
                    style={{
                      color: `${
                        senderUsername === 'me' ? '#77f11c' : '#ff4500'
                      }`,
                    }}
                    className={Style.senderDetails}
                  >
                    {senderUsername}
                  </div>
                </div>
                <div className={Style.logItemContent}>{message}</div>
                <div className={Style.logItemTimestamp}>
                  {' '}
                  {moment(createdAt).fromNow()}
                </div>
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
        <div className={Style.mobileTitle}>Messages</div>
        <div className={Style.layout}>
          <div className={Style.messageSelectionContainer}>
            <label
              className={Style.messageSelectionLabel}
              onClick={() => this.toggleSelection('buying')}
            >
              Buy messages
            </label>
            <Switch
              checked={messageSelection === 'selling' ? true : false}
              onChange={value => {
                if (value !== true) {
                  this.toggleSelection('buying');
                } else {
                  this.toggleSelection('selling');
                }
              }}
              onColor="#9A8686"
              onHandleColor="#fff"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
              className="react-switch"
              id="material-switch"
            />
            <label
              className={Style.messageSelectionLabel}
              onClick={() => this.toggleSelection('selling')}
            >
              Sell Messages
            </label>
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
