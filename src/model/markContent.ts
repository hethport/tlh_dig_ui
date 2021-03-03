import {MarkContentInput, MarkType} from "../generated/graphql";
import {alt, Parser, string} from "parsimmon";

export const markTypeParser: Parser<MarkType> = alt(
  string('S').result(MarkType.Sign),
  string('G').result(MarkType.TextGap),
  string('F').result(MarkType.FootNote),
  string('K').result(MarkType.Colon),
);

export function markContent(markType: MarkType, content: string): MarkContentInput {
  return {type: markType, content};
}
