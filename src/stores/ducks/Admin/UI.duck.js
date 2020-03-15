import { createActionTypes } from "../../lib";

// Duck Name
const duckName = 'ADMIN_UI';

// Action Types
export const actionTypes = createActionTypes({
    CHANGE_ACTIVE_NAVBAR_ITEM: 'CHANGE_ACTIVE_NAVBAR_ITEM',
}, duckName);

// Initial State
const initialState = {
    activeNavbarItemId: 'brands',
}


// Action Creators
export const changeActiveNavbarItem = (activeNavbarItemId) => {
    return {
        type: actionTypes.CHANGE_ACTIVE_NAVBAR_ITEM,
        payload: {
            activeNavbarItemId
        }
    }
}

  
// Reducers
export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.CHANGE_ACTIVE_NAVBAR_ITEM: 
            return {
                ...state,
                activeNavbarItemId: action.payload.activeNavbarItemId
            }
       default:
           return state;
    }

}

export default {
    duckName,
    reducer,
    actionCreators: {
        changeActiveNavbarItem
    }
}
