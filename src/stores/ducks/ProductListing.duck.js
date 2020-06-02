import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

// Duck Name
const duckName = 'PRODUCT_LISTING';

const actionTypes = createActionTypes(
  {
    // query

    GET_PRODUCT_LISTING_REQUEST: 'GET_PRODUCT_LISTING_REQUEST',
    GET_PRODUCT_LISTING_SUCCESS: 'GET_PRODUCT_LISTING_SUCCESS',
    GET_PRODUCT_LISTING_ERROR: 'GET_PRODUCT_LISTING_ERROR',
  },
  duckName,
);

const initialState = {
  currentSlug: '',
  listingsMap: {},
  error: '',
  isFetching: false,
};

const getProductListing = productSlug => dispatch => {
  dispatch(getProductListingRequest());
  console.log(productSlug);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
        query {
            getProductListing(slug: "${productSlug}") {
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
              designer {
                  name
                  id
              }
              gender
              original_image_url
              additional_pictures
              hasSizing
              colorway
              releaseDate
              resellItems {
                  id
                  reseller {
                      id
                      name
                      slug
                      imageURL
                  }
                  askingPrice
                  condition
                  size
                  images
              }
            }
        }`).then(res => {
      if (
        res !== null &&
        res !== undefined &&
        res.getProductListing !== null &&
        res.getProductListing !== undefined
      ) {
        dispatch(getProductListingSuccess(productSlug, res.getProductListing));
        resolve({
          success: true,
          message: 'Fetched Product Listing successfully',
        });
      } else {
        dispatch(
          getProductListingError(
            productSlug,
            'Could not fetch Product Listing',
          ),
        );
        resolve({ success: false, message: 'Failed to fetch brands' });
      }
    });
  });
};

const getProductListingRequest = () => {
  return {
    type: actionTypes.GET_PRODUCT_LISTING_REQUEST,
  };
};

const getProductListingSuccess = (productSlug, data) => {
  return {
    type: actionTypes.GET_PRODUCT_LISTING_SUCCESS,
    payload: { productSlug, data },
  };
};

const getProductListingError = (productSlug, errorMessage) => {
  console.log(errorMessage);
  return {
    type: actionTypes.GET_PRODUCT_LISTING_ERROR,
    payload: { productSlug, errorMessage },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //  --------> Mutations

    case actionTypes.GET_PRODUCT_LISTING_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actionTypes.GET_PRODUCT_LISTING_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        currentSlug: action.payload.productSlug,
        listingsMap: Object.assign({}, state.listingsMap, {
          [action.payload.productSlug]: action.payload.data,
        }),
      });
    case actionTypes.GET_PRODUCT_LISTING_ERROR:
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
    getProductListing,
  },
};
