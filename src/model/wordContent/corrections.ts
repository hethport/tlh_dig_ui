import {failableAttributeReader, XmlFormat} from "../../editor/xmlLib";
import {failure, mapResult, success} from '../../functional/result';
import {AOWordContent} from "./wordContent";

export type AOCorrType = '(?)' | 'sic' | '!' | '?' | '!?';

export interface AOCorr {
  type: 'AOCorr',
  c: AOCorrType;
}

function isAoCorrType(v: string | null): v is AOCorrType {
  return !!v && (v === '(?)' || v === 'sic' || v === '!' || v === '?' || v === '!?');
}

export const aoCorrFormat: XmlFormat<AOCorr> = {
  read: (el) => mapResult(
    failableAttributeReader(el, 'c', (v) => isAoCorrType(v) ? success(v) : failure([`Value '${v}' is not allowed!`])),
    (corrType) => aoCorr(corrType)
  ),
  write: ({c}) => [`<corr c="${c}"/>`]
}

export function aoCorr(c: AOCorrType): AOCorr {
  return {type: 'AOCorr', c};
}

export function isCorrectionContent(w: AOWordContent): w is AOCorr {
  return typeof w !== 'string' && 'type' in w && w.type === 'AOCorr';
}