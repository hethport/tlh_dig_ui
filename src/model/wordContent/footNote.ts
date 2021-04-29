import {attributeReader, failableAttributeReader, XmlFormat} from "../../editor/xmlLib";
import {failure, mapResult, myTry} from '../../functional/result';
import {AOWordContent} from "./wordContent";

export interface AOFootNote {
  type: 'AONote';
  content: string;
  number: number;
}

export const aoNoteFormat: XmlFormat<AOFootNote> = {
  read: (el) => mapResult(
    failableAttributeReader(el, 'n',
      (v) => v
        ? myTry(() => parseInt(v), (s) => [s])
        : failure(['No value given!'])),
    (num) => aoNote(attributeReader(el, 'c', (v) => v || ''), num)
  ),
  write: ({content, number}) => [`<note c="${content}" n="${number}"/>`]
}

export function aoNote(content: string, number: number = -1): AOFootNote {
  return {type: 'AONote', content, number};
}

export function isAoFootNote(w: AOWordContent): w is AOFootNote {
  return typeof w !== 'string' && 'type' in w && w.type === 'AONote';
}