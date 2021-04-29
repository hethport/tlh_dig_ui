import {AOSentence, aoSentenceFormat} from "./sentence";
import {childElementReader, XmlFormat} from "../editor/xmlLib";
import {mapResult} from '../functional/result';
import {AOTextContent} from "../editor/documentBody";

export interface Paragraph {
  // FIXME: split by lb?
  type: 'AOParagraph';
  s: AOSentence;
}

export const paragraphFormat: XmlFormat<Paragraph> = {
  read: (el) => mapResult(
    childElementReader(el, 's', aoSentenceFormat),
    (aoS) => aoParagraph(aoS)
  ),
  write: ({s}) => []
}

function aoParagraph(s: AOSentence): Paragraph {
  return {type: 'AOParagraph', s};
}

export function isAOParagraph(c: AOTextContent): c is Paragraph {
  return c.type === 'AOParagraph';
}