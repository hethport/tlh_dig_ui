import {failure, Result, success} from '../../functional/result';
import {damageContent, DamageType, isDamageContent, xmlifyDamageContent} from "./damages";
import {MultiStringContent} from "./wordContent";
import {aoBasicText} from "./basicText";
import {aoCorrFormat, isCorrectionContent} from "./corrections";
import {inscribedLetterFormat, isInscribedLetter} from "./inscribedLetter";

/**
 * @deprecated
 * @param el
 */
export function readMultiWordContent(el: ChildNode): Result<MultiStringContent> {
  if (el instanceof Element) {
    switch (el.tagName) {
      case 'del_in':
        return success(damageContent(DamageType.DeletionStart));
      case 'del_fin':
        return success(damageContent(DamageType.DeletionEnd));
      case 'ras_in':
        return success(damageContent(DamageType.RasureStart));
      case 'ras_fin':
        return success(damageContent(DamageType.RasureEnd));
      case 'laes_in':
        return success(damageContent(DamageType.LesionStart));
      case 'laes_fin':
        return success(damageContent(DamageType.LesionEnd));
      default:
        return failure(`Illegal tag name found: ${el.tagName}`);
    }
  } else if (el instanceof Text) {
    return success(aoBasicText(el.textContent || ''));
  } else {
    return failure(`Illegal tag found: ${el.nodeType}`);
  }
}

/**
 * @deprecated
 * @param c
 */
export function writeMultiWordContent(c: MultiStringContent): string[] {
  if (isCorrectionContent(c)) {
    return aoCorrFormat.write(c);
  } else if (isDamageContent(c)) {
    return xmlifyDamageContent(c);
  } else if (isInscribedLetter(c)) {
    return inscribedLetterFormat.write(c);
  } else {
    return [c.content];
  }
}