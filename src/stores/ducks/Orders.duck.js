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
    ON_CLICK_BUY_ORDER: 'ON_CLICK_BUY_ORDER',
    ON_CLICK_SELL_ORDER: 'ON_CLICK_SELL_ORDER',
  },
  duckName,
);

const initialState = {
  orderSelection: 'buying',
  buying: {
    orders: [],
    loadingOrders: false,
    openOrders: [],
    unread_count: 0,
  },
  selling: {
    orders: [],
    loadingOrders: false,
    openOrders: [],
    unread_count: 0,
  },
};

// Fetch Buy Orders

const fetchBuyOrders = page => dispatch => {
  dispatch(fetchBuyOrdersRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
        fetchBuyOrders {
          data {
            id
            orderNumber
            resellItem {
                id
                product {
                  id
                  name
                  slug 
                  original_image_url
                }
            }
            status
            price_cents
            shipping_cents
            platform_fees_buyer_cents
            total_price_cents
            purchased_at
            buyerRead
            purchased_at
          }
          metadata {
            unread_count
          }
        }
      }`)
      .then(res => {
        if (res !== undefined && res !== null && res.fetchBuyOrders !== null) {
          dispatch(fetchBuyOrdersSuccess(res.fetchBuyOrders));
          resolve({ success: true });
        } else {
          dispatch(fetchBuyOrdersFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        dispatch(fetchBuyOrdersFailure());
        resolve({ success: false });
      });
  });
};

const fetchSellOrders = page => dispatch => {
  dispatch(fetchSellOrdersRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
        fetchSellOrders {
          data {
            id
            orderNumber
            resellItem {
                id
                product {
                  id
                  name
                  slug 
                  original_image_url
                }
            }
            status
            price_cents
            seller_shipping_cents
            platform_fees_seller_cents
            seller_amount_made_cents
            purchased_at
            sellerRead
            purchased_at
          }
          metadata {
            unread_count
          }
        }
      }`)
      .then(res => {
        if (res !== undefined && res !== null && res.fetchSellOrders !== null) {
          dispatch(fetchSellOrdersSuccess(res.fetchSellOrders));
          resolve({ success: true });
        } else {
          dispatch(fetchSellOrdersFailure());
          resolve({ success: false });
        }
      })
      .catch(err => {
        dispatch(fetchSellOrdersFailure());
        resolve({ success: false });
      });
  });
};

const toggleOrdersView = selection => dispatch => {
  dispatch(changeOrdersSelection(selection));
};

const onClickOrder = (orderID, orderSelection) => dispatch => {
  console.log(orderID);
  if (orderSelection === 'buying') {
    dispatch(toggleBuyOrder(orderID));
  } else {
    dispatch(toggleSellOrder(orderID));
  }
};

const changeOrdersSelection = selection => {
  return {
    type: actionTypes.CHANGE_ORDERS_SELECTION,
    payload: selection,
  };
};

const fetchBuyOrdersRequest = () => {
  return {
    type: actionTypes.FETCH_BUY_ORDERS_REQUEST,
  };
};

const fetchBuyOrdersSuccess = ({ data, metadata }) => {
  return {
    type: actionTypes.FETCH_BUY_ORDERS_SUCCESS,
    payload: { data, metadata },
  };
};

const fetchBuyOrdersFailure = () => {
  return {
    type: actionTypes.FETCH_BUY_ORDERS_FAILURE,
  };
};

const fetchSellOrdersRequest = () => {
  return {
    type: actionTypes.FETCH_SELL_ORDERS_REQUEST,
  };
};

const fetchSellOrdersSuccess = ({ data, metadata }) => {
  return {
    type: actionTypes.FETCH_SELL_ORDERS_SUCCESS,
    payload: { data, metadata },
  };
};

const fetchSellOrdersFailure = () => {
  return {
    type: actionTypes.FETCH_SELL_ORDERS_FAILURE,
  };
};

const toggleBuyOrder = orderID => {
  return {
    type: actionTypes.ON_CLICK_BUY_ORDER,
    payload: { orderID },
  };
};

const toggleSellOrder = orderID => {
  return {
    type: actionTypes.ON_CLICK_SELL_ORDER,
    payload: { orderID },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BUY_ORDERS_REQUEST:
      return Object.assign({}, state, {
        buying: immutable.set(state.buying, 'loadingOrders', true),
      });
    case actionTypes.FETCH_BUY_ORDERS_SUCCESS:
      return Object.assign({}, state, {
        buying: immutable
          .wrap(state.buying)
          .set('orders', action.payload.data)
          .set('unread_count', action.payload.metadata.unread_count)
          .set('loadingOrders', false)
          .value(),
      });
    case actionTypes.FETCH_BUY_ORDERS_FAILURE:
      return Object.assign({}, state, {
        buying: immutable.set(state.buying, 'loadingOrders', false),
      });
    case actionTypes.FETCH_SELL_ORDERS_REQUEST:
      return Object.assign({}, state, {
        selling: immutable.set(state.selling, 'loadingOrders', true),
      });
    case actionTypes.FETCH_SELL_ORDERS_SUCCESS:
      return Object.assign({}, state, {
        selling: immutable
          .wrap(state.selling)
          .set('orders', action.payload.data)
          .set('unread_count', action.payload.metadata.unread_count)
          .set('loadingOrders', false)
          .value(),
      });
    case actionTypes.FETCH_SELL_ORDERS_FAILURE:
      return Object.assign({}, state, {
        selling: immutable.set(state.selling, 'loadingOrders', false),
      });
    case actionTypes.CHANGE_ORDERS_SELECTION:
      return Object.assign({}, state, {
        orderSelection: action.payload,
      });
    case actionTypes.ON_CLICK_BUY_ORDER:
      const { buying } = state;
      const { openOrders } = buying;
      if (openOrders.includes(action.payload.orderID)) {
        const filteredOpenOrders = openOrders.filter(
          id => id !== action.payload.orderID,
        );
        return Object.assign({}, state, {
          buying: immutable.set(state.buying, 'openOrders', filteredOpenOrders),
        });
      } else {
        openOrders.push(action.payload.orderID);
        return Object.assign({}, state, {
          buying: immutable.set(state.buying, 'openOrders', openOrders),
        });
      }
    case actionTypes.ON_CLICK_SELL_ORDER:
      const { selling } = state;

      const { orderID } = action.payload;
      if (selling.openOrders.includes(orderID)) {
        const filteredOpenOrders = selling.openOrders.filter(
          id => id !== orderID,
        );
        return Object.assign({}, state, {
          selling: immutable.set(
            state.selling,
            'openOrders',
            filteredOpenOrders,
          ),
        });
      } else {
        selling.openOrders.push(orderID);
        return Object.assign({}, state, {
          selling: immutable.set(
            state.selling,
            'openOrders',
            selling.openOrders,
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
    fetchBuyOrders,
    fetchSellOrders,
    toggleOrdersView,
    onClickOrder,
  },
};
