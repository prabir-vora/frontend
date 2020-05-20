import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

const duckName = 'CHECKOUT';
const actionTypes = createActionTypes(
  {
    CREATE_ORDER_REQUEST: 'CREATE_ORDER_REQUEST',
    CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
    CREATE_ORDER_FAILURE: 'CREATE_ORDER_FAILURE',

    CREATE_SHIPPING_ADDRESS_REQUEST: 'CREATE_SHIPPING_ADDRESS_REQUEST',
    CREATE_SHIPPING_ADDRESS_SUCCESS: 'CREATE_SHIPPING_ADDRESS_SUCCESS',
    CREATE_SHIPPING_ADDRESS_FAILURE: 'CREATE_SHIPPING_ADDRESS_FAILURE',

    CREATE_PAYMENT_METHOD_REQUEST: 'CREATE_PAYMENT_METHOD_REQUEST',
    CREATE_PAYMENT_METHOD_SUCCESS: 'CREATE_PAYMENT_METHOD_SUCCESS',
    CREATE_PAYMENT_METHOD_FAILURE: 'CREATE_PAYMENT_METHOD_FAILURE',

    FETCH_ORDER_REQUEST: 'FETCH_ORDER_REQUEST',
    FETCH_ORDER_SUCCESS: 'FETCH_ORDER_SUCCESS',
    FETCH_ORDER_FAILURE: 'FETCH_ORDER_FAILURE',
  },
  duckName,
);

const initialState = {
  currentOrderNumber: '',
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
                    buyer
                    seller
                    buyerAddress {
                        id
                        postal_code
                        city_locality
                        state_province
                        country_code
                        country
                        address1
                        address2
                        name
                        phone
                    }
                    billingInfo {
                        id
                        payment_method_id
                        name
                        payment_type
                        card_brand
                        last_4_digits
                        processor_name
                    }
                    status
                    price_cents
                    total_price_cents
                    shipping_cents
                }
            }
        `).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.createOrder !== null &&
        res.createOrder !== undefined
      ) {
        const { orderNumber } = res.createOrder;
        dispatch(createOrderSuccess(orderNumber, res.createOrder));
        resolve({
          success: true,
          message: 'Created Order Successfully',
          orderNumber,
        });
      } else {
        dispatch(createOrderError('Failed to create order'));
        resolve({ success: false, message: 'Failed to create order' });
      }
    });
  });
};

const createShippingAddressWithInput = () => {
  return `
  mutation($orderNumber: String!, $address: AddressInput!) {
    createShippingAddress(orderNumber: $orderNumber, address: $address) {
      order { 
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
        buyer
        seller
        buyerAddress {
            id
            postal_code
            city_locality
            state_province
            country_code
            country
            address1
            address2
            name
            phone
        }
        billingInfo {
            id
            payment_method_id
            name
            payment_type
            card_brand
            last_4_digits
            processor_name
        }
        status
        price_cents
        total_price_cents
        shipping_cents
      }
      error
    }
  }
`;
};

const createShippingAddress = (orderNumber, address) => dispatch => {
  dispatch(createShippingAddressRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(createShippingAddressWithInput(), undefined, {
      orderNumber,
      address,
    })
      .then(res => {
        console.log(res);
        if (res !== null && res !== undefined && res.createShippingAddress) {
          const { orderNumber } = res.createShippingAddress.order;
          dispatch(
            createShippingAddressSuccess(
              orderNumber,
              res.createShippingAddress.order,
            ),
          );
          resolve({
            updated: true,
            message: 'Added address successfully',
          });

          // Update the user with the new addresses
        } else {
          dispatch(createShippingAddressError(res.createShippingAddress.error));
          resolve({
            updated: false,
            message: 'Failed to add address',
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(createShippingAddressError('Failed to add address'));
        resolve({
          updated: false,
          message: 'Failed to add address',
        });
      });
  });
};

const createPaymentMethodWithInput = () => {
  return `
    mutation($orderNumber: String!, $paymentMethodID: String!) {
      createPaymentMethod(orderNumber: $orderNumber, paymentMethodID: $paymentMethodID) {
        order { 
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
          buyer
          seller
          buyerAddress {
              id
              postal_code
              city_locality
              state_province
              country_code
              country
              address1
              address2
              name
              phone
          }
          billingInfo {
              id
              payment_method_id
              name
              payment_type
              card_brand
              last_4_digits
              processor_name
          }
          status
          price_cents
          total_price_cents
          shipping_cents
        }
        error
      }
    }
  `;
};

const createPaymentMethod = (orderNumber, paymentMethodID) => dispatch => {
  dispatch(createPaymentMethodRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(createPaymentMethodWithInput(), undefined, {
      orderNumber,
      paymentMethodID,
    })
      .then(res => {
        if (res !== null && res !== undefined && res.createPaymentMethod) {
          const { orderNumber } = res.createPaymentMethod.order;
          dispatch(
            createPaymentMethodSuccess(
              orderNumber,
              res.createPaymentMethod.order,
            ),
          );
          resolve({
            updated: true,
            message: 'Added payment method successfully',
          });
        } else {
          dispatch(createPaymentMethodError(res.createPaymentMethod.error));
          resolve({
            updated: false,
            message: 'Failed to add payment method',
          });
        }
      })
      .catch(err => {
        dispatch(createPaymentMethodError('Failed to add payment method'));
        resolve({
          updated: false,
          message: 'Failed to add payment method',
        });
      });
  });
};

const fetchNewSetupIntent = () => diispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      query {
        fetchNewSetupIntent 
      }
    `).then(res => {
      if (res !== null && res !== undefined && res.fetchNewSetupIntent) {
        console.log(res.fetchNewSetupIntent);
        resolve({ success: true, clientSecret: res.fetchNewSetupIntent });
      } else {
        resolve({ success: false, clientSecret: null });
      }
    });
  });
};

const fetchOrder = orderNumber => dispatch => {
  dispatch(fetchOrderRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            query {
                fetchOrder(orderNumber: "${orderNumber}") {
                    order { 
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
                      buyer
                      seller
                      buyerAddress {
                          id
                          postal_code
                          city_locality
                          state_province
                          country_code
                          country
                          address1
                          address2
                          name
                          phone
                      }
                      billingInfo {
                          id
                          payment_method_id
                          name
                          payment_type
                          card_brand
                          last_4_digits
                          processor_name
                      }
                      status
                      price_cents
                      total_price_cents
                      shipping_cents
                    }
                    error
                }
            }
        `)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.fetchOrder !== null &&
          res.fetchOrder !== undefined &&
          res.fetchOrder.order !== null &&
          res.fetchOrder.order !== undefined &&
          res.fetchOrder.error === ''
        ) {
          const { orderNumber } = res.fetchOrder.order;
          dispatch(fetchOrderSuccess(orderNumber, res.fetchOrder.order));
          resolve({
            success: true,
            message: 'Fetched Order Successfully',
            orderNumber,
          });
        } else {
          dispatch(fetchOrderError(res.fetchOrder.error));
          resolve({ success: false, message: 'Failed to fetch order' });
        }
      })
      .catch(err => {
        dispatch(fetchOrderError('Failed to fetch order'));
        resolve({ success: false, message: 'Failed to fetch order' });
      });
  });
};

const createOrderRequest = () => {
  return {
    type: actionTypes.CREATE_ORDER_REQUEST,
  };
};

const createOrderSuccess = (orderNumber, data) => {
  return {
    type: actionTypes.CREATE_ORDER_SUCCESS,
    payload: { orderNumber, data },
  };
};

const createOrderError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.CREATE_ORDER_FAILURE,
    payload: { errorMessage },
  };
};

const createShippingAddressRequest = () => {
  return {
    type: actionTypes.CREATE_SHIPPING_ADDRESS_REQUEST,
  };
};

const createShippingAddressSuccess = (orderNumber, data) => {
  return {
    type: actionTypes.CREATE_SHIPPING_ADDRESS_SUCCESS,
    payload: { orderNumber, data },
  };
};

const createShippingAddressError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.CREATE_SHIPPING_ADDRESS_FAILURE,
    payload: { errorMessage },
  };
};

const createPaymentMethodRequest = () => {
  return {
    type: actionTypes.CREATE_PAYMENT_METHOD_REQUEST,
  };
};

const createPaymentMethodSuccess = (orderNumber, data) => {
  return {
    type: actionTypes.CREATE_PAYMENT_METHOD_SUCCESS,
    payload: { orderNumber, data },
  };
};

const createPaymentMethodError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.CREATE_PAYMENT_METHOD_FAILURE,
    payload: { errorMessage },
  };
};

const fetchOrderRequest = () => {
  return {
    type: actionTypes.FETCH_ORDER_REQUEST,
  };
};

const fetchOrderSuccess = (orderNumber, data) => {
  return {
    type: actionTypes.FETCH_ORDER_SUCCESS,
    payload: { orderNumber, data },
  };
};

const fetchOrderError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.FETCH_ORDER_FAILURE,
    payload: { errorMessage },
  };
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
        currentOrderNumber: action.payload.orderNumber,
        ordersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderNumber]: action.payload.data,
        }),
      });
    case actionTypes.CREATE_ORDER_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        error: action.payload.errorMessage,
      });
    case actionTypes.CREATE_SHIPPING_ADDRESS_REQUEST:
      return state;
    case actionTypes.CREATE_SHIPPING_ADDRESS_SUCCESS:
      return Object.assign({}, state, {
        currentOrderNumber: action.payload.orderNumber,
        ordersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderNumber]: action.payload.data,
        }),
      });
    case actionTypes.CREATE_SHIPPING_ADDRESS_FAILURE:
      return Object.assign({}, state, {
        error: action.payload.errorMessage,
      });
    case actionTypes.CREATE_PAYMENT_METHOD_REQUEST:
      return state;
    case actionTypes.CREATE_PAYMENT_METHOD_SUCCESS:
      return Object.assign({}, state, {
        currentOrderNumber: action.payload.orderNumber,
        ordersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderNumber]: action.payload.data,
        }),
      });
    case actionTypes.CREATE_PAYMENT_METHOD_FAILURE:
      return Object.assign({}, state, {
        error: action.payload.errorMessage,
      });
    case actionTypes.FETCH_ORDER_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
      });
    case actionTypes.FETCH_ORDER_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false,
        currentOrderNumber: action.payload.orderNumber,
        ordersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderNumber]: action.payload.data,
        }),
      });
    case actionTypes.FETCH_ORDER_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        error: action.payload.errorMessage,
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    createOrder,
    createShippingAddress,
    createPaymentMethod,
    fetchOrder,
    fetchNewSetupIntent,
  },
};
