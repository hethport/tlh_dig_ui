import {CorrectionType, DamageTypeEnum} from "../generated/graphql";

export const de = DamageTypeEnum.DeletionEnd;
export const ds = DamageTypeEnum.DeletionStart;
export const le = DamageTypeEnum.LesionEnd;
export const ls = DamageTypeEnum.LesionStart;
export const supE = DamageTypeEnum.SupplementEnd;
export const supS = DamageTypeEnum.SupplementStart;
export const ue = DamageTypeEnum.UnknownDamageEnd;
export const us = DamageTypeEnum.UnknownDamageStart;

export const el = CorrectionType.Ellipsis;
export const pe = CorrectionType.ParagraphEnd;
export const uc = CorrectionType.UnsureCorrection;
