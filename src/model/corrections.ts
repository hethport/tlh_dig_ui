import {alt, Parser, string} from "parsimmon";
import {WordContent} from "./oldTransliteration";

export interface CorrectionContent {
  type: 'Correction';
  correctionType: CorrectionType;
}

export function correctionContent(correctionType: CorrectionType): CorrectionContent {
  return {type: 'Correction', correctionType};
}

export function isCorrectionContent(w: WordContent): w is CorrectionContent {
  return typeof w !== 'string' && 'type' in w && w.type === 'Correction';
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
).map(correctionContent);

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
