import React from "react";
import {
  allManuscriptLanguages,
  getNameForManuscriptSide,
  manuscriptColumnModifiers,
  manuscriptColumns,
  manuscriptSides
} from "../manuscriptSide";
import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptLanguage, ManuscriptSide} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {parseTransliterationLine, TransliterationLineParseResult} from "../transliterationParser/parser";
import {TransliterationSideParseResult} from "../model/transliterationSideParseResult";
import {Field, Form, Formik} from "formik";
import {BulmaField, BulmaSelect} from "../forms/BulmaFields";

interface IProps {
  onTransliterationUpdate: (t: TransliterationSideParseResult) => void;
}

interface IState {
  manuscriptSide: ManuscriptSide;
  manuscriptColumn?: ManuscriptColumn;
  manuscriptColumnModifier?: ManuscriptColumnModifier;
  manuscriptDefaultLanguage: ManuscriptLanguage;
  transliteration: string;
}

export function TransliterationSideInput({onTransliterationUpdate}: IProps): JSX.Element {

  const {t} = useTranslation('common');

  const initialValues: IState = {
    manuscriptSide: ManuscriptSide.NotIdentifiable,
    manuscriptDefaultLanguage: ManuscriptLanguage.Hittite,
    transliteration: '',
  };

  function updateTransliteration(values: IState): void {
    const lineResults: TransliterationLineParseResult[] = values.transliteration
      .split('\n')
      .map<TransliterationLineParseResult>((line, lineIndex) => {
        return {...parseTransliterationLine(line), lineIndex};
      });

    onTransliterationUpdate({
      lineResults,
      ...values
    });
  }

  return (
    <Formik initialValues={initialValues} onSubmit={updateTransliteration}>
      {({submitForm}) =>

        <Form>
          <div className="field">
            <div className="field-body">
              <Field as="select" name="manuscriptSide" label={t('manuscriptSide')} component={BulmaSelect}>
                {manuscriptSides.map((ms) => <option key={ms} value={ms}>{getNameForManuscriptSide(ms, t)}</option>)}
              </Field>

              <Field name="manuscriptColumn" label={t('manuscriptColumn')} component={BulmaSelect}>
                {manuscriptColumns.map((mc) => <option key={mc} value={mc}>{mc}</option>)}
              </Field>

              <Field name="manuscriptColumnModifier" label={t('manuscriptColumnModifier')} component={BulmaSelect}>
                {manuscriptColumnModifiers.map((mcm) => <option key={mcm} value={mcm}>{mcm}</option>)}
              </Field>

              <Field name="manuscriptDefaultLanguage" label={t('defaultLanguage')} component={BulmaSelect}>
                {allManuscriptLanguages.map((l) => <option key={l}>{l}</option>)}
              </Field>
            </div>
          </div>

          <Field name="transliteration" label={t('transliteration')} asTextArea={true} rows={20}
                 onKeyUp={() => submitForm()}
                 component={BulmaField}/>
        </Form>
      }
    </Formik>
  );
}