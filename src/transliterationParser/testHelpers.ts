import {MarkType} from "../model/markContent";
import {DamageType} from "../model/damages";
import {CorrectionType} from "../model/corrections";
import {WordContent} from "../model/oldTransliteration";

export const illegibleContent: WordContent = {};

export const de: DamageType = DamageType.DeletionEnd;
export const ds: DamageType = DamageType.DeletionStart;
export const le: DamageType = DamageType.LesionEnd;
export const ls: DamageType = DamageType.LesionStart;
export const supE: DamageType = DamageType.SupplementEnd;
export const supS: DamageType = DamageType.SupplementStart;
export const ue: DamageType = DamageType.UnknownDamageEnd;
export const us: DamageType = DamageType.UnknownDamageStart;
export const r: DamageType = DamageType.Rasure;

export const el: CorrectionType = CorrectionType.Ellipsis;
export const pe: CorrectionType = CorrectionType.ParagraphEnd;
export const uc: CorrectionType = CorrectionType.UnsureCorrection;
export const sc: CorrectionType = CorrectionType.SureCorrection;
export const dpe: CorrectionType = CorrectionType.DoubleParagraphEnd;

export const S = MarkType.Sign;
export const G = MarkType.TextGap;
export const K = MarkType.Colon;
export const F = MarkType.FootNote

