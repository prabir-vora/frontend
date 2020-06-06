import slugify from 'slugify';
import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';
import * as immutable from 'object-path-immutable';

// Duck Name
const duckName = 'ADMIN_TEST';

const actionTypes = createActionTypes(
  {
    // -----> Users
    UPDATE_EXISTING_USER_REQUEST: 'UPDATE_EXISTING_USER_REQUEST',
    UPDATE_EXISTING_USER_SUCCESS: 'UPDATE_EXISTING_USER_SUCCESS',
    UPDATE_EXISTING_USER_ERROR: 'UPDATE_EXISTING_USER_ERROR',
    REMOVE_EXISTING_USER_REQUEST: 'REMOVE_EXISTING_USER_REQUEST',
    REMOVE_EXISTING_USER_SUCCESS: 'REMOVE_EXISTING_USER_SUCCESS',
    REMOVE_EXISTING_USER_ERROR: 'REMOVE_EXISTING_USER_ERROR',
    UPDATE_USER_IMAGE_REQUEST: 'UPDATE_USER_IMAGE_REQUEST',
    UPDATE_USER_IMAGE_SUCCESS: 'UPDATE_USER_IMAGE_SUCCESS',
    UPDATE_USER_IMAGE_ERROR: 'UPDATE_USER_IMAGE_ERROR',

    // -------> Resell Items
    CREATE_NEW_RESELL_ITEM_REQUEST: 'CREATE_NEW_RESELL_ITEM_REQUEST',
    CREATE_NEW_RESELL_ITEM_SUCCESS: 'CREATE_NEW_RESELL_ITEM_SUCCESS',
    CREATE_NEW_RESELL_ITEM_ERROR: 'CREATE_NEW_RESELL_ITEM_ERROR',
    UPDATE_EXISTING_RESELL_ITEM_REQUEST: 'UPDATE_EXISTING_RESELL_ITEM_REQUEST',
    UPDATE_EXISTING_RESELL_ITEM_SUCCESS: 'UPDATE_EXISTING_RESELL_ITEM_SUCCESS',
    UPDATE_EXISTING_RESELL_ITEM_ERROR: 'UPDATE_EXISTING_RESELL_ITEM_ERROR',
    UPDATE_RESELL_ITEM_IMAGES_REQUEST: 'UPDATE_RESELL_ITEM_IMAGES_REQUEST',
    UPDATE_RESELL_ITEM_IMAGES_SUCCESS: 'UPDATE_RESELL_ITEM_IMAGES_SUCCESS',
    UPDATE_RESELL_ITEM_IMAGES_ERROR: 'UPDATE_RESELL_ITEM_IMAGES_ERROR',
    REMOVE_EXISTING_RESELL_ITEM_REQUEST: 'REMOVE_EXISTING_RESELL_ITEM_REQUEST',
    REMOVE_EXISTING_RESELL_ITEM_SUCCESS: 'REMOVE_EXISTING_RESELL_ITEM_SUCCESS',
    REMOVE_EXISTING_RESELL_ITEM_ERROR: 'REMOVE_EXISTING_RESELL_ITEM_ERROR',
    UPDATE_RESELL_ITEM_IMAGE_REQUEST: 'UPDATE_RESELL_ITEM_IMAGE_REQUEST',
    UPDATE_RESELL_ITEM_IMAGE_SUCCESS: 'UPDATE_RESELL_ITEM_IMAGE_SUCCESS',
    UPDATE_RESELL_ITEM_IMAGE_ERROR: 'UPDATE_RESELL_ITEM_IMAGE_ERROR',

    // -------> Users
    GET_USERS_REQUEST: 'GET_USERS_REQUEST',
    GET_USERS_SUCCESS: 'GET_USERS_SUCCESS',
    GET_USERS_ERROR: 'GET_USERS_ERROR',

    // -------> Resell Items
    GET_RESELL_ITEMS_REQUEST: 'GET_RESELL_ITEMS_REQUEST',
    GET_RESELL_ITEMS_SUCCESS: 'GET_RESELL_ITEMS_SUCCESS',
    GET_RESELL_ITEMS_ERROR: 'GET_RESELL_ITEMS_ERROR',

    // -----> Filtering And Searching
    CHANGE_RESELL_ITEMS_QUERY: 'CHANGE_RESELL_ITEMS_QUERY',
    CHANGE_RESELL_ITEMS_DATE_INPUT: 'CHANGE_RESELL_ITEMS_DATE_INPUT',
    CHANGE_ORDERS_QUERY: 'CHANGE_ORDERS_QUERY',
    CHANGE_ORDERS_DATE_INPUT: 'CHANGE_ORDERS_DATE_INPUT',

    ORDER_STATUS_UPDATE_REQUEST: 'ORDER_STATUS_UPDATE_REQUEST',
    ORDER_STATUS_UPDATE_SUCCESS: 'ORDER_STATUS_UPDATE_SUCCESS',
    ORDER_STATUS_UPDATE_ERROR: 'ORDER_STATUS_UPDATE_ERROR',

    // ------> Orders
    GET_ORDERS_REQUEST: 'GET_ORDERS_REQUEST',
    GET_ORDERS_SUCCESS: 'GET_ORDERS_SUCCESS',
    GET_ORDERS_ERROR: 'GET_ORDERS_ERROR',
  },
  duckName,
);

const initialState = {
  users: {
    data: [],
    errorMessage: {},
    isFetching: false,
    isMutating: false,
  },
  resellItems: {
    data: [],
    query: '',
    dateInput: 'allTime',
    errorMessage: {},
    isFetching: false,
    isMutating: false,
  },
  orders: {
    data: [],
    query: '',
    dateInput: 'allTime',
    errorMessage: {},
    isFetching: false,
    isMutating: false,
  },
};

// <------------ Users ----------------->

const updateUserWithInputType = () => {
  return `
        mutation($reseller: UserInput!, $id: ID!) {
                updateExistingUser(reseller: $reseller, id: $id) 
            }
        `;
};

const updateExistingUser = resellerInfo => dispatch => {
  dispatch(updateExistingUserRequest());
  const { name, id, lat, lng } = resellerInfo;
  const resellerSlug = slugify(name, {
    replacement: '-',
    lower: true, // convert to lower case, defaults to `false`
  });
  const _geoloc = {
    lat,
    lng,
  };

  const reseller = immutable
    .wrap(resellerInfo)
    .set('_geoloc', _geoloc)
    .set('slug', resellerSlug)
    .del('lat')
    .del('lng')
    .del('imageURL')
    .del('id')
    .value();

  return new Promise((resolve, reject) => {
    fetchGraphQL(updateUserWithInputType(), undefined, {
      reseller,
      id,
    })
      .then(res => {
        if ((res !== null) & (res !== undefined) && res.updateExistingUser) {
          dispatch(updateExistingUserSuccess());
          resolve({ updated: true, message: 'Updated User Successfully' });
        } else {
          dispatch(updateExistingUserError('Could Not Update User'));
          resolve({ updated: false, message: 'Failed to update User' });
        }
      })
      .catch(err => {
        dispatch(updateExistingUserError(err.response));
        resolve({ updated: false, message: 'Failed to update User' });
      });
  });
};

const removeExistingUser = resellerInfo => dispatch => {
  dispatch(removeExistingUserRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                removeExistingUser(id: "${resellerInfo.id}")
            }
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.removeExistingUser) {
          dispatch(removeExistingUserSuccess());
          resolve({ deleted: true, message: 'Deleted User Successfully' });
        } else {
          dispatch(removeExistingUserError('Could Not Remove User'));
          resolve({ deleted: false, message: 'Failed to delete User' });
        }
      })
      .catch(err => {
        dispatch(removeExistingUserError(err.response));
        resolve({ deleted: false, message: 'Failed to delete User' });
      });
  });
};

const updateUserImage = (imageURL, resellerInfo) => dispatch => {
  dispatch(updateUserImageRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                updateUserImage(id: "${resellerInfo.id}", imageURL: "${imageURL}")
            }    
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.updateUserImage) {
          dispatch(updateUserImageSuccess());
          resolve({
            updated: true,
            message: 'Updated User Image Successfully',
          });
        } else {
          dispatch(updateUserImageFailure('Could Not Update User Image'));
          resolve({
            updated: false,
            message: 'Failed to update User Image',
          });
        }
      })
      .catch(err => {
        dispatch(updateUserImageFailure(err.response));
        resolve({ updated: false, message: 'Failed to update User Image' });
      });
  });
};

// <------------ RESELL ITEM ----------------->

const createResellItemWithInputType = () => {
  return `
        mutation($resellItem: ResellItemInput!, ) {
                createNewResellItem(resellItem: $resellItem) {
                    id
                }
            }
        `;
};

const createNewResellItem = resellItemInfo => dispatch => {
  dispatch(createNewResellItemRequest());
  const { product, reseller, askingPrice, size } = resellItemInfo;
  const resellItemSlug = slugify(product.label + ' ' + reseller.label, {
    replacement: '-',
    lower: true, // convert to lower case, defaults to `false`
  });

  const resellItem = immutable
    .wrap(resellItemInfo)
    .set('slug', resellItemSlug)
    .set('product', product.value)
    .set('reseller', reseller.value)
    .set('askingPrice', parseInt(askingPrice))
    .set('size', size.value)
    .del('productType')
    .value();
  return new Promise((resolve, reject) => {
    fetchGraphQL(createResellItemWithInputType(), undefined, {
      resellItem,
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.createNewResellItem !== null &&
          res.createNewResellItem !== undefined
        ) {
          dispatch(createNewResellItemSuccess());
          resolve({
            created: true,
            message: 'Created ResellItem Successfully',
          });
        } else {
          dispatch(createNewResellItemError());
          resolve({ created: false, message: 'Failed to Create Resell Item' });
        }
      })
      .catch(err => {
        dispatch(createNewResellItemError(err.response));
        resolve({ created: false, message: 'Failed to Create Resell Item' });
      });
  });
};

const updateResellItemWithInputType = () => {
  return `
        mutation($resellItem: ResellItemInput!, $id: ID!) {
                updateExistingResellItem(resellItem: $resellItem, id: $id)
            }
        `;
};

const updateExistingResellItem = resellItemInfo => dispatch => {
  dispatch(updateExistingResellItemRequest());

  const { product, reseller, askingPrice, size, id } = resellItemInfo;
  const resellItemSlug = slugify(product.label + ' ' + reseller.label, {
    replacement: '-',
    lower: true, // convert to lower case, defaults to `false`
  });

  const resellItem = immutable
    .wrap(resellItemInfo)
    .set('slug', resellItemSlug)
    .set('product', product.value)
    .set('reseller', reseller.value)
    .set('size', size.value)
    .set('askingPrice', parseInt(askingPrice))
    .del('productType')
    .del('id')
    .value();
  return new Promise((resolve, reject) => {
    fetchGraphQL(updateResellItemWithInputType(), undefined, {
      resellItem,
      id,
    })
      .then(res => {
        if (
          (res !== null) & (res !== undefined) &&
          res.updateExistingResellItem
        ) {
          dispatch(updateExistingResellItemSuccess());
          resolve({
            updated: true,
            message: 'Updated Resell Item Successfully',
          });
        } else {
          dispatch(
            updateExistingResellItemError('Could Not Update Resell Item'),
          );
          resolve({ updated: false, message: 'Failed to update Resell Item' });
        }
      })
      .catch(err => {
        dispatch(updateExistingResellItemError(err.response));
        resolve({ updated: false, message: 'Failed to update ResellItem' });
      });
  });
};

const updateResellItemImagesWithInput = () => {
  return `
  mutation($id: ID!, $images: [String!]!) {
      updateResellItemImages(id: $id, imageURLs: $images)
  }
  `;
};

const updateResellItemImages = (images, resellItemInfo) => dispatch => {
  dispatch(updateResellItemImagesRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(updateResellItemImagesWithInput(), undefined, {
      id: resellItemInfo.id,
      images,
    })
      .then(res => {
        if (res !== null && res !== undefined && res.updateResellItemImages) {
          dispatch(updateResellItemImagesSuccess());
          resolve({
            updated: true,
            message: 'Updated Resell Item Image Successfully',
          });
        } else {
          dispatch(
            updateResellItemImagesFailure('Could Not Update Resell Item Image'),
          );
          resolve({
            updated: false,
            message: 'Failed to update Resell Item Image',
          });
        }
      })
      .catch(err => {
        dispatch(updateResellItemImagesFailure(err.response));
        resolve({
          updated: false,
          message: 'Failed to update Resell Item Image',
        });
      });
  });
};

const removeExistingResellItem = resellItemInfo => dispatch => {
  dispatch(removeExistingResellItemRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                removeExistingResellItem(id: "${resellItemInfo.id}")
            }
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.removeExistingResellItem) {
          dispatch(removeExistingResellItemSuccess());
          resolve({
            deleted: true,
            message: 'Deleted Resell Item Successfully',
          });
        } else {
          dispatch(
            removeExistingResellItemError('Could Not Remove Resell Item'),
          );
          resolve({ deleted: false, message: 'Failed to delete Resell Item' });
        }
      })
      .catch(err => {
        dispatch(removeExistingResellItemError(err.response));
        resolve({ deleted: false, message: 'Failed to delete Resell Item' });
      });
  });
};

const getAllUsers = () => dispatch => {
  dispatch(getAllUsersRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            getAllUsers {
              name
              username
              email
              authCode
              
            }
        }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getAllUsers !== null &&
          res.getAllUsers !== undefined
        ) {
          dispatch(getAllUsersSuccess(res.getAllUsers));
          resolve({ success: true, message: 'Fetched Users successfully' });
        } else {
          dispatch(getAllUsersError('Could not fetch Users'));
          resolve({ success: false, message: 'Failed to fetch users' });
        }
      })
      .catch(err => {
        dispatch(getAllUsersError(err.response));
        resolve({ success: false, message: 'Failed to fetch users' });
      });
  });
};

const getAllResellItems = (query = '', dateInput = 'allTime') => dispatch => {
  dispatch(getAllResellItemsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          query {
              getAllResellItems(query: "${query}", dateInput: "${dateInput}") {
                  id
                  product {
                      id
                      name
                      productCategory
                      original_image_url
                  }
                  reseller {
                      id 
                      name
                  }
                  availability
                  askingPrice
                  condition
                  images
                  size
              }
          }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getAllResellItems !== null &&
          res.getAllResellItems !== undefined
        ) {
          const results = res.getAllResellItems;
          const resellItems = results.map(resellItem => {
            const { product, reseller, askingPrice, size = '' } = resellItem;
            return immutable
              .wrap(resellItem)
              .set('product', { value: product.id, label: product.name })
              .set('productType', product.productCategory)
              .set('reseller', { value: reseller.id, label: reseller.name })
              .set('size', { value: size, label: size })
              .set('askingPrice', `${askingPrice}`)
              .set('imageURL', product.original_image_url)
              .value();
          });
          dispatch(getAllResellItemsSuccess(resellItems));
          resolve({
            success: true,
            message: 'Fetched Resell Items successfully',
          });
        } else {
          dispatch(getAllResellItemsError('Could not fetch ResellItems'));
          resolve({ success: false, message: 'Failed to fetch resell items' });
        }
      })
      .catch(err => {
        dispatch(getAllResellItemsError(err.response));
        resolve({ success: false, message: 'Failed to fetch resell items' });
      });
  });
};

const updateOrderStatus = (orderNumber, status) => dispatch => {
  dispatch(updateOrderStatusRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        orderStatusUpdate(orderNumber: "${orderNumber}", status: "${status}") 
      }
    `)
      .then(res => {
        if (res.orderStatusUpdate) {
          dispatch(updateOrderStatusSuccess());
          resolve({ success: true });
        } else {
          dispatch(updateOrderStatusError());
          resolve({ success: false });
        }
      })
      .catch(err => {
        dispatch(updateOrderStatusError());
        resolve({ success: false });
      });
  });
};

const getPurchasedOrders = (query = '', dateInput = 'allTime') => dispatch => {
  dispatch(getPurchasedOrdersRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          query {
            getPurchasedOrders(query: "${query}", dateInput: "${dateInput}") {
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
                  askingPrice
                  condition
                  size
                  images
              }
              buyer {
                id
                name
                email
              }
              seller {
                id
                name
                email
              }
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
              platform_fees_buyer_cents
              total_price_cents
              shipping_cents
              seller_amount_made
              platform_fees_seller_cents
              seller_shipping_cents
              international_checkout_note
              seller_amount_made_cents
              applicationFeeRateCharged
              sellerScoreDuringPurchase
              purchased_at
              buyerShipment {
                id
                status
                eta
                tracking_number
                tracking_status
                tracking_url_provider
                label_url
                createdAt
                updatedAt
              }
              sellerShipment {
                id
                status
                eta
                tracking_number
                tracking_status
                tracking_url_provider
                label_url
                createdAt
                updatedAt
              }
            }
          }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getPurchasedOrders !== null &&
          res.getPurchasedOrders !== undefined
        ) {
          dispatch(getPurchasedOrdersSuccess(res.getPurchasedOrders));
          resolve({
            success: true,
            message: 'Fetched Purchased Orders successfully',
          });
        } else {
          dispatch(getPurchasedOrdersError('Could not fetch Purchased Orders'));
          resolve({
            success: false,
            message: 'Failed to fetch Purchased Orders',
          });
        }
      })
      .catch(err => {
        dispatch(getPurchasedOrdersError(err.response));
        resolve({
          success: false,
          message: 'Failed to fetch Purchased Orders',
        });
      });
  });
};

const changeResellItemsQuery = query => dispatch => {
  dispatch(changeResellItemsSearchQuery(query));
};

const changeResellItemsDateInput = dateInput => dispatch => {
  dispatch(changeResellItemsFilterDate(dateInput));
};

const changeOrdersQuery = query => dispatch => {
  dispatch(changeOrdersSearchQuery(query));
};

const changeOrdersDateInput = dateInput => dispatch => {
  dispatch(changeOrdersFilterDate(dateInput));
};

//  Actions

const updateExistingUserRequest = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_USER_REQUEST,
  };
};

const updateExistingUserSuccess = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_USER_SUCCESS,
  };
};

const updateExistingUserError = errorMessage => {
  return {
    type: actionTypes.UPDATE_EXISTING_USER_ERROR,
    payload: { errorMessage },
  };
};

const removeExistingUserRequest = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_USER_REQUEST,
  };
};

const removeExistingUserSuccess = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_USER_SUCCESS,
  };
};

const removeExistingUserError = errorMessage => {
  return {
    type: actionTypes.REMOVE_EXISTING_USER_ERROR,
    payload: { errorMessage },
  };
};

const updateUserImageRequest = () => {
  return {
    type: actionTypes.UPDATE_USER_IMAGE_REQUEST,
  };
};

const updateUserImageSuccess = () => {
  return {
    type: actionTypes.UPDATE_USER_IMAGE_SUCCESS,
  };
};

const updateUserImageFailure = errorMessage => {
  return {
    type: actionTypes.UPDATE_USER_IMAGE_ERROR,
    payload: { errorMessage },
  };
};

// <---------------------- RESELL ITEMS ---------------->
const createNewResellItemRequest = () => {
  return {
    type: actionTypes.CREATE_NEW_RESELL_ITEM_REQUEST,
  };
};

const createNewResellItemSuccess = () => {
  return {
    type: actionTypes.CREATE_NEW_RESELL_ITEM_SUCCESS,
  };
};

const createNewResellItemError = errorMessage => {
  return {
    type: actionTypes.CREATE_NEW_RESELL_ITEM_ERROR,
    payload: { errorMessage },
  };
};

const updateExistingResellItemRequest = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_RESELL_ITEM_REQUEST,
  };
};

const updateExistingResellItemSuccess = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_RESELL_ITEM_SUCCESS,
  };
};

const updateExistingResellItemError = errorMessage => {
  return {
    type: actionTypes.UPDATE_EXISTING_RESELL_ITEM_ERROR,
    payload: { errorMessage },
  };
};

const updateResellItemImagesRequest = () => {
  return {
    type: actionTypes.UPDATE_RESELL_ITEM_IMAGES_REQUEST,
  };
};

const updateResellItemImagesSuccess = () => {
  return {
    type: actionTypes.UPDATE_RESELL_ITEM_IMAGES_SUCCESS,
  };
};

const updateResellItemImagesFailure = errorMessage => {
  return {
    type: actionTypes.UPDATE_RESELL_ITEM_IMAGES_ERROR,
    payload: { errorMessage },
  };
};

const removeExistingResellItemRequest = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_RESELL_ITEM_REQUEST,
  };
};

const removeExistingResellItemSuccess = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_RESELL_ITEM_SUCCESS,
  };
};

const removeExistingResellItemError = errorMessage => {
  return {
    type: actionTypes.REMOVE_EXISTING_RESELL_ITEM_ERROR,
    payload: { errorMessage },
  };
};

// users
const getAllUsersRequest = () => {
  return {
    type: actionTypes.GET_USERS_REQUEST,
  };
};

const getAllUsersSuccess = data => {
  return {
    type: actionTypes.GET_USERS_SUCCESS,
    payload: { data },
  };
};

const getAllUsersError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_USERS_ERROR,
    payload: { errorMessage },
  };
};

//  Resell items
const getAllResellItemsRequest = () => {
  return {
    type: actionTypes.GET_RESELL_ITEMS_REQUEST,
  };
};

const getAllResellItemsSuccess = data => {
  return {
    type: actionTypes.GET_RESELL_ITEMS_SUCCESS,
    payload: { data },
  };
};

const getAllResellItemsError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_RESELL_ITEMS_ERROR,
    payload: { errorMessage },
  };
};

const updateOrderStatusRequest = () => {
  return {
    type: actionTypes.ORDER_STATUS_UPDATE_REQUEST,
  };
};

const updateOrderStatusSuccess = () => {
  return {
    type: actionTypes.ORDER_STATUS_UPDATE_SUCCESS,
  };
};

const updateOrderStatusError = () => {
  return {
    type: actionTypes.ORDER_STATUS_UPDATE_ERROR,
  };
};

const getPurchasedOrdersRequest = () => {
  return {
    type: actionTypes.GET_ORDERS_REQUEST,
  };
};

const getPurchasedOrdersSuccess = data => {
  return {
    type: actionTypes.GET_ORDERS_SUCCESS,
    payload: { data },
  };
};

const getPurchasedOrdersError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_ORDERS_ERROR,
    payload: { errorMessage },
  };
};

const changeResellItemsSearchQuery = query => {
  return {
    type: actionTypes.CHANGE_RESELL_ITEMS_QUERY,
    payload: { query },
  };
};

const changeResellItemsFilterDate = dateInput => {
  return {
    type: actionTypes.CHANGE_RESELL_ITEMS_DATE_INPUT,
    payload: { dateInput },
  };
};

const changeOrdersSearchQuery = query => {
  return {
    type: actionTypes.CHANGE_ORDERS_QUERY,
    payload: { query },
  };
};

const changeOrdersFilterDate = dateInput => {
  return {
    type: actionTypes.CHANGE_ORDERS_DATE_INPUT,
    payload: { dateInput },
  };
};

// Reducers
const reducer = (state = initialState, action) => {
  switch (action.type) {
    // -------> Mutations

    // Users
    case actionTypes.CREATE_NEW_USER_REQUEST:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, { isMutating: true }),
      });
    case actionTypes.CREATE_NEW_USER_SUCCESS:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, { isMutating: false }),
      });
    case actionTypes.CREATE_NEW_USER_ERROR:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    case actionTypes.UPDATE_EXISTING_USER_REQUEST:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, { isMutating: true }),
      });
    case actionTypes.UPDATE_EXISTING_USER_SUCCESS:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, { isMutating: false }),
      });
    case actionTypes.UPDATE_EXISTING_USER_ERROR:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    case actionTypes.REMOVE_EXISTING_USER_REQUEST:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, { isMutating: true }),
      });
    case actionTypes.REMOVE_EXISTING_USER_SUCCESS:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, { isMutating: false }),
      });
    case actionTypes.REMOVE_EXISTING_USER_ERROR:
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });

    // Resell Items
    case actionTypes.CREATE_NEW_RESELL_ITEM_REQUEST:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, { isMutating: true }),
      });
    case actionTypes.CREATE_NEW_RESELL_ITEM_SUCCESS:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          isMutating: false,
        }),
      });
    case actionTypes.CREATE_NEW_RESELL_ITEM_ERROR:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    case actionTypes.UPDATE_EXISTING_RESELL_ITEM_REQUEST:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, { isMutating: true }),
      });
    case actionTypes.UPDATE_EXISTING_RESELL_ITEM_SUCCESS:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          isMutating: false,
        }),
      });
    case actionTypes.UPDATE_EXISTING_RESELL_ITEM_ERROR:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    case actionTypes.REMOVE_EXISTING_RESELL_ITEM_REQUEST:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, { isMutating: true }),
      });
    case actionTypes.REMOVE_EXISTING_RESELL_ITEM_SUCCESS:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          isMutating: false,
        }),
      });
    case actionTypes.REMOVE_EXISTING_RESELL_ITEM_ERROR:
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });

    // Users
    case actionTypes.GET_USERS_REQUEST: {
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, { isFetching: true }),
      });
    }
    case actionTypes.GET_USERS_SUCCESS: {
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          data: action.payload.data || [],
          isFetching: false,
        }),
      });
    }
    case actionTypes.GET_USERS_ERROR: {
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    }
    // Resell Items
    case actionTypes.GET_RESELL_ITEMS_REQUEST: {
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, { isFetching: true }),
      });
    }
    case actionTypes.GET_RESELL_ITEMS_SUCCESS: {
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          data: action.payload.data || [],
          isFetching: false,
        }),
      });
    }
    case actionTypes.GET_RESELL_ITEMS_ERROR: {
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    }
    // Orders
    case actionTypes.ORDER_STATUS_UPDATE_REQUEST: {
      return state;
    }
    case actionTypes.ORDER_STATUS_UPDATE_SUCCESS: {
      return state;
    }
    case actionTypes.ORDER_STATUS_UPDATE_ERROR: {
      return state;
    }
    case actionTypes.GET_ORDERS_REQUEST: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, { isFetching: true }),
      });
    }
    case actionTypes.GET_ORDERS_SUCCESS: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, {
          data: action.payload.data || [],
          isFetching: false,
        }),
      });
    }
    case actionTypes.GET_ORDERS_ERROR: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    }
    case actionTypes.CHANGE_RESELL_ITEMS_QUERY: {
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          query: action.payload.query,
        }),
      });
    }
    case actionTypes.CHANGE_RESELL_ITEMS_DATE_INPUT: {
      return Object.assign({}, state, {
        resellItems: Object.assign({}, state.resellItems, {
          dateInput: action.payload.dateInput,
        }),
      });
    }
    case actionTypes.CHANGE_ORDERS_QUERY: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, {
          query: action.payload.query,
        }),
      });
    }
    case actionTypes.CHANGE_ORDERS_DATE_INPUT: {
      return Object.assign({}, state, {
        orders: Object.assign({}, state.orders, {
          dateInput: action.payload.dateInput,
        }),
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
    // Users
    // ----> Mutations
    updateExistingUser,
    removeExistingUser,
    updateUserImage,
    // ----> Query
    getAllUsers,
    // Resell Item
    // -----> Mutation
    createNewResellItem,
    updateExistingResellItem,
    removeExistingResellItem,
    updateResellItemImages,
    // -----> Query
    getAllResellItems,
    getPurchasedOrders,
    // --> Filtering
    changeResellItemsQuery,
    changeResellItemsDateInput,
    changeOrdersQuery,
    changeOrdersDateInput,
    updateOrderStatus,
  },
};
