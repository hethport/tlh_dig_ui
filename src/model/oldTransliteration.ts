import {getXmlNameForManuscriptSide} from "./manuscriptProperties/manuscriptProperties";
import {getAbbreviationForManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {SideBasics} from "./sideParseResult";
import {AOWord, aoWordFormat} from "./word";

// Line

export interface LineParseResult {
  lineNumber: number;
  lineNumberIsAbsolute: boolean;
  words: AOWord[]
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
  return x + words.map(aoWordFormat.write).join(' ');
}

export function lineParseResult(lineNumber: number, lineNumberIsAbsolute: boolean = false, words: AOWord[]): LineParseResult {
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
