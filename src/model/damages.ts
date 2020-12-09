import {DamagePositionEnum, DamageTypeEnum} from "../generated/graphql";

interface IDamage {
    type: DamageTypeEnum;
    position: DamagePositionEnum;
    symbol: string;
    regex?: RegExp;
}

export const DeletionStart: IDamage = {
    type: DamageTypeEnum.Deletion,
    position: DamagePositionEnum.Start,
    symbol: '['
};
export const DeletionEnd: IDamage = {
    type: DamageTypeEnum.Deletion,
    position: DamagePositionEnum.End,
    symbol: ']'
};

export const LesionStart: IDamage = {
    type: DamageTypeEnum.Lesion,
    position: DamagePositionEnum.Start,
    symbol: '⸢'
};
export const LesionEnd: IDamage = {
    type: DamageTypeEnum.Lesion,
    position: DamagePositionEnum.End,
    symbol: '⸣'
};

export const RasureStart: IDamage = {
    type: DamageTypeEnum.Rasure,
    position: DamagePositionEnum.Start,
    symbol: '*'
};
export const RasureEnd: IDamage = {
    type: DamageTypeEnum.Rasure,
    position: DamagePositionEnum.End,
    symbol: '*'
};

export const SurplusStart: IDamage = {
    type: DamageTypeEnum.Surplus,
    position: DamagePositionEnum.Start,
    symbol: '〈〈',
    regex: /[〈<]{2}/
};
export const SurplusEnd: IDamage = {
    type: DamageTypeEnum.Surplus,
    position: DamagePositionEnum.End,
    symbol: '〉〉',
    regex: /[〉>]{2}/
};

export const SupplementStart: IDamage = {
    type: DamageTypeEnum.Supplement,
    position: DamagePositionEnum.Start,
    symbol: '〈',
    regex: /[〈<]/
};
export const SupplementEnd: IDamage = {
    type: DamageTypeEnum.Supplement,
    position: DamagePositionEnum.End,
    symbol: '〉',
    regex: /[〉>]/
};

export const UnknownBracketStart: IDamage = {
    type: DamageTypeEnum.UnknownDamage,
    position: DamagePositionEnum.Start,
    symbol: '('
};
export const UnknownBracketEnd: IDamage = {
    type: DamageTypeEnum.UnknownDamage,
    position: DamagePositionEnum.End,
    symbol: ')'
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