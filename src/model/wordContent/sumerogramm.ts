// Sumerogramm:
// - automatisch für Versalien
// - im Wortinnern durch vorausgehendes `--` markiert

import {AOWordContent} from "./wordContent";
import {XmlFormat} from "../../editor/xmlLib";
import {flattenResults} from "../../functional/result";
import {clearUpperMultiStringContent, readMultiWordContent, UpperMultiStringContent, writeMultiWordContent} from "./multiStringContent";

export interface AOSumerogramm {
  type: 'AOSumerogramm';
  contents: UpperMultiStringContent[];
}

export function sumerogramm(...contents: (UpperMultiStringContent | string)[]): AOSumerogramm {
  return {type: 'AOSumerogramm', contents: contents.map(clearUpperMultiStringContent)};
}

export const sumerogrammFormat: XmlFormat<AOSumerogramm> = {
  read: (el) => flattenResults(Array.from(el.childNodes).map(readMultiWordContent))
    .map((content) => sumerogramm(...content)),
  write: ({contents}) => [`<sGr>${contents.flatMap(writeMultiWordContent).join('')}</sGr>`]
}

export function isSumerogramm(c: AOWordContent): c is AOSumerogramm {
  return c.type === 'AOSumerogramm';
}