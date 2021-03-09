import {Maybe} from "../generated/graphql";
import {StringContent} from "./stringContent";
import {MarkContent} from "./markContent";
import {CorrectionType} from "./corrections";
import {DamageType} from "./damages";
import {MultiStringContent} from "./multiStringContent";

export interface TransliterationLine {
  lineIndex: number;
  lineInput: string;
  result?: Maybe<TransliterationLineResult>;
}

export interface TransliterationLineResult {
  lineNumber: number;
  isAbsolute: boolean;
  words: Word[];
}

export interface Word {
  input: string;
  content: WordContent[];
}

export type SimpleWordContent = StringContent
  | DamageType
  | CorrectionType
  | NumeralContent
  | MarkContent
  | IllegibleContent;

export type WordContent = MultiStringContent | SimpleWordContent;

// Numeral content

export class NumeralContent {
  constructor(public isSubscript: boolean, public  content: string) {
  }
}

export function numeralContent(content: string, isSubscript: boolean = false): NumeralContent {
  return new NumeralContent(isSubscript, content);
}

export function wordContentIsMultiStringContent(wordContent: WordContent): wordContent is MultiStringContent {
  return wordContent instanceof MultiStringContent;
}

export interface IllegibleContent {
}
