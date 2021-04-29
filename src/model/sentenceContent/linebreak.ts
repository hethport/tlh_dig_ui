import {attributeReader, success, XmlFormat} from "../../editor/xmlLib";
import {AOSentenceContent} from "../sentence";
import {AOWord, aoWordFormat} from "./word";

export interface AOLineBreak {
  type: 'AOLineBreak';
  textId: string;
  side: string;
  column: string;
  lineNumber: string;
  language: string;
  words: AOWord[]
}

export const aoLineBreakFormat: XmlFormat<AOLineBreak> = {
  read: (el) => success(
    aoLineBreak(
      attributeReader(el, 'txtid', (v) => v || ''),
      attributeReader(el, 'lnr', (v) => v || ''),
      attributeReader(el, 'lg', (v) => v || ''),
      []
    )
  ),
  write: ({textId, side, column, lineNumber, language, words}) =>
    [`<lb lg="${language}" lnr="${lineNumber}" txt="${textId}"/>`, ...words.flatMap((w) => aoWordFormat.write(w))]
}

export function aoLineBreak(textId: string, lnr: string, language: string, words: AOWord[]): AOLineBreak {
  // TODO: split lnr in side, paragraphNumber, lineNumber and lineNumberIsAbsolute
  const [lineNumber, column, side] = lnr.split(' ').reverse();

  return {type: 'AOLineBreak', side, column, language, lineNumber, textId, words};
}

export function isAOLineBreak(c: AOSentenceContent): c is AOLineBreak {
  return c.type === 'AOLineBreak';
}