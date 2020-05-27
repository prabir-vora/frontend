import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

import * as immutable from 'object-path-immutable';

// Duck Name
const duckName = 'ORDERS';

const actionTypes = createActionTypes(
  {
    FETCH_BUY_ORDERS_REQUEST: 'FETCH_BUY_ORDERS_REQUEST',
    FETCH_BUY_ORDERS_SUCCESS: 'FETCH_BUY_ORDERS_SUCCESS',
    FETCH_BUY_ORDERS_FAILURE: 'FETCH_BUY_ORDERS_FAILURE',

    FETCH_SELL_ORDERS_REQUEST: 'FETCH_SELL_ORDERS_REQUEST',
    FETCH_SELL_ORDERS_SUCCESS: 'FETCH_SELL_ORDERS_SUCCESS',
    FETCH_SELL_ORDERS_FAILURE: 'FETCH_SELL_ORDERS_FAILURE',

    CHANGE_ORDERS_SELECTION: 'CHANGE_ORDERS_SELECTION',
  },
  duckName,
);

const initialState = {
  messageSelection: 'buying',
  buying: {
    orders: [],
    nextPage: 1,
    loadingOrders: false,
    unread_count: 0,
    hasMoreOrders: true,
  },
  selling: {
    orders: [],
    nextPage: 1,
    loadingOrders: false,
    unread_count: 0,
    hasMoreOrders: true,
  },
};

// Fetch Buy Conversations

const fetchBuyOrders = page => dispatch => {
  dispatch(fetchBuyConversationsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
        fetchBuyConversations(page: ${page}) {
          data {
            orderNumber
            resellItem {
                id
                product {
                    id
                    name
                    slug 
                    original_image_url
                }
                reseller {
                    id
                    name
                    username
                    imageURL
                    isReseller
                    resellerPageName
                }
                askingPrice
                condition
                size
                images
            }
            status
            total_price_cents
            purchased_at
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

const fetchSellOrders = page => dispatch => {
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
