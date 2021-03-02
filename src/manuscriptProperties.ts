import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptLanguage, ManuscriptSide} from "./generated/graphql";
import {TFunction} from "i18next";

// Sides

export const manuscriptSides: ManuscriptSide[] = [
  ManuscriptSide.NotIdentifiable,
  ManuscriptSide.Obverse, ManuscriptSide.Reverse,
  ManuscriptSide.LeftEdge, ManuscriptSide.RightEdge,
  ManuscriptSide.UpperEdge, ManuscriptSide.LowerEdge,
  ManuscriptSide.SideA, ManuscriptSide.SideB,
  ManuscriptSide.InscriptionNumber, ManuscriptSide.SealInscription
];


export function getXmlNameForManuscriptSide(side: ManuscriptSide): string {
  switch (side) {
    case ManuscriptSide.NotIdentifiable:
      return '';
    case ManuscriptSide.Obverse:
      return 'obv.';
    case ManuscriptSide.Reverse:
      return 'rev.';
    case ManuscriptSide.LowerEdge:
      return 'lo. e.';
    case ManuscriptSide.UpperEdge:
      return 'u. e.';
    case ManuscriptSide.LeftEdge:
      return 'l. e.';
    case ManuscriptSide.RightEdge:
      return 'r. e.';
    case ManuscriptSide.SideA:
      return 'side A';
    case ManuscriptSide.SideB:
      return 'side B';
    case ManuscriptSide.InscriptionNumber:
      return 'inscription no.';
    case ManuscriptSide.SealInscription:
      return 'seal inscription';
  }
}

export function getNameForManuscriptSide(ms: ManuscriptSide, t: TFunction): string {
  switch (ms) {
    case ManuscriptSide.NotIdentifiable:
      return t('notIdentifiable');
    case ManuscriptSide.Obverse:
      return t('obverse');
    case ManuscriptSide.Reverse:
      return t('reverse');
    case ManuscriptSide.LeftEdge:
      return t('leftEdgeSide');
    case ManuscriptSide.RightEdge:
      return t('rightEdgeSide');
    case ManuscriptSide.UpperEdge:
      return t('upperEdgeSide');
    case ManuscriptSide.LowerEdge:
      return t('lowerEdgeSide');
    case ManuscriptSide.SideA:
      return t('sideA');
    case ManuscriptSide.SideB:
      return t('sideB');
    case ManuscriptSide.InscriptionNumber:
      return t('inscriptionNumber');
    case ManuscriptSide.SealInscription:
      return t('sealInscription');
  }
}

// Columns

export const manuscriptColumns: ManuscriptColumn[] = [
  ManuscriptColumn.None,
  ManuscriptColumn.I, ManuscriptColumn.Ii, ManuscriptColumn.Iii, ManuscriptColumn.Iv,
  ManuscriptColumn.V, ManuscriptColumn.Vi, ManuscriptColumn.Vii, ManuscriptColumn.Viii,
  ManuscriptColumn.Ix, ManuscriptColumn.X, ManuscriptColumn.Xi, ManuscriptColumn.Xii,
  ManuscriptColumn.LeftColumn, ManuscriptColumn.MiddleColumn, ManuscriptColumn.RightColumn,
  ManuscriptColumn.ColumnDivider
];

export const manuscriptColumnModifiers: ManuscriptColumnModifier[] = [
  ManuscriptColumnModifier.None, ManuscriptColumnModifier.Slash, ManuscriptColumnModifier.SlashQuestion
];

// Languages

export const allManuscriptLanguages: ManuscriptLanguage[] = [
  ManuscriptLanguage.Hittite, ManuscriptLanguage.Luwian, ManuscriptLanguage.Palaic, ManuscriptLanguage.Hattic,
  ManuscriptLanguage.Hurrian, ManuscriptLanguage.Akkadian, ManuscriptLanguage.Sumerian, ManuscriptLanguage.NotIdentifiable
];