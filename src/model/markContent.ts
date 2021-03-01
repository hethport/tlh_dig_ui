import {MarkContent, MarkContentInput, MarkType} from "../generated/graphql";
import {TransliterationWordContent} from "./transliterationTextLineParseResult";

export function markContent(markType: MarkType, content: string): MarkContentInput {
  return {type: markType, content};
}

export function isMarkContent(t: TransliterationWordContent): t is MarkContent {
  return typeof (t) !== 'string' && 'type' in t && (
    t.type === MarkType.TextGap ||
    t.type === MarkType.FootNote ||
    t.type === MarkType.Colon ||
    t.type === MarkType.Sign ||
    t.type === MarkType.Arbitrary);
}