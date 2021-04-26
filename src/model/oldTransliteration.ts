import {determinativFormat, isDeterminativ,} from "./wordContent/determinativ";
import {aoSignFormat, isAoSign} from "./wordContent/sign";
import {isCorrectionContent} from "./corrections";
import {isDamageContent, xmlifyDamageContent} from "./damages";
import {akkadogrammFormat, isAkkadogramm, isSumerogramm, sumerogrammFormat} from "./wordContent/multiStringContent";
import {getXmlNameForManuscriptSide} from "./manuscriptProperties/manuscriptProperties";
import {getAbbreviationForManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {SideBasics} from "./sideParseResult";
import {AOWord, AOWordContent, aoWordFormat} from "../editor/documentWord";
import {isNumeralContent, numeralContentFormat} from "./wordContent/numeralContent";
import {isMaterLectionis, materLectionisFormat} from "./wordContent/materLectionis";
import {aoNoteFormat, isAoNote} from "./wordContent/footNote";
import {aoKolonMarkFormat, isAoKolonMark} from "./wordContent/kolonMark";

// Word Content

export function xmlify(c: AOWordContent): string {
  if (typeof c === 'string') {
    return c;
  } else if (isAkkadogramm(c)) {
    return akkadogrammFormat.write(c, -1);
  } else if (isSumerogramm(c)) {
    return sumerogrammFormat.write(c, -1);
  } else if (isDeterminativ(c)) {
    return determinativFormat.write(c, -1);
  } else if (isMaterLectionis(c)) {
    return materLectionisFormat.write(c, -1);
  } else if (isNumeralContent(c)) {
    return numeralContentFormat.write(c, -1);
  } else if (isCorrectionContent(c)) {
    // TODO!
    return `<todo!/>`; // c.xmlify();
  } else if (isDamageContent(c)) {
    return xmlifyDamageContent(c);
  } else if (isAoSign(c)) {
    return aoSignFormat.write(c, 0);
  } else if (isAoNote(c)) {
    return aoNoteFormat.write(c, 0);
  } else if (isAoKolonMark(c)) {
    return aoKolonMarkFormat.write(c, 0);
  } else {
    // Illegible c
    return 'x';
  }
}

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
