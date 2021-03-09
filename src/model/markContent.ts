import {alt, Parser, string} from "parsimmon";

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


export class MarkContent {
  constructor(public type: MarkType, public content: string) {
  }
}

export function markContent(markType: MarkType, content: string): MarkContent {
  return new MarkContent(markType, content);
}
