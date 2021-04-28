import {
  alt,
  createLanguage,
  end,
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
import {aoEllipsis, Ellipsis} from "../model/wordContent/ellipsis";
import {AOWord, parsedWord} from "../model/sentenceContent/word";
import {AOMaterLectionis, materLectionis} from "../model/wordContent/materLectionis";
import {AONumeralContent, numeralContent} from "../model/wordContent/numeralContent";
import {AOFootNote, aoNote} from "../model/wordContent/footNote";
import {aoIllegibleContent, AOIllegibleContent} from "../model/wordContent/illegible";
import {aoKolonMark, AOKolonMark} from "../model/wordContent/kolonMark";
import {AOSimpleWordContent, AOWordContent, MultiStringContent} from "../model/wordContent/wordContent";

// Other

const lowerTextRegex: RegExp = /\p{Ll}+/u;
const upperTextRegex: RegExp = /\p{Lu}+/u;

type LanguageSpec = {
  indexDigit: string;

  // Multi string content
  damages: DamageContent;
  corrections: AOCorr;
  inscribedLetter: InscribedLetter;
  hittite: string;

  contentOfMultiStringContent: MultiStringContent;

  // Other content
  parseP: typeof ParseP,
  parsePDouble: typeof ParsePDouble,
  ellipsis: Ellipsis,

  gap: AOGap;

  // Simple word content
  specialDeterminativContent: string;
  determinativ: AODeterminativ;
  materLectionis: AOMaterLectionis | AODeterminativ;
  numeralContent: AONumeralContent;
  footNote: AOFootNote;
  sign: AOSign;
  kolonMark: AOKolonMark;
  illegible: AOIllegibleContent;

  simpleWordContent: AOSimpleWordContent;

  // Word content
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
    string('!?'),
    string('!'),
    string('sic'),
  ).map(x => aoCorr(x)),

  parseP: () => alt(string('§'), string('¬¬¬')).result(ParseP),
  parsePDouble: () => alt(string('§§'), string('===')).result(ParsePDouble),

  ellipsis: () => alt(string('…'), string('...')).result(aoEllipsis),

  hittite: () => alt(
    regexp(lowerTextRegex),
    string('-').notFollowedBy(string('-')),
    oneOf('×ₓ')
  ).atLeast(1).tie(),

  specialDeterminativContent: () => seq(
    oneOf('mf'),
    seq(string('.'), regexp(upperTextRegex)).tie().times(0, 1)
  ).map(([genus, rest]) => rest ? (genus + rest) : genus),

  determinativ: r => seq(
    string('°'),
    alt<string>(
      alt(regexp(upperTextRegex), string('.')).atLeast(1).tie(),
      r.specialDeterminativContent
    ),
    string('°')
  ).map(([_deg1, content, _deg2]) => determinativ(content)),

  materLectionis: () => seq(
    string('°'),
    alt(
      regexp(lowerTextRegex),
      string('.')
    ).atLeast(1).tie(),
    string('°')
  ).map(([_degSym1, result, _degSym2]) => result === 'm' || result === 'f' ? determinativ(result) : materLectionis(result)),

  numeralContent: () => regexp(/[[\d₀₁₂₃₄₅₆₇₈₉]+/).map((result) => numeralContent(result)),

  illegible: () => string('x').result(aoIllegibleContent),

  sign: () => seq(string('{S:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing]) => aoSign(content)),

  kolonMark: () => seq(string('{K:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing_]) => aoKolonMark(content)),

  footNote: () => seq(string('{F:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing]) => aoNote(content)),

  gap: () => seq(string('{G:'), optWhitespace, regexp(/[^}]*/), string('}'))
    .map(([_opening, _ws, content, _closing]) => aoGap(content)),


  inscribedLetter: () => seq(string('x'), regexp(upperTextRegex)).map(([_x, result]) => inscribedLetter(result)),

  indexDigit: () => oneOf('1234567890x').lookahead(end)
    .map((result) => result === 'x' ? 'ₓ' : result),


  contentOfMultiStringContent: r => alt<MultiStringContent>(
    r.corrections,
    r.damages,
    r.inscribedLetter,
    // TODO: r.indexDigit,
    r.hittite,
  ),

  simpleWordContent: r => alt<AOSimpleWordContent>(
    r.contentOfMultiStringContent,
    r.ellipsis,
    r.sign,
    r.footNote,
    r.kolonMark,
    // Do not change order of parsers!
    alt(r.determinativ, r.materLectionis,/* r.subscriptNumeralContent,*/ r.numeralContent),
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
    r.illegible.result([aoIllegibleContent]),
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
