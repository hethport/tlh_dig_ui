import {DamagePositionEnum, DamageTypeEnum} from "../generated/graphql";

interface IDamage {
    type: DamageTypeEnum;
    position: DamagePositionEnum;
    symbol: string;
    node: string;
    regex?: RegExp;
}

export const DeletionStart: IDamage = {
    type: DamageTypeEnum.Deletion,
    position: DamagePositionEnum.Start,
    symbol: '[',
    node: '<del_in/>'
};
export const DeletionEnd: IDamage = {
    type: DamageTypeEnum.Deletion,
    position: DamagePositionEnum.End,
    symbol: ']',
    node: '<del_fin/>'
};

export const LesionStart: IDamage = {
    type: DamageTypeEnum.Lesion,
    position: DamagePositionEnum.Start,
    symbol: '⸢',
    node: '<laes_in/>'
};
export const LesionEnd: IDamage = {
    type: DamageTypeEnum.Lesion,
    position: DamagePositionEnum.End,
    symbol: '⸣',
    node: '<laes_fin/>'
};

export const RasureStart: IDamage = {
    type: DamageTypeEnum.Rasure,
    position: DamagePositionEnum.Start,
    symbol: '*',
    node: '<ras_in/>'
};
export const RasureEnd: IDamage = {
    type: DamageTypeEnum.Rasure,
    position: DamagePositionEnum.End,
    symbol: '*',
    node: '<ras_fin/>'
};

export const SurplusStart: IDamage = {
    type: DamageTypeEnum.Surplus,
    position: DamagePositionEnum.Start,
    symbol: '〈〈',
    node: '<sur_in/>',
    regex: /[〈<]{2}/
};
export const SurplusEnd: IDamage = {
    type: DamageTypeEnum.Surplus,
    position: DamagePositionEnum.End,
    symbol: '〉〉',
    node: '<sur_fin/>',
    regex: /[〉>]{2}/
};

export const SupplementStart: IDamage = {
    type: DamageTypeEnum.Supplement,
    position: DamagePositionEnum.Start,
    symbol: '〈',
    node: '<sup_in/>',
    regex: /[〈<]/
};
export const SupplementEnd: IDamage = {
    type: DamageTypeEnum.Supplement,
    position: DamagePositionEnum.End,
    symbol: '〉',
    node: '<sup_fin/>',
    regex: /[〉>]/
};

export const UnknownBracketStart: IDamage = {
    type: DamageTypeEnum.UnknownDamage,
    position: DamagePositionEnum.Start,
    symbol: '(',
    node: '<ub_in/>'
};
export const UnknownBracketEnd: IDamage = {
    type: DamageTypeEnum.UnknownDamage,
    position: DamagePositionEnum.End,
    symbol: ')',
    node: '<ub_fin/>'
};

export const allDamages = [
    DeletionStart, DeletionEnd,
    LesionStart, LesionEnd,
    RasureStart, RasureEnd,
    SurplusStart, SurplusEnd,
    SupplementStart, SupplementEnd,
    UnknownBracketStart, UnknownBracketEnd
];

export type Damages = typeof DeletionStart | typeof DeletionEnd
    | typeof LesionStart | typeof LesionEnd
    | typeof RasureStart | typeof RasureEnd
    | typeof SurplusStart | typeof SurplusEnd
    | typeof SupplementStart | typeof SupplementStart
    | typeof UnknownBracketStart | typeof UnknownBracketEnd;