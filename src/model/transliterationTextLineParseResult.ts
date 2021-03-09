import {xmlifyStringContent} from './stringContent';
import {xmlifyDamage} from "./damages";
import {
  getXmlNameForManuscriptSide,
  ManuscriptColumn,
  ManuscriptColumnModifier,
  ManuscriptSide
} from "./manuscriptProperties/manuscriptProperties";
import {getAbbreviationForManuscriptLanguage, ManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {Word, WordContent} from "./oldTransliteration";

// Word Content

export function xmlify(content: WordContent): string {
  return '';
  /*
  if (content.stringContent) {
    return xmlifyStringContent(content.stringContent);
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
   */
}

function getContent(twc: WordContent): string {
  return '';
  /*
  if (twc.stringContent) {
    return twc.stringContent.content;
  } else {
    // FIXME: implement!
    return '';
  }
   */
}

function getTranscription(content: WordContent[]): string {
  return content.map((twc) => getContent(twc)).join('');
}

// Word

export function transliterationWord(input: string, ...content: WordContent[]): Word {
  return {input, content};
}

function xmlifyTransliterationWordParseResult({input, content}: Word): string {
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
    public words: Word[]
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

export function transliterationTextLineParseResult(lineNumber: number, content: Word[], isAbsolute: boolean = false): TransliterationTextLineParseResult {
  return new TransliterationTextLineParseResult(lineNumber, isAbsolute, content);
}
