import { createActionTypes } from "stores/lib";
import { fetchGraphQL } from "constants/graphql";
import axios from 'axios';
import slugify from "slugify";

import * as immutable from 'object-path-immutable';

// Duck Name
const duckName = 'ADMIN';

// Action Types
const actionTypes = createActionTypes({
    // Mutations

    // ----> Brands
    CREATE_NEW_BRAND_REQUEST: 'CREATE_NEW_BRAND_REQUEST',
    CREATE_NEW_BRAND_SUCCESS: 'CREATE_NEW_BRAND_SUCCESS',
    CREATE_NEW_BRAND_FAILURE: 'CREATE_NEW_BRAND_FAILURE',
    UPDATE_EXISTING_BRAND_REQUEST: 'UPDATE_EXISTING_BRAND_REQUEST',
    UPDATE_EXISTING_BRAND_SUCCESS: 'UPDATE_EXISTING_BRAND_SUCCESS',
    UPDATE_EXISTING_BRAND_ERROR: 'UPDATE_EXISTING_BRAND_ERROR',
    REMOVE_EXISTING_BRAND_REQUEST: 'REMOVE_EXISTING_BRAND_REQUEST',
    REMOVE_EXISTING_BRAND_SUCCESS: 'REMOVE_EXISTING_BRAND_SUCCESS',
    REMOVE_EXISTING_BRAND_ERROR: 'REMOVE_EXISTING_BRAND_ERROR',
    UPDATE_BRAND_IMAGE_REQUEST: 'UPDATE_BRAND_IMAGE_REQUEST',
    UPDATE_BRAND_IMAGE_SUCCESS: 'UPDATE_BRAND_IMAGE_SUCCESS',
    UPDATE_BRAND_IMAGE_ERROR: 'UPDATE_BRAND_IMAGE_ERROR',

    // ------> Designers
    CREATE_NEW_DESIGNER_REQUEST: 'CREATE_NEW_DESIGNER_REQUEST',
    CREATE_NEW_DESIGNER_SUCCESS: 'CREATE_NEW_DESIGNER_SUCCESS',
    CREATE_NEW_DESIGNER_FAILURE: 'CREATE_NEW_DESIGNER_FAILURE',
    UPDATE_EXISTING_DESIGNER_REQUEST: 'UPDATE_EXISTING_DESIGNER_REQUEST',
    UPDATE_EXISTING_DESIGNER_SUCCESS: 'UPDATE_EXISTING_DESIGNER_SUCCESS',
    UPDATE_EXISTING_DESIGNER_ERROR: 'UPDATE_EXISTING_DESIGNER_ERROR',
    REMOVE_EXISTING_DESIGNER_REQUEST: 'REMOVE_EXISTING_DESIGNER_REQUEST',
    REMOVE_EXISTING_DESIGNER_SUCCESS: 'REMOVE_EXISTING_DESIGNER_SUCCESS',
    REMOVE_EXISTING_DESIGNER_ERROR: 'REMOVE_EXISTING_DESIGNER_ERROR',
    UPDATE_DESIGNER_IMAGE_REQUEST: 'UPDATE_DESIGNER_IMAGE_REQUEST',
    UPDATE_DESIGNER_IMAGE_SUCCESS: 'UPDATE_DESIGNER_IMAGE_SUCCESS',
    UPDATE_DESIGNER_IMAGE_ERROR: 'UPDATE_DESIGNER_IMAGE_ERROR',


    // -------> Sizing
    CREATE_NEW_SIZING_REQUEST: 'CREATE_NEW_SIZING_REQUEST',
    CREATE_NEW_SIZING_SUCCESS: 'CREATE_NEW_SIZING_SUCCESS',
    CREATE_NEW_SIZING_ERROR: 'CREATE_NEW_SIZING_ERROR',

    // -------> Sneakers
    CREATE_NEW_SNEAKER_REQUEST: 'CREATE_NEW_SNEAKER_REQUEST',
    CREATE_NEW_SNEAKER_SUCCESS: 'CREATE_NEW_SNEAKER_SUCCESS',
    CREATE_NEW_SNEAKER_ERROR: 'CREATE_NEW_SNEAKER_ERROR',
    UPDATE_EXISTING_SNEAKER_REQUEST: 'UPDATE_EXISTING_SNEAKER_REQUEST',
    UPDATE_EXISTING_SNEAKER_SUCCESS: 'UPDATE_EXISTING_SNEAKER_SUCCESS',
    UPDATE_EXISTING_SNEAKER_ERROR: 'UPDATE_EXISTING_SNEAKER_ERROR',
    REMOVE_EXISTING_SNEAKER_REQUEST: 'REMOVE_EXISTING_SNEAKER_REQUEST',
    REMOVE_EXISTING_SNEAKER_SUCCESS: 'REMOVE_EXISTING_SNEAKER_SUCCESS',
    REMOVE_EXISTING_SNEAKER_ERROR: 'REMOVE_EXISTING_SNEAKER_ERROR',
    UPDATE_SNEAKER_IMAGE_REQUEST: 'UPDATE_SNEAKER_IMAGE_REQUEST',
    UPDATE_SNEAKER_IMAGE_SUCCESS: 'UPDATE_SNEAKER_IMAGE_SUCCESS',
    UPDATE_SNEAKER_IMAGE_ERROR: 'UPDATE_SNEAKER_IMAGE_ERROR',

    //  Queries 

    //  -----> Brands
    GET_BRANDS_REQUEST: 'GET_BRANDS_REQUEST',
    GET_BRANDS_SUCCESS: 'GET_BRANDS_SUCCESS',
    GET_BRANDS_ERROR: 'GET_BRANDS_ERROR',

    // ------> Designers
    GET_DESIGNERS_REQUEST: 'GET_DESIGNERS_REQUEST',
    GET_DESIGNERS_SUCCESS: 'GET_DESIGNERS_SUCCESS',
    GET_DESIGNERS_ERROR: 'GET_DESIGNERS_ERROR',

    // -----> Sizing
    GET_SIZING_REQUEST: 'GET_SIZING_REQUEST',
    GET_SIZING_SUCCESS: 'GET_SIZING_SUCCESS',
    GET_SIZING_ERROR: 'GET_SIZING_ERROR',

    //  -----> Sneakers
    GET_SNEAKERS_REQUEST: 'GET_SNEAKERS_REQUEST',
    GET_SNEAKERS_SUCCESS: 'GET_SNEAKERS_SUCCESS',
    GET_SNEAKERS_ERROR: 'GET_SNEAKERS_ERROR',
    
}, duckName);

// Initial State
const initialState = {
    sneakers: {
        data: [],
        errorMessage: {},
        isFetching: false,
        isMutating: false,
    },
    apparel: {
        data: [],
        errorMessage: {},
        isFetching: false,
        isMutating: false,
    },
    brands: {
        data: [],
        errorMessage: {},
        isFetching: false,
        isMutating: false,
    },
    designers: {
        data: [],
        errorMessage: {},
        isFetching: false,
        isMutating: false
    },
    sizing: {
        data: {},
        errorMessage: {},
        isFetching: false,
        isMutating: true,
    }
}


// Action Creators

// <------------ BRANDS ----------------->
const createNewBrand = (brandInfo) => dispatch => {   
    dispatch(createNewBrandRequest());
    const { name } = brandInfo;
    const brandSlug = slugify(name, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })

    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                createNewBrand(name: "${name}", slug: "${brandSlug}") {
                    name
                }
            }
        `)
        .then(res => {
            if (res !== null && res !== undefined && res.createNewBrand !== null && res.createNewBrand !== undefined) {
                dispatch(createNewBrandSuccess());
                resolve({ created: true, message: "Created Brand Successfully" });
            } else {
                dispatch(createNewBrandError());
                resolve({ created: false, message: "Failed to Create brand" });
            }
            
          })
        .catch(err => {
            dispatch(createNewBrandError(err.response));
            resolve({ created: false, message: "Failed to Create brand" });
        });
    })    
}

const updateExistingBrand = (brandInfo) => dispatch => {
    dispatch(updateExistingBrandRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                updateExistingBrand(id: "${brandInfo.id}", name: "${brandInfo.name}")
            }
        `)
        .then((res) => {
            if (res !== null & res !== undefined && res.updateExistingBrand) {
                dispatch(updateExistingBrandSuccess());
                resolve({ updated: true, message: "Updated Brand Successfully" });
            } else {
                dispatch(updateExistingBrandError("Could Not Update Brand"));
                resolve({ updated: false, message: "Failed to update Brand" });
            }  
          })
          .catch(err => {
            dispatch(updateExistingBrandError(err.response));
            resolve({ updated: false, message: "Failed to update Brand" })
          });
    })
}

const removeExistingBrand = (brandInfo) => dispatch => {
    dispatch(removeExistingBrandRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                removeExistingBrand(id: "${brandInfo.id}")
            }
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.removeExistingBrand) {
                dispatch(removeExistingBrandSuccess());
                resolve({ deleted: true, message: 'Deleted Brand Successfully' });
            } else {
                dispatch(removeExistingBrandError("Could Not Remove Brand"));
                resolve({ deleted: false, message: 'Failed to delete Brand' });
            }
        })
        .catch(err => {
            dispatch(removeExistingBrandError(err.response));
            resolve({ deleted: false, message: 'Failed to delete Brand' });
          });
    })
}

const updateBrandImage = (imageURL, brandInfo) => dispatch => {
    dispatch(updateBrandImageRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                updateBrandImage(id: "${brandInfo.id}", imageURL: "${imageURL}")
            }    
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.updateBrandImage) {
                dispatch(updateBrandImageSuccess())
                resolve({ updated: true, message: "Updated Brand Image Successfully" });
            } else {
                dispatch(updateBrandImageFailure("Could Not Update Brand Image"));
                resolve({ updated: false, message: "Failed to update Brand Image" });
            }
        })
        .catch(err => {
            dispatch(updateBrandImageFailure(err.response));
            resolve({ updated: false, message: "Failed to update Brand Image" });
        });
    })
}

// <------------ DESIGNERS ----------------->

const createNewDesigner = (designerInfo) => dispatch => {   
    dispatch(createNewDesignerRequest());
    const { name } = designerInfo;

    const designerSlug = slugify(name, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                createNewDesigner(name: "${name}", slug: "${designerSlug}") {
                    name
                }
            }
        `)
        .then(res => {
            if (res !== null && res !== undefined && res.createNewDesigner !== null && res.createNewDesigner !== undefined) {
                dispatch(createNewDesignerSuccess());
                resolve({ created: true, message: "Created Brand Successfully" });
            } else {
                dispatch(createNewDesignerError());
                resolve({ created: false, message: "Failed to Create brand" });
            }
            
          })
        .catch(err => {
            dispatch(createNewDesignerError(err.response));
            resolve({ created: false, message: "Failed to Create brand" });
        });
    })    
}

const updateExistingDesigner = (designerInfo) => dispatch => {
    dispatch(updateExistingDesignerRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                updateExistingDesigner(id: "${designerInfo.id}", name: "${designerInfo.name}")
            }
        `)
        .then((res) => {
            if (res !== null & res !== undefined && res.updateExistingDesigner) {
                dispatch(updateExistingDesignerSuccess());
                resolve({ updated: true, message: "Updated Designer Successfully" });
            } else {
                dispatch(updateExistingDesignerError("Could Not Update Designer"));
                resolve({ updated: false, message: "Failed to update Designer" });
            }  
          })
          .catch(err => {
            dispatch(updateExistingDesignerError(err.response));
            resolve({ updated: false, message: "Failed to update Designer" })
          });
    })
}

const removeExistingDesigner = (designerInfo) => dispatch => {
    dispatch(removeExistingDesignerRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                removeExistingDesigner(id: "${designerInfo.id}")
            }
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.removeExistingDesigner) {
                dispatch(removeExistingDesignerSuccess());
                resolve({ deleted: true, message: 'Deleted Designer Successfully' });
            } else {
                dispatch(removeExistingDesignerError("Could Not Remove Designer"));
                resolve({ deleted: false, message: 'Failed to delete Designer' });
            }
        })
        .catch(err => {
            dispatch(removeExistingDesignerError(err.response));
            resolve({ deleted: false, message: 'Failed to delete Designer' });
          });
    })
}

const updateDesignerImage = (imageURL, designerInfo) => dispatch => {
    dispatch(updateDesignerImageRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                updateDesignerImage(id: "${designerInfo.id}", imageURL: "${imageURL}")
            }    
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.updateDesignerImage) {
                dispatch(updateDesignerImageSuccess())
                resolve({ updated: true, message: "Updated Designer Image Successfully" });
            } else {
                dispatch(updateDesignerImageFailure("Could Not Update Designer Image"));
                resolve({ updated: false, message: "Failed to update Designer Image" });
            }
        })
        .catch(err => {
            dispatch(updateDesignerImageFailure(err.response));
            resolve({ updated: false, message: "Failed to update Designer Image" });
        });
    })
}

// <----------------- Sizing -------------->

const createSneakerSize = (productCategory) => {
    if (productCategory === "sneakers") {
        return `
            mutation($productCategory: String!, $gender: String!, $brandChoice: String!, $size_range: [Float!]) {
                createNewSneakerSizing(productCategory: $productCategory, gender: $gender, brand: $brandChoice, size_range: $size_range)
            }
        `
    } else {
        return `
            mutation($productCategory: String!, $gender: String!, $brandChoice: String!, $size_range: [String!]) {
                createNewApparelSizing(productCategory: $productCategory, gender: $gender, brand: $brandChoice, size_range: $size_range) 
            }
        `
    }
    
} 

const createNewSizing = (productCategory, gender, brandChoice, size_range) => dispatch => {
    dispatch(createNewSizingRequest());
    
    return new Promise((resolve, reject) => {
        fetchGraphQL(
            createSneakerSize(productCategory), undefined, {
                productCategory,
                gender,
                brandChoice,
                size_range
            }
        )
        .then((res) => {
            if (res !== null && res !== undefined && (res.createNewSneakerSizing || res.createNewApparelSizing)) {
                dispatch(createNewSizingSuccess())
                resolve({ created: true, message: "Created Sizing Successfully" });
            } else {
                dispatch(createNewSizingError("Could Not create sizing"));
                resolve({ created: false, message: "Failed to create sizing" });
            }
        })
        .catch(err => {
            dispatch(createNewSizingError(err.response));
            resolve({ created: false, message: "Failed to create sizing" });
        });
    })
}


// <------------ SNEAKERS ----------------->

const createSneakerWithInputType = () => {

    return `
        mutation($sneaker: SneakerInput!, ) {
                createNewSneaker(sneaker: $sneaker) {
                    name
                    id
                }
            }
        `
} 

const createNewSneaker = (sneakerInfo) => dispatch => {   
    dispatch(createNewSneakerRequest());
    const { name } = sneakerInfo;
    const sneakerSlug = slugify(name, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })
    const sneaker = immutable.set(sneakerInfo, "slug", sneakerSlug);
    return new Promise((resolve, reject) => {
        fetchGraphQL(
            createSneakerWithInputType(), undefined, {
                sneaker
            }
        )
        .then(res => {
            if (res !== null && res !== undefined && res.createNewSneaker !== null && res.createNewSneaker !== undefined) {
                dispatch(createNewSneakerSuccess());
                resolve({ created: true, message: "Created Sneaker Successfully" });
            } else {
                dispatch(createNewSneakerError());
                resolve({ created: false, message: "Failed to Create Sneaker" });
            }
            
          })
        .catch(err => {
            dispatch(createNewSneakerError(err.response));
            resolve({ created: false, message: "Failed to Create Sneaker" });
        });
    })    
}

const updateSneakerWithInputType = () => {

    return `
        mutation($sneaker: SneakerInput!, $id: ID!) {
                updateExistingSneaker(sneaker: $sneaker, id: $id) 
            }
        `
} 

const updateExistingSneaker = (sneakerInfo) => dispatch => {
    dispatch(updateExistingSneakerRequest());
    const { name, id } = sneakerInfo;
    const sneakerSlug = slugify(name, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })

    const sneakerWithUpdatedSlug = immutable.set(sneakerInfo, "slug", sneakerSlug);
    const sneaker = immutable.wrap(sneakerWithUpdatedSlug).del('id').del('imageURL').value();
    console.log(sneaker);
    return new Promise((resolve, reject) => {
        fetchGraphQL(
            updateSneakerWithInputType(), undefined, {
                sneaker,
                id
            }
        )
        .then((res) => {
            if (res !== null & res !== undefined && res.updateExistingSneaker) {
                dispatch(updateExistingSneakerSuccess());
                resolve({ updated: true, message: "Updated Sneaker Successfully" });
            } else {
                dispatch(updateExistingSneakerError("Could Not Update Sneaker"));
                resolve({ updated: false, message: "Failed to update Sneaker" });
            }  
          })
          .catch(err => {
            dispatch(updateExistingSneakerError(err.response));
            resolve({ updated: false, message: "Failed to update Sneaker" })
          });
    })
}

const removeExistingSneaker = (brandInfo) => dispatch => {
    dispatch(removeExistingSneakerRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                removeExistingSneaker(id: "${brandInfo.id}")
            }
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.removeExistingSneaker) {
                dispatch(removeExistingSneakerSuccess());
                resolve({ deleted: true, message: 'Deleted Sneaker Successfully' });
            } else {
                dispatch(removeExistingSneakerError("Could Not Remove Sneaker"));
                resolve({ deleted: false, message: 'Failed to delete Sneaker' });
            }
        })
        .catch(err => {
            dispatch(removeExistingSneakerError(err.response));
            resolve({ deleted: false, message: 'Failed to delete Sneaker' });
          });
    })
}

const updateSneakerImage = (imageURL, sneakerInfo) => dispatch => {
    dispatch(updateSneakerImageRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                updateSneakerImage(id: "${sneakerInfo.id}", imageURL: "${imageURL}")
            }    
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.updateSneakerImage) {
                dispatch(updateSneakerImageSuccess())
                resolve({ updated: true, message: "Updated Sneaker Image Successfully" });
            } else {
                dispatch(updateSneakerImageFailure("Could Not Update Sneaker Image"));
                resolve({ updated: false, message: "Failed to update Sneaker Image" });
            }
        })
        .catch(err => {
            dispatch(updateSneakerImageFailure(err.response));
            resolve({ updated: false, message: "Failed to update Sneaker Image" });
        });
    })
}



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
        .then((res) => {
            if (res !== null && res !== undefined && res.getAllBrands !== null && res.getAllBrands !== undefined) {
                dispatch(getAllBrandsSuccess(res.getAllBrands));
                resolve({ success: true, message: "Fetched Brands successfully"});
            } else {
                dispatch(getAllBrandsError("Could not fetch Brands"));
                resolve({ success: false, message: "Failed to fetch brands"});
            }
          })
        .catch(err => {
            dispatch(getAllBrandsError(err.response));
            resolve({ success: false, message: "Failed to fetch brands"});
        });
    })
}

// <---------------- Designers ------------------>
const getAllDesigners = () => dispatch => {
    dispatch(getAllDesignersRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
        query {
            getAllDesigners {
                id
                name
                slug
                imageURL
            }
        }`)
        .then((res) => {
            if (res !== null && res !== undefined && res.getAllDesigners !== null && res.getAllDesigners !== undefined) {
                dispatch(getAllDesignersSuccess(res.getAllDesigners));
                resolve({ success: true, message: "Fetched Designers successfully"});
            } else {
                dispatch(getAllDesignersError("Could not fetch Designers"));
                resolve({ success: false, message: "Failed to fetch Designers"});
            }
          })
        .catch(err => {
            dispatch(getAllDesignersError(err.response));
            resolve({ success: false, message: "Failed to fetch Designers"});
        });
    })
}


const getSizing = () => dispatch => {
    dispatch(getSizingRequest());
    return new Promise((resolve, reject) => {
        axios
        .get('http://localhost:4000/sizing', {})
        .then((res) => {
            console.log(res.data);
            if (res !== null && res !== undefined && res.data !== null && res.data !== undefined) {
                dispatch(getSizingSuccess(res.data));
                resolve({ success: true, message: "Fetched Sizing successfully"});
            } else {
                dispatch(getSizingError("Could not fetch Sizing"));
                resolve({ success: false, message: "Failed to fetch Sizing"});
            }
          })
        .catch(err => {
            console.log(err)
            dispatch(getSizingError(err.response));
            resolve({ success: false, message: "Failed to fetch Sizing"});
        });
    })
}

// <----------------- Sneakers -------------->

const getAllSneakers = () => dispatch => {
    dispatch(getAllSneakersRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
        query {
            getAllSneakers {
                id
                name
                nickName
                description
                sku
                slug
                brand
                designer
                gender
                imageURL
            }
        }`)
        .then((res) => {
            if (res !== null && res !== undefined && res.getAllSneakers !== null && res.getAllSneakers !== undefined) {
                dispatch(getAllSneakersSuccess(res.getAllSneakers));
                resolve({ success: true, message: "Fetched Sneakers successfully"});
            } else {
                dispatch(getAllSneakersError("Could not fetch Sneakers"));
                resolve({ success: false, message: "Failed to fetch sneakers"});
            }
          })
        .catch(err => {
            dispatch(getAllSneakersError(err.response));
            resolve({ success: false, message: "Failed to fetch sneakers"});
        });
    })
}

// Actions

// <---------------------- BRANDS ---------------->
const createNewBrandRequest = () => {
    return {
        type: actionTypes.CREATE_NEW_BRAND_REQUEST
    }
}

const createNewBrandSuccess = () => {
    return {
        type: actionTypes.CREATE_NEW_BRAND_SUCCESS,
    }
}

const createNewBrandError = (errorMessage) => {
    return {
        type: actionTypes.CREATE_NEW_BRAND_ERROR,
        payload: { errorMessage }
    }
}

const updateExistingBrandRequest = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_BRAND_REQUEST
    }
}

const updateExistingBrandSuccess = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_BRAND_SUCCESS,
    }
}

const updateExistingBrandError = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_EXISTING_BRAND_ERROR,
        payload: { errorMessage }
    }
}

const removeExistingBrandRequest = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_BRAND_REQUEST
    }
}

const removeExistingBrandSuccess = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_BRAND_SUCCESS,
    }
}

const removeExistingBrandError = (errorMessage) => {
    return {
        type: actionTypes.REMOVE_EXISTING_BRAND_ERROR,
        payload: { errorMessage }
    }
}

const updateBrandImageRequest = () => {
    return {
        type: actionTypes.UPDATE_BRAND_IMAGE_REQUEST
    }
}

const updateBrandImageSuccess = () => {
    return {
        type: actionTypes.UPDATE_BRAND_IMAGE_SUCCESS,
    }
}

const updateBrandImageFailure = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_BRAND_IMAGE_ERROR,
        payload: { errorMessage }
    }
}





// <---------------------- DESIGNERS ---------------->

const createNewDesignerRequest = () => {
    return {
        type: actionTypes.CREATE_NEW_DESIGNER_REQUEST
    }
}

const createNewDesignerSuccess = () => {
    return {
        type: actionTypes.CREATE_NEW_DESIGNER_SUCCESS,
    }
}

const createNewDesignerError = (errorMessage) => {
    return {
        type: actionTypes.CREATE_NEW_DESIGNER_ERROR,
        payload: { errorMessage }
    }
}

const updateExistingDesignerRequest = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_DESIGNER_REQUEST
    }
}

const updateExistingDesignerSuccess = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_DESIGNER_SUCCESS,
    }
}

const updateExistingDesignerError = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_EXISTING_DESIGNER_ERROR,
        payload: { errorMessage }
    }
}

const removeExistingDesignerRequest = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_DESIGNER_REQUEST
    }
}

const removeExistingDesignerSuccess = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_DESIGNER_SUCCESS,
    }
}

const removeExistingDesignerError = (errorMessage) => {
    return {
        type: actionTypes.REMOVE_EXISTING_DESIGNER_ERROR,
        payload: { errorMessage }
    }
}

const updateDesignerImageRequest = () => {
    return {
        type: actionTypes.UPDATE_DESIGNER_IMAGE_REQUEST
    }
}

const updateDesignerImageSuccess = () => {
    return {
        type: actionTypes.UPDATE_DESIGNER_IMAGE_SUCCESS,
    }
}

const updateDesignerImageFailure = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_DESIGNER_IMAGE_ERROR,
        payload: { errorMessage }
    }
}

const createNewSizingRequest = () => {
    return {
        type: actionTypes.CREATE_NEW_SIZING_REQUEST
    }
}

const createNewSizingSuccess = () => {
    return {
        type: actionTypes.CREATE_NEW_SIZING_SUCCESS,
    }
}

const createNewSizingError = (errorMessage) => {
    return {
        type: actionTypes.CREATE_NEW_SIZING_ERROR,
        payload: { errorMessage }
    }
}

// <---------------------- SNEAKERS ---------------->
const createNewSneakerRequest = () => {
    return {
        type: actionTypes.CREATE_NEW_SNEAKER_REQUEST
    }
}

const createNewSneakerSuccess = () => {
    return {
        type: actionTypes.CREATE_NEW_SNEAKER_SUCCESS,
    }
}

const createNewSneakerError = (errorMessage) => {
    return {
        type: actionTypes.CREATE_NEW_SNEAKER_ERROR,
        payload: { errorMessage }
    }
}

const updateExistingSneakerRequest = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_SNEAKER_REQUEST
    }
}

const updateExistingSneakerSuccess = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_SNEAKER_SUCCESS,
    }
}

const updateExistingSneakerError = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_EXISTING_SNEAKER_ERROR,
        payload: { errorMessage }
    }
}

const removeExistingSneakerRequest = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_SNEAKER_REQUEST
    }
}

const removeExistingSneakerSuccess = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_SNEAKER_SUCCESS,
    }
}

const removeExistingSneakerError = (errorMessage) => {
    return {
        type: actionTypes.REMOVE_EXISTING_SNEAKER_ERROR,
        payload: { errorMessage }
    }
}

const updateSneakerImageRequest = () => {
    return {
        type: actionTypes.UPDATE_SNEAKER_IMAGE_REQUEST
    }
}

const updateSneakerImageSuccess = () => {
    return {
        type: actionTypes.UPDATE_SNEAKER_IMAGE_SUCCESS,
    }
}

const updateSneakerImageFailure = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_SNEAKER_IMAGE_ERROR,
        payload: { errorMessage }
    }
}

// QUERY Actions

// brands
const getAllBrandsRequest = () => {
    return {
        type: actionTypes.GET_BRANDS_REQUEST
    }
}

const getAllBrandsSuccess = (data) => {
    return {
        type: actionTypes.GET_BRANDS_SUCCESS,
        payload: { data }
    }
}

const getAllBrandsError = (errorMessage) => {
    console.log(errorMessage)
    return {
        type: actionTypes.GET_BRANDS_ERROR,
        payload: { errorMessage }
    }
}

// designers
const getAllDesignersRequest = () => {
    return {
        type: actionTypes.GET_DESIGNERS_REQUEST
    }
}

const getAllDesignersSuccess = (data) => {
    return {
        type: actionTypes.GET_DESIGNERS_SUCCESS,
        payload: { data }
    }
}

const getAllDesignersError = (errorMessage) => {
    console.log(errorMessage)
    return {
        type: actionTypes.GET_DESIGNERS_ERROR,
        payload: { errorMessage }
    }
}

// sizing
const getSizingRequest = () => {
    return {
        type: actionTypes.GET_SIZING_REQUEST
    }
}

const getSizingSuccess = (data) => {
    return {
        type: actionTypes.GET_SIZING_SUCCESS,
        payload: { data }
    }
}

const getSizingError = (errorMessage) => {
    console.log(errorMessage)
    return {
        type: actionTypes.GET_SIZING_ERROR,
        payload: { errorMessage }
    }
}

// sneakers
const getAllSneakersRequest = () => {
    return {
        type: actionTypes.GET_SNEAKERS_REQUEST
    }
}

const getAllSneakersSuccess = (data) => {
    return {
        type: actionTypes.GET_SNEAKERS_SUCCESS,
        payload: { data }
    }
}

const getAllSneakersError = (errorMessage) => {
    console.log(errorMessage)
    return {
        type: actionTypes.GET_SNEAKERS_ERROR,
        payload: { errorMessage }
    }
}

// Reducers
const reducer = (state = initialState, action) => {
    switch(action.type) {
        // -------> Mutations

        // Brands
        case actionTypes.CREATE_NEW_BRAND_REQUEST:
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: true })
              })
        case actionTypes.CREATE_NEW_BRAND_SUCCESS:
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: false })
              })
        case actionTypes.CREATE_NEW_BRAND_ERROR: 
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.UPDATE_EXISTING_BRAND_REQUEST:
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: true })
              })
        case actionTypes.UPDATE_EXISTING_BRAND_SUCCESS:
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: false })
              })
        case actionTypes.UPDATE_EXISTING_BRAND_ERROR: 
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.REMOVE_EXISTING_BRAND_REQUEST:
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: true })
              })
        case actionTypes.REMOVE_EXISTING_BRAND_SUCCESS:
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: false })
              })
        case actionTypes.REMOVE_EXISTING_BRAND_ERROR: 
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isMutating: false, errorMessage: action.payload.errorMessage })
            })

        
            // Designers
        case actionTypes.CREATE_NEW_DESIGNER_REQUEST:
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: true })
              })
        case actionTypes.CREATE_NEW_DESIGNER_SUCCESS:
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: false })
              })
        case actionTypes.CREATE_NEW_DESIGNER_ERROR: 
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.UPDATE_EXISTING_DESIGNER_REQUEST:
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: true })
              })
        case actionTypes.UPDATE_EXISTING_DESIGNER_SUCCESS:
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: false })
              })
        case actionTypes.UPDATE_EXISTING_DESIGNER_ERROR: 
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.REMOVE_EXISTING_DESIGNER_REQUEST:
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: true })
              })
        case actionTypes.REMOVE_EXISTING_DESIGNER_SUCCESS:
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: false })
              })
        case actionTypes.REMOVE_EXISTING_DESIGNER_ERROR: 
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })

        // Sizing
        case actionTypes.CREATE_NEW_SIZING_REQUEST:
            return Object.assign({}, state, {
                sizing: Object.assign({}, state.sizing, { isMutating: true })
              })
        case actionTypes.CREATE_NEW_SIZING_SUCCESS:
            return Object.assign({}, state, {
                sizing: Object.assign({}, state.sizing, { isMutating: false })
              })
        case actionTypes.CREATE_NEW_SIZING_ERROR: 
            return Object.assign({}, state, {
                sizing: Object.assign({}, state.sizing, { isMutating: false, errorMessage: action.payload.errorMessage })
            })

        // Brands
        case actionTypes.CREATE_NEW_SNEAKER_REQUEST:
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: true })
              })
        case actionTypes.CREATE_NEW_SNEAKER_SUCCESS:
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: false })
              })
        case actionTypes.CREATE_NEW_SNEAKER_ERROR: 
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        
        case actionTypes.UPDATE_EXISTING_SNEAKER_REQUEST:
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: true })
              })
        case actionTypes.UPDATE_EXISTING_SNEAKER_SUCCESS:
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: false })
              })
        case actionTypes.UPDATE_EXISTING_SNEAKER_ERROR: 
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.REMOVE_EXISTING_SNEAKER_REQUEST:
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: true })
              })
        case actionTypes.REMOVE_EXISTING_SNEAKER_SUCCESS:
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: false })
              })
        case actionTypes.REMOVE_EXISTING_SNEAKER_ERROR: 
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isMutating: false, errorMessage: action.payload.errorMessage })
            })

        // ----------- Query Reducers ----------------
            // Brands
        case actionTypes.GET_BRANDS_REQUEST: {
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { isFetching: true })
              })
        }
        case actionTypes.GET_BRANDS_SUCCESS: {
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { data: action.payload.data || [], isFetching: false })
              })
        }
        case actionTypes.GET_BRANDS_ERROR: {
            return Object.assign({}, state, {
                brands: Object.assign({}, state.brands, { data: [], isFetching: false, errorMessage: action.payload.errorMessage })
              })
        }

            // Designers
        case actionTypes.GET_DESIGNERS_REQUEST: {
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { isFetching: true })
              })
        }
        case actionTypes.GET_DESIGNERS_SUCCESS: {
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { data: action.payload.data || [], isFetching: false })
              })
        }
        case actionTypes.GET_DESIGNERS_ERROR: {
            return Object.assign({}, state, {
                designers: Object.assign({}, state.designers, { data: [], isFetching: false, errorMessage: action.payload.errorMessage })
              })
        }

            // Sizing
        case actionTypes.GET_SIZING_REQUEST: {
            return Object.assign({}, state, {
                sizing: Object.assign({}, state.sizing, { isFetching: true })
              })
        }
        case actionTypes.GET_SIZING_SUCCESS: {
            return Object.assign({}, state, {
                sizing: Object.assign({}, state.sizing, { data: action.payload.data || [], isFetching: false })
              })
        }
        case actionTypes.GET_SIZING_ERROR: {
            return Object.assign({}, state, {
                sizing: Object.assign({}, state.sizing, { data: [], isFetching: false, errorMessage: action.payload.errorMessage })
              })
        }
            // Sneakers
        case actionTypes.GET_SNEAKERS_REQUEST: {
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { isFetching: true })
              })
        }
        case actionTypes.GET_SNEAKERS_SUCCESS: {
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { data: action.payload.data || [], isFetching: false })
              })
        }
        case actionTypes.GET_SNEAKERS_ERROR: {
            return Object.assign({}, state, {
                sneakers: Object.assign({}, state.sneakers, { data: [], isFetching: false, errorMessage: action.payload.errorMessage })
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
        // Brands
            // ----> Mutations
            createNewBrand,
            updateExistingBrand,
            removeExistingBrand,
            updateBrandImage,
            // ----> Query
            getAllBrands,
        // Designers 
            // ----> Mutations
            createNewDesigner,
            updateExistingDesigner,
            removeExistingDesigner,
            updateDesignerImage,
            // -----> Query
            getAllDesigners,
        // Sizing
            // ----> Mutation
            createNewSizing,
            // ----> Query
            getSizing,
        // Sneakers
            // ----> Mutation
            createNewSneaker,
            updateExistingSneaker,
            removeExistingSneaker,
            updateSneakerImage,
            // ----> Query
            getAllSneakers
        
    }
}
