interface ICorrection {
    type: 'Correction';
    subType: 'UnsureCorrection' | 'MaybeUnsureCorrection' | 'SureCorrection' | 'SicCorrection';
    symbol: string;
}

export const UnsureCorrection: ICorrection = {type: 'Correction', subType: 'UnsureCorrection', symbol: '?'};

export const MaybeUnsureCorrection: ICorrection = {type: 'Correction', subType: 'MaybeUnsureCorrection', symbol: '(?)'};

export const SureCorrection: ICorrection = {type: 'Correction', subType: 'SureCorrection', symbol: '!'};

export const SicCorrection: ICorrection = {type: 'Correction', subType: 'SicCorrection', symbol: 'sic'};


export const allCorrections = [UnsureCorrection, MaybeUnsureCorrection, SureCorrection, SicCorrection];

export type Corrections =
    typeof UnsureCorrection
    | typeof MaybeUnsureCorrection
    | typeof SureCorrection
    | typeof SicCorrection;