import {alt, oneOf, Parser, regexp, seq, string} from "parsimmon";
import {akkadogramm, determinativ, hittite, materLectionis, sumerogramm} from "../model/stringContent";
import {StringContentInput} from "../generated/graphql";

export const upperTextRegex: RegExp = /\p{Lu}+/u;

export const lowerTextRegex: RegExp = /\p{Ll}+/u;

function materLectionisThatIsActuallyDeterminatives(ml: string): boolean {
  return ml === 'm' || ml === 'f' || ml.startsWith('m.') || ml.startsWith('f.');
}

export const hittiteParser: Parser<StringContentInput> =
  alt(
    regexp(lowerTextRegex),
    string('-').notFollowedBy(string('-')),
    oneOf('×ₓ')
  )
    .atLeast(1)
    .tie()
    .map(hittite)

/**
 * Akadogramm: automatisch für Zeichen in VERSALIEN, denen ein `-` oder `_` vorausgeht
 */
export const akkadogrammParser: Parser<StringContentInput> = seq(
  oneOf('_-').map((res) => res === '_' ? '' : '-'),
  alt(regexp(upperTextRegex), oneOf('-×ₓ')).atLeast(1).tie()
).map(([start, result]) => akkadogramm(start + result));

/**
 * Sumerogramm:
 * - automatisch für Versalien
 * - im Wortinnern durch vorausgehendes `--` markiert
 */
export const sumerogrammParser: Parser<StringContentInput> = seq(
  string('--').times(0, 1),
  alt(regexp(upperTextRegex), oneOf('.×ₓ')).atLeast(1).tie()
).map(([_1, result]) => sumerogramm(result));

/**
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - bei mehreren Determinativen nacheinander Doppelsetzung (°°.°°)
 */
export const determinativParser: Parser<StringContentInput> = seq(
  string('°'),
  alt(regexp(upperTextRegex), oneOf('.')).atLeast(1).tie(),
  string('°')
).map(([_degSym1, content, _degSym2]) => determinativ(content));

/**
 * Mater lectionis:
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export const materLectionisParser: Parser<StringContentInput> = seq(
  string('°'),
  alt(regexp(lowerTextRegex), string('.')).atLeast(1).tie(),
  string('°'),
).map(([_degSym1, result, _degSym2]) => materLectionisThatIsActuallyDeterminatives(result) ? determinativ(result) : materLectionis(result));

