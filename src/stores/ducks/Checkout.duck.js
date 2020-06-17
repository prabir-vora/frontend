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

    UPDATE_SHIPPING_ADDRESS_REQUEST: 'UPDATE_SHIPPING_ADDRESS_REQUEST',
    UPDATE_SHIPPING_ADDRESS_SUCCESS: 'UPDATE_SHIPPING_ADDRESS_SUCCESS',
    UPDATE_SHIPPING_ADDRESS_FAILURE: 'UPDATE_SHIPPING_ADDRESS_FAILURE',

    UPDATE_PAYMENT_METHOD_REQUEST: 'UPDATE_PAYMENT_METHOD_REQUEST',
    UPDATE_PAYMENT_METHOD_SUCCESS: 'UPDATE_PAYMENT_METHOD_SUCCESS',
    UPDATE_PAYMENT_METHOD_FAILURE: 'UPDATE_PAYMENT_METHOD_FAILURE',

    PURCHASE_ORDER_REQUEST: 'PURCHASE_ORDER_REQUEST',
    PURCHASE_ORDER_SUCCESS: 'PURCHASE_ORDER_SUCCESS',
    PURCHASE_ORDER_FAILURE: 'PURCHASE_ORDER_FAILURE',

    ON_PAYMENT_SUCCESS: 'ON_PAYMENT_SUCCESS',

    FETCH_ORDER_REQUEST: 'FETCH_ORDER_REQUEST',
    FETCH_ORDER_SUCCESS: 'FETCH_ORDER_SUCCESS',
    FETCH_ORDER_FAILURE: 'FETCH_ORDER_FAILURE',

    FETCH_SELLER_ORDER_REQUEST: 'FETCH_SELLER_ORDER_REQUEST',
    FETCH_SELLER_ORDER_SUCCESS: 'FETCH_SELLER_ORDER_SUCCESS',
    FETCH__SELLER_ORDER_FAILURE: 'FETCH_SELLER_ORDER_FAILURE',
  },
  duckName,
);

const initialState = {
  currentOrderNumber: '',
  currentSellerOrderNumber: '',
  ordersMap: {},
  error: '',
  newShippingAdrressError: '',
  newPaymentMethodError: '',
  updateShippingAddressError: '',
  updatePaymentMethodError: '',
  isSaving: false,
  isSavingSellerOrder: false,
  sellerOrderError: '',
  sellerOrdersMap: {},
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
                    purchased_at
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
        purchased_at
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
          purchased_at
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

const updateShippingAddress = (orderNumber, addressID) => dispatch => {
  dispatch(updateShippingAddressRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`mutation {
      updateShippingAddress(orderNumber: "${orderNumber}", addressID: "${addressID}") {
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
          purchased_at
        }
        error
      }
    }
  `)
      .then(res => {
        console.log(res);
        if (res !== null && res !== undefined && res.updateShippingAddress) {
          const { orderNumber } = res.updateShippingAddress.order;
          dispatch(
            updateShippingAddressSuccess(
              orderNumber,
              res.updateShippingAddress.order,
            ),
          );
          resolve({
            updated: true,
            message: 'Added address successfully',
          });

          // Update the user with the new addresses
        } else {
          dispatch(updateShippingAddressError(res.updateShippingAddress.error));
          resolve({
            updated: false,
            message: 'Failed to add address',
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(updateShippingAddressError('Failed to add address'));
        resolve({
          updated: false,
          message: 'Failed to add address',
        });
      });
  });
};

const updatePaymentMethod = (orderNumber, paymentID) => dispatch => {
  dispatch(updatePaymentMethodRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`mutation {
      updatePaymentMethod(orderNumber: "${orderNumber}", paymentID: "${paymentID}") {
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
          purchased_at
        }
        error
      }
    }
  `)
      .then(res => {
        console.log(res);
        if (res !== null && res !== undefined && res.updatePaymentMethod) {
          const { orderNumber } = res.updatePaymentMethod.order;
          dispatch(
            updatePaymentMethodSuccess(
              orderNumber,
              res.updatePaymentMethod.order,
            ),
          );
          resolve({
            updated: true,
            message: 'Updated payment methods successfully',
          });

          // Update the user with the new payment methods
        } else {
          dispatch(updatePaymentMethodError(res.updatePaymentMethod.error));
          resolve({
            updated: false,
            message: 'Failed to update payment method',
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(updatePaymentMethodError('Failed to update payment Method'));
        resolve({
          updated: false,
          message: 'Failed to update payment Method',
        });
      });
  });
};

const purchaseOrder = orderNumber => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        createOrderPaymentIntent(orderNumber: "${orderNumber}") 
      }
    `)
      .then(res => {
        console.log(res);
        if (
          res !== null &&
          res !== undefined &&
          res.createOrderPaymentIntent !== null
        ) {
          resolve(res.createOrderPaymentIntent);
        } else {
          resolve('');
        }
      })
      .catch(err => {
        console.log(err);
        resolve('');
      });
  });
};

const onPaymentSuccess = orderNumber => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        orderPaymentSuccess(orderNumber: "${orderNumber}") 
      }
   `)
      .then(res => {
        resolve(true);
      })
      .catch(res => {
        resolve(false);
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
                      purchased_at
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
          resolve({ success: false, message: res.fetchOrder.error });
        }
      })
      .catch(err => {
        dispatch(fetchOrderError('Failed to fetch order'));
        resolve({ success: false, message: 'Failed to fetch order' });
      });
  });
};

const fetchSellerOrder = orderNumber => dispatch => {
  dispatch(fetchSellerOrderRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            query {
                fetchSellerOrder(orderNumber: "${orderNumber}") {
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
                          askingPrice
                          condition
                          size
                          images
                      }
                      seller
                      sellerAddress {
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
                      status
                      price_cents
                      purchased_at
                      seller_amount_made_cents
                      seller_shipping_cents 
                      platform_fees_seller_cents 
                      applicationFeeRateCharged 
                      sellerScoreDuringPurchase 
                    }
                    error
                }
            }
        `)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.fetchSellerOrder !== null &&
          res.fetchSellerOrder !== undefined &&
          res.fetchSellerOrder.order !== null &&
          res.fetchSellerOrder.order !== undefined &&
          res.fetchSellerOrder.error === ''
        ) {
          const { orderNumber } = res.fetchSellerOrder.order;
          dispatch(
            fetchSellerOrderSuccess(orderNumber, res.fetchSellerOrder.order),
          );
          resolve({
            success: true,
            message: 'Fetched Order Successfully',
            orderNumber,
          });
        } else {
          dispatch(fetchSellerOrderError(res.fetchSellerOrder.error));
          resolve({ success: false, message: res.fetchSellerOrder.error });
        }
      })
      .catch(err => {
        dispatch(fetchSellerOrderError('Failed to fetch order'));
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

const updateShippingAddressRequest = () => {
  return {
    type: actionTypes.UPDATE_SHIPPING_ADDRESS_REQUEST,
  };
};

const updateShippingAddressSuccess = (orderNumber, data) => {
  return {
    type: actionTypes.UPDATE_SHIPPING_ADDRESS_SUCCESS,
    payload: { orderNumber, data },
  };
};

const updateShippingAddressError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.UPDATE_SHIPPING_ADDRESS_FAILURE,
    payload: { errorMessage },
  };
};

const updatePaymentMethodRequest = () => {
  return {
    type: actionTypes.UPDATE_PAYMENT_METHOD_REQUEST,
  };
};

const updatePaymentMethodSuccess = (orderNumber, data) => {
  return {
    type: actionTypes.UPDATE_PAYMENT_METHOD_SUCCESS,
    payload: { orderNumber, data },
  };
};

const updatePaymentMethodError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.UPDATE_PAYMENT_METHOD_FAILURE,
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

const fetchSellerOrderRequest = () => {
  return {
    type: actionTypes.FETCH_SELLER_ORDER_REQUEST,
  };
};

const fetchSellerOrderSuccess = (orderNumber, data) => {
  return {
    type: actionTypes.FETCH_SELLER_ORDER_SUCCESS,
    payload: { orderNumber, data },
  };
};

const fetchSellerOrderError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.FETCH_SELLER_ORDER_FAILURE,
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
        newShippingAdrressError: action.payload.errorMessage,
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
        newPaymentMethodError: action.payload.errorMessage,
      });
    case actionTypes.UPDATE_SHIPPING_ADDRESS_REQUEST:
      return state;
    case actionTypes.UPDATE_SHIPPING_ADDRESS_SUCCESS:
      return Object.assign({}, state, {
        currentOrderNumber: action.payload.orderNumber,
        ordersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderNumber]: action.payload.data,
        }),
      });
    case actionTypes.UPDATE_SHIPPING_ADDRESS_FAILURE:
      return Object.assign({}, state, {
        updateShippingAddressError: action.payload.errorMessage,
      });
    case actionTypes.UPDATE_PAYMENT_METHOD_REQUEST:
      return state;
    case actionTypes.UPDATE_PAYMENT_METHOD_SUCCESS:
      return Object.assign({}, state, {
        currentOrderNumber: action.payload.orderNumber,
        ordersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderNumber]: action.payload.data,
        }),
      });
    case actionTypes.UPDATE_PAYMENT_METHOD_FAILURE:
      return Object.assign({}, state, {
        updatePaymentMethodError: action.payload.errorMessage,
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
    case actionTypes.FETCH_SELLER_ORDER_REQUEST:
      return Object.assign({}, state, {
        isSavingSellerOrder: true,
      });
    case actionTypes.FETCH_SELLER_ORDER_SUCCESS:
      return Object.assign({}, state, {
        isSavingSellerOrder: false,
        currentSellerOrderNumber: action.payload.orderNumber,
        sellerOrdersMap: Object.assign({}, state.ordersMap, {
          [action.payload.orderNumber]: action.payload.data,
        }),
      });
    case actionTypes.FETCH_SELLER_ORDER_FAILURE:
      return Object.assign({}, state, {
        isSavingSellerOrder: false,
        sellerOrderError: action.payload.errorMessage,
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
    updateShippingAddress,
    updatePaymentMethod,
    fetchOrder,
    fetchNewSetupIntent,
    purchaseOrder,
    onPaymentSuccess,
    fetchSellerOrder,
  },
};
