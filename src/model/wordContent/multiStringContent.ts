import {XmlFormat} from "../../editor/xmlLoader";
import {DamageType} from "../damages";
import {AOWordContent, MultiStringContent} from "./wordContent";


function readMultiWordContent(el: ChildNode): MultiStringContent {
  if (el instanceof Text) {
    return el.textContent || '';
  } else if (el instanceof Element) {
    switch (el.tagName) {
      case 'del_in':
        return DamageType.DeletionStart;
      case 'del_fin':
        return DamageType.DeletionEnd;
      case 'ras_in':
        return DamageType.RasureStart;
      case 'ras_fin':
        return DamageType.RasureEnd;
      case 'laes_in':
        return DamageType.LesionStart;
      case 'laes_fin':
        return DamageType.LesionEnd;
      default:
        throw new Error(`Illegal tag name found: ${el.tagName}`);
    }
  } else {
    throw new Error(`Illegal tag found: ${el.nodeType}`);
  }
}


// Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht

export interface AOAkkadogramm {
  type: 'AOAkkadogramm';
  contents: MultiStringContent[];
}

export function akkadogramm(...contents: MultiStringContent[]): AOAkkadogramm {
  return {type: 'AOAkkadogramm', contents};
}

export const akkadogrammFormat: XmlFormat<AOAkkadogramm> = {
  read: (el) => akkadogramm(...Array.from(el.childNodes).map(readMultiWordContent)),
  write: ({contents}) => `<aGr>${contents}</aGr>`
}

export function isAkkadogramm(c: AOWordContent): c is AOAkkadogramm {
  return typeof c !== 'string' && 'type' in c && c.type === 'AOAkkadogramm';
}

// Sumerogramm:
// - automatisch für Versalien
// - im Wortinnern durch vorausgehendes `--` markiert

export interface AOSumerogramm {
  type: 'AOSumerogramm';
  contents: MultiStringContent[];
}

export function sumerogramm(...contents: MultiStringContent[]): AOSumerogramm {
  return {type: 'AOSumerogramm', contents};
}

export const sumerogrammFormat: XmlFormat<AOSumerogramm> = {
  read: (el) => sumerogramm(...Array.from(el.childNodes).map(readMultiWordContent)),
  write: ({contents}) => `<sGr>${contents}</sGr>`
}

export function isSumerogramm(c: AOWordContent): c is AOSumerogramm {
  return typeof c !== 'string' && 'type' in c && c.type === 'AOSumerogramm';
}