import {DamageType} from "../generated/graphql";
import {TransliterationWordContent} from "./transliterationTextLine";

export const allDamageTypes: DamageType[] = [
  DamageType.DeletionStart, DamageType.DeletionEnd,
  DamageType.LesionStart, DamageType.LesionEnd,
  DamageType.Rasure,
  DamageType.SurplusStart, DamageType.SurplusEnd,
  DamageType.SupplementStart, DamageType.SupplementEnd,
  DamageType.UnknownDamageStart, DamageType.UnknownDamageEnd
];

export function xmlifyDamage(damageType: DamageType): string {
  switch (damageType) {
    case DamageType.DeletionEnd:
      return '<del_fin/>';
    case DamageType.DeletionStart:
      return '<del_in/>';
    case DamageType.LesionEnd:
      return '<laes_fin/>';
    case DamageType.LesionStart:
      return '<laes_in/>';
    case DamageType.Rasure:
      return '<ras_fin/>';
    case DamageType.Rasure:
      return '<ras_in/>';
    case DamageType.SupplementEnd:
      return '<sup_fin/>';
    case DamageType.SupplementStart:
      return '<sup_in/>';
    case DamageType.SurplusEnd:
      return '<sur_fin/>';
    case DamageType.SurplusStart:
      return '<sur_in/>';
    case DamageType.UnknownDamageEnd:
      return '<ub_fin/>';
    case DamageType.UnknownDamageStart:
      return '<ub_in/>';
  }
}

export function getSymbolForDamageType(damageType: DamageType): string {
  switch (damageType) {
    case DamageType.DeletionEnd:
      return ']';
    case DamageType.DeletionStart:
      return '[';
    case DamageType.LesionEnd:
      return '⸣';
    case DamageType.LesionStart:
      return '⸢';
    case DamageType.Rasure:
      return '*';
    case DamageType.SupplementEnd:
      return '〉';
    case DamageType.SupplementStart:
      return '〈';
    case DamageType.SurplusEnd:
      return '〉〉';
    case DamageType.SurplusStart:
      return '〈〈';
    case DamageType.UnknownDamageEnd:
      return ')';
    case DamageType.UnknownDamageStart:
      return '(';
  }
}

export function isDamage(twc: TransliterationWordContent): twc is DamageType {
  return !!allDamageTypes.find((d) => d === twc);
}
