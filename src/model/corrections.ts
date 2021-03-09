import {alt, Parser, string} from "parsimmon";

export class CorrectionContent {
  constructor(public correctionType: CorrectionType) {
  }
}

export enum CorrectionType {
  UnsureCorrection = 'UnsureCorrection',
  MaybeUnsureCorrection = 'MaybeUnsureCorrection',
  SureCorrection = 'SureCorrection',
  SicCorrection = 'SicCorrection',
  Ellipsis = 'Ellipsis',
  ParagraphEnd = 'ParagraphEnd',
  DoubleParagraphEnd = 'DoubleParagraphEnd'
}

export const correctionTypeParser: Parser<CorrectionContent> = alt(
  string('?').result(CorrectionType.UnsureCorrection),
  string('(?)').result(CorrectionType.MaybeUnsureCorrection),
  string('!').result(CorrectionType.SureCorrection),
  string('sic').result(CorrectionType.SicCorrection),
  alt(string('…'), string('...')).result(CorrectionType.Ellipsis),
  alt(string('§§'), string('===')).result(CorrectionType.DoubleParagraphEnd),
  alt(string('§'), string('¬¬¬')).result(CorrectionType.ParagraphEnd),
).map((correctionType) => new CorrectionContent(correctionType));

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
