import {CorrectionType, DamageType, MarkType} from "../generated/graphql";
import {TransliterationWord, TransliterationWordParseResult} from "../model/transliterationTextLineParseResult";

export const de = DamageType.DeletionEnd;
export const ds = DamageType.DeletionStart;
export const le = DamageType.LesionEnd;
export const ls = DamageType.LesionStart;
export const supE = DamageType.SupplementEnd;
export const supS = DamageType.SupplementStart;
export const ue = DamageType.UnknownDamageEnd;
export const us = DamageType.UnknownDamageStart;
export const r = DamageType.Rasure;

export const el = CorrectionType.Ellipsis;
export const pe = CorrectionType.ParagraphEnd;
export const uc = CorrectionType.UnsureCorrection;
export const sc = CorrectionType.SureCorrection;

export const S = MarkType.Sign;
export const G = MarkType.TextGap;
export const K = MarkType.Colon;
export const F = MarkType.FootNote


export function wordResult(wordInput: string, word?: TransliterationWord): TransliterationWordParseResult {
  return word ? {wordInput, result: word} : {wordInput};
}