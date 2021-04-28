import {AOSentence, aoSentenceFormat} from "./sentence";
import {childElementReader, XmlFormat} from "../editor/xmlLoader";
import {AOTextContent} from "../editor/documentBody";

export interface Paragraph {
  // FIXME: split by lb?
  type: 'AOParagraph';
  s: AOSentence;
}

export const paragraphFormat: XmlFormat<Paragraph> = {
  read: (el) => aoParagraph(childElementReader(el, 's', aoSentenceFormat)),
  write: ({s}) => []
}

function aoParagraph(s: AOSentence): Paragraph {
  return {type: 'AOParagraph', s};
}

export function isAOParagraph(c: AOTextContent): c is Paragraph {
  return c.type === 'AOParagraph';
}