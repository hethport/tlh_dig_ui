import {alt, oneOf, Parser, regexp, seq, string} from "parsimmon";
import {upperTextRegex} from "../transliterationParser/parserHelpers";
import {WordContent} from "./oldTransliteration";

export interface StringContent {
  type: 'Determinativ' | 'MaterLectionis';
  content: string;
}

export function isStringContent(w: WordContent): w is StringContent {
  return typeof w !== 'string' && 'type' in w && (w.type === 'Determinativ' || w.type === 'MaterLectionis');
}

export function xmlifyStringContent({type, content}: StringContent): string {
  const tag = type === 'Determinativ' ? 'dt' : 'ml';

  return `<${tag}>${content}</${tag}>`;
}

export function cssClassForStringContent({type}: StringContent): string {
  return type === 'Determinativ' ? 'determinativ' : 'materLectionis';
}

/**
 * Mater lectionis:
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export function materLectionis(content: string): StringContent {
  return {type: 'MaterLectionis', content};
}

/*
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - auch °m°, °m.[...]°, °f° und °f.[...]° sind Determinative!
 */
export function determinativ(content: string): StringContent {
  return {type: 'Determinativ', content};
}

const defaultDeterminativParser: Parser<StringContent> = alt(regexp(upperTextRegex), oneOf('.'))
  .atLeast(1)
  .tie()
  .map((content) => determinativ(content));

const specialDeterminativParser: Parser<StringContent> = seq(
  alt(string('m'), string('f')),
  string('.'),
  regexp(upperTextRegex),
).map(([genus, dot, rest]) => determinativ(genus + dot + rest))

export const determinativParser: Parser<StringContent> = seq(
  string('°'),
  alt(
    defaultDeterminativParser,
    specialDeterminativParser
  ),
  string('°')
).map(([_deg1, content, _deg2]) => content);
