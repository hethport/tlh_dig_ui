export const serverUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8066/tlh_dig'
    : '/tlh_dig';

export const homeUrl = '/';

export const createManuscriptUrl = '/createManuscript';

export const registerUrl = '/registerForm';
export const loginUrl = '/login';

export const editXmlUrl = '/xmlEditor';


interface MyUrlParam<Params extends { [K in keyof Params]?: string } = {}> {
    name: keyof Params;
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