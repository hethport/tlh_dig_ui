import {xmlifyStringContentInput} from './stringContent';
import {xmlifyDamage} from "./damages";
import {
  ManuscriptLanguage,
  ManuscriptSide,
  TransliterationWordContentInputUnion,
  TransliterationWordInput
} from "../generated/graphql";
import {getXmlNameForManuscriptSide} from "../manuscriptProperties";

// Word Content

function xmlify(content: TransliterationWordContentInputUnion): string {
  if (content.stringContent) {
    return xmlifyStringContentInput(content.stringContent);
  } else if (content.correctionContent) {
    return '<todo/>';
  } else if (content.damageContent) {
    return xmlifyDamage(content.damageContent);
  } else if (content.numeralContent) {
    return `<nc>${content.numeralContent}</nc>`;
  } else if (content.markContent) {
    return `<mc>${content.markContent}</mc>`;
  } else {
    return `<error/>`;
  }
}

function getContent(twc: TransliterationWordContentInputUnion): string {
  if (twc.stringContent) {
    return twc.stringContent.content;
  } else {
    // FIXME: implement!
    return '';
  }
}

function getTranscription(content: TransliterationWordContentInputUnion[]): string {
  return content.map((twc) => getContent(twc)).join('');
}

// Word

export function transliterationWord(...content: TransliterationWordContentInputUnion[]): TransliterationWordInput {
  return {content};
}

export interface TransliterationWordParseResult {
  wordInput: string;
  result?: TransliterationWordInput;
}

function xmlifyTransliterationWordParseResult(t: TransliterationWordParseResult): string {
  if (t.result) {
    const content = t.result.content;

    const xmlContent = content
      ? content.map((wc) => wc ? xmlify(wc) : '').join(' ')
      : '';

    return `<w trans="${getTranscription(content)}">${xmlContent}</w>`;
  } else {
    return `<unknown>${t.wordInput}</unknown>`;
  }
}

// Line

export class TransliterationTextLineParseResult {
  constructor(
    public lineNumber: number,
    public lineNumberIsAbsolute: boolean = false,
    public content: TransliterationWordParseResult[]
  ) {
  }

  xmlify(textId: string, side: ManuscriptSide, manuscriptLanguage: ManuscriptLanguage, paragraphNumber: number = 1): string {
    // FIXME: paragraphNumber, language!
    const language = 'Hit';

    const x = `<lb txtid="${textId}" lnr="${getXmlNameForManuscriptSide(side)} ${paragraphNumber} ${this.lineNumber}" lg="${language}"/>\n\n`
    return x + this.content.map((tw) => xmlifyTransliterationWordParseResult(tw)).join('\n\n');
  }
}

export function transliterationTextLineParseResult(lineNumber: number, content: TransliterationWordParseResult[], isAbsolute: boolean = false): TransliterationTextLineParseResult {
  return new TransliterationTextLineParseResult(lineNumber, isAbsolute, content);
}
