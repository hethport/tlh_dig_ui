import React, {createRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import {IProps} from "./ManuscriptHelpers";
import {parseTransliterationLine, TransliterationLineParseResult} from "../transliterationParser/parser"
import './TransliterationInput.sass';
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {TransliterationLineResultComponent} from './TransliterationLineResult';


interface IState {
    transliterationOutput?: TransliterationLineParseResult[];
}

export function TransliterationInput({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');
    const [state, setState] = useState<IState>({})
    const currentUser = useSelector(activeUserSelector);
    const textAreaRef = createRef<HTMLTextAreaElement>();

    if (!currentUser || currentUser.username !== manuscript.creatorUsername) {
        return <Redirect to={homeUrl}/>;
    }

    function updateTransliteration(): void {
        setState((state) => {
            const transliterationOutput = textAreaRef.current
                ? textAreaRef.current.value
                    .split('\n')
                    .map<TransliterationLineParseResult>((line, lineIndex) => {
                        return {...parseTransliterationLine(line), lineIndex};
                    })
                : [];

            return {...state, transliterationOutput};
        });
    }

    return (
        <div className="container is-fluid">
            <h1 className="subtitle is-3 has-text-centered">{t('Eingabe der Transliteration')}</h1>

            <div className="columns">

                <div className="column">
                    <h2 className="subtitle is-4 has-text-centered">{t('Transliteration')}:</h2>

                    <div className="field">
                        <div className="control">
                            {/* TODO: remove default text! */}
                            <textarea className="textarea" id="transliteration" placeholder={t('Transliteration')}
                                      rows={20} onChange={updateTransliteration} ref={textAreaRef}/>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <h2 className="subtitle is-4 has-text-centered">{t('parse_result')}</h2>

                    {state.transliterationOutput &&
                    <TransliterationLineResultComponent lines={state.transliterationOutput}
                                                        mainIdentifier={manuscript.mainIdentifier.identifier}/>}
                </div>

            </div>
        </div>
    );
}
