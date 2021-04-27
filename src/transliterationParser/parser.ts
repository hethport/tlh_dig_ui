import {
  alt,
  createLanguage,
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
import {lineParseResult, LineParseResult} from "../model/lineParseResult";
import {AOSign, aoSign} from "../model/wordContent/sign";
import {damageContent, DamageContent, DamageType} from "../model/wordContent/damages";
import {aoCorr, AOCorr} from "../model/wordContent/corrections";
import {ParseP, ParsePDouble} from '../model/paragraphEnds';
import {AODeterminativ, determinativ,} from "../model/wordContent/determinativ";
import {akkadogramm, AOAkkadogramm, AOSumerogramm, sumerogramm} from "../model/wordContent/multiStringContent";
import {inscribedLetter, InscribedLetter} from "../model/wordContent/inscribedLetter";
import {AOGap, aoGap} from "../model/sentenceContent/gap";
import {Ellipsis} from "../model/wordContent/ellipsis";
import {AOWord, parsedWord} from "../model/sentenceContent/word";
import {AOMaterLectionis, materLectionis} from "../model/wordContent/materLectionis";
import {AONumeralContent, numeralContent} from "../model/wordContent/numeralContent";
import {aoNote, AONote} from "../model/wordContent/footNote";
import {AOIllegibleContent} from "../model/wordContent/illegible";
import {aoKolonMark, AOKolonMark} from "../model/wordContent/kolonMark";
import {AOSimpleWordContent, AOWordContent, MultiStringContent} from "../model/wordContent/wordContent";

// Other

const lowerTextRegex: RegExp = /\p{Ll}+/u;
const upperTextRegex: RegExp = /\p{Lu}+/u;

type LanguageSpec = {
  // String contents
  damages: DamageContent;
  corrections: AOCorr;

  parseP: typeof ParseP,
  parsePDouble: typeof ParsePDouble,

  ellipsis: typeof Ellipsis,

  hittite: string;

  defaultDeterminativ: AODeterminativ;
  specialDeterminativ: AODeterminativ;
  determinativ: AODeterminativ;

  materLectionis: AOMaterLectionis | AODeterminativ;

  numeralContent: AONumeralContent;
  subscriptNumeralContent: AONumeralContent;

  illegible: typeof AOIllegibleContent;

  sign: AOSign;
  kolonMark: AOKolonMark;
  footNote: AONote;
  gap: AOGap;

  inscribedLetter: InscribedLetter;

  indexDigit: string;

  contentOfMultiStringContent: MultiStringContent;

  simpleWordContent: AOSimpleWordContent;

  multiMultiStringContent: MultiStringContent[];

  akkadogramm: AOAkkadogramm;
  sumerogramm: AOSumerogramm;

  wordContent: AOWordContent;

  wordContents: AOWordContent[];
}

interface LinePreParseResult {
  lineNumber: string;
  content: string;
}

function newLinePreParseResult(lineNumber: string, content: string): LinePreParseResult {
  return {lineNumber, content};
}

const lineParser: Parser<LinePreParseResult> = seq(
  regexp(/\d+'?/),
  optWhitespace,
  string('#'),
  optWhitespace,
  regexp(/[\w\W]+/)
).map(([number, _ows1, _hash, _ows2, content]) => newLinePreParseResult(number, content))

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
  damages: () => alt(
    string('[').result(DamageType.DeletionStart),
    string(']').result(DamageType.DeletionEnd),
    string('⸢').result(DamageType.LesionStart),
    string('⸣').result(DamageType.LesionEnd),
    // FIXME: rasure has start and end!
    string('*').result(DamageType.RasureStart),
    regexp(/[〈<]{2}/).result(DamageType.SurplusStart),
    regexp(/[〉>]{2}/).result(DamageType.SurplusEnd),
    regexp(/[〈<]/).result(DamageType.SupplementStart),
    regex(/[〉>]/).result(DamageType.SupplementEnd),
    string('(').result(DamageType.UnknownDamageStart),
    string(')').result(DamageType.UnknownDamageEnd),
  ).map(damageContent),

  corrections: () => alt(
    string('?'),
    string('(?)'),
    string('!'),
    string('sic')
  ).map(x => aoCorr(x)),

  parseP: () => alt(string('§'), string('¬¬¬')).result(ParseP),
  parsePDouble: () => alt(string('§§'), string('===')).result(ParsePDouble),

  ellipsis: () => alt(string('…'), string('...')).result(Ellipsis),

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
    alt<AODeterminativ>(r.defaultDeterminativ, r.specialDeterminativ),
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

  illegible: () => string('x').result<typeof AOIllegibleContent>(AOIllegibleContent),

  sign: () => seq(string('{S:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing]) => aoSign(content)),

  gap: () => seq(string('{G:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing]) => aoGap(content)),

  footNote: () => seq(string('{F:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing]) => aoNote(content, '-1000')),

  kolonMark: () => seq(string('{K:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing_]) => aoKolonMark(content)),

  numeralContent: () => regexp(/\d+/).map((result) => numeralContent(result)),

  subscriptNumeralContent: () => regexp(/[₀₁₂₃₄₅₆₇₈₉]+/).map((result) => numeralContent(result)),

  inscribedLetter: () => seq(string('x'), regexp(upperTextRegex)).map(([_x, result]) => inscribedLetter(result)),

  indexDigit: () => oneOf('1234567890x').notFollowedBy(regexp(upperTextRegex))
    .map((result) => result === 'x' ? 'ₓ' : result),

  contentOfMultiStringContent: r => alt<MultiStringContent>(
    // r.sign,
    // r.footNote,
    // r.kolonMark,
    r.damages,
    r.corrections,
    r.inscribedLetter,
    r.indexDigit
  ),

  simpleWordContent: r => alt<AOSimpleWordContent>(
    r.ellipsis,
    r.sign,
    r.footNote,
    r.kolonMark,
    r.damages,
    r.corrections,
    // Do not change order of parsers!
    alt(r.determinativ, r.materLectionis, r.subscriptNumeralContent, r.numeralContent),
    r.hittite
  ),

  multiMultiStringContent: r => seq(
    regexp(upperTextRegex),
    alt<MultiStringContent>(regexp(upperTextRegex), r.contentOfMultiStringContent).many()
  ).map(([first, rest]) => [first, ...rest]),

  akkadogramm: r => seq(
    oneOf('_-'),
    r.multiMultiStringContent,
    seq(string('-'), r.multiMultiStringContent).many()
  ).map(([mark, start, rest]) => akkadogramm(mark, ...start.flat(), ...rest.flat().flat())),

  sumerogramm: r => seq(
    string('--').times(0, 1),
    r.multiMultiStringContent,
    seq(string('.'), r.multiMultiStringContent).many()
  ).map(([_x, sgs, rest]) => sumerogramm(...sgs.flat(), ...rest.flat().flat())),

  wordContent: r => alt(r.akkadogramm, r.sumerogramm, r.simpleWordContent, r.parseP, r.parsePDouble),

  wordContents: r => alt<AOWordContent[]>(
    r.illegible.result([AOIllegibleContent]),
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

  const {lineNumber, content} = linePreParsingResult.value;

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
  const newContent: AOWord[] = substitutedWords.map(([input, replacedWordInput]) => {
    const wordParseResult: ParsimmonResult<AOWordContent[]> = transliteration.wordContents.parse(replacedWordInput);

    return parsedWord(input, ...(wordParseResult.status ? wordParseResult.value : []));
  });

  return lineParseResult(lineNumber, newContent);
}
