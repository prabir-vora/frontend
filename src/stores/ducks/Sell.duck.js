import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';
import * as immutable from 'object-path-immutable';
import slugify from 'slugify';

const duckName = 'SELL';
const actionTypes = createActionTypes(
  {
    SHOW_MODAL: 'SHOW_MODAL',
    HIDE_MODAL: 'HIDE_MODAL',

    SUBMIT_LISTING_INFO: 'SUBMIT_LISTING_INFO',

    SUBMIT_EDIT_LISTING_INFO: 'SUBMIT_EDIT_LISTING_INFO',

    CREATE_NEW_LISTING_REQUEST: 'CREATE_NEW_LISTING_REQUEST',
    CREATE_NEW_LISTING_SUCCESS: 'CREATE_NEW_LISTING_SUCCESS',
    CREATE_NEW_LISTING_FAILURE: 'CREATE_NEW_LISTING_FAILURE',

    EDIT_LISTING_REQUEST: 'EDIT_LISTING_REQUEST',
    EDIT_LISTING_SUCCESS: 'EDIT_LISTING_SUCCESS',
    EDIT_LISTING_FAILURE: 'EDIT_LISTING_FAILURE',

    //  -----> Brands
    GET_BRANDS_REQUEST: 'GET_BRANDS_REQUEST',
    GET_BRANDS_SUCCESS: 'GET_BRANDS_SUCCESS',
    GET_BRANDS_ERROR: 'GET_BRANDS_ERROR',

    GET_LISTING_REQUEST: 'GET_LISTING_REQUEST',
    GET_LISTING_SUCCESS: 'GET_LISTING_SUCCESS',
    GET_LISTING_ERROR: 'GET_LISTING_ERROR',
  },
  duckName,
);

const initialState = {
  showHowSellingWorksModal: false,
  showConfirmListingModal: false,
  showSellerSetupModal: false,
  showConfirmEditListingModal: false,
  listingInfo: null,
  creatingNewListing: false,
  currentSlug: '',
  listingsMap: {},
  error: '',
  isFetching: false,
  editListingInfo: null,

  // brands: {
  //   data: [],
  //   errorMessage: {},
  //   isFetching: false,
  //   isMutating: false,
  // },
};

const submitListingInfo = listingInfo => dispatch => {
  dispatch(setListingInfo(listingInfo));
  return;
};

const submitEditListingInfo = listingInfo => dispatch => {
  dispatch(setEditListingInfo(listingInfo));
  return;
};

const showModal = modalType => dispatch => {
  switch (modalType) {
    case 'howSellingWorks':
      dispatch(showHowSellingWorksModal());
      return;
    case 'confirmListing':
      dispatch(showConfirmListingModal());
      return;
    case 'confirmEditListing':
      dispatch(showConfirmEditListingModal());
      return;
    case 'sellerSetup':
      dispatch(showSellerSetupModal());
      return;
    default:
      return null;
  }
};

const hideModal = modalType => dispatch => {
  switch (modalType) {
    case 'howSellingWorks':
      dispatch(hideHowSellingWorksModal());
      return;
    case 'confirmListing':
      dispatch(hideConfirmListingModal());
      return;
    case 'confirmEditListing':
      dispatch(hideConfirmEditListingModal());
      return;
    case 'sellerSetup':
      dispatch(hideSellerSetupModal());
      return;
    default:
      return null;
  }
};

const createListingWithInputType = () => {
  return `
          mutation($listing: ListingInput!, ) {
                  createNewListing(listing: $listing) {
                      id
                  }
              }
          `;
};

const createNewListing = (resellItemInfo, reseller) => dispatch => {
  dispatch(createNewListingRequest());
  const {
    product,
    askingPrice,
    size,
    conditionDetails,
    condition,
  } = resellItemInfo;
  const listingSlug = slugify(
    product.name + ' ' + reseller.username + ' ' + Date.now(),
    {
      replacement: '-',
      lower: true, // convert to lower case, defaults to `false`
    },
  );

  const listing = immutable
    .wrap(resellItemInfo)
    .set('slug', listingSlug)
    .set('product', product._id)
    .set('reseller', reseller.id)
    .set('askingPrice', parseInt(askingPrice))
    .set('conditionDetails', condition === 'new' ? '' : conditionDetails)
    .set('size', size.value)
    .del('productType')
    .value();
  return new Promise((resolve, reject) => {
    fetchGraphQL(createListingWithInputType(), undefined, {
      listing,
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.createNewListing !== null &&
          res.createNewListing !== undefined
        ) {
          dispatch(createNewListingSuccess());
          resolve({
            created: true,
            message: 'Created ResellItem Successfully',
          });
        } else {
          dispatch(createNewListingError());
          resolve({ created: false, message: 'Failed to Create Resell Item' });
        }
      })
      .catch(err => {
        dispatch(createNewListingError(err.response));
        resolve({ created: false, message: 'Failed to Create Resell Item' });
      });
  });
};

const editListingWithInputType = () => {
  return `
          mutation($id: ID!, $listing: EditListingInput!) {
                  editListing(id: $id, listing: $listing) 
              }
          `;
};

const editListing = editListingInfo => dispatch => {
  dispatch(editListingRequest());
  const {
    id,
    askingPrice,
    size,
    conditionDetails,
    condition,
  } = editListingInfo;

  const listing = immutable
    .wrap(editListingInfo)
    .set('askingPrice', parseInt(askingPrice))
    .set('conditionDetails', condition === 'new' ? '' : conditionDetails)
    .set('size', size.value)
    .del('product')
    .del('id')
    .value();
  return new Promise((resolve, reject) => {
    fetchGraphQL(editListingWithInputType(), undefined, {
      id,
      listing,
    })
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.editListing !== null &&
          res.editListing !== undefined
        ) {
          dispatch(editListingSuccess());
          resolve({
            success: true,
            message: 'Edited Listings Successfully',
          });
        } else {
          dispatch(editListingError());
          resolve({ success: false, message: 'Failed to Edit Resell Item' });
        }
      })
      .catch(err => {
        dispatch(editListingError(err.response));
        resolve({ success: false, message: 'Failed to Edit Resell Item' });
      });
  });
};

// ----------------> Query

// <----------------- Brands -------------->

const getAllBrands = () => dispatch => {
  dispatch(getAllBrandsRequest());
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            getAllBrands {
                id
                name
                slug
                imageURL
            }
        }`)
      .then(res => {
        if (
          res !== null &&
          res !== undefined &&
          res.getAllBrands !== null &&
          res.getAllBrands !== undefined
        ) {
          dispatch(getAllBrandsSuccess(res.getAllBrands));
          resolve({ success: true, message: 'Fetched Brands successfully' });
        } else {
          dispatch(getAllBrandsError('Could not fetch Brands'));
          resolve({ success: false, message: 'Failed to fetch brands' });
        }
      })
      .catch(err => {
        dispatch(getAllBrandsError(err.response));
        resolve({ success: false, message: 'Failed to fetch brands' });
      });
  });
};

const getListing = resellItemSlug => dispatch => {
  dispatch(getListingRequest());
  console.log(resellItemSlug);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            getListing(slug: "${resellItemSlug}") {
                id
                product {
                  id
                  name
                  productCategory
                  gender
                  original_image_url
                  brand {
                    name
                  }
                  colorway
                  size_brand
                }
                askingPrice
                condition
                conditionDetails
                availability
                size
                images
                sold
                purchased_at
            }
        }`)
      .then(res => {
        console.log(res);
        if (res !== null && res !== undefined && res.getListing) {
          dispatch(getListingSuccess(resellItemSlug, res.getListing));
          resolve({
            success: true,
            message: 'Fetched Listing successfully',
          });
        } else {
          dispatch(
            getListingError(resellItemSlug, 'Could not fetch Product Listing'),
          );
          resolve({ success: false, message: 'Failed to fetch listing' });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(
          getListingError(resellItemSlug, 'Could not fetch Product Listing'),
        );
        resolve({ success: false, message: 'Failed to fetch listing' });
      });
  });
};

const getListingRequest = () => {
  return {
    type: actionTypes.GET_LISTING_REQUEST,
  };
};

const getListingSuccess = (listingSlug, data) => {
  return {
    type: actionTypes.GET_LISTING_SUCCESS,
    payload: { listingSlug, data },
  };
};

const getListingError = (listingSlug, errorMessage) => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_LISTING_ERROR,
    payload: { listingSlug, errorMessage },
  };
};

const setListingInfo = listingInfo => {
  return {
    type: actionTypes.SUBMIT_LISTING_INFO,
    payload: listingInfo,
  };
};

const setEditListingInfo = listingInfo => {
  console.log(listingInfo);
  return {
    type: actionTypes.SUBMIT_EDIT_LISTING_INFO,
    payload: listingInfo,
  };
};

const showConfirmListingModal = () => {
  return {
    type: actionTypes.SHOW_MODAL,
    payload: 'showConfirmListingModal',
  };
};

const showConfirmEditListingModal = () => {
  return {
    type: actionTypes.SHOW_MODAL,
    payload: 'showConfirmEditListingModal',
  };
};

const showSellerSetupModal = () => {
  return {
    type: actionTypes.SHOW_MODAL,
    payload: 'showSellerSetupModal',
  };
};

const hideConfirmListingModal = () => {
  return {
    type: actionTypes.HIDE_MODAL,
    payload: 'showConfirmListingModal',
  };
};

const hideConfirmEditListingModal = () => {
  return {
    type: actionTypes.HIDE_MODAL,
    payload: 'showConfirmEditListingModal',
  };
};

const hideSellerSetupModal = () => {
  return {
    type: actionTypes.HIDE_MODAL,
    payload: 'showSellerSetupModal',
  };
};

const showHowSellingWorksModal = () => {
  return {
    type: actionTypes.SHOW_MODAL,
    payload: 'showHowSellingWorksModal',
  };
};

const hideHowSellingWorksModal = () => {
  return {
    type: actionTypes.HIDE_MODAL,
    payload: 'showHowSellingWorksModal',
  };
};

const createNewListingRequest = () => {
  return {
    type: actionTypes.CREATE_NEW_LISTING_REQUEST,
  };
};

const createNewListingSuccess = () => {
  return {
    type: actionTypes.CREATE_NEW_LISTING_SUCCESS,
  };
};

const createNewListingError = errorMessage => {
  return {
    type: actionTypes.CREATE_NEW_LISTING_ERROR,
    payload: { errorMessage },
  };
};

const editListingRequest = () => {
  return {
    type: actionTypes.EDIT_LISTING_REQUEST,
  };
};

const editListingSuccess = () => {
  return {
    type: actionTypes.EDIT_LISTING_SUCCESS,
  };
};

const editListingError = errorMessage => {
  return {
    type: actionTypes.EDIT_LISTING_FAILURE,
    payload: { errorMessage },
  };
};

// QUERY Actions

// brands
const getAllBrandsRequest = () => {
  return {
    type: actionTypes.GET_BRANDS_REQUEST,
  };
};

const getAllBrandsSuccess = data => {
  return {
    type: actionTypes.GET_BRANDS_SUCCESS,
    payload: { data },
  };
};

const getAllBrandsError = errorMessage => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_BRANDS_ERROR,
    payload: { errorMessage },
  };
};

// Reducers
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUBMIT_LISTING_INFO:
      return Object.assign({}, state, {
        listingInfo: action.payload,
      });
    case actionTypes.SUBMIT_EDIT_LISTING_INFO:
      return Object.assign({}, state, {
        editListingInfo: action.payload,
      });
    case actionTypes.SHOW_MODAL:
      return Object.assign({}, state, {
        [action.payload]: true,
      });
    case actionTypes.HIDE_MODAL:
      return Object.assign({}, state, {
        [action.payload]: false,
      });
    case actionTypes.CREATE_NEW_LISTING_REQUEST:
      return Object.assign({}, state, {
        creatingNewListing: true,
      });
    case actionTypes.CREATE_NEW_LISTING_SUCCESS:
      return Object.assign({}, state, {
        creatingNewListing: false,
      });
    case actionTypes.CREATE_NEW_LISTING_FAILURE:
      return Object.assign({}, state, {
        creatingNewListing: false,
      });
    case actionTypes.EDIT_LISTING_REQUEST:
      return Object.assign({}, state, {
        editingListing: true,
      });
    case actionTypes.EDIT_LISTING_SUCCESS:
      return Object.assign({}, state, {
        editingListing: false,
      });
    case actionTypes.EDIT_LISTING_FAILURE:
      return Object.assign({}, state, {
        editingListing: false,
      });
    // Brands
    case actionTypes.GET_BRANDS_REQUEST: {
      return Object.assign({}, state, {
        brands: Object.assign({}, state.brands, { isFetching: true }),
      });
    }
    case actionTypes.GET_BRANDS_SUCCESS: {
      return Object.assign({}, state, {
        brands: Object.assign({}, state.brands, {
          data: action.payload.data || [],
          isFetching: false,
        }),
      });
    }
    case actionTypes.GET_BRANDS_ERROR: {
      return Object.assign({}, state, {
        brands: Object.assign({}, state.brands, {
          data: [],
          isFetching: false,
          errorMessage: action.payload.errorMessage,
        }),
      });
    }
    case actionTypes.GET_LISTING_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actionTypes.GET_LISTING_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        currentSlug: action.payload.listingSlug,
        listingsMap: Object.assign({}, state.listingsMap, {
          [action.payload.listingSlug]: action.payload.data,
        }),
      });
    case actionTypes.GET_LISTING_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.payload.errorMessage,
        currentSlug: action.payload.listingSlug,
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    createNewListing,
    editListing,
    getAllBrands,
    showModal,
    hideModal,
    submitListingInfo,
    submitEditListingInfo,
    getListing,
  },
};
