import {XmlFormat} from "../../editor/xmlLoader";
import {AOWordContent} from "./wordContent";

export interface AOKolonMark {
  type: 'AOKolonMark';
  content: string;
}

export const aoKolonMarkFormat: XmlFormat<AOKolonMark> = {
  read: (el) => aoKolonMark(el.textContent || ''),
  write: ({content}) => `<AO:KolonMark>${content}</AO:KolonMark>`
}

export function aoKolonMark(content: string): AOKolonMark {
  return {type: 'AOKolonMark', content};
}

export function isAoKolonMark(w: AOWordContent): w is AOKolonMark {
  return typeof w !== 'string' && 'type' in w && w.type === 'AOKolonMark';
}