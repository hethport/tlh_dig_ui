import {attributeReader, XmlFormat} from "../../editor/xmlLoader";
import {AOWordContent} from "./wordContent";

export interface AONote {
  type: 'AONote';
  content: string;
  number: string;
}

export const aoNoteFormat: XmlFormat<AONote> = {
  read: (el) => aoNote(
    attributeReader(el, 'c', (v) => v || ''),
    attributeReader(el, 'n', (v) => v || '')
  ),
  write: ({content, number}) => [`<note c="${content}" n="${number}"/>`]
}

export function aoNote(content: string, number: string): AONote {
  return {type: 'AONote', content, number};
}

export function isAoNote(w: AOWordContent): w is AONote {
  return typeof w !== 'string' && 'type' in w && w.type === 'AONote';
}