import {attributeReader, XmlFormat} from "../../editor/xmlLoader";
import {AOWordContent} from "./wordContent";

export type AOCorrType = '(?)' | 'sic' | '!' | '?' | '!?';

export interface AOCorr {
  type: 'AOCorr',
  c: AOCorrType;
}

export const aoCorrFormat: XmlFormat<AOCorr> = {
  read: (el) => aoCorr(attributeReader(el, 'c', (v) => {
    if (v && (v === '(?)' || v === 'sic' || v === '!' || v === '?' || v === '!?')) {
      return v;
    } else {
      throw new Error(`Value '${v}' is not allowed!`);
    }
  })),
  write: ({c}) => [`<corr c="${c}"/>`]
}

export function aoCorr(c: AOCorrType): AOCorr {
  return {type: 'AOCorr', c};
}

export function isCorrectionContent(w: AOWordContent): w is AOCorr {
  return typeof w !== 'string' && 'type' in w && w.type === 'AOCorr';
}