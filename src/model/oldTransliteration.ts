import {Maybe} from "../generated/graphql";
import {StringContent} from "./stringContent";
import {MarkContent} from "./markContent";
import {CorrectionContent} from "./corrections";
import {DamageContent} from "./damages";
import {MultiStringContent} from "./multiStringContent";
import {InscribedLetter} from "./inscribedLetter";
import {TransliterationTextLineParseResult} from "./transliterationTextLineParseResult";

// Word Content

export type IllegibleContent = {};

export type ContentOfMultiStringContent = string | CorrectionContent | DamageContent | InscribedLetter;

export type SimpleWordContent = StringContent
  | DamageContent
  | CorrectionContent
  | NumeralContent
  | MarkContent
  | IllegibleContent
  | string /* Hittite */;

export type WordContent = MultiStringContent | SimpleWordContent;

// Numeral content

export class NumeralContent {
  constructor(public isSubscript: boolean, public  content: string) {
  }
}

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContent {
  return new NumeralContent(isSubscript, content);
}

export function wordContentIsMultiStringContent(wordContent: WordContent): wordContent is MultiStringContent {
  return wordContent instanceof MultiStringContent;
}


function getContent(twc: WordContent): string {
  if (typeof twc === 'string') {
    return twc;
  } else if (twc instanceof MultiStringContent) {
    return twc.contents.map(getContent).join('');
  } else if (twc instanceof StringContent) {
    return twc.content;
  } else {
    // FIXME: implement?!
    return '';
  }
}

export function xmlify(content: WordContent): string {
  if (content instanceof MultiStringContent) {
    return content.xmlify();
  } else {
    if (typeof content === 'string') {
      return content;
    } else if (content instanceof StringContent) {
      return content.xmlify();
    } else if (content instanceof CorrectionContent) {
      // TODO!
      return `<todo!/>`; // content.xmlify();
    } else if (content instanceof DamageContent) {
      return content.xmlify();
    } else if (content instanceof NumeralContent) {
      // TODO!
      return `<nc>${content.content}</nc>`
    } else if (content instanceof MarkContent) {
      // TODO!
      return `<mc>${content.content}</mc>`
    } else {
      // Illegible content
      return 'x';
    }
  }
}

// Word

export class Word {
  constructor(public input: string, public content: WordContent[]) {
  }

  xmlify(): string {
    const xmlContent = this.content.map((wc) => xmlify(wc)).join(' ');
    const transcription = this.content.map((twc) => getContent(twc)).join('');

    return `<w trans="${transcription}">${xmlContent}</w>`;
  }
}

export function transliterationWord(input: string, ...content: WordContent[]): Word {
  return new Word(input, content);
}

// Line

export interface TransliterationLine {
  lineInput: string;
  result?: Maybe<TransliterationTextLineParseResult>;
}
