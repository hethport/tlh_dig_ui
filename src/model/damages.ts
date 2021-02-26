import {DamageTypeEnum} from "../generated/graphql";
import {TransliterationWordContent} from "./transliterationTextLine";

export const allDamageTypes: DamageTypeEnum[] = [
  DamageTypeEnum.DeletionStart, DamageTypeEnum.DeletionEnd,
  DamageTypeEnum.LesionStart, DamageTypeEnum.LesionEnd,
  DamageTypeEnum.Rasure,
  DamageTypeEnum.SurplusStart, DamageTypeEnum.SurplusEnd,
  DamageTypeEnum.SupplementStart, DamageTypeEnum.SupplementEnd,
  DamageTypeEnum.UnknownDamageStart, DamageTypeEnum.UnknownDamageEnd
];

export function xmlifyDamage(damageType: DamageTypeEnum): string {
  switch (damageType) {
    case DamageTypeEnum.DeletionEnd:
      return '<del_fin/>';
    case DamageTypeEnum.DeletionStart:
      return '<del_in/>';
    case DamageTypeEnum.LesionEnd:
      return '<laes_fin/>';
    case DamageTypeEnum.LesionStart:
      return '<laes_in/>';
    case DamageTypeEnum.Rasure:
      return '<ras_fin/>';
    case DamageTypeEnum.Rasure:
      return '<ras_in/>';
    case DamageTypeEnum.SupplementEnd:
      return '<sup_fin/>';
    case DamageTypeEnum.SupplementStart:
      return '<sup_in/>';
    case DamageTypeEnum.SurplusEnd:
      return '<sur_fin/>';
    case DamageTypeEnum.SurplusStart:
      return '<sur_in/>';
    case DamageTypeEnum.UnknownDamageEnd:
      return '<ub_fin/>';
    case DamageTypeEnum.UnknownDamageStart:
      return '<ub_in/>';
  }
}

export function getSymbolForDamageType(damageType: DamageTypeEnum): string {
  switch (damageType) {
    case DamageTypeEnum.DeletionEnd:
      return ']';
    case DamageTypeEnum.DeletionStart:
      return '[';
    case DamageTypeEnum.LesionEnd:
      return '⸣';
    case DamageTypeEnum.LesionStart:
      return '⸢';
    case DamageTypeEnum.Rasure:
      return '*';
    case DamageTypeEnum.SupplementEnd:
      return '〉';
    case DamageTypeEnum.SupplementStart:
      return '〈';
    case DamageTypeEnum.SurplusEnd:
      return '〉〉';
    case DamageTypeEnum.SurplusStart:
      return '〈〈';
    case DamageTypeEnum.UnknownDamageEnd:
      return ')';
    case DamageTypeEnum.UnknownDamageStart:
      return '(';
  }
}

export function isDamage(twc: TransliterationWordContent): twc is DamageTypeEnum {
  return !!allDamageTypes.find((d) => d === twc);
}
