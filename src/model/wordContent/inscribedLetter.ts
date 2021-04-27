import {AOWordContent} from "./wordContent";
import {XmlFormat} from "../../editor/xmlLoader";

export interface InscribedLetter {
  type: 'InscribedLetter';
  content: string;
}

export function inscribedLetter(content: string): InscribedLetter {
  return {type: 'InscribedLetter', content};
}

export const inscribedLetterFormat: XmlFormat<InscribedLetter> = {
  read: (el) => inscribedLetter('TODO!'),
  write: () => ['x']
};

export function isInscribedLetter(c: AOWordContent): c is InscribedLetter {
  return typeof c !== 'string' && 'type' in c && c.type === 'InscribedLetter';
}