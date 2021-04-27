import {
  akkadogrammFormat,
  AOAkkadogramm,
  AOSumerogramm,
  isAkkadogramm,
  isSumerogramm,
  sumerogrammFormat
} from "./multiStringContent";
import {AONumeralContent, isNumeralContent, numeralContentFormat} from "./numeralContent";
import {AODeterminativ, determinativFormat, isDeterminativ} from "./determinativ";
import {AOMaterLectionis, isMaterLectionis, materLectionisFormat} from "./materLectionis";
import {AOCorr, aoCorrFormat, isCorrectionContent} from "../corrections";
import {
  DamageContent,
  deletionEndFormat,
  deletionStartFormat,
  isDamageContent,
  lesionEndFormat,
  lesionStartFormat,
  rasureEndFormat,
  rasureStartFormat,
  xmlifyDamageContent
} from "../damages";
import {AOSign, aoSignFormat, isAoSign} from "./sign";
import {AONote, aoNoteFormat, isAoNote} from "./footNote";
import {AOKolonMark, aoKolonMarkFormat, isAoKolonMark} from "./kolonMark";
import {AOIllegibleContent} from "./illegible";
import {AOSpace, aoSpaceFormat, isSpace} from "./space";
import {XmlFormat} from "../../editor/xmlLoader";
import {InscribedLetter, inscribedLetterFormat, isInscribedLetter} from "../inscribedLetter";

// Word content

export type MultiStringContent = string | AOCorr | DamageContent | InscribedLetter;

export type AOSimpleWordContent = MultiStringContent
  | AODeterminativ
  | AOMaterLectionis
  | AONumeralContent
  | AONote
  | AOSign
  | AOKolonMark
  | AOIllegibleContent
  | AOCorr
  | AOSpace;

export type AOWordContent = AOAkkadogramm | AOSumerogramm | AOSimpleWordContent; // TODO: more types?!

export const aoWordContentFormat: XmlFormat<AOWordContent> = {
  read: (el) => {
    switch (el.tagName) {
      case 'del_in':
        return deletionStartFormat.read(el);
      case 'del_fin':
        return deletionEndFormat.read(el);
      case 'ras_in':
        return rasureStartFormat.read(el);
      case 'ras_fin':
        return rasureEndFormat.read(el);
      case 'laes_in':
        return lesionStartFormat.read(el);
      case 'laes_fin':
        return lesionEndFormat.read(el);
      case 'sGr':
        return sumerogrammFormat.read(el);
      case 'aGr':
        return akkadogrammFormat.read(el);
      case 'd':
        return determinativFormat.read(el);
      case 'SP___AO_3a_MaterLect':
        return materLectionisFormat.read(el);
      case 'num':
        return numeralContentFormat.read(el);
      case 'space':
        return aoSpaceFormat.read(el);
      case 'corr':
        return aoCorrFormat.read(el);
      case 'SP___AO_3a_-KolonMark':
        return aoKolonMarkFormat.read(el);
      case 'AO:Sign':
        return aoSignFormat.read(el);
      case 'note':
        return aoNoteFormat.read(el);
      default:
        throw new Error(`Illegal tag name ${el.tagName} found!`)
    }
  },
  write: (c) => {
    if (typeof c === 'string') {
      return c;
    } else if (isAkkadogramm(c)) {
      return akkadogrammFormat.write(c, -1);
    } else if (isSumerogramm(c)) {
      return sumerogrammFormat.write(c, -1);
    } else if (isDeterminativ(c)) {
      return determinativFormat.write(c, -1);
    } else if (isMaterLectionis(c)) {
      return materLectionisFormat.write(c, -1);
    } else if (isNumeralContent(c)) {
      return numeralContentFormat.write(c, -1);
    } else if (isCorrectionContent(c)) {
      return aoCorrFormat.write(c, -1);
    } else if (isDamageContent(c)) {
      return xmlifyDamageContent(c);
    } else if (isAoSign(c)) {
      return aoSignFormat.write(c, -1);
    } else if (isAoNote(c)) {
      return aoNoteFormat.write(c, -1);
    } else if (isAoKolonMark(c)) {
      return aoKolonMarkFormat.write(c, -1);
    } else if (isSpace(c)) {
      return aoSpaceFormat.write(c, -1);
    } else if (isInscribedLetter(c)) {
      return inscribedLetterFormat.write(c, -1);
    } else {
      // Illegible content
      let y = c;
      return 'x';
    }
  }
};


export function getContent(c: AOWordContent): string {
  if (typeof c === 'string') {
    return c;
  } else if (isAkkadogramm(c)) {
    return c.contents.map(getContent).join('');
  } else if (isSumerogramm(c)) {
    return c.contents.map(getContent).join('');
  } else if (isNumeralContent(c)) {
    return c.content;
  } else if (isDeterminativ(c)) {
    return c.content;
  } else if (isMaterLectionis(c)) {
    return c.content;
  } else {
    // FIXME: implement?!
    return '';
  }
}
