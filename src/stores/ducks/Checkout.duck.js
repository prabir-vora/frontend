import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

const duckName = 'CHECKOUT';
const actionTypes = createActionTypes(
  {
    CREATE_ORDER_REQUEST: 'CREATE_ORDER_REQUEST',
    CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
    CREATE_ORDER_FAILURE: 'CREATE_ORDER_FAILURE',
  },
  duckName,
);

const initialState = {
  currentSlug: '',
  ordersMap: {},
  error: '',
  isSaving: false,
};

const createOrder = listingID => dispatch => {
  dispatch(createOrderRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                createOrder(listingID: "${listingID}") {
                    resellItem
                    buyer
                    seller
                    address
                    billingInfo
                    orderTotalPrice
                    shippingPrice
                    authenticationRequired
                    buyerStatus
                    sellerStatus

                }
            }
        `);
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //  --------> Mutations

    case actionTypes.CREATE_ORDER_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
      });
    case actionTypes.CREATE_ORDER_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        currentSlug: action.payload.orderSlug,
        ordersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderSlug]: action.payload.data,
        }),
      });
    case actionTypes.CREATE_ORDER_ERROR:
      return Object.assign({}, state, {
        isSaving: false,
        error: action.payload.errorMessage,
        currentSlug: action.payload.orderSlug,
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    getProductListing,
  },
};
