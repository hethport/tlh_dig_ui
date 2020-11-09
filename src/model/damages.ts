interface IDamage {
    type: 'DeletionStart' | 'DeletionEnd' | 'LesionStart' | 'LesionEnd' | 'RasureStart' | 'RasureEnd';
    symbol: string;
}

export const DeletionStart: IDamage = {type: 'DeletionStart', symbol: '['};
export const DeletionEnd: IDamage = {type: 'DeletionEnd', symbol: ']'};

export const LesionStart: IDamage = {type: 'LesionStart', symbol: '('};
export const LesionEnd: IDamage = {type: 'LesionEnd', symbol: ')'};

export const RasureStart: IDamage = {type: 'RasureStart', symbol: '⸢'};
export const RasureEnd: IDamage = {type: 'RasureEnd', symbol: '⸣'};

export const allDamages = [DeletionStart, DeletionEnd, LesionStart, LesionEnd, RasureStart, RasureEnd];
export type Damages =
    typeof DeletionStart
    | typeof DeletionEnd
    | typeof LesionStart
    | typeof LesionEnd
    | typeof RasureStart
    | typeof RasureEnd;