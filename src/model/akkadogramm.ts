import {HasSimtexStyleName, JsonFormat, JsonInterface} from "./basics";

export const akadogrammRegex = /[_-](\p{Lu})+/u;

interface IAkkadogramm extends JsonInterface {
    type: 'Akkadogramm';
    content: string;
}

/**
 * automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
 */
export class Akkadogramm implements HasSimtexStyleName {
    constructor(public content: string) {
    }

    styleName() {
        return 'AO:AKKGRAM'
    };
}

export const akkadogrammFormat: JsonFormat<IAkkadogramm, Akkadogramm> = {
    fromJson(t: IAkkadogramm): Akkadogramm {
        return new Akkadogramm(t.content);
    },
    toJson(u: Akkadogramm): IAkkadogramm {
        return {type: 'Akkadogramm', content: u.content};
    }
}