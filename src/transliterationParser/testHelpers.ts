import {CorrectionType, DamageType} from "../generated/graphql";

export const de = DamageType.DeletionEnd;
export const ds = DamageType.DeletionStart;
export const le = DamageType.LesionEnd;
export const ls = DamageType.LesionStart;
export const supE = DamageType.SupplementEnd;
export const supS = DamageType.SupplementStart;
export const ue = DamageType.UnknownDamageEnd;
export const us = DamageType.UnknownDamageStart;

export const el = CorrectionType.Ellipsis;
export const pe = CorrectionType.ParagraphEnd;
export const uc = CorrectionType.UnsureCorrection;
