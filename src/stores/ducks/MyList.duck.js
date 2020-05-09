import { createActionTypes } from 'stores/lib';
import { fetchGraphQL } from 'constants/graphql';

const duckName = 'MY_LIST';
const actionTypes = createActionTypes(
  {
    CHANGE_LISTING_SELECTION: 'CHANGE_LISTING_SELECTION',

    FETCH_USER_SHOP_LIST_REQUEST: 'FETCH_USER_SHOP_LIST_REQUEST',
    FETCH_USER_SHOP_LIST_SUCCESS: 'FETCH_USER_SHOP_LIST_SUCCESS',
    FETCH_USER_SHOP_LIST_FAILURE: 'FETCH_USER_SHOP_LIST_FAILURE',

    FETCH_USER_LOCAL_LIST_REQUEST: 'FETCH_USER_LOCAL_LIST_REQUEST',
    FETCH_USER_LOCAL_LIST_SUCCESS: 'FETCH_USER_LOCAL_LIST_SUCCESS',
    FETCH_USER_LOCAL_LIST_FAILURE: 'FETCH_USER_LOCAL_LIST_FAILURE',
  },
  duckName,
);

const initialState = {
  listingSelection: 'shop',
  myShopList: [],
  myLocalList: [],
};

const fetchUserShopList = () => dispatch => {
  dispatch(fetchUserShopListRequest());

  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            query {
                fetchUserShopList {
                    id
                    askingPrice
                    condition
                    size
                    slug
                    product {
                        id
                        name
                        original_image_url
                    }
                    reseller {
                        username
                    }
                    images
                  }
            }
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.fetchUserShopList) {
          dispatch(fetchUserShopListSuccess(res.fetchUserShopList));
          resolve({
            success: true,
          });
        } else {
          dispatch(fetchUserShopListFailure());
          resolve({ success: false });
        }
      })
      .catch(e => {
        dispatch(fetchUserShopListFailure());
        resolve({ success: false });
      });
  });
};

const fetchUserLocalList = () => dispatch => {
  dispatch(fetchUserLocalListRequest());

  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            query {
                fetchUserLocalList {
                    id
                    askingPrice
                    condition
                    size
                    slug
                    product {
                      id
                      name
                      original_image_url
                    }
                    reseller {
                        username
                        _geoloc {
                          lat
                          lng
                        }
                    }
                    images
                  }
            }
        `)
      .then(res => {
        if (res !== null && res !== undefined && res.fetchUserLocalList) {
          dispatch(fetchUserLocalListSuccess(res.fetchUserLocalList));
          resolve({
            success: true,
          });
        } else {
          dispatch(fetchUserLocalListFailure());
          resolve({ success: false });
        }
      })
      .catch(e => {
        dispatch(fetchUserLocalListFailure());
        resolve({ success: false });
      });
  });
};

const toggleListingSelection = selection => dispatch => {
  dispatch(changeListingSelection(selection));
};

const changeListingSelection = selection => {
  return {
    type: actionTypes.CHANGE_LISTING_SELECTION,
    payload: selection,
  };
};

const fetchUserShopListRequest = () => {
  return {
    type: actionTypes.FETCH_USER_SHOP_LIST_REQUEST,
  };
};

const fetchUserShopListSuccess = myShopList => {
  console.log(myShopList);
  return {
    type: actionTypes.FETCH_USER_SHOP_LIST_SUCCESS,
    payload: { myShopList },
  };
};

const fetchUserShopListFailure = () => {
  return {
    type: actionTypes.FETCH_USER_SHOP_LIST_FAILURE,
  };
};

const fetchUserLocalListRequest = () => {
  return {
    type: actionTypes.FETCH_USER_LOCAL_LIST_REQUEST,
  };
};

const fetchUserLocalListSuccess = myLocalList => {
  console.log(myLocalList);
  return {
    type: actionTypes.FETCH_USER_LOCAL_LIST_SUCCESS,
    payload: { myLocalList },
  };
};

const fetchUserLocalListFailure = () => {
  return {
    type: actionTypes.FETCH_USER_LOCAL_LIST_FAILURE,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_LISTING_SELECTION:
      return Object.assign({}, state, {
        listingSelection: action.payload,
      });
    case actionTypes.FETCH_USER_SHOP_LIST_REQUEST:
      return Object.assign({}, state, {
        fetchingMyShopList: true,
      });
    case actionTypes.FETCH_USER_SHOP_LIST_SUCCESS:
      console.log(action.payload.myShopList);
      return Object.assign({}, state, {
        fetchingMyShopList: false,
        myShopList: action.payload.myShopList,
      });
    case actionTypes.FETCH_USER_SHOP_LIST_FAILURE:
      return Object.assign({}, state, {
        fetchingMyShopList: false,
      });
    case actionTypes.FETCH_USER_LOCAL_LIST_REQUEST:
      return Object.assign({}, state, {
        fetchingMyLocalList: true,
      });
    case actionTypes.FETCH_USER_LOCAL_LIST_SUCCESS:
      console.log(action.payload.myLocalList);
      return Object.assign({}, state, {
        fetchingMyLocalList: false,
        myLocalList: action.payload.myLocalList,
      });
    case actionTypes.FETCH_USER_LOCAL_LIST_FAILURE:
      return Object.assign({}, state, {
        fetchingMyLocalList: false,
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    toggleListingSelection,
    fetchUserShopList,
    fetchUserLocalList,
  },
};
