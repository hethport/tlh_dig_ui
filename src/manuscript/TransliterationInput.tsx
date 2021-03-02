import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {TransliterationLineParseResult} from "../transliterationParser/parser"
import './TransliterationInput.sass';
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {
  ManuscriptLanguage,
  ManuscriptSide,
  TransliterationLineInput,
  TransliterationLineResultInput,
  TransliterationWordInput,
  useUploadTransliterationMutation
} from "../generated/graphql";
import {TransliterationWordParseResult} from "../model/transliterationTextLineParseResult";
import {ManuscriptBaseIProps} from "./ManuscriptBase";
import {saveBlob} from "../saveBlob";
import {TransliterationSideInput} from "./TransliterationSideInput";
import {TransliterationSideParseResult} from "../model/transliterationSideParseResult";

interface SideParseResultContainer {
  transliterationOutput?: TransliterationSideParseResult;
}

interface IState {
  sideParseResults: SideParseResultContainer[];
  transliterationOutput?: TransliterationLineParseResult[];
  transliterationIsUpToDate?: boolean;
}

function convertWordParseResult({wordInput, result}: TransliterationWordParseResult): TransliterationWordInput {
  if (result) {
    return result;
  } else {
    return {content: [/*wordInput*/]};
  }
}

function convertTransliterationTextLine(
  {transliterationLineInput, result}: TransliterationLineParseResult,
  lineIndex: number
): TransliterationLineInput {
  const content: TransliterationLineResultInput | undefined = result
    ? {
      isAbsolute: result.lineNumberIsAbsolute,
      lineNumber: result.lineNumber,
      words: result.content.map(convertWordParseResult)
    }
    : undefined;

  return {lineIndex, transliterationLineInput, result: content}
}

export function TransliterationInput({manuscript}: ManuscriptBaseIProps): JSX.Element {

  const {t} = useTranslation('common');
  const [state, setState] = useState<IState>({sideParseResults: [{}]})
  const currentUser = useSelector(activeUserSelector);

  const [uploadTransliteration, {loading, error}] = useUploadTransliterationMutation();

  const mainIdentifier = manuscript.mainIdentifier.identifier;

  if (!currentUser || currentUser.username !== manuscript.creatorUsername) {
    return <Redirect to={homeUrl}/>;
  }

  function exportAsXml(): void {
    // FIXME: get ManuscriptSide!
    const manuscriptSide = /*state.manuscriptSide ||*/ ManuscriptSide.NotIdentifiable;
    const manuscriptLanguage = ManuscriptLanguage.Hittite;

    const xmlLinesOutput = state.transliterationOutput!
      .map((line) => line.result ? line.result.xmlify(mainIdentifier, manuscriptSide, manuscriptLanguage) : '')
      .join('\n\n\n');

    const xmlOutput = '<AOxml>\n' + xmlLinesOutput + '\n</AOxml>';

    saveBlob(xmlOutput, mainIdentifier + '.xml');
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

  function addTransliterationSideInput(): void {
    setState((state) => {
      return {...state, sideParseResults: [...state.sideParseResults, {}]}
    })
  }

  function updateTransliteration(index: number, result: TransliterationSideParseResult): void {
    setState((state) => {
      return {
        ...state,
        sideParseResults: state.sideParseResults
          .map((sprc, runningIndex) => index === runningIndex ? {transliterationOutput: result} : sprc),
      }
    });
  }

  return (
    <div className="container">
      <h1 className="subtitle is-3 has-text-centered">{t('createTransliteration')}</h1>

      {state.sideParseResults.map((_, index) =>
        <TransliterationSideInput key={index} onTransliterationUpdate={(s) => updateTransliteration(index, s)}/>
      )}

      <div className="columns">
        <div className="column">
          <button className="button is-link is-fullwidth" onClick={addTransliterationSideInput}>
            {t('additionalPage')}
          </button>
        </div>

        <div className="column">
          <button type="button" className="button is-link is-fullwidth" onClick={exportAsXml}>
            {t('xml_export')}
          </button>
        </div>
        <div className="column">
          <button type="button" className="button is-link is-fullwidth" onClick={upload}
                  disabled={loading || state.transliterationIsUpToDate}>
            {t('uploadTransliteration')}
          </button>

          {error && <div className="notification is-danger has-text-centered my-3">{error.message}</div>}
        </div>
      </div>
    </div>
  );
}
