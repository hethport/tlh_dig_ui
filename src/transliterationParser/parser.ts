import {
  alt,
  createLanguage,
  digits,
  oneOf,
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
  ContentOfMultiStringContent,
  IllegibleContent,
  lineParseResult,
  LineParseResult,
  numeralContent,
  NumeralContent,
  SimpleWordContent,
  word,
  Word,
  WordContent
} from "../model/oldTransliteration";
import {MarkContent, markContent, MarkType, markTypeParser} from "../model/markContent";
import {damageContent, DamageContent, DamageType} from "../model/damages";
import {correctionContent, CorrectionContent, CorrectionType} from "../model/corrections";
import {determinativ, materLectionis, StringContent} from "../model/stringContent";
import {akkadogramm, MultiStringContent, sumerogramm} from "../model/multiStringContent";
import {inscribedLetter, InscribedLetter} from "../model/inscribedLetter";

// Other

const lowerTextRegex: RegExp = /\p{Ll}+/u;
const upperTextRegex: RegExp = /\p{Lu}+/u;

type LanguageSpec = {
  // String contents
  damages: DamageContent;
  corrections: CorrectionContent;

  hittite: string;

  defaultDeterminativ: StringContent;
  specialDeterminativ: StringContent;
  determinativ: StringContent;
  materLectionis: StringContent;

  illegible: IllegibleContent;

  markType: MarkType;
  markContent: MarkContent,

  numeralContent: NumeralContent;
  subscriptNumeralContent: NumeralContent;

  inscribedLetter: InscribedLetter;

  indexDigit: string;

  contentOfMultiStringContent: ContentOfMultiStringContent;

  simpleWordContent: SimpleWordContent;

  singleAkkadogrammContent: ContentOfMultiStringContent[];
  akkadogramm: MultiStringContent;

  singleSumerogrammContent: ContentOfMultiStringContent[];
  sumerogramm: MultiStringContent;

  wordContent: WordContent;

  wordContents: WordContent[];
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
  ).map(damageContent),

  corrections: () => alt(
    string('?').result(CorrectionType.UnsureCorrection),
    string('(?)').result(CorrectionType.MaybeUnsureCorrection),
    string('!').result(CorrectionType.SureCorrection),
    string('sic').result(CorrectionType.SicCorrection),
    alt(string('…'), string('...')).result(CorrectionType.Ellipsis),
    alt(string('§§'), string('===')).result(CorrectionType.DoubleParagraphEnd),
    alt(string('§'), string('¬¬¬')).result(CorrectionType.ParagraphEnd),
  ).map(correctionContent),

  hittite: () => alt(
    regexp(lowerTextRegex),
    string('-').notFollowedBy(string('-')),
    oneOf('×ₓ')
  ).atLeast(1).tie(),

  defaultDeterminativ: () => alt(regexp(upperTextRegex), string('.'))
    .atLeast(1)
    .tie()
    .map((content) => determinativ(content)),

  specialDeterminativ: () => seq(
    alt(string('m'), string('f')),
    string('.'),
    regexp(upperTextRegex),
  ).map(([genus, dot, rest]) => determinativ(genus + dot + rest)),

  determinativ: r => seq(
    string('°'),
    alt<StringContent>(r.defaultDeterminativ, r.specialDeterminativ),
    string('°')
  ).map(([_deg1, content, _deg2]) => content),

  materLectionis: () => seq(
    string('°'),
    alt(
      regexp(lowerTextRegex),
      string('.')
    ).atLeast(1).tie(),
    string('°')
  ).map(([_degSym1, result, _degSym2]) => result === 'm' || result === 'f' ? determinativ(result) : materLectionis(result)),

  illegible: () => string('x').result<IllegibleContent>({}),

  markType: () => markTypeParser,
  markContent: r => seq(string('{'), r.markType, string(':'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_oa, markType, _colon, _ws, content, _ca]) => markContent(markType, content)),

  numeralContent: () => regexp(/\d+/)
    .map((result) => numeralContent(result, false)),
  subscriptNumeralContent: () => regexp(/[₀₁₂₃₄₅₆₇₈₉]+/)
    .map((result) => numeralContent((result.codePointAt(0)! % 10).toString(), true)),

  inscribedLetter: () => seq(string('x'), regexp(upperTextRegex)).map(([_x, result]) => inscribedLetter(result)),

  indexDigit: () => oneOf('1234567890x').notFollowedBy(regexp(upperTextRegex))
    .map((result) => result === 'x' ? 'ₓ' : result),

  contentOfMultiStringContent: r => alt<ContentOfMultiStringContent>(
    r.markContent,
    r.damages,
    r.corrections,
    r.inscribedLetter,
    r.indexDigit
  ),

  simpleWordContent: r => alt<SimpleWordContent>(
    r.markContent,
    r.damages,
    r.corrections,
    alt<NumeralContent>(r.subscriptNumeralContent, r.numeralContent),
    // Do not change order of parsers!
    alt<StringContent>(r.determinativ, r.materLectionis),
    r.hittite
  ),

  singleAkkadogrammContent: r => seq(
    regexp(upperTextRegex),
    alt<ContentOfMultiStringContent>(regexp(upperTextRegex), r.contentOfMultiStringContent).many()
  ).map(([first, rest]) => [first, ...rest]),

  akkadogramm: r => seq(
    oneOf('_-'),
    r.singleAkkadogrammContent,
    seq(string('-'), r.singleAkkadogrammContent).many()
  ).map(([mark, start, rest]) => akkadogramm(mark, ...start.flat(), ...rest.flat().flat())),

  singleSumerogrammContent: r => seq(
    regexp(upperTextRegex),
    alt<ContentOfMultiStringContent>(regexp(upperTextRegex), r.contentOfMultiStringContent).many()
  ).map(([first, rest]) => [first, ...rest]),

  sumerogramm: r => seq(
    string('--').times(0, 1),
    r.singleSumerogrammContent,
    seq(string('.'), r.singleSumerogrammContent).many()
  ).map(([_x, sgs, rest]) => sumerogramm(...sgs.flat(), ...rest.flat().flat())),

  wordContent: r => alt(r.akkadogramm, r.sumerogramm, r.simpleWordContent),

  wordContents: r => alt<WordContent[]>(
    r.illegible.result([{}]),
    r.wordContent.atLeast(1)
  )
});

const spaceNotInAccoladesRegex = /\s+(?![^{]*})/;

export function parseTransliterationLine(transliterationLineInput: string): LineParseResult | undefined {
  // step 0: trim line content
  const trimmedLine = transliterationLineInput.trim();

  // step 1: extract line number and actual content
  const linePreParsingResult: ParsimmonResult<LinePreParseResult> = lineParser.parse(trimmedLine);

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
      .replace('><', '𒉽');

    return [word, replaced_word];
  });

  // step 4: parse words
  const newContent: Word[] = substitutedWords.map(([input, replacedWordInput]) => {
    const wordParseResult: ParsimmonResult<WordContent[]> = transliteration.wordContents.parse(replacedWordInput);

    return word(input, ...(wordParseResult.status ? wordParseResult.value : []));
  });

  return lineParseResult(lineNumber, lineNumberIsAbsolute, newContent);
}
