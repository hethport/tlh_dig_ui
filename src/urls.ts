export const serverUrl = 'http://localhost:8066/tlh_dig'

export const homeUrl = '/';

export const createManuscriptUrl = '/createManuscript';

export const registerUrl = '/registerForm';
export const loginUrl = '/login';


interface MyUrl<T> {
    pattern: string;
    url: (params: T) => string;
}


export interface ManuscriptUrlParams {
    mainIdentifier: string;
}

export const myManuscriptUrl: MyUrl<ManuscriptUrlParams> = {
    pattern: '/manuscript/:mainIdentifier',
    url: ({mainIdentifier}) => `/manuscript/${mainIdentifier}`
}
