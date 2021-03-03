import {ManuscriptLanguage} from "../../generated/graphql";
import {TFunction} from "i18next";

export const allManuscriptLanguages: ManuscriptLanguage[] = [
  ManuscriptLanguage.Hittite, ManuscriptLanguage.Luwian, ManuscriptLanguage.Palaic, ManuscriptLanguage.Hattic,
  ManuscriptLanguage.Hurrian, ManuscriptLanguage.Akkadian, ManuscriptLanguage.Sumerian, ManuscriptLanguage.NotIdentifiable
];

export function getNameForManuscriptLanguage(l: ManuscriptLanguage, t: TFunction): string {
  // FIXME: implement!
  return 'TODO!';
}

export function getAbbreviationForManuscriptLanguage(l: ManuscriptLanguage): string {
  switch (l) {
    case ManuscriptLanguage.Akkadian:
      return 'Akk';
    case ManuscriptLanguage.Hattic:
      return 'Hat';
    case ManuscriptLanguage.Hittite:
      return 'Hit';
    case ManuscriptLanguage.Hurrian:
      return 'Hur';
    case ManuscriptLanguage.Luwian:
      return 'Luw';
    case ManuscriptLanguage.Palaic:
      return 'Pal';
    case ManuscriptLanguage.Sumerian:
      return 'Sum';
    case ManuscriptLanguage.NotIdentifiable:
      return '';
  }
}