import {CorrectionType, DamageType, MarkType, WordContentInputUnion} from "../generated/graphql";
import {akkadogramm, determinativ, hittite, materLectionis, sumerogramm} from "../model/stringContent";
import {markContent} from "../model/markContent";
import {numeralContent} from "./parser";

export const xContent: WordContentInputUnion = {xContent: {}};

export const de: WordContentInputUnion = {damageContent: DamageType.DeletionEnd};
export const ds: WordContentInputUnion = {damageContent: DamageType.DeletionStart};
export const le: WordContentInputUnion = {damageContent: DamageType.LesionEnd};
export const ls: WordContentInputUnion = {damageContent: DamageType.LesionStart};
export const supE: WordContentInputUnion = {damageContent: DamageType.SupplementEnd};
export const supS: WordContentInputUnion = {damageContent: DamageType.SupplementStart};
export const ue: WordContentInputUnion = {damageContent: DamageType.UnknownDamageEnd};
export const us: WordContentInputUnion = {damageContent: DamageType.UnknownDamageStart};
export const r: WordContentInputUnion = {damageContent: DamageType.Rasure};

export const el: WordContentInputUnion = {correctionContent: CorrectionType.Ellipsis};
export const pe: WordContentInputUnion = {correctionContent: CorrectionType.ParagraphEnd};
export const uc: WordContentInputUnion = {correctionContent: CorrectionType.UnsureCorrection};
export const sc: WordContentInputUnion = {correctionContent: CorrectionType.SureCorrection};
export const dpe: WordContentInputUnion = {correctionContent: CorrectionType.DoubleParagraphEnd};

export const S = MarkType.Sign;
export const G = MarkType.TextGap;
export const K = MarkType.Colon;
export const F = MarkType.FootNote


export function hittiteContentUnion(content: string): WordContentInputUnion {
  return {stringContent: hittite(content)}
}

export function sumerogrammContentUnion(content: string): WordContentInputUnion {
  return {stringContent: sumerogramm(content)};
}

export function determinativContentUnion(content: string): WordContentInputUnion {
  return {stringContent: determinativ(content)};
}

export function akkadogrammContentUnion(content: string): WordContentInputUnion {
  return {stringContent: akkadogramm(content)};
}

export function materLectionisContentUnion(content: string): WordContentInputUnion {
  return {stringContent: materLectionis(content)};
}

export function markContentUnion(markType: MarkType, content: string): WordContentInputUnion {
  return {markContent: markContent(markType, content)};
}

export function numeralContentUnion(content: string, isSubscript: boolean = false): WordContentInputUnion {
  return {numeralContent: numeralContent(content, isSubscript)}
}