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
    UPDATE_SNEAKER_ADDITIONAL_IMAGES_REQUEST: 'UPDATE_SNEAKER_ADDITIONAL_IMAGES_REQUEST',
    UPDATE_SNEAKER_ADDITIONAL_IMAGES_SUCCESS: 'UPDATE_SNEAKER_ADDITIONAL_IMAGES_SUCCESS',
    UPDATE_SNEAKER_ADDITIONAL_IMAGES_ERROR: 'UPDATE_SNEAKER_ADDITIONAL_IMAGES_ERROR',

    // -------> Apparel
    CREATE_NEW_APPAREL_REQUEST: 'CREATE_NEW_APPAREL_REQUEST',
    CREATE_NEW_APPAREL_SUCCESS: 'CREATE_NEW_APPAREL_SUCCESS',
    CREATE_NEW_APPAREL_ERROR: 'CREATE_NEW_APPAREL_ERROR',
    UPDATE_EXISTING_APPAREL_REQUEST: 'UPDATE_EXISTING_APPAREL_REQUEST',
    UPDATE_EXISTING_APPAREL_SUCCESS: 'UPDATE_EXISTING_APPAREL_SUCCESS',
    UPDATE_EXISTING_APPAREL_ERROR: 'UPDATE_EXISTING_APPAREL_ERROR',
    REMOVE_EXISTING_APPAREL_REQUEST: 'REMOVE_EXISTING_APPAREL_REQUEST',
    REMOVE_EXISTING_APPAREL_SUCCESS: 'REMOVE_EXISTING_APPAREL_SUCCESS',
    REMOVE_EXISTING_APPAREL_ERROR: 'REMOVE_EXISTING_APPAREL_ERROR',
    UPDATE_APPAREL_IMAGE_REQUEST: 'UPDATE_APPAREL_IMAGE_REQUEST',
    UPDATE_APPAREL_IMAGE_SUCCESS: 'UPDATE_APPAREL_IMAGE_SUCCESS',
    UPDATE_APPAREL_IMAGE_ERROR: 'UPDATE_APPAREL_IMAGE_ERROR',
    UPDATE_APPAREL_ADDITIONAL_IMAGES_REQUEST: 'UPDATE_APPAREL_ADDITIONAL_IMAGES_REQUEST',
    UPDATE_APPAREL_ADDITIONAL_IMAGES_SUCCESS: 'UPDATE_APPAREL_ADDITIONAL_IMAGES_SUCCESS',
    UPDATE_APPAREL_ADDITIONAL_IMAGES_ERROR: 'UPDATE_APPAREL_ADDITIONAL_IMAGES_ERROR',

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

    //  -----> Apparel
    GET_APPAREL_REQUEST: 'GET_APPAREL_REQUEST',
    GET_APPAREL_SUCCESS: 'GET_APPAREL_SUCCESS',
    GET_APPAREL_ERROR: 'GET_APPAREL_ERROR',
    
     //  -----> Apparel
     GET_PURCHASED_ORDERS_REQUEST: 'GET_PURCHASED_ORDERS_REQUEST',
     GET_PURCHASED_ORDERS_SUCCESS: 'GET_PURCHASED_ORDERS_SUCCESS',
     GET_PURCHASED_ORDERS_ERROR: 'GET_PURCHASED_ORDERS_ERROR',

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
    },
    orders: {
        data: [],
        errorMessage: {},
        isFetching: false
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
        mutation($product: ProductInput!, ) {
                createNewProduct(product: $product) {
                    name
                    id
                }
            }
        `
} 

const createNewSneaker = (sneakerInfo) => dispatch => {   
    dispatch(createNewSneakerRequest());

    const { name, sku, brand, designer, size_brand} = sneakerInfo;
    const sneakerSlug = slugify(name + " " + sku, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })
    const product = immutable.wrap(sneakerInfo).set('slug', sneakerSlug).set('productCategory', 'sneakers').set('brand', brand.value).set('designer', designer.value).set('size_brand', size_brand.value).value();

    return new Promise((resolve, reject) => {
        fetchGraphQL(
            createSneakerWithInputType(), undefined, {
                product
            }
        )
        .then(res => {
            if (res !== null && res !== undefined && res.createNewProduct !== null && res.createNewProduct !== undefined) {
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
        mutation($product: ProductInput!, $id: ID!) {
                updateExistingProduct(product: $product, id: $id) 
            }
        `
} 

const updateExistingSneaker = (sneakerInfo) => dispatch => {
    dispatch(updateExistingSneakerRequest());

    const { name, id, sku, brand, designer, size_brand } = sneakerInfo;
    const sneakerSlug = slugify(name + " " + sku, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })
    const product = immutable.wrap(sneakerInfo).set('slug', sneakerSlug).set('brand', brand.value).set('designer', designer.value).set('size_brand', size_brand.value).del('id').value();

    return new Promise((resolve, reject) => {
        fetchGraphQL(
            updateSneakerWithInputType(), undefined, {
                product,
                id
            }
        )
        .then((res) => {
            if (res !== null & res !== undefined && res.updateExistingProduct) {
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

const removeExistingSneaker = (sneakerInfo) => dispatch => {
    dispatch(removeExistingSneakerRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                removeExistingProduct(id: "${sneakerInfo.id}")
            }
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.removeExistingProduct) {
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
                updateProductImage(id: "${sneakerInfo.id}", imageURL: "${imageURL}")
            }    
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.updateProductImage) {
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

const updateSneakerImagesWithInput = () => {
    return `
    mutation($id: ID!, $imageURLs: [String!]!) {
        updateProductAdditionalImages(id: $id, imageURLs: $imageURLs)
    }
    `
}

const updateSneakerAdditionalImages = (imageURLs, sneakerInfo) => dispatch => {
    console.log(imageURLs);
    dispatch(updateSneakerAdditionalImagesRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(
            updateSneakerImagesWithInput(), undefined,
            {
                id: sneakerInfo.id,
                imageURLs
            }
        )
        .then((res) => {
            if (res !== null && res !== undefined && res.updateProductAdditionalImages) {
                dispatch(updateSneakerAdditionalImagesSuccess())
                resolve({ updated: true, message: "Updated Sneaker Image Successfully" });
            } else {
                dispatch(updateSneakerAdditionalImagesFailure("Could Not Update Sneaker Image"));
                resolve({ updated: false, message: "Failed to update Sneaker Image" });
            }
        })
        .catch(err => {
            dispatch(updateSneakerAdditionalImagesFailure(err.response));
            resolve({ updated: false, message: "Failed to update Sneaker Image" });
        });
    })
}

// <------------ APPAREL ----------------->

const createApparelWithInputType = () => {

    return `
        mutation($product: ProductInput!, ) {
                createNewProduct(product: $product) {
                    name
                    id
                }
            }
        `
} 

const createNewApparel = (apparelInfo) => dispatch => {   
    dispatch(createNewApparelRequest());
    console.log(apparelInfo);
    const { productType, name, sku, brand, designer, hasSizing, size_brand } = apparelInfo;
    const apparelSlug = slugify(name + " " + sku, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })

    const product = immutable.wrap(apparelInfo).set("slug", apparelSlug).set('productType', productType.value).set('brand', brand.value).set('designer', designer.value).set('productCategory', 'apparel').set('hasSizing', hasSizing === "yes" ? true : false).set('size_brand', size_brand.value).value();
    return new Promise((resolve, reject) => {
        fetchGraphQL(
            createApparelWithInputType(), undefined, {
                product
            }
        )
        .then(res => {
            if (res !== null && res !== undefined && res.createNewProduct !== null && res.createNewProduct !== undefined) {
                dispatch(createNewApparelSuccess());
                resolve({ created: true, message: "Created Apparel Successfully" });
            } else {
                dispatch(createNewApparelError());
                resolve({ created: false, message: "Failed to Create Apparel" });
            }
            
          })
        .catch(err => {
            dispatch(createNewApparelError(err.response));
            resolve({ created: false, message: "Failed to Create Apparel" });
        });
    })    
}

const updateApparelWithInputType = () => {

    return `
        mutation($product: ProductInput!, $id: ID!) {
                updateExistingProduct(product: $product, id: $id) 
            }
        `
} 

const updateExistingApparel = (apparelInfo) => dispatch => {
    dispatch(updateExistingApparelRequest());
    const { productType, name, id, sku, brand, designer, hasSizing, size_brand } = apparelInfo;
    const apparelSlug = slugify(name + " " + sku, {
        replacement: '-',  
        lower: true,      // convert to lower case, defaults to `false`
      })
    const product = immutable.wrap(apparelInfo).set('slug', apparelSlug).set('productType', productType.value).set('brand', brand.value).set('designer', designer.value).set('hasSizing', hasSizing === "yes" ? true : false).set('size_brand', size_brand.value).del('id').value();

    return new Promise((resolve, reject) => {
        fetchGraphQL(
            updateApparelWithInputType(), undefined, {
                product,
                id
            }
        )
        .then((res) => {
            if (res !== null & res !== undefined && res.updateExistingProduct) {
                dispatch(updateExistingApparelSuccess());
                resolve({ updated: true, message: "Updated Apparel Successfully" });
            } else {
                dispatch(updateExistingApparelError("Could Not Update Apparel"));
                resolve({ updated: false, message: "Failed to update Apparel" });
            }  
          })
          .catch(err => {
            dispatch(updateExistingApparelError(err.response));
            resolve({ updated: false, message: "Failed to update Apparel" })
          });
    })
}

const removeExistingApparel = (apparelInfo) => dispatch => {
    dispatch(removeExistingApparelRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                removeExistingProduct(id: "${apparelInfo.id}")
            }
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.removeExistingProduct) {
                dispatch(removeExistingApparelSuccess());
                resolve({ deleted: true, message: 'Deleted Apparel Successfully' });
            } else {
                dispatch(removeExistingApparelError("Could Not Remove Apparel"));
                resolve({ deleted: false, message: 'Failed to delete Apparel' });
            }
        })
        .catch(err => {
            dispatch(removeExistingApparelError(err.response));
            resolve({ deleted: false, message: 'Failed to delete Apparel' });
          });
    })
}

const updateApparelImage = (imageURL, apparelInfo) => dispatch => {
    dispatch(updateApparelImageRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
            mutation {
                updateProductImage(id: "${apparelInfo.id}", imageURL: "${imageURL}")
            }    
        `)
        .then((res) => {
            if (res !== null && res !== undefined && res.updateProductImage) {
                dispatch(updateApparelImageSuccess())
                resolve({ updated: true, message: "Updated Apparel Image Successfully" });
            } else {
                dispatch(updateApparelImageFailure("Could Not Update Apparel Image"));
                resolve({ updated: false, message: "Failed to update Apparel Image" });
            }
        })
        .catch(err => {
            dispatch(updateApparelImageFailure(err.response));
            resolve({ updated: false, message: "Failed to update Apparel Image" });
        });
    })
}

const updateApparelImagesWithInput = () => {
    return `
    mutation($id: ID!, $imageURLs: [String!]!) {
        updateProductAdditionalImages(id: $id, imageURLs: $imageURLs)
    }
    `
}

const updateApparelAdditionalImages = (imageURLs, apparelInfo) => dispatch => {
    console.log(imageURLs);
    dispatch(updateApparelAdditionalImagesRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(
            updateApparelImagesWithInput(), undefined,
            {
                id: apparelInfo.id,
                imageURLs
            }
        )
        .then((res) => {
            if (res !== null && res !== undefined && res.updateProductAdditionalImages) {
                dispatch(updateApparelAdditionalImagesSuccess())
                resolve({ updated: true, message: "Updated Apparel Image Successfully" });
            } else {
                dispatch(updateApparelAdditionalImagesFailure("Could Not Update Apparel Image"));
                resolve({ updated: false, message: "Failed to update Apparel Image" });
            }
        })
        .catch(err => {
            dispatch(updateApparelAdditionalImagesFailure(err.response));
            resolve({ updated: false, message: "Failed to update Apparel Image" });
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

// <---------------- Sizing ------------------>
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

// <---------------- Orders ------------------>
const getPurchasedOrders = () => dispatch => {
    dispatch(getPurchasedOrdersRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
        query {
            getPurchasedOrders {
                
            }
        }`)
        .then((res) => {
            if (res !== null && res !== undefined && res.getPurchasedOrders !== null && res.getPurchasedOrders !== undefined) {
                dispatch(getPurchasedOrdersSuccess(res.getPurchasedOrders));
                resolve({ success: true, message: "Fetched Orders successfully"});
            } else {
                dispatch(getPurchasedOrdersError("Could not fetch Orders"));
                resolve({ success: false, message: "Failed to fetch Orders"});
            }
          })
        .catch(err => {
            dispatch(getPurchasedOrdersError(err.response));
            resolve({ success: false, message: "Failed to fetch Orders"});
        });
    })
}

// Image Upload

const uploadImage = (file, typeOfUpload) => dispatch => {
    const formData = new FormData()
    formData.append("attachment", file);
    formData.append("typeOfUpload", typeOfUpload);
    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    }

    return new Promise((resolve, reject) => {
        axios.post('http://localhost:4000/uploadMedia', formData, config)
        .then((res) => {
            const { status, url } = res.data;
            if (status === "success") {
                resolve({ success: true, imageURL: url, message: "Image upload successful" });
            } else {
                resolve({ success: false, imageURL: "", message: "Image upload unsuccessful" })
            }
        }).catch(err => {
            resolve({ success: false, imageURL: "", message: "Image upload unsuccessful" })
        })
    })
}

const uploadImages = (files, typeOfUpload) => dispatch => {

    const config = {
        headers: {
            "content-type": "multipart/form-data"
        }
    }

    const callList = [];
    files.forEach(file => {
        const formData = new FormData()
        formData.append("attachment", file);
        formData.append("typeOfUpload", typeOfUpload);
        callList.push(axios.post('http://localhost:4000/uploadMedia', formData, config));
    })
    return new Promise((resolve, reject) => {
        Promise.all(callList)
        .then((values) => {
            const imageURLs = [];
            if (values !== undefined && values !== null) {
                values.forEach(res => {
                    const { status, url } = res.data;
                    if (status === "success") {
                        imageURLs.push(url);
                    }
                })
                console.log(imageURLs);
                resolve({ success: true, imageURLs, message: "Image upload successful" });
            } else {
                resolve({ success: false, imageURLs: [], message: "Image upload unsuccessful" })
            }
        }).catch(err => {
            resolve({ success: false, imageURLs: [], message: "Image upload unsuccessful" })
        })
    })
}

// <----------------- Sneakers -------------->

const getAllSneakers = () => dispatch => {
    dispatch(getAllSneakersRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
        query {
            getProducts(productCategory: "sneakers") {
                id
                productCategory
                name
                nickName
                description
                sku
                slug
                brand {
                    id
                    name
                }
                designer {
                    id
                    name
                }
                original_image_url
                gender
                additional_pictures
                hasSizing
                colorway
                releaseDate
                size_brand
            }
        }`)
        .then((res) => {
            if (res !== null && res !== undefined && res.getProducts !== null && res.getProducts !== undefined) {
                const products = res.getProducts;
    
                const sneakers = products.map(product => {
                    console.log(product)
                    const { brand, designer, size_brand = ""} = product;
                    return immutable.wrap(product).set('brand', { value: brand.id, label: brand.name }).set('designer', { value: designer.id, label: designer.name }).set('size_brand', { value: size_brand, label: size_brand }).value();
                })
                dispatch(getAllSneakersSuccess(sneakers));
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

// <----------------- Apparel -------------->

const getAllApparel = () => dispatch => {
    dispatch(getAllApparelRequest());
    return new Promise((resolve, reject) => {
        fetchGraphQL(`
        query {
            getProducts(productCategory: "apparel") {
                id
                productCategory
                productType
                name
                nickName
                description
                sku
                slug
                brand {
                    id
                    name
                }
                designer {
                    id
                    name
                }
                original_image_url
                gender
                additional_pictures
                hasSizing
                size_brand
                colorway
                releaseDate
            }
        }`)
        .then((res) => {
            if (res !== null && res !== undefined && res.getProducts !== null && res.getProducts !== undefined) {
                const productTypes = {
                    hoodies: 'Hoodies' ,
                    sweatshirts: 'Sweatshirts' ,
                    shorts: 'Shorts',
                    pants: 'Pants',
                    tshirts: 'T-shirts',
                    sweatpants: 'Sweatpants' ,
                }
                const products = res.getProducts;
                const apparel = products.map(product => {
                    console.log(product);
                    const { productType, brand, designer, hasSizing, size_brand = "" } = product;
                    return immutable.wrap(product).set('brand', { value: brand.id, label: brand.name }).set('designer', { value: designer.id, label: designer.name }).set('productType', { value: productType, label: productTypes[productType]}).set('hasSizing', hasSizing ? "yes": "no" ).set('size_brand', { value: size_brand, label: size_brand }).value();
                })
                dispatch(getAllApparelSuccess(apparel));
                resolve({ success: true, message: "Fetched Apparel successfully"});
            } else {
                dispatch(getAllApparelError("Could not fetch Apparel"));
                resolve({ success: false, message: "Failed to fetch apparel"});
            }
          })
        .catch(err => {
            dispatch(getAllApparelError(err.response));
            resolve({ success: false, message: "Failed to fetch apparel"});
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

const updateSneakerAdditionalImagesRequest = () => {
    return {
        type: actionTypes.UPDATE_SNEAKER_ADDITIONAL_IMAGES_REQUEST
    }
}

const updateSneakerAdditionalImagesSuccess = () => {
    return {
        type: actionTypes.UPDATE_SNEAKER_ADDITIONAL_IMAGES_SUCCESS,
    }
}

const updateSneakerAdditionalImagesFailure = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_SNEAKER_ADDITIONAL_IMAGES_ERROR,
        payload: { errorMessage }
    }
}

// <---------------------- APPAREL ---------------->
const createNewApparelRequest = () => {
    return {
        type: actionTypes.CREATE_NEW_APPAREL_REQUEST
    }
}

const createNewApparelSuccess = () => {
    return {
        type: actionTypes.CREATE_NEW_APPAREL_SUCCESS,
    }
}

const createNewApparelError = (errorMessage) => {
    return {
        type: actionTypes.CREATE_NEW_APPAREL_ERROR,
        payload: { errorMessage }
    }
}

const updateExistingApparelRequest = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_APPAREL_REQUEST
    }
}

const updateExistingApparelSuccess = () => {
    return {
        type: actionTypes.UPDATE_EXISTING_APPAREL_SUCCESS,
    }
}

const updateExistingApparelError = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_EXISTING_APPAREL_ERROR,
        payload: { errorMessage }
    }
}

const removeExistingApparelRequest = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_APPAREL_REQUEST
    }
}

const removeExistingApparelSuccess = () => {
    return {
        type: actionTypes.REMOVE_EXISTING_APPAREL_SUCCESS,
    }
}

const removeExistingApparelError = (errorMessage) => {
    return {
        type: actionTypes.REMOVE_EXISTING_APPAREL_ERROR,
        payload: { errorMessage }
    }
}

const updateApparelImageRequest = () => {
    return {
        type: actionTypes.UPDATE_APPAREL_IMAGE_REQUEST
    }
}

const updateApparelImageSuccess = () => {
    return {
        type: actionTypes.UPDATE_APPAREL_IMAGE_SUCCESS,
    }
}

const updateApparelImageFailure = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_APPAREL_IMAGE_ERROR,
        payload: { errorMessage }
    }
}

const updateApparelAdditionalImagesRequest = () => {
    return {
        type: actionTypes.UPDATE_APPAREL_ADDITIONAL_IMAGES_REQUEST
    }
}

const updateApparelAdditionalImagesSuccess = () => {
    return {
        type: actionTypes.UPDATE_APPAREL_ADDITIONAL_IMAGES_SUCCESS,
    }
}

const updateApparelAdditionalImagesFailure = (errorMessage) => {
    return {
        type: actionTypes.UPDATE_APPAREL_ADDITIONAL_IMAGES_ERROR,
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

// apparel
const getAllApparelRequest = () => {
    return {
        type: actionTypes.GET_APPAREL_REQUEST
    }
}

const getAllApparelSuccess = (data) => {
    return {
        type: actionTypes.GET_APPAREL_SUCCESS,
        payload: { data }
    }
}

const getAllApparelError = (errorMessage) => {
    console.log(errorMessage)
    return {
        type: actionTypes.GET_APPAREL_ERROR,
        payload: { errorMessage }
    }
}

// orders
const getPurchasedOrdersRequest = () => {
    return {
        type: actionTypes.GET_PURCHASED_ORDERS_REQUEST
    }
}

const getPurchasedOrdersSuccess = (data) => {
    return {
        type: actionTypes.GET_PURCHASED_ORDERS_SUCCESS,
        payload: { data }
    }
}

const getPurchasedOrdersError = (errorMessage) => {
    console.log(errorMessage)
    return {
        type: actionTypes.GET_PURCHASED_ORDERS_ERROR,
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

        // Sneakers
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

        // Apparel
        case actionTypes.CREATE_NEW_APPAREL_REQUEST:
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: true })
              })
        case actionTypes.CREATE_NEW_APPAREL_SUCCESS:
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: false })
              })
        case actionTypes.CREATE_NEW_APPAREL_ERROR: 
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        
        case actionTypes.UPDATE_EXISTING_APPAREL_REQUEST:
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: true })
              })
        case actionTypes.UPDATE_EXISTING_APPAREL_SUCCESS:
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: false })
              })
        case actionTypes.UPDATE_EXISTING_APPAREL_ERROR: 
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: false, errorMessage: action.payload.errorMessage })
            })
        case actionTypes.REMOVE_EXISTING_APPAREL_REQUEST:
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: true })
              })
        case actionTypes.REMOVE_EXISTING_APPAREL_SUCCESS:
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: false })
              })
        case actionTypes.REMOVE_EXISTING_APPAREL_ERROR: 
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isMutating: false, errorMessage: action.payload.errorMessage })
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
             // Apparel
        case actionTypes.GET_APPAREL_REQUEST: {
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { isFetching: true })
              })
        }
        case actionTypes.GET_APPAREL_SUCCESS: {
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { data: action.payload.data || [], isFetching: false })
              })
        }
        case actionTypes.GET_APPAREL_ERROR: {
            return Object.assign({}, state, {
                apparel: Object.assign({}, state.apparel, { data: [], isFetching: false, errorMessage: action.payload.errorMessage })
              })
        }
             // Orders
             case actionTypes.GET_PURCHASED_ORDERS_REQUEST: {
                return Object.assign({}, state, {
                    orders: Object.assign({}, state.orders, { isFetching: true })
                  })
            }
            case actionTypes.GET_PURCHASED_ORDERS_SUCCESS: {
                return Object.assign({}, state, {
                    orders: Object.assign({}, state.orders, { data: action.payload.data || [], isFetching: false })
                  })
            }
            case actionTypes.GET_PURCHASED_ORDERS_ERROR: {
                return Object.assign({}, state, {
                    orders: Object.assign({}, state.orders, { data: [], isFetching: false, errorMessage: action.payload.errorMessage })
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
            updateSneakerAdditionalImages,
            // ----> Query
            getAllSneakers,
        // Apparel
            // -----> Mutation
            createNewApparel,
            updateExistingApparel,
            removeExistingApparel,
            updateApparelImage,
            updateApparelAdditionalImages,
            // -----> Query
            getAllApparel,
        // Orders
            // ----> Mutation

            // -----> Query
            getPurchasedOrders,
        // Other
            uploadImage,
            uploadImages
    }
}
