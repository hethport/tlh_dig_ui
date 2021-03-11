import {alt, oneOf, Parser, regexp, seq, string} from "parsimmon";
import {determinativ, materLectionis, StringContent} from "../model/stringContent";
import {lowerTextRegex} from './parserHelpers';

function materLectionisThatIsActuallyDeterminatives(ml: string): boolean {
  return ml === 'm' || ml === 'f' || ml.startsWith('m.') || ml.startsWith('f.');
}
export const hittiteParser: Parser<string> =
  alt(
    regexp(lowerTextRegex),
    string('-').notFollowedBy(string('-')),
    oneOf('×ₓ')
  ).atLeast(1).tie()

/**
 * Mater lectionis:
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export const materLectionisParser: Parser<StringContent> =
  seq(
    string('°'),
    alt(regexp(lowerTextRegex), string('.')).atLeast(1).tie(),
    string('°'),
  )
    .map(([_degSym1, result, _degSym2]) =>
      materLectionisThatIsActuallyDeterminatives(result)
        ? determinativ(result)
        : materLectionis(result)
    );
