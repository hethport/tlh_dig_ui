import React, {useState} from "react";
import {
  getNameForManuscriptSide,
  ManuscriptColumn,
  ManuscriptColumnModifier,
  manuscriptColumnModifiers,
  manuscriptColumns,
  ManuscriptSide,
  manuscriptSides
} from "../model/manuscriptProperties/manuscriptProperties";
import {allManuscriptLanguages, ManuscriptLanguage} from "../model/manuscriptProperties/manuscriptLanugage";
import {useTranslation} from "react-i18next";
import {parseTransliterationLine} from "../transliterationParser/parser";
import {RawSideInput, SideParseResult} from "../model/sideParseResult";
import {Field, Form, Formik} from "formik";
import {BulmaSelect} from "../forms/BulmaFields";
import {Transliteration} from "./TransliterationLineResult";
import {TransliterationLine} from "../model/oldTransliteration";

interface IProps {
  mainIdentifier: string;
  onTransliterationUpdate: (t: SideParseResult) => void;
}

interface IState {
  activeTab?: string;
  sideParseResult?: SideParseResult;
}

function parseLine(lineInput: string): TransliterationLine {
  return {lineInput, result: parseTransliterationLine(lineInput)};
}

export function TransliterationSideInput({mainIdentifier, onTransliterationUpdate}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({});

  const initialValues: RawSideInput = {
    side: ManuscriptSide.NotIdentifiable,
    column: ManuscriptColumn.None,
    columnModifier: ManuscriptColumnModifier.None,
    language: ManuscriptLanguage.Hittite,
    transliteration: '',
  };

  function updateTransliteration(values: RawSideInput): void {
    const sideParseResult: SideParseResult = {
      lineResults: values.transliteration.split('\n').map(parseLine),
      ...values
    };

    setState(() => {
      return {sideParseResult}
    });

    toggleTab('rendered');

    onTransliterationUpdate(sideParseResult);
  }

  function exportAsXml({lineResults, side, language, column, columnModifier}: SideParseResult): string[] {
    return lineResults.map(({lineInput, result}) =>
      result
        ? result.xmlify(mainIdentifier, side, language, column, columnModifier)
        : `<error>${lineInput}</error>`
    );
  }

  function toggleTab(name: string): void {
    setState((state) => {
      return {...state, activeTab: name};
    });
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
                  ? <>
                    <div className="tabs is-centered">
                      <ul>
                        <li><a onClick={() => toggleTab('rendered')}>{t('rendered')}</a></li>
                        <li><a onClick={() => toggleTab('asXml')}>{t('asXml')}</a></li>
                      </ul>
                    </div>
                    {state.activeTab === 'rendered' &&
                    <Transliteration lines={state.sideParseResult.lineResults}/>}
                    {state.activeTab === 'asXml' &&
                    <div className="box">
                      {exportAsXml(state.sideParseResult).map((line, index) => <p key={index}>{line}</p>)}
                    </div>}
                  </>
                  : <div className="notification is-info has-text-centered">{t('no_result_yet')}</div>}
              </div>
            </div>
          </Form>
        }
      </Formik>
    </div>
  );
}