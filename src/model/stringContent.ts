import {alt, oneOf, Parser, regexp, seq, string} from "parsimmon";
import {upperTextRegex} from "../transliterationParser/parserHelpers";

export enum StringContentTypeEnum {
  Determinativ = 'Determinativ',
  MaterLectionis = 'MaterLectionis',
}

export class StringContent {
  constructor(public type: StringContentTypeEnum, public content: string) {
  }
}

/**
 * Mater lectionis:
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export function materLectionis(content: string): StringContent {
  return new StringContent(StringContentTypeEnum.MaterLectionis, content);
}


/*
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - auch °m°, °m.[...]°, °f° und °f.[...]° sind Determinative!
 */

export function determinativ(content: string): StringContent {
  return new StringContent(StringContentTypeEnum.Determinativ, content);
}

const defaultDeterminativParser: Parser<StringContent> = seq(
  alt(regexp(upperTextRegex), oneOf('.')).atLeast(1).tie(),
).map(([content]) => determinativ(content));

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

// CSS class

export function classForStringContentType(stringContentType: StringContentTypeEnum): string {
  switch (stringContentType) {
    case StringContentTypeEnum.Determinativ:
      return 'determinativ';
    case StringContentTypeEnum.MaterLectionis:
      return 'materLectionis';
  }
}

// String content

export function xmlifyStringContent({type, content}: StringContent): string {
  switch (type) {
    case StringContentTypeEnum.MaterLectionis:
      return `<ml>${content}</ml>`;
    case StringContentTypeEnum.Determinativ:
      return `<dt>${content}</dt>`;
  }
}
