import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

// Duck Name
const duckName = 'RESELL_LISTING';

const actionTypes = createActionTypes(
  {
    // query

    GET_RESELL_LISTING_REQUEST: 'GET_RESELL_LISTING_REQUEST',
    GET_RESELL_LISTING_SUCCESS: 'GET_RESELL_LISTING_SUCCESS',
    GET_RESELL_LISTING_ERROR: 'GET_RESELL_LISTING_ERROR',
  },
  duckName,
);

const initialState = {
  currentSlug: '',
  listingsMap: {},
  error: '',
  isFetching: false,
};

const getResellListing = resellItemSlug => dispatch => {
  dispatch(getResellListingRequest());
  console.log(resellItemSlug);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            getResellListing(slug: "${resellItemSlug}") {
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
        }`).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.getResellListing !== null &&
        res.getResellListing !== undefined
      ) {
        dispatch(getResellListingSuccess(resellItemSlug, res.getResellListing));
        resolve({
          success: true,
          message: 'Fetched Product Listing successfully',
        });
      } else {
        dispatch(
          getResellListingError(
            resellItemSlug,
            'Could not fetch Product Listing',
          ),
        );
        resolve({ success: false, message: 'Failed to fetch brands' });
      }
    });
  });
};

const getResellListingRequest = () => {
  return {
    type: actionTypes.GET_RESELL_LISTING_REQUEST,
  };
};

const getResellListingSuccess = (productSlug, data) => {
  return {
    type: actionTypes.GET_RESELL_LISTING_SUCCESS,
    payload: { productSlug, data },
  };
};

const getResellListingError = (productSlug, errorMessage) => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_RESELL_LISTING_ERROR,
    payload: { productSlug, errorMessage },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //  --------> Mutations

    case actionTypes.GET_RESELL_LISTING_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actionTypes.GET_RESELL_LISTING_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        currentSlug: action.payload.productSlug,
        listingsMap: Object.assign({}, state.listingsMap, {
          [action.payload.productSlug]: action.payload.data,
        }),
      });
    case actionTypes.GET_RESELL_LISTING_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.payload.errorMessage,
        currentSlug: action.payload.productSlug,
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    getResellListing,
  },
};
