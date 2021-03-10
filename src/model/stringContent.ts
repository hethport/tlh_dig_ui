import {alt, oneOf, Parser, regexp, seq, string} from "parsimmon";
import {upperTextRegex} from "../transliterationParser/parserHelpers";

export abstract class StringContent {
  constructor(public content: string) {
  }

  protected abstract getTag(): string;

  abstract cssClass(): string ;

  xmlify(): string {
    return `<${this.getTag()}>${this.content}</${this.getTag()}>`;
  }
}

/**
 * Mater lectionis:
 * vor und nach der Mater Lectionis (Kleinbuchstaben markiert durch ° … °; davor oder dahinter jeweils ein Spatium oder Bindestrich)
 */
export class MaterLectionis extends StringContent {
  protected getTag(): string {
    return 'ml';
  }

  cssClass(): string {
    return 'materLectionis';
  }
}

/*
 * Determinativ:
 * - automatisch für Großbuchstaben markiert durch ° … ° (davor oder dahinter jeweils ein Spatium oder Bindestrich)
 * - auch °m°, °m.[...]°, °f° und °f.[...]° sind Determinative!
 */
export class Determinativ extends StringContent {
  protected getTag(): string {
    return 'dt';
  }

  cssClass(): string {
    return 'determinativ';
  }
}

const defaultDeterminativParser: Parser<StringContent> = seq(
  alt(regexp(upperTextRegex), oneOf('.')).atLeast(1).tie(),
).map(([content]) => new Determinativ(content));

const specialDeterminativParser: Parser<StringContent> = seq(
  alt(string('m'), string('f')),
  string('.'),
  regexp(upperTextRegex),
).map(([genus, dot, rest]) => new Determinativ(genus + dot + rest))

export const determinativParser: Parser<StringContent> = seq(
  string('°'),
  alt(
    defaultDeterminativParser,
    specialDeterminativParser
  ),
  string('°')
).map(([_deg1, content, _deg2]) => content);
