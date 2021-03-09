import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptSide} from "./manuscriptProperties/manuscriptProperties";
import {ManuscriptLanguage} from "./manuscriptProperties/manuscriptLanugage";
import {TransliterationLine} from "./oldTransliteration";

interface SideBasics {
  side: ManuscriptSide;
  column: ManuscriptColumn;
  columnModifier: ManuscriptColumnModifier;
  language: ManuscriptLanguage;
}

export interface RawSideInput extends SideBasics {
  transliteration: string;
}

export interface SideParseResult extends SideBasics {
  lineResults: TransliterationLine[];
}