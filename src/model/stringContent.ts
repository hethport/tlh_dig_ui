import {StringContentInput, StringContentTypeEnum} from "../generated/graphql";
import {TransliterationWordContent} from "./transliterationTextLine";

/**
 * Hittite
 */
export function hittite(content: string): StringContentInput {
    return {type: StringContentTypeEnum.Hittite, content};
}

/**
 * Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
 */
export const akadogrammRegex = /[_-]([\p{Lu}-])+/u;

export function akkadogramm(content: string): StringContentInput {
    return {type: StringContentTypeEnum.Akadogramm, content};
}

/**
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
 */
export const determinativRegex = /°([\p{Lu}.]+)°/u;

export function determinativ(content: string): StringContentInput {
    return {type: StringContentTypeEnum.Determinativ, content};
}

/**
 * Mater lectionis:
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export function materLectionis(content: string): StringContentInput {
    return {type: StringContentTypeEnum.MaterLectionis, content};
}

/**
 * Sumerogramm:
 * - automatisch für Versalien
 * - im Wortinnern durch vorausgehendes `--` markiert
 */
export const sumerogrammRegex = /[.\p{Lu}]+/u;

export function sumerogramm(content: string): StringContentInput {
    return {type: StringContentTypeEnum.Sumerogramm, content};
}

// CSS class

export function classForStringContentType(stringContentType: StringContentTypeEnum): string {
    switch (stringContentType) {
        case StringContentTypeEnum.Hittite:
            return 'hittite';
        case StringContentTypeEnum.Akadogramm:
            return 'akadogramm';
        case StringContentTypeEnum.Determinativ:
            return 'determinativ';
        case StringContentTypeEnum.MaterLectionis:
            return 'materLectionis';
        case StringContentTypeEnum.Sumerogramm:
            return 'sumerogramm';
    }
}

// String content

export function isStringContentInput(twc: TransliterationWordContent): twc is StringContentInput {
    return typeof (twc) !== 'string' && 'type' in twc && (
        twc.type === StringContentTypeEnum.Hittite ||
        twc.type === StringContentTypeEnum.Determinativ ||
        twc.type === StringContentTypeEnum.MaterLectionis ||
        twc.type === StringContentTypeEnum.Akadogramm ||
        twc.type === StringContentTypeEnum.Sumerogramm);
}

export function xmlifyStringContentInput(sci: StringContentInput): string {
    switch (sci.type) {
        case StringContentTypeEnum.Hittite:
            return sci.content;
        case StringContentTypeEnum.Akadogramm:
            return `<aGr>${sci.content}</aGr>`;
        case StringContentTypeEnum.Sumerogramm:
            return `<sGr>${sci.content}</sGr>`;
        case StringContentTypeEnum.MaterLectionis:
            return `<ml>${sci.content}</ml>`;
        case StringContentTypeEnum.Determinativ:
            return `<dt>${sci.content}</dt>`;
    }
}
