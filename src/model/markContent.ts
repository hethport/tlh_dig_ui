import {MarkContentInput, MarkType} from "../generated/graphql";

export function markContent(markType: MarkType, content: string): MarkContentInput {
  return {type: markType, content};
}
