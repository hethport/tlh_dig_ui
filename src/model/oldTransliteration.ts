import {StringContent} from "./stringContent";
import {MarkContent} from "./markContent";
import {CorrectionContent} from "./corrections";
import {DamageContent} from "./damages";
import {MultiStringContent} from "./multiStringContent";
import {InscribedLetter} from "./inscribedLetter";
import {getXmlNameForManuscriptSide} from "./manuscriptProperties/manuscriptProperties";
import {getAbbreviationForManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {SideBasics} from "./sideParseResult";

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

const charCodeZero = '0'.charCodeAt(0);
const charCodeSubscriptZero = '₀'.charCodeAt(0);

export class NumeralContent {
  constructor(public content: string, public isSubscript: boolean) {
  }

  private digitToSubscript(): string {
    return String.fromCharCode(charCodeSubscriptZero + (this.content.charCodeAt(0) - charCodeZero));
  }
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


// Line

export class LineParseResult {
  constructor(public lineNumber: number, public lineNumberIsAbsolute: boolean = false, public words: Word[]) {
  }

  xmlify(textId: string, {side, language, column, columnModifier}: SideBasics, paragraphNumber: number = 1): string {
    // FIXME: paragraphNumber!
    const sideName = getXmlNameForManuscriptSide(side);
    const lang = getAbbreviationForManuscriptLanguage(language);

    const x = `<lb txtid="${textId}" lnr="${sideName} ${paragraphNumber} ${this.lineNumber}" lg="${lang}"/>\n\n`
    return x + this.words.map((tw) => tw.xmlify()).join(' ');
  }
}

export class TransliterationLine {
  constructor(public lineInput: string, public result?: LineParseResult) {
  }

  xmlify(mainIdentifier: string, sideBasics: SideBasics): string {
    return this.result
      ? this.result.xmlify(mainIdentifier, sideBasics)
      : `<error>${this.lineInput}</error>`
  }
}
