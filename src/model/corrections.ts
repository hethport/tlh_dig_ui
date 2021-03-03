import {CorrectionType} from '../generated/graphql';
import {alt, Parser, string} from "parsimmon";

export const correctionTypeParser: Parser<CorrectionType> = alt(
  string('?').result(CorrectionType.UnsureCorrection),
  string('(?)').result(CorrectionType.MaybeUnsureCorrection),
  string('!').result(CorrectionType.SureCorrection),
  string('sic').result(CorrectionType.SicCorrection),
  string('…').result(CorrectionType.Ellipsis),
  // Double paragraph end
  string('§§').result(CorrectionType.DoubleParagraphEnd),
  string('===').result(CorrectionType.DoubleParagraphEnd),
  // Paragraph end
  string('§').result(CorrectionType.ParagraphEnd),
  string('¬¬¬').result(CorrectionType.ParagraphEnd),
);

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
    case CorrectionType.DoubleParagraphEnd:
      return '===';
  }
}
