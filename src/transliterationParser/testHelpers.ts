import {MarkType} from "../model/markContent";
import {damageContent, DamageContent, DamageType} from "../model/damages";
import {correctionContent, CorrectionContent, CorrectionType} from "../model/corrections";
import {Word, WordContent} from "../model/oldTransliteration";

export const illegibleContent: WordContent = {};

export const de: DamageContent = damageContent(DamageType.DeletionEnd);
export const ds: DamageContent = damageContent(DamageType.DeletionStart);
export const le: DamageContent = damageContent(DamageType.LesionEnd);
export const ls: DamageContent = damageContent(DamageType.LesionStart);
export const supE: DamageContent = damageContent(DamageType.SupplementEnd);
export const supS: DamageContent = damageContent(DamageType.SupplementStart);
export const ue: DamageContent = damageContent(DamageType.UnknownDamageEnd);
export const us: DamageContent = damageContent(DamageType.UnknownDamageStart);
export const r: DamageContent = damageContent(DamageType.Rasure);

export const el: CorrectionContent = correctionContent(CorrectionType.Ellipsis);
export const pe: CorrectionContent = correctionContent(CorrectionType.ParagraphEnd);
export const uc: CorrectionContent = correctionContent(CorrectionType.UnsureCorrection);
export const sc: CorrectionContent = correctionContent(CorrectionType.SureCorrection);
export const dpe: CorrectionContent = correctionContent(CorrectionType.DoubleParagraphEnd);

export const S = MarkType.Sign;
export const G = MarkType.TextGap;
export const K = MarkType.Colon;
export const F = MarkType.FootNote

export function transliterationWord(input: string, ...content: WordContent[]): Word {
  return new Word(input, content);
}
