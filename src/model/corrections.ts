import {CorrectionType} from '../generated/graphql';

interface ICorrection {
    type: 'Correction';
    subType: CorrectionType;
    symbol: string;
}

export const UnsureCorrection: ICorrection = {
    type: 'Correction',
    subType: CorrectionType.UnsureCorrection,
    symbol: '?'
};

export const MaybeUnsureCorrection: ICorrection = {
    type: 'Correction',
    subType: CorrectionType.MaybeUnsureCorrection,
    symbol: '(?)'
};

export const SureCorrection: ICorrection = {type: 'Correction', subType: CorrectionType.SureCorrection, symbol: '!'};

export const SicCorrection: ICorrection = {type: 'Correction', subType: CorrectionType.SicCorrection, symbol: 'sic'};


export const Ellipsis: ICorrection = {type: 'Correction', subType: CorrectionType.Ellipsis, symbol: '…'};


export const ParagraphEnd: ICorrection = {type: 'Correction', subType: CorrectionType.ParagraphEnd, symbol: '¬¬¬'};


export const allCorrections = [UnsureCorrection, MaybeUnsureCorrection, SureCorrection, SicCorrection, Ellipsis, ParagraphEnd];

export type Corrections =
    typeof UnsureCorrection
    | typeof MaybeUnsureCorrection
    | typeof SureCorrection
    | typeof SicCorrection
    | typeof Ellipsis
    | typeof ParagraphEnd;