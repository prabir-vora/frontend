import slugify from 'slugify';
import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';
import * as immutable from 'object-path-immutable';

// Duck Name
const duckName = 'ADMIN_TEST';

const actionTypes = createActionTypes(
  {
    // -----> Resellers
    CREATE_NEW_RESELLER_REQUEST: 'CREATE_NEW_RESELLER_REQUEST',
    CREATE_NEW_RESELLER_SUCCESS: 'CREATE_NEW_RESELLER_SUCCESS',
    CREATE_NEW_RESELLER_FAILURE: 'CREATE_NEW_RESELLER_FAILURE',
    UPDATE_EXISTING_RESELLER_REQUEST: 'UPDATE_EXISTING_RESELLER_REQUEST',
    UPDATE_EXISTING_RESELLER_SUCCESS: 'UPDATE_EXISTING_RESELLER_SUCCESS',
    UPDATE_EXISTING_RESELLER_ERROR: 'UPDATE_EXISTING_RESELLER_ERROR',
    REMOVE_EXISTING_RESELLER_REQUEST: 'REMOVE_EXISTING_RESELLER_REQUEST',
    REMOVE_EXISTING_RESELLER_SUCCESS: 'REMOVE_EXISTING_RESELLER_SUCCESS',
    REMOVE_EXISTING_RESELLER_ERROR: 'REMOVE_EXISTING_RESELLER_ERROR',
    UPDATE_RESELLER_IMAGE_REQUEST: 'UPDATE_RESELLER_IMAGE_REQUEST',
    UPDATE_RESELLER_IMAGE_SUCCESS: 'UPDATE_RESELLER_IMAGE_SUCCESS',
    UPDATE_RESELLER_IMAGE_ERROR: 'UPDATE_RESELLER_IMAGE_ERROR',

    // -------> Resell Items
    CREATE_NEW_RESELL_ITEM_REQUEST: 'CREATE_NEW_RESELL_ITEM_REQUEST',
    CREATE_NEW_RESELL_ITEM_SUCCESS: 'CREATE_NEW_RESELL_ITEM_SUCCESS',
    CREATE_NEW_RESELL_ITEM_ERROR: 'CREATE_NEW_RESELL_ITEM_ERROR',
    UPDATE_EXISTING_RESELL_ITEM_REQUEST: 'UPDATE_EXISTING_RESELL_ITEM_REQUEST',
    UPDATE_EXISTING_RESELL_ITEM_SUCCESS: 'UPDATE_EXISTING_RESELL_ITEM_SUCCESS',
    UPDATE_EXISTING_RESELL_ITEM_ERROR: 'UPDATE_EXISTING_RESELL_ITEM_ERROR',
    REMOVE_EXISTING_RESELL_ITEM_REQUEST: 'REMOVE_EXISTING_RESELL_ITEM_REQUEST',
    REMOVE_EXISTING_RESELL_ITEM_SUCCESS: 'REMOVE_EXISTING_RESELL_ITEM_SUCCESS',
    REMOVE_EXISTING_RESELL_ITEM_ERROR: 'REMOVE_EXISTING_RESELL_ITEM_ERROR',
    UPDATE_RESELL_ITEM_IMAGE_REQUEST: 'UPDATE_RESELL_ITEM_IMAGE_REQUEST',
    UPDATE_RESELL_ITEM_IMAGE_SUCCESS: 'UPDATE_RESELL_ITEM_IMAGE_SUCCESS',
    UPDATE_RESELL_ITEM_IMAGE_ERROR: 'UPDATE_RESELL_ITEM_IMAGE_ERROR',

    // -------> Resellers
    GET_RESELLERS_REQUEST: 'GET_RESELLERS_REQUEST',
    GET_RESELLERS_SUCCESS: 'GET_RESELLERS_SUCCESS',
    GET_RESELLERS_ERROR: 'GET_RESELLERS_ERROR',

    // -------> Resell Items
    GET_RESELL_ITEMS_REQUEST: 'GET_RESELL_ITEMS_REQUEST',
    GET_RESELL_ITEMS_SUCCESS: 'GET_RESELL_ITEMS_SUCCESS',
    GET_RESELL_ITEMS_ERROR: 'GET_RESELL_ITEMS_ERROR',
  },
  duckName,
);

const initialState = {
  resellers: {
    data: [],
    errorMessage: {},
    isFetching: false,
    isMutating: false,
  },
  resellItems: {
    data: [],
    errorMessage: {},
    isFetching: false,
    isMutating: false,
  },
};

// <------------ Resellers ----------------->

const createResellerWithInputType = () => {
  return `
        mutation($reseller: ResellerInput!, ) {
                createNewReseller(reseller: $reseller) {
                    name
                    id
                }
            }
        `;
};

const createNewReseller = resellerInfo => dispatch => {
  dispatch(createNewResellerRequest());

  const { name, lat, lng } = resellerInfo;
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
    .value();

  return new Promise((resolve, reject) => {
    fetchGraphQL(createResellerWithInputType(), undefined, {
      reseller,
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.createNewReseller !== null &&
          res.createNewReseller !== undefined
        ) {
          dispatch(createNewResellerSuccess());
          resolve({ created: true, message: 'Created Reseller Successfully' });
        } else {
          dispatch(createNewResellerError());
          resolve({ created: false, message: 'Failed to Create brand' });
        }
      })
      .catch(err => {
        dispatch(createNewResellerError(err.response));
        resolve({ created: false, message: 'Failed to Create brand' });
      });
  });
};

const updateResellerWithInputType = () => {
  return `
        mutation($reseller: ResellerInput!, $id: ID!) {
                updateExistingReseller(reseller: $reseller, id: $id) 
            }
        `;
};

const updateExistingReseller = resellerInfo => dispatch => {
  dispatch(updateExistingResellerRequest());
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
    fetchGraphQL(updateResellerWithInputType(), undefined, {
      reseller,
      id,
    })
      .then(res => {
        if (
          (res !== null) & (res !== undefined) &&
          res.updateExistingReseller
        ) {
          dispatch(updateExistingResellerSuccess());
          resolve({ updated: true, message: 'Updated Reseller Successfully' });
        } else {
          dispatch(updateExistingResellerError('Could Not Update Reseller'));
          resolve({ updated: false, message: 'Failed to update Reseller' });
        }
      })
      .catch(err => {
        dispatch(updateExistingResellerError(err.response));
        resolve({ updated: false, message: 'Failed to update Reseller' });
      });
  });
};

const removeExistingReseller = resellerInfo => dispatch => {
  dispatch(removeExistingResellerRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                removeExistingReseller(id: "${resellerInfo.id}")
            }
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.removeExistingReseller) {
          dispatch(removeExistingResellerSuccess());
          resolve({ deleted: true, message: 'Deleted Reseller Successfully' });
        } else {
          dispatch(removeExistingResellerError('Could Not Remove Reseller'));
          resolve({ deleted: false, message: 'Failed to delete Reseller' });
        }
      })
      .catch(err => {
        dispatch(removeExistingResellerError(err.response));
        resolve({ deleted: false, message: 'Failed to delete Reseller' });
      });
  });
};

const updateResellerImage = (imageURL, resellerInfo) => dispatch => {
  dispatch(updateResellerImageRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                updateResellerImage(id: "${resellerInfo.id}", imageURL: "${imageURL}")
            }    
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.updateResellerImage) {
          dispatch(updateResellerImageSuccess());
          resolve({
            updated: true,
            message: 'Updated Reseller Image Successfully',
          });
        } else {
          dispatch(
            updateResellerImageFailure('Could Not Update Reseller Image'),
          );
          resolve({
            updated: false,
            message: 'Failed to update Reseller Image',
          });
        }
      })
      .catch(err => {
        dispatch(updateResellerImageFailure(err.response));
        resolve({ updated: false, message: 'Failed to update Reseller Image' });
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
  const { product, reseller, askingPrice } = resellItemInfo;
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

  const { product, reseller, askingPrice, id } = resellItemInfo;
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

const getAllResellers = () => dispatch => {
  dispatch(getAllResellersRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            getAllResellers {
                id
                name
                address
                _geoloc {
                    lat
                    lng
                }
                shipping
                verified
                imageURL
            }
        }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getAllResellers !== null &&
          res.getAllResellers !== undefined
        ) {
          dispatch(getAllResellersSuccess(res.getAllResellers));
          resolve({ success: true, message: 'Fetched Resellers successfully' });
        } else {
          dispatch(getAllResellersError('Could not fetch Resellers'));
          resolve({ success: false, message: 'Failed to fetch resellers' });
        }
      })
      .catch(err => {
        dispatch(getAllResellersError(err.response));
        resolve({ success: false, message: 'Failed to fetch resellers' });
      });
  });
};

const getAllResellItems = () => dispatch => {
  dispatch(getAllResellItemsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
          query {
              getAllResellItems {
                  id
                  product {
                      id
                      name
                      productCategory
                  }
                  reseller {
                      id 
                      name
                  }
                  availability
                  askingPrice
                  condition
                  images
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
            const { product, reseller, askingPrice } = resellItem;
            return immutable
              .wrap(resellItem)
              .set('product', { value: product.id, label: product.name })
              .set('productType', product.productCategory)
              .set('reseller', { value: reseller.id, label: reseller.name })
              .set('askingPrice', `${askingPrice}`)
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

//  Actions
const createNewResellerRequest = () => {
  return {
    type: actionTypes.CREATE_NEW_RESELLER_REQUEST,
  };
};

const createNewResellerSuccess = () => {
  return {
    type: actionTypes.CREATE_NEW_RESELLER_SUCCESS,
  };
};

const createNewResellerError = errorMessage => {
  return {
    type: actionTypes.CREATE_NEW_RESELLER_ERROR,
    payload: { errorMessage },
  };
};

const updateExistingResellerRequest = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_RESELLER_REQUEST,
  };
};

const updateExistingResellerSuccess = () => {
  return {
    type: actionTypes.UPDATE_EXISTING_RESELLER_SUCCESS,
  };
};

const updateExistingResellerError = errorMessage => {
  return {
    type: actionTypes.UPDATE_EXISTING_RESELLER_ERROR,
    payload: { errorMessage },
  };
};

const removeExistingResellerRequest = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_RESELLER_REQUEST,
  };
};

const removeExistingResellerSuccess = () => {
  return {
    type: actionTypes.REMOVE_EXISTING_RESELLER_SUCCESS,
  };
};

const removeExistingResellerError = errorMessage => {
  return {
    type: actionTypes.REMOVE_EXISTING_RESELLER_ERROR,
    payload: { errorMessage },
  };
};

const updateResellerImageRequest = () => {
  return {
    type: actionTypes.UPDATE_RESELLER_IMAGE_REQUEST,
  };
};

const updateResellerImageSuccess = () => {
  return {
    type: actionTypes.UPDATE_RESELLER_IMAGE_SUCCESS,
  };
};

const updateResellerImageFailure = errorMessage => {
  return {
    type: actionTypes.UPDATE_RESELLER_IMAGE_ERROR,
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

// resellers
const getAllResellersRequest = () => {
  return {
    type: actionTypes.GET_RESELLERS_REQUEST,
  };
};

const getAllResellersSuccess = data => {
  return {
    type: actionTypes.GET_RESELLERS_SUCCESS,
    payload: { data },
  };
};

const getAllResellersError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_RESELLERS_ERROR,
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

// Reducers
const reducer = (state = initialState, action) => {
  switch (action.type) {
    // -------> Mutations

    // Resellers
    case actionTypes.CREATE_NEW_RESELLER_REQUEST:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, { isMutating: true }),
      });
    case actionTypes.CREATE_NEW_RESELLER_SUCCESS:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, { isMutating: false }),
      });
    case actionTypes.CREATE_NEW_RESELLER_ERROR:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    case actionTypes.UPDATE_EXISTING_RESELLER_REQUEST:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, { isMutating: true }),
      });
    case actionTypes.UPDATE_EXISTING_RESELLER_SUCCESS:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, { isMutating: false }),
      });
    case actionTypes.UPDATE_EXISTING_RESELLER_ERROR:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, {
          isMutating: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    case actionTypes.REMOVE_EXISTING_RESELLER_REQUEST:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, { isMutating: true }),
      });
    case actionTypes.REMOVE_EXISTING_RESELLER_SUCCESS:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, { isMutating: false }),
      });
    case actionTypes.REMOVE_EXISTING_RESELLER_ERROR:
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, {
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

    // Resellers
    case actionTypes.GET_RESELLERS_REQUEST: {
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, { isFetching: true }),
      });
    }
    case actionTypes.GET_RESELLERS_SUCCESS: {
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, {
          data: action.payload.data || [],
          isFetching: false,
        }),
      });
    }
    case actionTypes.GET_RESELLERS_ERROR: {
      return Object.assign({}, state, {
        resellers: Object.assign({}, state.resellers, {
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
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    // Resellers
    // ----> Mutations
    createNewReseller,
    updateExistingReseller,
    removeExistingReseller,
    updateResellerImage,
    // ----> Query
    getAllResellers,
    // Resell Item
    // -----> Mutation
    createNewResellItem,
    updateExistingResellItem,
    removeExistingResellItem,
    // -----> Query
    getAllResellItems,
  },
};
