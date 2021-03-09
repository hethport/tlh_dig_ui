import {MarkType} from "../model/markContent";
import {DamageContent, DamageType} from "../model/damages";
import {CorrectionContent, CorrectionType} from "../model/corrections";
import {WordContent} from "../model/oldTransliteration";
import {Determinativ, MaterLectionis, StringContent} from "../model/stringContent";

export const illegibleContent: WordContent = {};

export const de: DamageContent = new DamageContent(DamageType.DeletionEnd);
export const ds: DamageContent = new DamageContent(DamageType.DeletionStart);
export const le: DamageContent = new DamageContent(DamageType.LesionEnd);
export const ls: DamageContent = new DamageContent(DamageType.LesionStart);
export const supE: DamageContent = new DamageContent(DamageType.SupplementEnd);
export const supS: DamageContent = new DamageContent(DamageType.SupplementStart);
export const ue: DamageContent = new DamageContent(DamageType.UnknownDamageEnd);
export const us: DamageContent = new DamageContent(DamageType.UnknownDamageStart);
export const r: DamageContent = new DamageContent(DamageType.Rasure);

export const el: CorrectionContent = new CorrectionContent(CorrectionType.Ellipsis);
export const pe: CorrectionContent = new CorrectionContent(CorrectionType.ParagraphEnd);
export const uc: CorrectionContent = new CorrectionContent(CorrectionType.UnsureCorrection);
export const sc: CorrectionContent = new CorrectionContent(CorrectionType.SureCorrection);
export const dpe: CorrectionContent = new CorrectionContent(CorrectionType.DoubleParagraphEnd);

export const S = MarkType.Sign;
export const G = MarkType.TextGap;
export const K = MarkType.Colon;
export const F = MarkType.FootNote

export function determinativ(content: string): StringContent {
  return new Determinativ(content);
}

export function materLectionis(content: string): StringContent {
  return new MaterLectionis(content);
}