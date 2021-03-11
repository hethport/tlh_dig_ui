import {alt, Parser, regex, regexp, string} from "parsimmon";
import {WordContent} from "./oldTransliteration";

export interface DamageContent {
  type: 'Damage';
  damageType: DamageType;
}

export function damageContent(damageType: DamageType): DamageContent {
  return {type: 'Damage', damageType};
}

export function isDamageContent(w: WordContent): w is DamageContent {
  return typeof w !== 'string' && 'type' in w && w.type === 'Damage';
}

export function xmlifyDamageContent({damageType}: DamageContent): string {
  return xmlifyDamage(damageType);
}

export enum DamageType {
  DeletionStart = 'DeletionStart',
  DeletionEnd = 'DeletionEnd',
  LesionStart = 'LesionStart',
  LesionEnd = 'LesionEnd',
  Rasure = 'Rasure',
  SurplusStart = 'SurplusStart',
  SurplusEnd = 'SurplusEnd',
  SupplementStart = 'SupplementStart',
  SupplementEnd = 'SupplementEnd',
  UnknownDamageStart = 'UnknownDamageStart',
  UnknownDamageEnd = 'UnknownDamageEnd'
}

export const damageTypeParser: Parser<DamageContent> = alt(
  string('[').result(DamageType.DeletionStart),
  string(']').result(DamageType.DeletionEnd),
  string('⸢').result(DamageType.LesionStart),
  string('⸣').result(DamageType.LesionEnd),
  string('*').result(DamageType.Rasure),
  regexp(/[〈<]{2}/).result(DamageType.SurplusStart),
  regexp(/[〉>]{2}/).result(DamageType.SurplusEnd),
  regexp(/[〈<]/).result(DamageType.SupplementStart),
  regex(/[〉>]/).result(DamageType.SupplementEnd),
  string('(').result(DamageType.UnknownDamageStart),
  string(')').result(DamageType.UnknownDamageEnd),
).map(damageContent);

function xmlifyDamage(damageType: DamageType): string {
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

