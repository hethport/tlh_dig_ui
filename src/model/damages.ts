interface IDamage {
    type: 'Deletion' | 'Lesion' | 'Rasure' | 'Surplus' | 'Supplement' | 'UnknownDamage';
    position: 'Start' | 'End';
    symbol: string;
}

export const DeletionStart: IDamage = {type: 'Deletion', position: 'Start', symbol: '['};
export const DeletionEnd: IDamage = {type: 'Deletion', position: 'End', symbol: ']'};

export const LesionStart: IDamage = {type: 'Lesion', position: 'Start', symbol: '⸢'};
export const LesionEnd: IDamage = {type: 'Lesion', position: 'End', symbol: '⸣'};

export const RasureStart: IDamage = {type: 'Rasure', position: 'Start', symbol: '*'};
export const RasureEnd: IDamage = {type: 'Rasure', position: 'End', symbol: '*'};

export const SurplusStart: IDamage = {type: 'Surplus', position: 'Start', symbol: '〈〈'};
export const SurplusEnd: IDamage = {type: 'Surplus', position: 'End', symbol: '〉〉'};

export const SupplementStart: IDamage = {type: 'Supplement', position: 'Start', symbol: '〈'};
export const SupplementEnd: IDamage = {type: 'Supplement', position: 'End', symbol: '〉'};

export const UnknownBracketStart: IDamage = {type: 'UnknownDamage', position: 'Start', symbol: '('};
export const UnknownBracketEnd: IDamage = {type: 'UnknownDamage', position: 'End', symbol: ')'};

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