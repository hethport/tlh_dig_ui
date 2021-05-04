// Sumerogramm:
// - automatisch für Versalien
// - im Wortinnern durch vorausgehendes `--` markiert

import {AOWordContent, MultiStringContent} from "./wordContent";
import {XmlFormat} from "../../editor/xmlLib";
import {flattenResults} from "../../functional/result";
import {readMultiWordContent, writeMultiWordContent} from "./multiStringContent";

export interface AOSumerogramm {
  type: 'AOSumerogramm';
  contents: MultiStringContent[];
}

export function sumerogramm(...contents: MultiStringContent[]): AOSumerogramm {
  return {type: 'AOSumerogramm', contents};
}

export const sumerogrammFormat: XmlFormat<AOSumerogramm> = {
  read: (el) => flattenResults(Array.from(el.childNodes).map(readMultiWordContent))
    .map((content) => sumerogramm(...content)),
  write: ({contents}) => [`<sGr>${contents.flatMap(writeMultiWordContent).join('')}</sGr>`]
}

export function isSumerogramm(c: AOWordContent): c is AOSumerogramm {
  return c.type === 'AOSumerogramm';
}