import {ManuscriptColumn, ManuscriptColumnModifier} from "./manuscriptProperties/manuscriptProperties";
import {ManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {TransliterationLine} from "./oldTransliteration";
import {ManuscriptSide} from "../generated/graphql";

export interface SideBasics {
  side: ManuscriptSide;
  column: ManuscriptColumn;
  columnModifier: ManuscriptColumnModifier;
  language: ManuscriptLanguage;
}

export const defaultSideBasics: SideBasics = {
  side: ManuscriptSide.NotIdentifiable,
  column: ManuscriptColumn.None,
  columnModifier: ManuscriptColumnModifier.None,
  language: ManuscriptLanguage.Hittite
};

export interface RawSideInput {
  sideBasics: SideBasics;
  transliteration: string;
}

export interface SideParseResult {
  sideBasics: SideBasics;
  lineResults: TransliterationLine[];
}