import {BehaviorSubject} from 'rxjs';
import {LoggedInUserFragment} from "../generated/graphql";

const localStorageKey = 'currentUser';

const currentUserSubject = new BehaviorSubject<LoggedInUserFragment | null>(
    JSON.parse(localStorage.getItem(localStorageKey) || 'null')
);

function activateLogin(user: LoggedInUserFragment) {
    localStorage.setItem(localStorageKey, JSON.stringify(user));
    currentUserSubject.next(user);
}

function logout() {
    localStorage.removeItem(localStorageKey);
    currentUserSubject.next(null);
}

export const authenticationService = {
    activateLogin,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.getValue()
    }
}
