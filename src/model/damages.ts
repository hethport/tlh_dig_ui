import {DamageTypeEnum} from "../generated/graphql";
import {TransliterationWordContent} from "./transliterationTextLine";

interface IDamage {
    type: DamageTypeEnum;
    symbol: string;
    regex?: RegExp;
}

export const DeletionStart: IDamage = {
    type: DamageTypeEnum.DeletionStart,
    symbol: '[',
};

export const DeletionEnd: IDamage = {
    type: DamageTypeEnum.DeletionEnd,
    symbol: ']',
};

export const LesionStart: IDamage = {
    type: DamageTypeEnum.LesionStart,
    symbol: '⸢',
};
export const LesionEnd: IDamage = {
    type: DamageTypeEnum.LesionEnd,
    symbol: '⸣',
};

export const RasureStart: IDamage = {
    type: DamageTypeEnum.RasureStart,
    symbol: '*',
};

export const RasureEnd: IDamage = {
    type: DamageTypeEnum.RasureEnd,
    symbol: '*',
};

export const SurplusStart: IDamage = {
    type: DamageTypeEnum.SurplusStart,
    symbol: '〈〈',
    regex: /[〈<]{2}/
};

export const SurplusEnd: IDamage = {
    type: DamageTypeEnum.SurplusEnd,
    symbol: '〉〉',
    regex: /[〉>]{2}/
};

export const SupplementStart: IDamage = {
    type: DamageTypeEnum.SupplementStart,
    symbol: '〈',
    regex: /[〈<]/
};
export const SupplementEnd: IDamage = {
    type: DamageTypeEnum.SupplementEnd,
    symbol: '〉',
    regex: /[〉>]/
};

export const UnknownBracketStart: IDamage = {
    type: DamageTypeEnum.UnknownDamageStart,
    symbol: '(',
};
export const UnknownBracketEnd: IDamage = {
    type: DamageTypeEnum.UnknownDamageEnd,
    symbol: ')'
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

export function isDamage(twc: TransliterationWordContent): twc is Damages {
    return !!allDamages.find((d) => d === twc);
}

export type Damages = typeof DeletionStart | typeof DeletionEnd
    | typeof LesionStart | typeof LesionEnd
    | typeof RasureStart | typeof RasureEnd
    | typeof SurplusStart | typeof SurplusEnd
    | typeof SupplementStart | typeof SupplementStart
    | typeof UnknownBracketStart | typeof UnknownBracketEnd;