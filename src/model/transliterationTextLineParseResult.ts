import {xmlifyStringContentInput} from './stringContent';
import {xmlifyDamage} from "./damages";
import {
  ManuscriptColumn,
  ManuscriptColumnModifier,
  ManuscriptLanguage,
  ManuscriptSide,
  WordContentInputUnion,
  WordInput
} from "../generated/graphql";
import {getXmlNameForManuscriptSide} from "./manuscriptProperties/manuscriptProperties";
import {getAbbreviationForManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";

// Word Content

function xmlify(content: WordContentInputUnion): string {
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

function getContent(twc: WordContentInputUnion): string {
  if (twc.stringContent) {
    return twc.stringContent.content;
  } else {
    // FIXME: implement!
    return '';
  }
}

function getTranscription(content: WordContentInputUnion[]): string {
  return content.map((twc) => getContent(twc)).join('');
}

// Word

export function transliterationWord(input: string, ...content: WordContentInputUnion[]): WordInput {
  return {input, content};
}

function xmlifyTransliterationWordParseResult({input, content}: WordInput): string {
  if (content) {
    const xmlContent = content
      ? content.map((wc) => wc ? xmlify(wc) : '').join(' ')
      : '';

    return `<w trans="${getTranscription(content)}">${xmlContent}</w>`;
  } else {
    return `<unknown>${input}</unknown>`;
  }
}

// Line

export class TransliterationTextLineParseResult {
  constructor(
    public lineNumber: number,
    public lineNumberIsAbsolute: boolean = false,
    public words: WordInput[]
  ) {
  }

  xmlify(textId: string, side: ManuscriptSide, language: ManuscriptLanguage, column: ManuscriptColumn, columnModifier: ManuscriptColumnModifier, paragraphNumber: number = 1): string {
    // FIXME: paragraphNumber!
    const sideName = getXmlNameForManuscriptSide(side);
    const lang = getAbbreviationForManuscriptLanguage(language);

    const x = `<lb txtid="${textId}" lnr="${sideName} ${paragraphNumber} ${this.lineNumber}" lg="${lang}"/>\n\n`
    return x + this.words.map((tw) => xmlifyTransliterationWordParseResult(tw)).join(' ');
  }
}

export function transliterationTextLineParseResult(lineNumber: number, content: WordInput[], isAbsolute: boolean = false): TransliterationTextLineParseResult {
  return new TransliterationTextLineParseResult(lineNumber, isAbsolute, content);
}
