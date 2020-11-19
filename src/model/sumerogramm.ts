export const sumerogrammRegex = /[.\p{Lu}]+/u;

/**
 * - automatisch für Versalien
 * - im Wortinnern durch vorausgehendes `--` markiert
 */
export interface Sumerogramm {
    type: 'Sumerogramm',
    content: string
}

export function Sumerogramm(content: string): Sumerogramm {
    return {type: 'Sumerogramm', content};
}

