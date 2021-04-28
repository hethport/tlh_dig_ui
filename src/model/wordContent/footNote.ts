import {attributeReader, XmlFormat} from "../../editor/xmlLoader";
import {AOWordContent} from "./wordContent";

export interface AOFootNote {
  type: 'AONote';
  content: string;
  number: number;
}

export const aoNoteFormat: XmlFormat<AOFootNote> = {
  read: (el) => aoNote(
    attributeReader(el, 'c', (v) => v || ''),
    attributeReader(el, 'n', (v) => v ? parseInt(v) : -1)
  ),
  write: ({content, number}) => [`<note c="${content}" n="${number}"/>`]
}

export function aoNote(content: string, number: number = -1): AOFootNote {
  return {type: 'AONote', content, number};
}

export function isAoFootNote(w: AOWordContent): w is AOFootNote {
  return typeof w !== 'string' && 'type' in w && w.type === 'AONote';
}