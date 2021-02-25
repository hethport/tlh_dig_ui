import {DamageTypeEnum} from "../generated/graphql";
import {TransliterationWordContent} from "./transliterationTextLine";

interface IDamage {
  type: DamageTypeEnum;
  /**
   * @deprecated
   */
  regex?: RegExp;
}

export const DeletionStart: IDamage = {
  type: DamageTypeEnum.DeletionStart,
};

export const DeletionEnd: IDamage = {
  type: DamageTypeEnum.DeletionEnd,
};

export const LesionStart: IDamage = {
  type: DamageTypeEnum.LesionStart
};
export const LesionEnd: IDamage = {
  type: DamageTypeEnum.LesionEnd
};

export const RasureStart: IDamage = {
  type: DamageTypeEnum.RasureStart,
};

export const RasureEnd: IDamage = {
  type: DamageTypeEnum.RasureEnd,
};

export const SurplusStart: IDamage = {
  type: DamageTypeEnum.SurplusStart,
  regex: /[〈<]{2}/
};

export const SurplusEnd: IDamage = {
  type: DamageTypeEnum.SurplusEnd,
  regex: /[〉>]{2}/
};

export const SupplementStart: IDamage = {
  type: DamageTypeEnum.SupplementStart,
  regex: /[〈<]/
};
export const SupplementEnd: IDamage = {
  type: DamageTypeEnum.SupplementEnd,
  regex: /[〉>]/
};

export const UnknownBracketStart: IDamage = {
  type: DamageTypeEnum.UnknownDamageStart
};
export const UnknownBracketEnd: IDamage = {
  type: DamageTypeEnum.UnknownDamageEnd
};

export const allDamages: Damages[] = [
  DeletionStart, DeletionEnd,
  LesionStart, LesionEnd,
  RasureStart, RasureEnd,
  SurplusStart, SurplusEnd,
  SupplementStart, SupplementEnd,
  UnknownBracketStart, UnknownBracketEnd
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
    case DamageTypeEnum.RasureEnd:
      return '<ras_fin/>';
    case DamageTypeEnum.RasureStart:
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
    case DamageTypeEnum.RasureEnd:
    case DamageTypeEnum.RasureStart:
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

export function isDamage(twc: TransliterationWordContent): twc is Damages {
  return !!allDamages.find((d) => d === twc);
}

export type Damages = typeof DeletionStart | typeof DeletionEnd
  | typeof LesionStart | typeof LesionEnd
  | typeof RasureStart | typeof RasureEnd
  | typeof SurplusStart | typeof SurplusEnd
  | typeof SupplementStart | typeof SupplementStart
  | typeof UnknownBracketStart | typeof UnknownBracketEnd;