export const akadogrammRegex = /[_-](\p{Lu})+/u;

/**
 * automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
 */
export interface Akkadogramm {
    type: 'Akkadogramm',
    content: string,
}

export function Akkadogramm(content: string): Akkadogramm {
    return {type: 'Akkadogramm', content};
}
