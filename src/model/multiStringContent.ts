import {ContentOfMultiStringContent, WordContent, xmlify} from "./oldTransliteration";

export interface MultiStringContent {
  type: 'Akkadogramm' | 'Sumerogramm';
  contents: ContentOfMultiStringContent[];
}

export function isMultiStringContent(w: WordContent): w is MultiStringContent {
  return typeof w !== 'string' && 'type' in w && (w.type === 'Akkadogramm' || w.type === 'Sumerogramm');
}

export function cssClassForMultiStringContent({type}: MultiStringContent): string {
  return type === 'Akkadogramm' ? 'akkadogramm' : 'sumerogramm';
}

export function xmlifyMultiStringContent({type, contents}: MultiStringContent): string {
  const tag = type === 'Akkadogramm' ? 'aGr' : 'sGr';

  return `<${tag}>${contents.map(xmlify).join('')}</${tag}>`
}


// Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht

export function akkadogramm(...contents: ContentOfMultiStringContent[]): MultiStringContent {
  return {type: 'Akkadogramm', contents};
}

// Sumerogramm:
// - automatisch für Versalien
// - im Wortinnern durch vorausgehendes `--` markiert

export function sumerogramm(...contents: ContentOfMultiStringContent[]): MultiStringContent {
  return {type: 'Sumerogramm', contents};
}
