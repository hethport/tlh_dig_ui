import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptLanguage, ManuscriptSide} from "../generated/graphql";
import {TransliterationLineParseResult} from "../transliterationParser/parser";

export interface TransliterationSideParseResult {
  manuscriptSide: ManuscriptSide;
  manuscriptColumn?: ManuscriptColumn;
  manuscriptColumnModifier?: ManuscriptColumnModifier;
  manuscriptDefaultLanguage: ManuscriptLanguage;
  lineResults: TransliterationLineParseResult[];
}