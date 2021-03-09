import {xmlify} from "./transliterationTextLineParseResult";
import {CorrectionType} from "./corrections";
import {DamageType} from "./damages";
import {InscribedLetter} from "./inscribedLetter";

export enum MultiStringContentType {
  Akkadogramm = 'Akkadogramm',
  Sumerogramm = 'Sumerogramm'
}

export type ContentOfMultiStringContent = string | CorrectionType | DamageType | InscribedLetter;

export class MultiStringContent {
  constructor(
    public type: MultiStringContentType,
    public contents: ContentOfMultiStringContent[]
  ) {
  }
}


// Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht

export function akkadogramm(...contents: ContentOfMultiStringContent[]): MultiStringContent {
  return {type: MultiStringContentType.Akkadogramm, contents};
}

// Sumerogramm:
// - automatisch für Versalien
// - im Wortinnern durch vorausgehendes `--` markiert

export function sumerogramm(...contents: ContentOfMultiStringContent[]): MultiStringContent {
  return {type: MultiStringContentType.Sumerogramm, contents};
}


// Helpers

export function getCssClassForMultiStringContentType(multiStringContentType: MultiStringContentType) {
  switch (multiStringContentType) {
    case MultiStringContentType.Akkadogramm:
      return 'akadogramm';
    case MultiStringContentType.Sumerogramm:
      return 'sumerogramm';
  }
}

export function xmlifyMultiStringContent({type, contents}: MultiStringContent): string {
  switch (type) {
    case MultiStringContentType.Akkadogramm:
      return `<aGr>${contents.map(xmlify)}</aGr>`;
    case MultiStringContentType.Sumerogramm:
      return `<sGr>${contents.map(xmlify)}</sGr>`;
  }
}