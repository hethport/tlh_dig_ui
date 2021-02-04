import {CorrectionType} from '../generated/graphql';
import {TransliterationWordContent} from "./transliterationTextLine";

export function symbolForCorrection(correctionType: CorrectionType): string {
    switch (correctionType) {
        case CorrectionType.Ellipsis:
            return '…';
        case CorrectionType.MaybeUnsureCorrection:
            return '(?)';
        case CorrectionType.ParagraphEnd:
            return '¬¬¬';
        case CorrectionType.SicCorrection:
            return 'sic';
        case CorrectionType.SureCorrection:
            return '!';
        case CorrectionType.UnsureCorrection:
            return '?';
    }
}

export function isCorrection(twc: TransliterationWordContent): twc is CorrectionType {
    return twc === CorrectionType.Ellipsis ||
        twc === CorrectionType.MaybeUnsureCorrection ||
        twc === CorrectionType.ParagraphEnd ||
        twc === CorrectionType.SicCorrection ||
        twc === CorrectionType.SureCorrection ||
        twc === CorrectionType.UnsureCorrection;
}

export const allCorrections = [
    CorrectionType.UnsureCorrection,
    CorrectionType.MaybeUnsureCorrection,
    CorrectionType.SureCorrection,
    CorrectionType.SicCorrection,
    CorrectionType.Ellipsis,
    CorrectionType.ParagraphEnd
];
