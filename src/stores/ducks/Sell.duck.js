import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';
import * as immutable from 'object-path-immutable';
import slugify from 'slugify';

const duckName = 'SELL';
const actionTypes = createActionTypes(
  {
    CREATE_NEW_LISTING_REQUEST: 'CREATE_NEW_LISTING_REQUEST',
    CREATE_NEW_LISTING_SUCCESS: 'CREATE_NEW_LISTING_SUCCESS',
    CREATE_NEW_LISTING_FAILURE: 'CREATE_NEW_LISTING_FAILURE',

    //  -----> Brands
    GET_BRANDS_REQUEST: 'GET_BRANDS_REQUEST',
    GET_BRANDS_SUCCESS: 'GET_BRANDS_SUCCESS',
    GET_BRANDS_ERROR: 'GET_BRANDS_ERROR',
  },
  duckName,
);

const initialState = {
  creatingNewListing: false,
  brands: {
    data: [],
    errorMessage: {},
    isFetching: false,
    isMutating: false,
  },
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
  const { product, askingPrice, size } = resellItemInfo;
  const listingSlug = slugify(product.name + ' ' + reseller.name, {
    replacement: '-',
    lower: true, // convert to lower case, defaults to `false`
  });

  const listing = immutable
    .wrap(resellItemInfo)
    .set('slug', listingSlug)
    .set('product', product._id)
    .set('reseller', reseller.id)
    .set('askingPrice', parseInt(askingPrice))
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
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    createNewListing,
    getAllBrands,
  },
};
