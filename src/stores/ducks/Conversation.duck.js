import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

import * as immutable from 'object-path-immutable';

// Duck Name
const duckName = 'CONVERSATION';

const actionTypes = createActionTypes(
  {
    SHOW_MESSAGE_MODAL: 'SHOW_MESSAGE_MODAL',
    HIDE_MESSAGE_MODAL: 'HIDE_MESSAGE_MODAL',

    SHOW_REPLY_MODAL: 'SHOW_REPLY_MODAL',
    HIDE_REPLY_MODAL: 'HIDE_REPLY_MODAL',

    NEW_MESSAGE_REQUEST: 'NEW_MESSAGE_REQUEST',
    NEW_MESSAGE_SUCCESS: 'NEW_MESSAGE_SUCCESS',
    NEW_MESSAGE_FAILURE: 'NEW_MESSAGE_FAILURE',

    NEW_REPLY_REQUEST: 'NEW_REPLY_REQUEST',
    NEW_REPLY_SUCCESS: 'NEW_REPLY_SUCCESS',
    NEW_REPLY_FAILURE: 'NEW_REPLY_FAILURE',

    FETCH_CONVERSATIONS_REQUEST: 'FETCH_CONVERSATIONS_REQUEST',
    FETCH_CONVERSATIONS_SUCCESS: 'FETCH_CONVERSATIONS_SUCCESS',
    FETCH_CONVERSATIONS_FAILURE: 'FETCH_CONVERSATIONS_FAILURE',

    FETCH_BUY_CONVERSATIONS_REQUEST: 'FETCH_BUY_CONVERSATIONS_REQUEST',
    FETCH_BUY_CONVERSATIONS_SUCCESS: 'FETCH_BUY_CONVERSATIONS_SUCCESS',
    FETCH_BUY_CONVERSATIONS_FAILURE: 'FETCH_BUY_CONVERSATIONS_FAILURE',

    FETCH_SELL_CONVERSATIONS_REQUEST: 'FETCH_SELL_CONVERSATIONS_REQUEST',
    FETCH_SELL_CONVERSATIONS_SUCCESS: 'FETCH_SELL_CONVERSATIONS_SUCCESS',
    FETCH_SELL_CONVERSATIONS_FAILURE: 'FETCH_SELL_CONVERSATIONS_FAILURE',

    CHANGE_MESSAGE_SELECTION: 'CHANGE_MESSAGE_SELECTION',
    ON_CLICK_BUY_CONVERSATION: 'ON_CLICK_BUY_CONVERSATION',
    ON_CLICK_SELL_CONVERSATION: 'ON_CLICK_SELL_CONVERSATION',
  },
  duckName,
);

const initialState = {
  messageSelection: 'buying',
  showMessageModal: false,
  showReplyModal: false,
  replyConversationID: '',
  currentListingContext: '',
  listingID: '',
  sendingMessage: false,
  loadingConversations: false,
  conversations: {},
  buying: {
    conversations: [],
    nextPage: 1,
    loadingConversation: false,
    unread_count: 0,
    openConversations: [],
    hasMoreMessages: true,
  },
  selling: {
    conversations: [],
    nextPage: 1,
    loadingConversations: false,
    unread_count: 0,
    openConversations: [],
    hasMoreMessages: true,
  },
};

const showMessageModal = (currentListingContext, listingID) => dispatch => {
  dispatch(showModal(currentListingContext, listingID));
  return;
};

const hideMessageModal = () => dispatch => {
  dispatch(hideModal());
};

const displayReplyModal = conversationID => dispatch => {
  dispatch(showReplyModal(conversationID));
  return;
};

const undisplayReplyModal = () => dispatch => {
  dispatch(hideReplyModal());
};

const newMessage = (message, listingID, listingContext) => dispatch => {
  dispatch(newMessageRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        newMessage(message: "${message}", listingId: "${listingID}", listingContext: "${listingContext}") {
          id
        }
      }
    `)
      .then(res => {
        console.log(res);
        if (res !== undefined && res !== null && res.newMessage !== undefined) {
          dispatch(newMessageSuccess());
          resolve({ success: true });
        } else {
          dispatch(newMessageFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(newMessageFailure());
        resolve({ success: false });
      });
  });
};

const newReply = (conversationID, message) => dispatch => {
  dispatch(newReplyRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          mutation {
            newReply(conversationID: "${conversationID}", message: "${message}")
          }
      `)
      .then(res => {
        console.log(res);
        if (res !== undefined && res !== null && res.newReply !== undefined) {
          dispatch(newReplySuccess());
          resolve({ success: true });
        } else {
          dispatch(newReplyFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(newReplyFailure());
        resolve({ success: false });
      });
  });
};

const fetchConversations = () => dispatch => {
  dispatch(fetchConversationsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
    query {
      fetchUserConversations {
        buyingConversations {
          id
          listing {
            id
            product {
              id 
              name
            }
            askingPrice
            slug
            images
          }
          isRead
          buyer 
          seller {
            id 
            username
            name
          }
        }
        sellingConversations {
          id
          listing {
            id
            product {
              id 
              name
            }
            askingPrice
            slug
            images
          }
          isRead
          buyer {
            id 
            username
            name
          }
          seller
        }
      }
    }`)
      .then(res => {
        if (
          res !== undefined &&
          res !== null &&
          res.fetchUserConversations !== null
        ) {
          dispatch(fetchConversationsSuccess(res.fetchUserConversations));
          resolve({ success: true });
        } else {
          dispatch(fetchConversationsFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        dispatch(fetchConversationsFailure());
        resolve({ success: false });
      });
  });
};

// Fetch Buy Conversations

const fetchBuyMessages = page => dispatch => {
  dispatch(fetchBuyConversationsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
    query {
      fetchBuyConversations(page: ${page}) {
        data {
          id
          listing {
            id
            product {
              id 
              name
            }
            askingPrice
            slug
            images
          }
          activityLog {
            id
            logType
            message
            senderID
            isSuspicious
            createdAt
          }
          buyerRead
          sellerRead
          buyer 
          seller {
            id 
            username
            name
          }
          listingContext
        }
        metadata {
          unread_count
        }
      }
    }`)
      .then(res => {
        if (
          res !== undefined &&
          res !== null &&
          res.fetchBuyConversations !== null
        ) {
          dispatch(fetchBuyConversationsSuccess(res.fetchBuyConversations));
          resolve({ success: true });
        } else {
          dispatch(fetchBuyConversationsFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        dispatch(fetchBuyConversationsFailure());
        resolve({ success: false });
      });
  });
};

const fetchSellMessages = page => dispatch => {
  dispatch(fetchSellConversationsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
    query {
      fetchSellConversations(page: ${page}) {
        data {
          id
          listing {
            id
            product {
              id 
              name
            }
            askingPrice
            slug
            images
          }
          activityLog {
            id
            logType
            message
            senderID
            isSuspicious
            createdAt
          }
          buyerRead
          sellerRead
          buyer {
            id 
            username
            name
          }
          seller
          listingContext
        }
        metadata {
          unread_count
        }
      }
    }`)
      .then(res => {
        if (
          res !== undefined &&
          res !== null &&
          res.fetchSellConversations !== null
        ) {
          dispatch(fetchSellConversationsSuccess(res.fetchSellConversations));
          resolve({ success: true });
        } else {
          dispatch(fetchSellConversationsFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        dispatch(fetchSellConversationsFailure());
        resolve({ success: false });
      });
  });
};

const toggleMessageView = selection => dispatch => {
  dispatch(changeMessageSelection(selection));
};

const onClickConversation = (conversationID, messageSelection) => dispatch => {
  console.log(conversationID);
  if (messageSelection === 'buying') {
    dispatch(toggleBuyConversation(conversationID));
  } else {
    dispatch(toggleSellConversation(conversationID));
  }
};

const changeMessageSelection = selection => {
  return {
    type: actionTypes.CHANGE_MESSAGE_SELECTION,
    payload: selection,
  };
};

const showModal = (currentListingContext, listingID) => {
  return {
    type: actionTypes.SHOW_MESSAGE_MODAL,
    payload: {
      currentListingContext,
      listingID,
    },
  };
};

const hideModal = () => {
  return {
    type: actionTypes.HIDE_MESSAGE_MODAL,
  };
};

const showReplyModal = conversationID => {
  return {
    type: actionTypes.SHOW_REPLY_MODAL,
    payload: {
      conversationID,
    },
  };
};

const hideReplyModal = () => {
  return {
    type: actionTypes.HIDE_REPLY_MODAL,
  };
};

const newMessageRequest = () => {
  return {
    type: actionTypes.NEW_MESSAGE_REQUEST,
  };
};

const newMessageSuccess = () => {
  return {
    type: actionTypes.NEW_MESSAGE_SUCCESS,
  };
};

const newMessageFailure = () => {
  return {
    type: actionTypes.NEW_MESSAGE_FAILURE,
  };
};

const newReplyRequest = () => {
  return {
    type: actionTypes.NEW_REPLY_REQUEST,
  };
};

const newReplySuccess = () => {
  return {
    type: actionTypes.NEW_REPLY_SUCCESS,
  };
};

const newReplyFailure = () => {
  return {
    type: actionTypes.NEW_REPLY_FAILURE,
  };
};

const fetchConversationsRequest = () => {
  return {
    type: actionTypes.FETCH_CONVERSATIONS_REQUEST,
  };
};

const fetchConversationsSuccess = conversations => {
  return {
    type: actionTypes.FETCH_CONVERSATIONS_SUCCESS,
    payload: conversations,
  };
};

const fetchConversationsFailure = () => {
  return {
    type: actionTypes.FETCH_CONVERSATIONS_FAILURE,
  };
};

const fetchBuyConversationsRequest = () => {
  return {
    type: actionTypes.FETCH_BUY_CONVERSATIONS_REQUEST,
  };
};

const fetchBuyConversationsSuccess = ({ data, metadata }) => {
  const hasMoreMessages = data.length === 3 ? true : false;
  return {
    type: actionTypes.FETCH_BUY_CONVERSATIONS_SUCCESS,
    payload: { data, metadata, hasMoreMessages },
  };
};

const fetchBuyConversationsFailure = () => {
  return {
    type: actionTypes.FETCH_BUY_CONVERSATIONS_FAILURE,
  };
};

const fetchSellConversationsRequest = () => {
  return {
    type: actionTypes.FETCH_SELL_CONVERSATIONS_REQUEST,
  };
};

const fetchSellConversationsSuccess = ({ data, metadata }) => {
  const hasMoreMessages = data.length === 3 ? true : false;
  return {
    type: actionTypes.FETCH_SELL_CONVERSATIONS_SUCCESS,
    payload: { data, metadata, hasMoreMessages },
  };
};

const fetchSellConversationsFailure = () => {
  return {
    type: actionTypes.FETCH_SELL_CONVERSATIONS_FAILURE,
  };
};

const toggleBuyConversation = conversationID => {
  return {
    type: actionTypes.ON_CLICK_BUY_CONVERSATION,
    payload: { conversationID },
  };
};

const toggleSellConversation = conversationID => {
  return {
    type: actionTypes.ON_CLICK_SELL_CONVERSATION,
    payload: { conversationID },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_MESSAGE_MODAL:
      return Object.assign({}, state, {
        showMessageModal: true,
        currentListingContext: action.payload.currentListingContext,
        listingID: action.payload.listingID,
      });
    case actionTypes.HIDE_MESSAGE_MODAL:
      return Object.assign({}, state, {
        showMessageModal: false,
      });
    case actionTypes.SHOW_REPLY_MODAL:
      return Object.assign({}, state, {
        showReplyModal: true,
        replyConversationID: action.payload.conversationID,
      });
    case actionTypes.HIDE_REPLY_MODAL:
      return Object.assign({}, state, {
        showReplyModal: false,
      });
    case actionTypes.NEW_MESSAGE_REQUEST:
      return Object.assign({}, state, {
        sendingMessage: true,
      });
    case actionTypes.NEW_MESSAGE_SUCCESS:
      return Object.assign({}, state, {
        sendingMessage: false,
      });
    case actionTypes.NEW_MESSAGE_FAILURE:
      return Object.assign({}, state, {
        sendingMessage: false,
      });
    case actionTypes.FETCH_CONVERSATIONS_REQUEST:
      return Object.assign({}, state, {
        loadingConversations: true,
      });
    case actionTypes.FETCH_CONVERSATIONS_SUCCESS:
      console.log(action);
      return Object.assign({}, state, {
        loadingConversations: false,
        conversations: action.payload,
      });
    case actionTypes.FETCH_CONVERSATIONS_FAILURE:
      return Object.assign({}, state, {
        loadingConversations: false,
      });
    case actionTypes.FETCH_BUY_CONVERSATIONS_REQUEST:
      return Object.assign({}, state, {
        buying: immutable.set(state.buying, 'loadingConversations', true),
      });
    case actionTypes.FETCH_BUY_CONVERSATIONS_SUCCESS:
      const buyConversations = [
        ...state.buying.conversations,
        ...action.payload.data,
      ];
      const updatedNextPage = state.buying.nextPage + 1;
      return Object.assign({}, state, {
        buying: immutable
          .wrap(state.buying)
          .set('conversations', buyConversations)
          .set('unread_count', action.payload.metadata.unread_count)
          .set('hasMoreMessages', action.payload.hasMoreMessages)
          .set('nextPage', updatedNextPage)
          .set('loadingConversations', false)
          .value(),
      });
    case actionTypes.FETCH_BUY_CONVERSATIONS_FAILURE:
      return Object.assign({}, state, {
        buying: immutable.set(state.buying, 'loadingConversations', false),
      });
    case actionTypes.FETCH_SELL_CONVERSATIONS_REQUEST:
      return Object.assign({}, state, {
        selling: immutable.set(state.selling, 'loadingConversations', true),
      });
    case actionTypes.FETCH_SELL_CONVERSATIONS_SUCCESS:
      const sellConversations = [
        ...state.selling.conversations,
        ...action.payload.data,
      ];
      const updatedNextSellPage = state.selling.nextPage + 1;

      return Object.assign({}, state, {
        selling: immutable
          .wrap(state.selling)
          .set('conversations', sellConversations)
          .set('unread_count', action.payload.metadata.unread_count)
          .set('hasMoreMessages', action.payload.hasMoreMessages)
          .set('nextPage', updatedNextSellPage)
          .set('loadingConversations', false)
          .value(),
      });
    case actionTypes.FETCH_SELL_CONVERSATIONS_FAILURE:
      return Object.assign({}, state, {
        selling: immutable.set(state.selling, 'loadingConversations', false),
      });
    case actionTypes.CHANGE_MESSAGE_SELECTION:
      return Object.assign({}, state, {
        messageSelection: action.payload,
      });
    case actionTypes.ON_CLICK_BUY_CONVERSATION:
      const { buying } = state;
      const { openConversations } = buying;
      if (openConversations.includes(action.payload.conversationID)) {
        const filteredOpenConversations = openConversations.filter(
          id => id !== action.payload.conversationID,
        );
        return Object.assign({}, state, {
          buying: immutable.set(
            state.buying,
            'openConversations',
            filteredOpenConversations,
          ),
        });
      } else {
        openConversations.push(action.payload.conversationID);
        return Object.assign({}, state, {
          buying: immutable.set(
            state.buying,
            'openConversations',
            openConversations,
          ),
        });
      }
    case actionTypes.ON_CLICK_SELL_CONVERSATION:
      const { selling } = state;

      const { conversationID } = action.payload;
      if (selling.openConversations.includes(conversationID)) {
        const filteredOpenConversations = selling.openConversations.filter(
          id => id !== conversationID,
        );
        return Object.assign({}, state, {
          selling: immutable.set(
            state.selling,
            'openConversations',
            filteredOpenConversations,
          ),
        });
      } else {
        selling.openConversations.push(conversationID);
        return Object.assign({}, state, {
          selling: immutable.set(
            state.selling,
            'openConversations',
            selling.openConversations,
          ),
        });
      }

    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    showMessageModal,
    hideMessageModal,
    displayReplyModal,
    undisplayReplyModal,
    newMessage,
    newReply,
    fetchConversations,
    fetchBuyMessages,
    fetchSellMessages,
    toggleMessageView,
    onClickConversation,
  },
};
