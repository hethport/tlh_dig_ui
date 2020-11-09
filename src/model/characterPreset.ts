import {Akkadian, Hattic, Hittite, Hurrian, Languages, Luwian, Palaian, Sumerian} from "./languages";
import {HasSimtexHotkey, HasSimtexStyleName, JsonFormat} from "./basics";

interface ILanguageCharacterPreset {
    type: 'LanguageCharacterPreset';
    language: Languages;
}

export class LanguageCharacterPreset implements HasSimtexStyleName, HasSimtexHotkey {
    constructor(public readonly language: Languages) {
    }

    styleName(): string {
        return `AO:${this.language}`;
    }

    simtexHotkey(): string {
        return `@${this.language.substr(0, 1)}`;
    }
}

export const hittiteCharacterPreset = new LanguageCharacterPreset(Hittite);
export const akkadianCharacterPreset = new LanguageCharacterPreset(Akkadian);
export const sumerianCharacterPreset = new LanguageCharacterPreset(Sumerian);
export const luwianCharacterPreset = new LanguageCharacterPreset(Luwian);
export const palaianCharacterPreset = new LanguageCharacterPreset(Palaian);
export const hatticCharacterPreset = new LanguageCharacterPreset(Hattic);
export const hurrianCharacterPreset = new LanguageCharacterPreset(Hurrian);

export const languageCharacterPresetFormat: JsonFormat<ILanguageCharacterPreset, LanguageCharacterPreset> = {
    fromJson(t: ILanguageCharacterPreset): LanguageCharacterPreset {
        return new LanguageCharacterPreset(t.language);
    },
    toJson(u: LanguageCharacterPreset): ILanguageCharacterPreset {
        return {type: 'LanguageCharacterPreset', language: u.language};
    }
}

// Other character presets

export interface NumeralCharacterPreset {
    type: 'NumeralCharacterPreset';
    styleName: 'AO:Numeral';
    content: string;
}

export function NumeralCharacterPreset(content: string): NumeralCharacterPreset {
    return {type: 'NumeralCharacterPreset', styleName: 'AO:Numeral', content};
}

// complete definition
