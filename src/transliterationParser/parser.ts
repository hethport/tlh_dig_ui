import {
  alt,
  createLanguage,
  digits,
  optWhitespace,
  Parser,
  regex,
  regexp,
  Result as ParsimmonResult,
  seq,
  string,
  TypedLanguage
} from "parsimmon";
import {
  TransliterationTextLineParseResult,
  transliterationWord,
  TransliterationWordParseResult
} from "../model/transliterationTextLineParseResult";
import {akkadogramm, determinativ, hittite, materLectionis, sumerogramm} from "../model/stringContent";
import {
  CorrectionType,
  DamageType,
  MarkContentInput,
  MarkType,
  NumeralContentInput,
  StringContentInput,
  TransliterationWordContentInputUnion,
  TransliterationWordInput
} from "../generated/graphql";
import {markContent} from "../model/markContent";

// helper functions

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContentInput {
  return {content, isSubscript};
}

// Other

export interface TransliterationLineParseResult {
  transliterationLineInput: string;
  result?: TransliterationTextLineParseResult;
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

  stringContent: TransliterationWordContentInputUnion,

  markType: MarkType;
  markContent: MarkContentInput,

  numeralContent: NumeralContentInput;
  subscriptNumeralContent: NumeralContentInput;

  singleContent: TransliterationWordContentInputUnion;

  transliterationWord: TransliterationWordInput;
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
  regexp(/[\w\W]+/)
).map(([number, isAbsolute, _ows1, _hash, _ows2, content]) => newLinePreParseResult(number, isAbsolute, content))

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
  damages: () => alt(
    string('[').result(DamageType.DeletionStart),
    string(']').result(DamageType.DeletionEnd),
    string('⸢').result(DamageType.LesionStart),
    string('⸣').result(DamageType.LesionEnd),
    string('*').result(DamageType.Rasure),
    regexp(/[〈<]{2}/).result(DamageType.SurplusStart),
    regexp(/[〉>]{2}/).result(DamageType.SurplusEnd),
    regexp(/[〈<]/).result(DamageType.SupplementStart),
    regex(/[〉>]/).result(DamageType.SupplementEnd),
    string('(').result(DamageType.UnknownDamageStart),
    string(')').result(DamageType.UnknownDamageEnd),
  ),

  corrections: () => alt(
    string('?').result(CorrectionType.UnsureCorrection),
    string('(?)').result(CorrectionType.MaybeUnsureCorrection),
    string('!').result(CorrectionType.SureCorrection),
    string('sic').result(CorrectionType.SicCorrection),
    string('…').result(CorrectionType.Ellipsis),
    // Double paragraph end
    string('$$').result(CorrectionType.DoubleParagraphEnd),
    string('===').result(CorrectionType.DoubleParagraphEnd),
    // Paragraph end
    string('$').result(CorrectionType.ParagraphEnd),
    string('¬¬¬').result(CorrectionType.ParagraphEnd),
  ),

  markType: () => alt(
    string('S').result(MarkType.Sign),
    string('G').result(MarkType.TextGap),
    string('F').result(MarkType.FootNote),
    string('K').result(MarkType.Colon),
  ),

  markContent: r => seq(string('{'), r.markType, string(':'), optWhitespace, regex(/[^}]*/), string('}'))
    .map(([_oa, markType, _colon, _ws, content, _ca]) => markContent(markType, content)),

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
  stringContent: r => alt<StringContentInput>(r.sumerogramm, r.akkadogramm, r.hittite, r.determinativ, r.materLectionis)
    .map((stringContent) => {
      return {stringContent};
    }),

  singleContent: (r) => alt<TransliterationWordContentInputUnion>(
    r.markContent.map((markContent) => {
      return {markContent};
    }),
    r.damages.map((damageContent) => {
      return {damageContent};
    }),
    r.corrections.map((correctionContent) => {
      return {correctionContent};
    }),
    alt<NumeralContentInput>(r.subscriptNumeralContent, r.numeralContent).map((numeralContent) => {
      return {numeralContent};
    }),
    r.stringContent
  ),

  transliterationWord: r => r.singleContent.atLeast(1)
    .map((content: TransliterationWordContentInputUnion[]) => transliterationWord(...content)),
});

const spaceNotInAccoladesRegex = /\s+(?![^{]*})/;

export function parseTransliterationLine(transliterationLineInput: string): TransliterationTextLineParseResult | undefined {
  // step 1: extract line number and actual content
  const linePreParsingResult: ParsimmonResult<LinePreParseResult> = lineParser.parse(transliterationLineInput);

  if (!linePreParsingResult.status) {
    return undefined;
  }

  const {lineNumber, lineNumberIsAbsolute, content} = linePreParsingResult.value;

  // step 2: split by spaces not in accolades, parse words
  const newContent: TransliterationWordParseResult[] = content
    .split(spaceNotInAccoladesRegex)
    .map((wordInput) => {
      const wordParseResult: ParsimmonResult<TransliterationWordInput> = transliteration.transliterationWord.parse(wordInput);

      return wordParseResult.status ? {wordInput, result: wordParseResult.value} : {wordInput};
    });

  return new TransliterationTextLineParseResult(lineNumber, lineNumberIsAbsolute, newContent);
}
