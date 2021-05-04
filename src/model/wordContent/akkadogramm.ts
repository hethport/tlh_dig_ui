// Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht

import {AOWordContent, MultiStringContent} from "./wordContent";
import {XmlFormat} from "../../editor/xmlLib";
import {flattenResults} from "../../functional/result";
import {readMultiWordContent} from "./multiStringContent";

export interface AOAkkadogramm {
  type: 'AOAkkadogramm';
  contents: MultiStringContent[];
}

export function akkadogramm(...contents: MultiStringContent[]): AOAkkadogramm {
  return {type: 'AOAkkadogramm', contents};
}

export const akkadogrammFormat: XmlFormat<AOAkkadogramm> = {
  read: (el) => flattenResults(Array.from(el.childNodes).map(readMultiWordContent))
    .map((content) => akkadogramm(...content)),
  write: ({contents}) => [`<aGr>${contents}</aGr>`]
}

export function isAkkadogramm(c: AOWordContent): c is AOAkkadogramm {
  return c.type === 'AOAkkadogramm';
}
