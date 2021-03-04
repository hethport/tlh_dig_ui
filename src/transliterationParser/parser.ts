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
import {
  CorrectionType,
  DamageType,
  IllegibleContentInput,
  MarkContentInput,
  MarkType,
  NumeralContentInput,
  StringContentInput,
  WordContentInputUnion,
  WordInput
} from "../generated/graphql";
import {markContent, markTypeParser} from "../model/markContent";
import {damageTypeParser} from "../model/damages";
import {correctionTypeParser} from "../model/corrections";
import {
  akkadogrammParser,
  determinativParser,
  hittiteParser,
  materLectionisParser,
  sumerogrammParser
} from "./singleParsers";

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

  illegible: IllegibleContentInput;

  markType: MarkType;
  markContent: MarkContentInput,

  numeralContent: NumeralContentInput;
  subscriptNumeralContent: NumeralContentInput;

  singleContent: WordContentInputUnion;

  wordContent: WordContentInputUnion[];
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

  illegible: () => string('x').result<IllegibleContentInput>({}),


  hittite: () => hittiteParser,

  akkadogramm: () => akkadogrammParser,
  sumerogramm: () => sumerogrammParser,
  determinativ: () => determinativParser,
  materLectionis: () => materLectionisParser,

  // Do not change order of parsers!
  stringContent: r => alt<StringContentInput>(
    r.sumerogramm,
    r.akkadogramm,
    r.determinativ,
    r.materLectionis,
    r.hittite,
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

  wordContent: r => alt<WordContentInputUnion[]>(
    r.illegible.result([{illegibleContent: {}}]),
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
      // Index digit or x
      .replace(/(?<=\w)x(?=\W)/, 'ₓ')
      .replace(/(?<=\w)(\d)(?=\w)/, (s) => digitToSubscript(s))
      // Replace inscribed 'x'
      .replace(/(?<=\w)x(?=\w)/, '×');

    return [word, replaced_word];
  });

  // step 4: parse words
  const newContent: WordInput[] = substitutedWords.map(([input, replacedWordInput]) => {
    const wordParseResult: ParsimmonResult<WordContentInputUnion[]> = transliteration.wordContent.parse(replacedWordInput);

    const content = wordParseResult.status ? wordParseResult.value : [];

    return {input, content};
  });


  return new TransliterationTextLineParseResult(lineNumber, lineNumberIsAbsolute, newContent);
}
