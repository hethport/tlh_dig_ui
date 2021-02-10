export const serverUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8066/tlh_dig'
  : '/tlh_dig';

export function pictureBaseUrl(manuscriptMainIdentifier: string): string {
  return `${serverUrl}/uploads/${manuscriptMainIdentifier}`;
}

export const homeUrl = '/';

export const createManuscriptUrl = '/createManuscript';

export const registerUrl = '/registerForm';
export const loginUrl = '/login';
