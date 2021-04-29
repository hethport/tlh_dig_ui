import {XmlFormat} from "../../editor/xmlLib";
import {failure, flattenResults, Result, success} from '../../functional/result';
import {damageContent, DamageType} from "./damages";
import {AOWordContent, MultiStringContent} from "./wordContent";

function readMultiWordContent(el: ChildNode): Result<MultiStringContent> {
  if (el instanceof Element) {
    switch (el.tagName) {
      case 'del_in':
        return success(damageContent(DamageType.DeletionStart));
      case 'del_fin':
        return success(damageContent(DamageType.DeletionEnd));
      case 'ras_in':
        return success(damageContent(DamageType.RasureStart));
      case 'ras_fin':
        return success(damageContent(DamageType.RasureEnd));
      case 'laes_in':
        return success(damageContent(DamageType.LesionStart));
      case 'laes_fin':
        return success(damageContent(DamageType.LesionEnd));
      default:
        return failure(`Illegal tag name found: ${el.tagName}`);
    }
  } else if (el instanceof Text) {
    return success(el.textContent || '');
  } else {
    return failure(`Illegal tag found: ${el.nodeType}`);
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
  read: (el) => flattenResults(Array.from(el.childNodes).map(readMultiWordContent)).map((content) => akkadogramm(...content)),
  write: ({contents}) => [`<aGr>${contents}</aGr>`]
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
  read: (el) => flattenResults(Array.from(el.childNodes).map(readMultiWordContent)).map((content) => sumerogramm(...content)),
  write: ({contents}) => [`<sGr>${contents}</sGr>`]
}

export function isSumerogramm(c: AOWordContent): c is AOSumerogramm {
  return typeof c !== 'string' && 'type' in c && c.type === 'AOSumerogramm';
}