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
import {TransliterationTextLineParseResult} from "../model/transliterationTextLineParseResult";
import {akkadogramm, determinativ, hittite, materLectionis, sumerogramm} from "../model/stringContent";
import {
  CorrectionType,
  DamageType,
  MarkContentInput,
  MarkType,
  NumeralContentInput,
  StringContentInput,
  WordContentInputUnion,
  WordInput,
  XContentInput
} from "../generated/graphql";
import {markContent, markTypeParser} from "../model/markContent";
import {damageTypeParser} from "../model/damages";
import {correctionTypeParser} from "../model/corrections";

// helper functions

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContentInput {
  return {content, isSubscript};
}

const charCodeZero = '0'.charCodeAt(0);
const charCodeSubscriptZero = '₀'.charCodeAt(0);

function digitToSubscript(digit: string): string {
  return String.fromCharCode(charCodeSubscriptZero + (digit.charCodeAt(0) - charCodeZero));
}

function toWordContentInputUnion(wordInput: WordContentInputUnion): WordContentInputUnion {
  return wordInput;
}

// Other

export interface LineParseResult {
  lineInput: string;
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

  stringContent: WordContentInputUnion;

  xContent: XContentInput;

  markType: MarkType;
  markContent: MarkContentInput,

  numeralContent: NumeralContentInput;
  subscriptNumeralContent: NumeralContentInput;

  singleContent: WordContentInputUnion;

  transliterationWord: WordContentInputUnion[];
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
  damages: () => damageTypeParser,

  corrections: () => correctionTypeParser,

  markType: () => markTypeParser,

  markContent: r => seq(string('{'), r.markType, string(':'), optWhitespace, regex(/[^}]*/), string('}'))
    .map(([_oa, markType, _colon, _ws, content, _ca]) => markContent(markType, content)),

  numeralContent: () => regexp(/\d+/)
    .map((result) => numeralContent(result, false)),

  subscriptNumeralContent: () => regexp(/[₀₁₂₃₄₅₆₇₈₉]+/)
    .map((result) => numeralContent((result.codePointAt(0)! % 10).toString(), true)),

  xContent: () => string('x').result<XContentInput>({}),


  hittite: () => regexp(/[-\p{Ll}\u00F7\u2093]+/u).map((result) => hittite(result)),

  /**
   * Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
   */
  akkadogramm: () => regexp(/[_-]([-\p{Lu}\u00F7\u2093])+/u).map((result) =>
    akkadogramm(result.charAt(0) === '_' ? result.substring(1) : result)
  ),

  /**
   * Sumerogramm:
   * - automatisch für Versalien
   * - im Wortinnern durch vorausgehendes `--` markiert
   */
  sumerogramm: () => regexp(/(--)?([.\p{Lu}\u00F7\u2093]+)/u, 2).map((result) => sumerogramm(result)),

  /**
   * Determinativ:
   * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
   * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
   */
  determinativ: () => regexp(/°([.\p{Lu}]+)°/u, 1).map((result) => determinativ(result)),

  /**
   * Mater lectionis:
   * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
   */
  materLectionis: () => regexp(/°([\p{Ll}.]+)°/u, 1).map((result) => materLectionis(result)),

  // Do not change order of parsers!
  stringContent: r => alt<StringContentInput>(
    r.sumerogramm,
    r.akkadogramm,
    r.hittite,
    r.determinativ,
    r.materLectionis
  ).map((stringContent) => toWordContentInputUnion({stringContent})),

  singleContent: (r) => alt<WordContentInputUnion>(
    r.markContent.map((markContent) => toWordContentInputUnion({markContent})),
    r.damages.map((damageContent) => toWordContentInputUnion({damageContent})),
    r.corrections.map((correctionContent) => toWordContentInputUnion({correctionContent})),
    alt<NumeralContentInput>(
      r.subscriptNumeralContent,
      r.numeralContent
    ).map((numeralContent) => toWordContentInputUnion({numeralContent})),
    r.stringContent
  ),

  transliterationWord: r => alt<WordContentInputUnion[]>(
    r.xContent.result([{xContent: {}}]),
    r.singleContent.atLeast(1)
  )
});

const spaceNotInAccoladesRegex = /\s+(?![^{]*})/;

export function parseTransliterationLine(transliterationLineInput: string): TransliterationTextLineParseResult | undefined {
  // step 1: extract line number and actual content
  const linePreParsingResult: ParsimmonResult<LinePreParseResult> = lineParser.parse(transliterationLineInput);

  if (!linePreParsingResult.status) {
    return undefined;
  }

  const {lineNumber, lineNumberIsAbsolute, content} = linePreParsingResult.value;

  // step 2: split by spaces not in accolades to get single words
  const words: string[] = content.split(spaceNotInAccoladesRegex);

  // TODO: step 3: perform substitutions!
  const substitutedWords = words.map((word) => {

    const replaced_word = word
      // Replace wedges
      .replace(';', '𒀹')
      .replace(/(?<!{[SKGF]):/, '𒑱')
      .replace('><', '𒉽')
      // Replace inscribed 'x'
      .replace(/(?<=[\w.])x(?=[\w.])/, '×')
      // TODO: Replace index digits with subscript digits
      .replace(/(?<=\w)(\d)(?=\w)/, (s) => digitToSubscript(s))
      // TODO: Replace index 'x' with subscript 'x'
      .replace(/(?<=\w)x(?=$)/, 'ₓ');

    return [word, replaced_word];
  });

  // step 4: parse words
  const newContent: WordInput[] = substitutedWords.map(([input, replacedWordInput]) => {
    const wordParseResult: ParsimmonResult<WordContentInputUnion[]> = transliteration.transliterationWord.parse(replacedWordInput);

    const content = wordParseResult.status ? wordParseResult.value : [];

    return {input, content};
  });


  return new TransliterationTextLineParseResult(lineNumber, lineNumberIsAbsolute, newContent);
}
