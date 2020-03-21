import slugify from "slugify";
import { createActionTypes } from "stores/lib";
import { fetchGraphQL } from "constants/graphql";
import * as immutable from "object-path-immutable";

// Duck Name
const duckName = 'ADMIN_TEST';

const actionTypes = createActionTypes({
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

    GET_RESELLERS_REQUEST: 'GET_RESELLERS_REQUEST',
    GET_RESELLERS_SUCCESS: 'GET_RESELLERS_SUCCESS',
    GET_RESELLERS_ERROR: 'GET_RESELLERS_ERROR',
}, duckName);


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
        isMutating: false
    },
}

// <------------ Resellers ----------------->

const createResellerWithInputType = () => {
    return `
        mutation($reseller: ResellerInput!, ) {
                createNewReseller(reseller: $reseller) {
                    name
                    id
                }
            }
        `
} 


const createNewReseller = (resellerInfo) => dispatch => {   
    dispatch(createNewResellerRequest());
    
    const { name, lat, lng } = resellerInfo;
    const resellerSlug = slugify(name, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })
    const _geoloc = {
        lat: parseFloat(lat), 
        lng: parseFloat(lng)
    } 

    const reseller = immutable.wrap(resellerInfo).set('_geoloc', _geoloc).set('slug', resellerSlug).del('lat').del('lng').value();

    return new Promise((resolve, reject) => {

        fetchGraphQL(
            createResellerWithInputType(), undefined, {
                reseller
            }
        )
        .then(res => {
            if (res !== null && res !== undefined && res.createNewReseller !== null && res.createNewReseller !== undefined) {
                dispatch(createNewResellerSuccess());
                resolve({ created: true, message: "Created Reseller Successfully" });
            } else {
                dispatch(createNewResellerError());
                resolve({ created: false, message: "Failed to Create brand" });
            }
            
          })
        .catch(err => {
            dispatch(createNewResellerError(err.response));
            resolve({ created: false, message: "Failed to Create brand" });
        });
    })    
}

const updateResellerWithInputType = () => {

    return `
        mutation($reseller: ResellerInput!, $id: ID!) {
                updateExistingReseller(reseller: $reseller, id: $id) 
            }
        `
} 

const updateExistingReseller = (resellerInfo) => dispatch => {
    dispatch(updateExistingResellerRequest());
    const { name, id, lat, lng } = resellerInfo;
    const resellerSlug = slugify(name, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })
    const _geoloc = {
        lat: parseFloat(lat), 
        lng: parseFloat(lng)
    } 

    const reseller = immutable.wrap(resellerInfo).set('_geoloc', _geoloc).set('slug', resellerSlug).del('lat').del('lng').del('imageURL').del('id').value();

    return new Promise((resolve, reject) => {
        fetchGraphQL(
            updateResellerWithInputType(), undefined, {
                reseller,
                id
            }
        )
        .then((res) => {
            if (res !== null & res !== undefined && res.updateExistingReseller) {
                dispatch(updateExistingResellerSuccess());
                resolve({ updated: true, message: "Updated Reseller Successfully" });
            } else {
                dispatch(updateExistingResellerError("Could Not Update Reseller"));
                resolve({ updated: false, message: "Failed to update Reseller" });
            }  
          })
          .catch(err => {
            dispatch(updateExistingResellerError(err.response));
            resolve({ updated: false, message: "Failed to update Reseller" })
          });
    })
}

const removeExistingReseller = (resellerInfo) => dispatch => {
    dispatch(removeExistingResellerRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                removeExistingReseller(id: "${resellerInfo.id}")
            }
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.removeExistingReseller) {
                dispatch(removeExistingResellerSuccess());
                resolve({ deleted: true, message: 'Deleted Reseller Successfully' });
            } else {
                dispatch(removeExistingResellerError("Could Not Remove Reseller"));
                resolve({ deleted: false, message: 'Failed to delete Reseller' });
            }
        })
        .catch(err => {
            dispatch(removeExistingResellerError(err.response));
            resolve({ deleted: false, message: 'Failed to delete Reseller' });
          });
    })
}

const updateResellerImage = (imageURL, resellerInfo) => dispatch => {
    dispatch(updateResellerImageRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                updateResellerImage(id: "${resellerInfo.id}", imageURL: "${imageURL}")
            }    
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.updateResellerImage) {
                dispatch(updateResellerImageSuccess())
                resolve({ updated: true, message: "Updated Reseller Image Successfully" });
            } else {
                dispatch(updateResellerImageFailure("Could Not Update Reseller Image"));
                resolve({ updated: false, message: "Failed to update Reseller Image" });
            }
        })
        .catch(err => {
            dispatch(updateResellerImageFailure(err.response));
            resolve({ updated: false, message: "Failed to update Reseller Image" });
        });
    })
}

const getAllResellers = () => dispatch => {
    dispatch(getAllResellersRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
        query {
            getAllResellers {
                id
                name
                _geoloc {
                    lat
                    lng
                }
                shipping
                verified
                imageURL
            }
        }`)
        .then((res) => {
            if (res !== null && res !== undefined && res.getAllResellers !== null && res.getAllResellers !== undefined) {
                dispatch(getAllResellersSuccess(res.getAllResellers));
                resolve({ success: true, message: "Fetched Resellers successfully"});
            } else {
                dispatch(getAllResellersError("Could not fetch Resellers"));
                resolve({ success: false, message: "Failed to fetch resellers"});
            }
          })
        .catch(err => {
            dispatch(getAllResellersError(err.response));
            resolve({ success: false, message: "Failed to fetch resellers"});
        });
    })
}


const createNewResellerRequest = () => {
    return {
        type: actionTypes.CREATE_NEW_RESELLER_REQUEST
    }
}

const createNewResellerSuccess = () => {
    return {
        type: actionTypes.CREATE_NEW_RESELLER_SUCCESS,
    }
}

const createNewResellerError = (errorMessage) => {
    return {
        type: actionTypes.CREATE_NEW_RESELLER_ERROR,
        payload: { errorMessage }
    }
}

const updateExistingResellerRequest = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_RESELLER_REQUEST
    }
}

const updateExistingResellerSuccess = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_RESELLER_SUCCESS,
    }
}

const updateExistingResellerError = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_EXISTING_RESELLER_ERROR,
        payload: { errorMessage }
    }
}

const removeExistingResellerRequest = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_RESELLER_REQUEST
    }
}

const removeExistingResellerSuccess = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_RESELLER_SUCCESS,
    }
}

const removeExistingResellerError = (errorMessage) => {
    return {
        type: actionTypes.REMOVE_EXISTING_RESELLER_ERROR,
        payload: { errorMessage }
    }
}

const updateResellerImageRequest = () => {
    return {
        type: actionTypes.UPDATE_RESELLER_IMAGE_REQUEST
    }
}

const updateResellerImageSuccess = () => {
    return {
        type: actionTypes.UPDATE_RESELLER_IMAGE_SUCCESS,
    }
}

const updateResellerImageFailure = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_RESELLER_IMAGE_ERROR,
        payload: { errorMessage }
    }
}

// resellers
const getAllResellersRequest = () => {
    return {
        type: actionTypes.GET_RESELLERS_REQUEST
    }
}

const getAllResellersSuccess = (data) => {
    return {
        type: actionTypes.GET_RESELLERS_SUCCESS,
        payload: { data }
    }
}

const getAllResellersError = (errorMessage) => {
    console.log(errorMessage)
    return {
        type: actionTypes.GET_RESELLERS_ERROR,
        payload: { errorMessage }
    }
}


// Reducers
const reducer = (state = initialState, action) => {
    switch(action.type) {
        // -------> Mutations

        // Resellers
        case actionTypes.CREATE_NEW_RESELLER_REQUEST:
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: true })
              })
        case actionTypes.CREATE_NEW_RESELLER_SUCCESS:
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: false })
              })
        case actionTypes.CREATE_NEW_RESELLER_ERROR: 
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.UPDATE_EXISTING_RESELLER_REQUEST:
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: true })
              })
        case actionTypes.UPDATE_EXISTING_RESELLER_SUCCESS:
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: false })
              })
        case actionTypes.UPDATE_EXISTING_RESELLER_ERROR: 
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.REMOVE_EXISTING_RESELLER_REQUEST:
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: true })
              })
        case actionTypes.REMOVE_EXISTING_RESELLER_SUCCESS:
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: false })
              })
        case actionTypes.REMOVE_EXISTING_RESELLER_ERROR: 
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })

        
        // Resellers
        case actionTypes.GET_RESELLERS_REQUEST: {
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { isFetching: true })
              })
        }
        case actionTypes.GET_RESELLERS_SUCCESS: {
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { data: action.payload.data || [], isFetching: false })
              })
        }
        case actionTypes.GET_RESELLERS_ERROR: {
            return Object.assign({}, state, {
                resellers: Object.assign({}, state.resellers, { data: [], isFetching: false, errorMessage: action.payload.errorMessage })
              })
        }
        default: 
            return state;
        
    }
}

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
    }
}