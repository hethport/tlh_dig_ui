import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {LineParseResult} from "../transliterationParser/parser"
import './TransliterationInput.sass';
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {TransliterationLine, TransliterationLineResult} from "../model/oldTransliteration";
import {useUploadTransliterationMutation} from "../generated/graphql";
import {ManuscriptBaseIProps} from "./ManuscriptBase";
import {TransliterationSideInput} from "./TransliterationSideInput";
import {SideParseResult} from "../model/sideParseResult";

interface SideParseResultContainer {
  transliterationOutput?: SideParseResult;
}

interface IState {
  sideParseResults: SideParseResultContainer[];
  transliterationIsUpToDate?: boolean;
}

function convertTransliterationTextLine(
  {lineInput, result}: LineParseResult,
  lineIndex: number
): TransliterationLine {
  const content: TransliterationLineResult | undefined = result
    ? {
      isAbsolute: result.lineNumberIsAbsolute,
      lineNumber: result.lineNumber,
      words: result.words // .map(convertWordParseResult)
    }
    : undefined;

  return {lineIndex, lineInput, result: content}
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

  function upload(): void {
    const values: TransliterationLine[] = state.sideParseResults
      .flatMap(({transliterationOutput}) => transliterationOutput?.lineResults || [])
      .map<TransliterationLine>(convertTransliterationTextLine);

    const input = '';
    const result = '';

    uploadTransliteration({variables: {mainIdentifier, values: {input, result}}})
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

  function updateTransliteration(index: number, result: SideParseResult): void {
    setState((state) => {
      return {
        ...state,
        sideParseResults: state.sideParseResults
          .map((sprc, runningIndex) => index === runningIndex ? {transliterationOutput: result} : sprc),
      }
    });
  }

  return (
    <div className="container is-fluid">
      <h1 className="subtitle is-3 has-text-centered">{t('createTransliteration')}</h1>

      {state.sideParseResults.map((_, index) =>
        <TransliterationSideInput key={index} mainIdentifier={mainIdentifier}
                                  onTransliterationUpdate={(s) => updateTransliteration(index, s)}/>
      )}

      <div className="columns">
        <div className="column">
          <button className="button is-link is-fullwidth" onClick={addTransliterationSideInput}>
            {t('additionalPage')}
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
