import {StringContentTypeEnum} from "../generated/graphql";


// Akadogramm

/**
 * automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
 */
export const akadogrammRegex = /[_-]([\p{Lu}-])+/u;


export interface Akkadogramm {
    type: StringContentTypeEnum.Akadogramm,
    content: string,
}

export function Akkadogramm(content: string): Akkadogramm {
    return {type: StringContentTypeEnum.Akadogramm, content};
}

// Determinativ

/**
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
 */
export const determinativRegex = /°([\p{Lu}.]+)°/u;

export interface Determinativ {
    type: StringContentTypeEnum.Determinativ,
    content: string
}

export function Determinativ(content: string): Determinativ {
    return {type: StringContentTypeEnum.Determinativ, content};
}

// Mater lectionis

/**
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export interface MaterLectionis {
    type: StringContentTypeEnum.MaterLectionis;
    content: string;
}

export function MaterLectionis(content: string): MaterLectionis {
    return {type: StringContentTypeEnum.MaterLectionis, content};
}


// Sumerogramm

/**
 * - automatisch für Versalien
 * - im Wortinnern durch vorausgehendes `--` markiert
 */
export const sumerogrammRegex = /[.\p{Lu}]+/u;

export interface Sumerogramm {
    type: StringContentTypeEnum.Sumerogramm,
    content: string
}

export function Sumerogramm(content: string): Sumerogramm {
    return {type: StringContentTypeEnum.Sumerogramm, content};
}

// String content

export interface NewStringContent {
    type: StringContentTypeEnum,
    content: string,
}

export type StringContent = Akkadogramm | Determinativ | MaterLectionis | Sumerogramm;