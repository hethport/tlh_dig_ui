import React, {useState} from "react";
import {
  allManuscriptLanguages,
  getNameForManuscriptSide,
  manuscriptColumnModifiers,
  manuscriptColumns,
  manuscriptSides
} from "../manuscriptProperties";
import {ManuscriptColumn, ManuscriptColumnModifier, ManuscriptLanguage, ManuscriptSide} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {parseTransliterationLine, TransliterationLineParseResult} from "../transliterationParser/parser";
import {TransliterationSideParseResult} from "../model/transliterationSideParseResult";
import {Field, Form, Formik} from "formik";
import {BulmaSelect} from "../forms/BulmaFields";
import {TransliterationLineParseResultsComponent} from "./TransliterationLineResult";

interface IProps {
  onTransliterationUpdate: (t: TransliterationSideParseResult) => void;
}

interface IState {
  sideParseResult?: TransliterationSideParseResult;
}

interface IFormValues {
  manuscriptSide: ManuscriptSide;
  manuscriptColumn: ManuscriptColumn;
  manuscriptColumnModifier: ManuscriptColumnModifier;
  manuscriptDefaultLanguage: ManuscriptLanguage;
  transliteration: string;
}

export function TransliterationSideInput({onTransliterationUpdate}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({});

  const initialValues: IFormValues = {
    manuscriptSide: ManuscriptSide.NotIdentifiable,
    manuscriptColumn: ManuscriptColumn.None,
    manuscriptColumnModifier: ManuscriptColumnModifier.None,
    manuscriptDefaultLanguage: ManuscriptLanguage.Hittite,
    transliteration: '',
  };

  function updateTransliteration(values: IFormValues): void {
    const lineResults: TransliterationLineParseResult[] = values.transliteration
      .split('\n')
      .map((transliterationLineInput, lineIndex) => {
        return {lineIndex, transliterationLineInput, result: parseTransliterationLine(transliterationLineInput)};
      });

    const sideParseResult = {lineResults, ...values};

    setState(() => {
      return {sideParseResult}
    });

    onTransliterationUpdate(sideParseResult);
  }

  return (
    <div className="box">
      <Formik initialValues={initialValues} onSubmit={updateTransliteration}>
        {({submitForm}) =>
          <Form>
            <div className="field">
              <div className="field-body">
                <Field as="select" name="manuscriptSide" label={t('manuscriptSide')} component={BulmaSelect}>
                  {manuscriptSides.map((ms) =>
                    <option key={ms} value={ms}>{getNameForManuscriptSide(ms, t)}</option>
                  )}
                </Field>

                <Field name="manuscriptDefaultLanguage" label={t('defaultLanguage')} component={BulmaSelect}>
                  {allManuscriptLanguages.map((l) => <option key={l}>{l}</option>)}
                </Field>

                <Field name="manuscriptColumn" label={t('manuscriptColumn')} component={BulmaSelect}>
                  {manuscriptColumns.map((mc) => <option key={mc} value={mc}>{mc}</option>)}
                </Field>

                <Field name="manuscriptColumnModifier" label={t('manuscriptColumnModifier')} component={BulmaSelect}>
                  {manuscriptColumnModifiers.map((mcm) => <option key={mcm} value={mcm}>{mcm}</option>)}
                </Field>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <label className="label">{t('transliteration')}:</label>
                <Field as="textarea" className="textarea" name="transliteration" placeholder={t('transliteration')}
                       rows={20} onKeyUp={() => submitForm()}/>
              </div>
              <div className="column">
                <label className="label">{t('parseResult')}:</label>

                {state.sideParseResult
                  ? <TransliterationLineParseResultsComponent lineResults={state.sideParseResult.lineResults}/>
                  : <div className="notification is-info has-text-centered">{t('no_result_yet')}</div>}
              </div>
            </div>
          </Form>
        }
      </Formik>
    </div>
  );
}