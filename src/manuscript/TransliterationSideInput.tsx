import React, {useState} from "react";
import {
  getNameForManuscriptSide,
  manuscriptColumnModifiers,
  manuscriptColumns,
  manuscriptSides
} from "../model/manuscriptProperties/manuscriptProperties";
import {allManuscriptLanguages, getNameForManuscriptLanguage} from "../model/manuscriptProperties/manuscriptLanugage";
import {useTranslation} from "react-i18next";
import {parseTransliterationLine} from "../transliterationParser/parser";
import {defaultSideBasics, RawSideInput, SideParseResult} from "../model/sideParseResult";
import {Field, Form, Formik} from "formik";
import {BulmaSelect} from "../forms/BulmaFields";
import {Transliteration} from "./TransliterationLineResult";
import {TransliterationLine} from "../model/oldTransliteration";
import {TransliterationInput} from "../generated/graphql";

interface IProps {
  mainIdentifier: string;
  onTransliterationUpdate: (t: TransliterationInput) => void;
}

interface IState {
  activeTab?: string;
  sideParseResult?: SideParseResult;
}

export function TransliterationSideInput({mainIdentifier, onTransliterationUpdate}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({});

  const initialValues: RawSideInput = {sideBasics: defaultSideBasics, transliteration: '',};

  function updateTransliteration({sideBasics, transliteration}: RawSideInput): void {
    console.info(JSON.stringify(sideBasics));

    const lineResults: TransliterationLine[] = transliteration
      .split('\n')
      .map((lineInput) => new TransliterationLine(lineInput, parseTransliterationLine(lineInput)));

    setState(() => {
      return {sideParseResult: {sideBasics, lineResults}}
    });

    toggleTab('rendered');

    onTransliterationUpdate({
      side: sideBasics.side,
      input: transliteration,
      result: lineResults
        .map((lr) => lr.xmlify(mainIdentifier, sideBasics))
        .join('\n')
    });
  }

  function exportAsXml({lineResults, sideBasics}: SideParseResult): string[] {
    console.info(lineResults);
    return lineResults.map((lr) => lr.xmlify(mainIdentifier, sideBasics));
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
                <Field as="select" name="sideBasics.side" label={t('manuscriptSide')} component={BulmaSelect}>
                  {manuscriptSides.map((ms) =>
                    <option key={ms} value={ms}>{getNameForManuscriptSide(ms, t)}</option>
                  )}
                </Field>

                <Field name="sideBasics.language" label={t('defaultLanguage')} component={BulmaSelect}>
                  {allManuscriptLanguages.map((l) =>
                    <option key={l} value={l}>{getNameForManuscriptLanguage(l, t)}</option>
                  )}
                </Field>

                <Field name="sideBasics.column" label={t('manuscriptColumn')} component={BulmaSelect}>
                  {manuscriptColumns.map((mc) => <option key={mc} value={mc}>{mc}</option>)}
                </Field>

                <Field name="sideBasics.columnModifier" label={t('manuscriptColumnModifier')}
                       component={BulmaSelect}>
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