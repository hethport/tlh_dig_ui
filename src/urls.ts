export const homeUrl = '/';

export const createManuscriptUrl = '/createManuscript';

export const registerUrl = '/registerForm';
export const loginUrl = '/login';


export interface ManuscriptUrlParams {
    mainIdentifier: string;
}

export function manuscriptUrl(manuscriptId: string): string {
    return `/manuscript/${manuscriptId}`;
}


interface MyUrl<T> {
    pattern: string;
    url: (params: T) => string;
}

export const myManuscriptUrl: MyUrl<ManuscriptUrlParams> = {
    pattern: '/manuscript/:mainIdentifier',
    url: ({mainIdentifier}) => `/manuscript/${mainIdentifier}`
}
