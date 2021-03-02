import {StringContentInput, StringContentTypeEnum} from "../generated/graphql";

/**
 * Hittite
 */
export function hittite(content: string): StringContentInput {
  return {type: StringContentTypeEnum.Hittite, content};
}

/**
 * Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
 */
export function akkadogramm(content: string): StringContentInput {
  return {type: StringContentTypeEnum.Akadogramm, content};
}

/**
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
 */
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
