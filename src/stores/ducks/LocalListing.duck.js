import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

// Duck Name
const duckName = 'LOCAL_LISTING';

const actionTypes = createActionTypes(
  {
    // query

    GET_LOCAL_LISTING_REQUEST: 'GET_LOCAL_LISTING_REQUEST',
    GET_LOCAL_LISTING_SUCCESS: 'GET_LOCAL_LISTING_SUCCESS',
    GET_LOCAL_LISTING_ERROR: 'GET_LOCAL_LISTING_ERROR',
  },
  duckName,
);

const initialState = {
  currentSlug: '',
  listingsMap: {},
  error: '',
  isFetching: false,
};

const getLocalListing = resellItemSlug => dispatch => {
  dispatch(getLocalListingRequest());
  console.log(resellItemSlug);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            getLocalListing(slug: "${resellItemSlug}") {
                id
                product {
                  id
                  productCategory
                  productType
                  name
                  nickName
                  description
                  sku
                  brand {
                    name
                    id
                    imageURL
                    slug
                  }
                  gender
                  hasSizing
                  colorway
                  releaseDate
                  slug
                  original_image_url
                }
                reseller {
                    id
                    name
                    username
                    _geoloc {
                        lat
                        lng
                    }
                }
                askingPrice
                condition
                size
                images
                slug
            }
        }`).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.getLocalListing !== null &&
        res.getLocalListing !== undefined
      ) {
        dispatch(getLocalListingSuccess(resellItemSlug, res.getLocalListing));
        resolve({
          success: true,
          message: 'Fetched Product Listing successfully',
        });
      } else {
        dispatch(
          getLocalListingError(
            resellItemSlug,
            'Could not fetch Product Listing',
          ),
        );
        resolve({ success: false, message: 'Failed to fetch brands' });
      }
    });
  });
};

const getLocalListingRequest = () => {
  return {
    type: actionTypes.GET_LOCAL_LISTING_REQUEST,
  };
};

const getLocalListingSuccess = (productSlug, data) => {
  return {
    type: actionTypes.GET_LOCAL_LISTING_SUCCESS,
    payload: { productSlug, data },
  };
};

const getLocalListingError = (productSlug, errorMessage) => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_LOCAL_LISTING_ERROR,
    payload: { productSlug, errorMessage },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //  --------> Mutations

    case actionTypes.GET_LOCAL_LISTING_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actionTypes.GET_LOCAL_LISTING_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        currentSlug: action.payload.productSlug,
        listingsMap: Object.assign({}, state.listingsMap, {
          [action.payload.productSlug]: action.payload.data,
        }),
      });
    case actionTypes.GET_LOCAL_LISTING_ERROR:
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
    getLocalListing,
  },
};
