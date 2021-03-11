import {alt, Parser, string} from "parsimmon";
import {WordContent} from "./oldTransliteration";

export enum MarkType {
  Sign = 'Sign',
  TextGap = 'TextGap',
  FootNote = 'FootNote',
  Colon = 'Colon',
}

export const markTypeParser: Parser<MarkType> = alt(
  string('S').result(MarkType.Sign),
  string('G').result(MarkType.TextGap),
  string('F').result(MarkType.FootNote),
  string('K').result(MarkType.Colon),
);


export interface MarkContent {
  type: 'Mark';
  markType: MarkType;
  content: string;
}

export function isMarkContent(w: WordContent): w is MarkContent {
  return typeof w !== 'string' && 'type' in w && w.type === 'Mark';
}

export function markContent(markType: MarkType, content: string): MarkContent {
  return {type: 'Mark', markType, content};
}
