import {isStringContent, StringContent, xmlifyStringContent} from "./stringContent";
import {isMarkContent, MarkContent} from "./markContent";
import {CorrectionContent, isCorrectionContent} from "./corrections";
import {DamageContent, isDamageContent, xmlifyDamageContent} from "./damages";
import {isMultiStringContent, MultiStringContent, xmlifyMultiStringContent} from "./multiStringContent";
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

export interface NumeralContent {
  type: 'Numeral';
  content: string;
  isSubscript: boolean
}

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContent {
  return {type: 'Numeral', content, isSubscript};
}

export function isNumeralContent(w: WordContent): w is NumeralContent {
  return typeof w !== 'string' && 'type' in w && w.type === 'Numeral';
}

/*
{
  private digitToSubscript(): string {
    return String.fromCharCode(charCodeSubscriptZero + (this.content.charCodeAt(0) - charCodeZero));
  }
}
 */

function getContent(c: WordContent): string {
  if (typeof c === 'string') {
    return c;
  } else if (isMultiStringContent(c)) {
    return c.contents.map(getContent).join('');
  } else if (isStringContent(c)) {
    return c.content;
  } else {
    // FIXME: implement?!
    return '';
  }
}

export function xmlify(c: WordContent): string {
  if (isMultiStringContent(c)) {
    return xmlifyMultiStringContent(c);
  } else {
    if (typeof c === 'string') {
      return c;
    } else if (isStringContent(c)) {
      return xmlifyStringContent(c);
    } else if (isCorrectionContent(c)) {
      // TODO!
      return `<todo!/>`; // c.xmlify();
    } else if (isDamageContent(c)) {
      return xmlifyDamageContent(c);
    } else if (isNumeralContent(c)) {
      // TODO!
      return `<nc>${c.content}</nc>`
    } else if (isMarkContent(c)) {
      // TODO!
      return `<mc>${c.content}</mc>`
    } else {
      // Illegible c
      return 'x';
    }
  }
}

// Word

export interface Word {
  input: string;
  content: WordContent[]
}

export function word(input: string, ...content: WordContent[]): Word {
  return {input, content};
}

export function xmlifyWord({input, content}: Word): string {
  const xmlContent = content.map((wc) => xmlify(wc)).join(' ');
  const transcription = content.map((twc) => getContent(twc)).join('');

  return `<w trans="${transcription}">${xmlContent}</w>`;
}

// Line

export interface LineParseResult {
  lineNumber: number;
  lineNumberIsAbsolute: boolean;
  words: Word[]
}

export function xmlifyLineParseResult(
  {lineNumber, lineNumberIsAbsolute, words}: LineParseResult,
  textId: string,
  {side, language, column, columnModifier}: SideBasics,
  paragraphNumber: number = 1
): string {
  // FIXME: paragraphNumber!
  const sideName = getXmlNameForManuscriptSide(side);
  const lang = getAbbreviationForManuscriptLanguage(language);

  const x = `<lb txtid="${textId}" lnr="${sideName} ${paragraphNumber} ${lineNumber}${lineNumberIsAbsolute ? '' : '\''}" lg="${lang}"/>\n\n`
  return x + words.map(xmlifyWord).join(' ');
}

export function lineParseResult(lineNumber: number, lineNumberIsAbsolute: boolean = false, words: Word[]): LineParseResult {
  return {lineNumber, lineNumberIsAbsolute, words};
}

export interface TransliterationLine {
  lineInput: string;
  result?: LineParseResult;
}

export function transliterationLine(lineInput: string, result?: LineParseResult): TransliterationLine {
  return {lineInput, result};
}

export function xmlifyTransliterationLine(
  {lineInput, result}: TransliterationLine,
  mainIdentifier: string,
  sideBasics: SideBasics
): string {
  return result
    ? xmlifyLineParseResult(result, mainIdentifier, sideBasics)
    : `<error>${lineInput}</error>`
}
