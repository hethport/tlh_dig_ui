import {createStore} from 'redux';
import {StoreAction, USER_LOGGED_IN, USER_LOGGED_OUT} from './actions';
import {LoggedInUserFragment} from "../generated/graphql";


interface StoreState {
    currentUser?: LoggedInUserFragment;
}


function rootReducer(store: StoreState = {}, action: StoreAction): StoreState {
    switch (action.type) {
        case USER_LOGGED_IN:
            return {...store, currentUser: action.user};
        case USER_LOGGED_OUT:
            return {...store, currentUser: undefined};
        default:
            return store;
    }
}


export function activeUserSelector(store: StoreState): LoggedInUserFragment | undefined {
    return store.currentUser;
}


export const store = createStore(rootReducer);
