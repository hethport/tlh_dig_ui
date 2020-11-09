import {HasSimtexStyleName, JsonFormat} from "./basics";

export const sumerogrammRegex = /[.\p{Lu}]+/u;

interface ISumerogramm {
    type: 'Sumerogramm';
    content: string;
}

/**
 * - automatisch für Versalien
 * - im Wortinnern durch vorausgehendes `--` markiert
 */
export class Sumerogramm implements HasSimtexStyleName {
    constructor(public readonly content: string) {
    }

    styleName() {
        return 'AO:SUMGRAM'
    };
}

export const sumerogrammWriter: JsonFormat<ISumerogramm, Sumerogramm> = {
    fromJson(t: ISumerogramm): Sumerogramm {
        return new Sumerogramm(t.content);
    },
    toJson(u: Sumerogramm): ISumerogramm {
        return {type: 'Sumerogramm', content: u.content};
    }
}
