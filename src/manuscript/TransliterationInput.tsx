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
import {
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


interface IState {
    transliterationOutput?: TransliterationLineParseResult[];
    transliterationIsUpToDate?: boolean;
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

export function TransliterationInput({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');
    const [state, setState] = useState<IState>({})
    const currentUser = useSelector(activeUserSelector);
    const textAreaRef = createRef<HTMLTextAreaElement>();

    const [uploadTransliteration] = useUploadTransliterationMutation();

    const mainIdentifier = manuscript.mainIdentifier.identifier;

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

            return {transliterationOutput, transliterationIsUpToDate: false};
        });
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
            <h1 className="subtitle is-3 has-text-centered">{t('Eingabe der Transliteration')}</h1>

            <div className="columns">

                <div className="column">
                    <h2 className="subtitle is-4 has-text-centered">{t('Transliteration')}:</h2>

                    <div className="field">
                        <div className="control">
                            <textarea className="textarea" id="transliteration" placeholder={t('Transliteration')}
                                      rows={20} onChange={updateTransliteration} ref={textAreaRef}/>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <h2 className="subtitle is-4 has-text-centered">{t('parse_result')}</h2>

                    {state.transliterationOutput && <TransliterationLineResultComponent
                        lines={state.transliterationOutput}
                        mainIdentifier={manuscript.mainIdentifier.identifier}
                        updateTransliteration={upload}
                        transliterationIsUpToDate={state.transliterationIsUpToDate}/>}
                </div>

            </div>
        </div>
    );
}
