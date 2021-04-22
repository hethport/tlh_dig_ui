import {ManuscriptColumn, ManuscriptColumnModifier} from "./manuscriptProperties/manuscriptProperties";
import {ManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {TransliterationLine} from "./oldTransliteration";
import {ManuscriptSide} from "../generated/graphql";

export interface SideBasics {
  side: ManuscriptSide;
  language: ManuscriptLanguage;
  column: ManuscriptColumn;
  columnModifier: ManuscriptColumnModifier;
}

export const defaultSideBasics: SideBasics = {
  side: ManuscriptSide.NotIdentifiable,
  language: ManuscriptLanguage.Hittite,
  column: ManuscriptColumn.None,
  columnModifier: ManuscriptColumnModifier.None
};

export interface RawSideInput {
  sideBasics: SideBasics;
  transliteration: string;
}

export interface SideParseResult {
  sideBasics: SideBasics;
  lineResults: TransliterationLine[];
}