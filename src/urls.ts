export const serverUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8066/tlh_dig'
    : '/tlh_dig';

export const homeUrl = '/';

export const createManuscriptUrl = '/createManuscript';

export const registerUrl = '/registerForm';
export const loginUrl = '/login';

export const editXmlUrl = '/xmlEditor';


interface MyUrlParam<T> {
    name: keyof T;
}

class MyNewUrl<T extends U, U = T> {
    constructor(
        private parts: (MyUrlParam<T> | string)[],
        private baseUrl?: MyNewUrl<U>
    ) {
    }

    buildAbsolutePattern(): string {
        return '/' + this.parts
            .map((part) => (typeof part === 'string') ? part : `:${part.name}`)
            .join('/')
    }

    buildAbsoluteUrl(params: T, withServerUrl: boolean = false): string {
        const parts = this.parts
            .map((part) => (typeof part === 'string') ? encodeURIComponent(part) : params[part.name])
            .join('/');

        const base = withServerUrl ? serverUrl : '';

        const x = base + (this.baseUrl ? this.baseUrl.buildAbsoluteUrl(params) : '') + '/' + parts;

        console.info(x);

        return x;
    }
}


export interface ManuscriptUrlParams {
    mainIdentifier: string;
}

export const manuscriptBaseUrl = new MyNewUrl<ManuscriptUrlParams>(['manuscripts', {name: 'mainIdentifier'}])

export const manuscriptDataUrl = new MyNewUrl<ManuscriptUrlParams>(['data'], manuscriptBaseUrl);

export const manuscriptTransliterationInputUrl = new MyNewUrl<ManuscriptUrlParams>(['transliterationInput'], manuscriptBaseUrl);


export interface ManuscriptPictureUrlParams extends ManuscriptUrlParams {
    pictureUrl: string;
}

export const manuscriptPictureUrl = new MyNewUrl<ManuscriptPictureUrlParams>(['uploads', {name: 'mainIdentifier'}, {name: 'pictureUrl'}]);