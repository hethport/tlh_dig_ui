import {
  CorrectionType,
  DamageType,
  MarkType,
  TransliterationWordContentInputUnion,
  TransliterationWordInput
} from "../generated/graphql";
import {TransliterationWordParseResult} from "../model/transliterationTextLineParseResult";
import {akkadogramm, determinativ, hittite, materLectionis, sumerogramm} from "../model/stringContent";
import {markContent} from "../model/markContent";
import {numeralContent} from "./parser";

export const de: TransliterationWordContentInputUnion = {damageContent: DamageType.DeletionEnd};
export const ds: TransliterationWordContentInputUnion = {damageContent: DamageType.DeletionStart};
export const le: TransliterationWordContentInputUnion = {damageContent: DamageType.LesionEnd};
export const ls: TransliterationWordContentInputUnion = {damageContent: DamageType.LesionStart};
export const supE: TransliterationWordContentInputUnion = {damageContent: DamageType.SupplementEnd};
export const supS: TransliterationWordContentInputUnion = {damageContent: DamageType.SupplementStart};
export const ue: TransliterationWordContentInputUnion = {damageContent: DamageType.UnknownDamageEnd};
export const us: TransliterationWordContentInputUnion = {damageContent: DamageType.UnknownDamageStart};
export const r: TransliterationWordContentInputUnion = {damageContent: DamageType.Rasure};

export const el: TransliterationWordContentInputUnion = {correctionContent: CorrectionType.Ellipsis};
export const pe: TransliterationWordContentInputUnion = {correctionContent: CorrectionType.ParagraphEnd};
export const uc: TransliterationWordContentInputUnion = {correctionContent: CorrectionType.UnsureCorrection};
export const sc: TransliterationWordContentInputUnion = {correctionContent: CorrectionType.SureCorrection};

export const S = MarkType.Sign;
export const G = MarkType.TextGap;
export const K = MarkType.Colon;
export const F = MarkType.FootNote


export function wordResult(wordInput: string, word?: TransliterationWordInput): TransliterationWordParseResult {
  return word ? {wordInput, result: word} : {wordInput};
}

export function hittiteContentUnion(content: string): TransliterationWordContentInputUnion {
  return {stringContent: hittite(content)}
}

export function sumerogrammContentUnion(content: string): TransliterationWordContentInputUnion {
  return {stringContent: sumerogramm(content)};
}

export function determinativContentUnion(content: string): TransliterationWordContentInputUnion {
  return {stringContent: determinativ(content)};
}

export function akkadogrammContentUnion(content: string): TransliterationWordContentInputUnion {
  return {stringContent: akkadogramm(content)};
}

export function materLectionisContentUnion(content: string): TransliterationWordContentInputUnion {
  return {stringContent: materLectionis(content)};
}

export function markContentUnion(markType: MarkType, content: string): TransliterationWordContentInputUnion {
  return {markContent: markContent(markType, content)};
}

export function numeralContentUnion(content: string, isSubscript: boolean = false): TransliterationWordContentInputUnion {
  return {numeralContent: numeralContent(content, isSubscript)}
}