import {Akkadian, Hattic, Hittite, Hurrian, Languages, Luwian, Palaian, Sumerian} from "./languages";
import {HasSimtexHotkey, HasSimtexStyleName, JsonFormat} from "./basics";


export const TextualSourceParagraphPreset = {type: 'TextualSourceParagraphPreset', styleName: 'AO:Manuscripts'};
export type TextualSourceParagraphPreset = typeof TextualSourceParagraphPreset;


interface ILanguageParagraphPreset {
    type: 'LanguageParagraphPreset';
    language: Languages;
}

export class LanguageParagraphPreset implements HasSimtexHotkey, HasSimtexStyleName {
    constructor(public readonly language: Languages) {
    }

    simtexHotkey(): string {
        return `@${this.language.substr(0, 3)}`;
    }

    styleName(): string {
        return `AO:Textline-${this.language.substr(0, 3)}`;
    }
}

export const languageParagraphPresetFormat: JsonFormat<ILanguageParagraphPreset, LanguageParagraphPreset> = {
    fromJson(t: ILanguageParagraphPreset): LanguageParagraphPreset {
        return new LanguageParagraphPreset(t.language);
    },
    toJson(u: LanguageParagraphPreset): ILanguageParagraphPreset {
        return {type: 'LanguageParagraphPreset', language: u.language};
    }
}


export const hittiteParagraphPreset: LanguageParagraphPreset = new LanguageParagraphPreset(Hittite);
export const akkadianParagraphPreset: LanguageParagraphPreset = new LanguageParagraphPreset(Akkadian);
export const sumerianParagraphPreset: LanguageParagraphPreset = new LanguageParagraphPreset(Sumerian);
export const luwianParagraphPreset: LanguageParagraphPreset = new LanguageParagraphPreset(Luwian);
export const palaianParagraphPreset: LanguageParagraphPreset = new LanguageParagraphPreset(Palaian);
export const hatticParagraphPreset: LanguageParagraphPreset = new LanguageParagraphPreset(Hattic);
export const hurrianParagraphPreset: LanguageParagraphPreset = new LanguageParagraphPreset(Hurrian);


export type ParagraphPreset = TextualSourceParagraphPreset | LanguageParagraphPreset;