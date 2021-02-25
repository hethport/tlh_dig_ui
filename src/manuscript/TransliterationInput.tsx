import React, {ChangeEvent, createRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import {parseTransliterationLine, TransliterationLineParseResult} from "../transliterationParser/parser"
import './TransliterationInput.sass';
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {TransliterationLineResultComponent} from './TransliterationLineResult';
import {
  ManuscriptColumn,
  ManuscriptColumnModifier,
  ManuscriptSide,
  TransliterationLineInput,
  TransliterationLineResultInput,
  TransliterationWordContentInputUnion,
  TransliterationWordInput,
  useUploadTransliterationMutation
} from "../generated/graphql";
import {TransliterationWord} from "../model/transliterationTextLine";
import {isStringContentInput} from "../model/stringContent";
import {isCorrection} from "../model/corrections";
import {isDamage} from "../model/damages";
import {ManuscriptBaseIProps} from "./ManuscriptBase";
import {
  allManuscriptLanguages,
  getNameForManuscriptSide,
  manuscriptColumnModifiers,
  manuscriptColumns,
  manuscriptSides
} from "../manuscriptSide";
import {saveBlob} from "../saveBlob";

interface IState {
  transliterationOutput?: TransliterationLineParseResult[];
  transliterationIsUpToDate?: boolean;
  manuscriptSide?: ManuscriptSide;
  manuscriptColumn?: ManuscriptColumn;
  manuscriptColumnModifier?: ManuscriptColumnModifier;
}

function convertWord({contents}: TransliterationWord): TransliterationWordInput {
  return {
    content: contents.map<TransliterationWordContentInputUnion>((content) => {
      // FIXME: implement!
      if (isStringContentInput(content)) {
        return {stringContent: content};
      } else if (isCorrection(content)) {
        return {correctionContent: content}
      } else if (isDamage(content)) {
        return {damageContent: content.type};
      } else {
        return {numeralContent: content};
      }
    })
  };
}

function convertTransliterationTextLine(
  {transliterationLineInput, result}: TransliterationLineParseResult,
  lineIndex: number
): TransliterationLineInput {
  const content: TransliterationLineResultInput | undefined = result
    ? {
      isAbsolute: result.isAbsolute,
      lineNumber: result.lineNumber,
      words: result.content.map(convertWord)
    }
    : undefined;

  return {lineIndex, transliterationLineInput, result: content}
}

export function TransliterationInput({manuscript}: ManuscriptBaseIProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({})
  const currentUser = useSelector(activeUserSelector);
  const textAreaRef = createRef<HTMLTextAreaElement>();

  const [uploadTransliteration, {loading, error}] = useUploadTransliterationMutation();

  const mainIdentifier = manuscript.mainIdentifier.identifier;

  if (!currentUser || currentUser.username !== manuscript.creatorUsername) {
    return <Redirect to={homeUrl}/>;
  }

  function updateTransliteration(): void {
    setState(() => {
      const transliterationOutput = textAreaRef.current
        ? textAreaRef.current.value
          .split('\n')
          .map<TransliterationLineParseResult>((line, lineIndex) => {
            return {...parseTransliterationLine(line), lineIndex};
          })
        : [];

      return {transliterationOutput, transliterationIsUpToDate: false};
    });
  }

  function exportAsXml(): void {
    // FIXME: get ManuscriptSide!
    const manuscriptSide = state.manuscriptSide || ManuscriptSide.NotIdentifiable;

    const xmlLinesOutput = state.transliterationOutput!
      .map((line) => line.result ? line.result.xmlify(mainIdentifier, manuscriptSide) : '')
      .join('\n\n\n');

    const xmlOutput = '<AOxml>\n' + xmlLinesOutput + '\n</AOxml>';

    saveBlob(xmlOutput, mainIdentifier + '.xml');
  }

  function updateManuscriptSide(event: ChangeEvent<HTMLSelectElement>): void {
    const manuscriptSide = manuscriptSides[event.target.selectedIndex];

    setState((state) => {
      return {...state, manuscriptSide};
    });
  }

  function updateManuscriptColumn(event: ChangeEvent<HTMLSelectElement>): void {
    const manuscriptColumn = manuscriptColumns[event.target.selectedIndex];

    setState((state) => {
      return {...state, manuscriptColumn};
    })
  }

  function updateManuscriptColumnModifier(event: ChangeEvent<HTMLSelectElement>): void {
    const manuscriptColumnModifier = manuscriptColumnModifiers[event.target.selectedIndex];

    setState((state) => {
      return {...state, manuscriptColumnModifier};
    })
  }

  function updateDefaultLanguage(event: ChangeEvent<HTMLSelectElement>): void {

  }

  function upload(): void {
    const values: TransliterationLineInput[] = state.transliterationOutput!
      .map<TransliterationLineInput>(convertTransliterationTextLine);

    uploadTransliteration({variables: {mainIdentifier, values}})
      .then(({data}) => {
        setState((currentState) => {
          return {...currentState, transliterationIsUpToDate: !!data?.me?.manuscript?.updateTransliteration}
        });
      })
      .catch((error) => console.error('Could not upload transliteration:\n' + error));
  }

  return (
    <div className="container is-fluid">
      <h1 className="subtitle is-3 has-text-centered">{t('createTransliteration')}</h1>

      <div className="columns">

        <div className="column">
          <h2 className="subtitle is-4 has-text-centered">{t('transliteration')}:</h2>

          <div className="field">
            <div className="field-body">

              <div className="field">
                <label htmlFor="manuscriptSide" className="label">{t('manuscriptSide')}:</label>
                <div className="control is-expanded">
                  <div className="select is-fullwidth">
                    <select onChange={updateManuscriptSide} id="manuscriptSide">
                      {manuscriptSides.map((ms) => <option key={ms}>{getNameForManuscriptSide(ms, t)}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="manuscriptColumn" className="label">{t('manuscriptColumn')}:</label>
                <div className="control is-expanded">
                  <div className="select is-fullwidth">
                    <select onChange={updateManuscriptColumn}>
                      {manuscriptColumns.map((mc) => <option key={mc}>{mc}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="manuscriptColumnModifier" className="label">{t('manuscriptColumnModifier')}:</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select onChange={updateManuscriptColumnModifier} id="manuscriptColumnModifier">
                      {manuscriptColumnModifiers.map((mcm) => <option key={mcm}>{mcm}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="defaultLanguage" className="label">{t('defaultLanguage')}:</label>
                <div className="control">
                  <div className="select">
                    <select onChange={updateDefaultLanguage} id="defaultLanguage">
                      {allManuscriptLanguages.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="field">
            <div className="control">
              <textarea className="textarea" id="transliteration" placeholder={t('transliteration')} rows={20}
                        onChange={updateTransliteration} ref={textAreaRef}/>
            </div>
          </div>
        </div>

        <div className="column">
          <h2 className="subtitle is-4 has-text-centered">{t('parseResult')}</h2>

          {state.transliterationOutput && <>
            <TransliterationLineResultComponent lines={state.transliterationOutput}/>

            {error && <div className="notification is-danger has-text-centered my-3">{error.message}</div>}

            <div className="columns my-3">
              <div className="column">
                <button type="button" className="button is-link is-fullwidth" onClick={exportAsXml}>
                  {t('xml_export')}
                </button>
              </div>
              <div className="column">
                <button type="button" className="button is-link is-fullwidth" onClick={upload}
                        disabled={loading || state.transliterationIsUpToDate}>
                  {t('createTransliteration')}
                </button>
              </div>
            </div>
          </>}

        </div>

      </div>
    </div>
  );
}
