import React, { Component } from 'react';

import Style from './style.module.scss';
import cx from 'classnames';

import { connect } from 'react-redux';

import { Img } from 'fields';

import moment from 'moment';

import ConversationDuck from 'stores/ducks/Conversation.duck';

class Messages extends Component {
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
    const { id, listing, seller, listingContext, activityLog } = conversation;
    const { slug, images, product } = listing;

    const { username } = seller;

    const lastLogIndex = activityLog.length - 1;
    const { message, createdAt } = activityLog[lastLogIndex];

    return (
      <div
        key={id}
        className={Style.conversationItem}
        onClick={() => this.onConversationClick(id)}
      >
        <div className={Style.listingDetails}>
          <a href={`/${listingContext}/listing/${slug}`}>
            <div style={{ cursor: 'pointer', display: 'flex' }}>
              <Img
                src={images[0]}
                style={{ width: '100px', height: '100px' }}
              />
              <div className={Style.listingInfo}>
                <h4 style={{ width: '120px' }}>{product.name}</h4>
              </div>
            </div>
          </a>
        </div>
        <div className={Style.lastMessage}>
          <div>
            <p style={{ color: 'white', textAlign: 'center' }}>{message}</p>
          </div>
        </div>
        <div className={Style.conversationDetails}>
          <p style={{ marginBottom: '20px' }}>{moment(createdAt).fromNow()}</p>
          <p>{username}</p>
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

    const sortedActivityLog = activityLog.reverse();

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
            <a href={`/${listingContext}/listing/${slug}`}>
              <div style={{ cursor: 'pointer', display: 'flex' }}>
                <Img
                  src={images[0]}
                  style={{ width: '100px', height: '100px' }}
                />
                <div className={Style.listingInfo}>
                  <h4>{product.name}</h4>
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
          {sortedActivityLog.map(log => {
            const { senderID, createdAt, message } = log;
            let senderUsername = senderID === user.id ? 'me' : username;
            return (
              <div className={Style.logItem}>
                <div className={Style.logSender}>
                  <Img src={''} className={Style.profilePictureURL} />
                  <div className={Style.senderDetails}>
                    <p style={{ fontSize: '12px' }}>{senderUsername}</p>
                    <p style={{ fontSize: '12px' }}>
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
    const { conversations, openConversations } = buying;
    return conversations.map(conversation => {
      const { id } = conversation;
      return (
        <React.Fragment>
          {!openConversations.includes(id)
            ? this.renderConversationItem(conversation)
            : this.renderActiveConversationItem(conversation)}
        </React.Fragment>
      );
    });
  };

  renderSellMessages = () => {
    const { data } = this.props;
    const { selling } = data;
    const { conversations, openConversations } = selling;
    return conversations.map(conversation => {
      const { id } = conversation;
      return (
        <React.Fragment>
          {!openConversations.includes(id)
            ? this.renderConversationItem(conversation)
            : this.renderActiveConversationItem(conversation)}
        </React.Fragment>
      );
    });
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
