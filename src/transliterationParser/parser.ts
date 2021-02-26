import {
  alt,
  createLanguage,
  digits,
  optWhitespace,
  Parser,
  regex,
  regexp,
  seq,
  string,
  TypedLanguage,
  whitespace
} from "parsimmon";
import {allCorrections, symbolForCorrection} from "../model/corrections";
import {
  TransliterationTextLine,
  TransliterationWord,
  TransliterationWordContent
} from "../model/transliterationTextLine";
import {akkadogramm, determinativ, hittite, materLectionis, sumerogramm} from "../model/stringContent";
import {CorrectionType, DamageType, NumeralContentInput, StringContentInput} from "../generated/graphql";

// helper functions

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContentInput {
  return {content, isSubscript};
}

// Other

export interface TransliterationLineParseResult {
  transliterationLineInput: string;
  result?: TransliterationTextLine;
}

type LanguageSpec = {
  // String contents
  damages: DamageType;
  corrections: CorrectionType;

  hittite: StringContentInput;
  akkadogramm: StringContentInput;
  sumerogramm: StringContentInput;
  determinativ: StringContentInput;
  materLectionis: StringContentInput;

  stringContent: StringContentInput,

  numeralContent: NumeralContentInput;
  subscriptNumeralContent: NumeralContentInput;

  singleContent: TransliterationWordContent;

  transliterationWord: TransliterationWord;

  transliterationTextLine: TransliterationTextLine;
}

interface LinePreParseResult {
  lineNumber: number;
  lineNumberIsAbsolute: boolean;
  content: string;
}

function newLinePreParseResult(lineNumber: number, lineNumberIsAbsolute: boolean, content: string): LinePreParseResult {
  return {lineNumber, lineNumberIsAbsolute, content};
}

const lineParser: Parser<LinePreParseResult> = seq(
  digits.map(parseInt),
  string("'").times(0, 1).map((res) => res.length === 0),
  optWhitespace,
  string('#'),
  optWhitespace,
  regexp(/\w\W/)
)
  .map(([number, isAbsolute, _ows1, _hash, _ows2, content]) => newLinePreParseResult(number, isAbsolute, content))

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
  damages: () => alt(
    string('[').map(() => DamageType.DeletionStart),
    string(']').map(() => DamageType.DeletionEnd),
    string('⸢').map(() => DamageType.LesionStart),
    string('⸣').map(() => DamageType.LesionEnd),
    string('*').map(() => DamageType.Rasure),
    regexp(/[〈<]{2}/).map(() => DamageType.SurplusStart),
    regexp(/[〉>]{2}/).map(() => DamageType.SurplusEnd),
    regexp(/[〈<]/).map(() => DamageType.SupplementStart),
    regex(/[〉>]/).map(() => DamageType.SupplementEnd),
    string('(').map(() => DamageType.UnknownDamageStart),
    string(')').map(() => DamageType.UnknownDamageEnd),
  ),

  corrections: () => alt(...allCorrections.map((c) => string(symbolForCorrection(c)).result(c))),

  numeralContent: () => regexp(/\d+/)
    .map((result) => numeralContent(result, false)),

  subscriptNumeralContent: () => regexp(/[₀₁₂₃₄₅₆₇₈₉]+/)
    .map((result) => numeralContent((result.codePointAt(0)! % 10).toString(), true)),

  hittite: () => regexp(/[\p{Ll}-]+/u).map((result) => hittite(result)),

  /**
   * Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
   */
  akkadogramm: () => regexp(/[_-]([\p{Lu}-])+/u).map((result) => akkadogramm(result.substring(1))),

  /**
   * Sumerogramm:
   * - automatisch für Versalien
   * - im Wortinnern durch vorausgehendes `--` markiert
   */
  sumerogramm: () => regexp(/(--)?([.\p{Lu}]+)/u, 2).map((result) => sumerogramm(result)),

  /**
   * Determinativ:
   * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
   * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
   */
  determinativ: () => regexp(/°([\p{Lu}.]+)°/u, 1).map((result) => determinativ(result)),

  /**
   * Mater lectionis:
   * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
   */
  materLectionis: () => regexp(/°([\p{Ll}.]+)°/u, 1).map((result) => materLectionis(result)),

  // Do not change order of parsers!
  stringContent: r => alt(r.sumerogramm, r.akkadogramm, r.hittite, r.determinativ, r.materLectionis),

  singleContent: r => alt(r.damages, r.corrections, r.subscriptNumeralContent, r.numeralContent, r.stringContent),

  transliterationWord: r => r.singleContent.atLeast(1)
    .map((content: TransliterationWordContent[]) => new TransliterationWord(content)),

  transliterationTextLine: r => seq(
    digits.map(parseInt),
    string("'").times(0, 1).map((res) => res.length === 0),
    optWhitespace,
    string('#'),
    optWhitespace,
    r.transliterationWord.sepBy(whitespace)
  ).map(([number, isAbsolute, _ows1, _hash, _ows2, content]) => new TransliterationTextLine(number, isAbsolute, content))
});

export function parseTransliterationLine(transliterationLineInput: string): TransliterationLineParseResult {
  const parsed = transliteration.transliterationTextLine.parse(transliterationLineInput);
  return parsed.status ? {transliterationLineInput, result: parsed.value} : {transliterationLineInput};
}
