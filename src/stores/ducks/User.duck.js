export default class UserDucks {
    static initialState = {
        name: ""
    };

    static duckName = "User";

    static reducer(state = {}, action) {
        switch (action.type) {
            default:
                return state;
        }
    }
}