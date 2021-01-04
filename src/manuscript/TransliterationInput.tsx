import React, {createRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import {IProps} from "./ManuscriptHelpers";
import {TransliterationTextLineContent} from '../model/transliterationTextLine';
import {parseTransliterationLine, TransliterationLineParseResult} from "../transliterationParser/parser"
import './TransliterationInput.sass';
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {manuscriptDataUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {StringContentTypeEnum} from "../generated/graphql";

const defaultText = `1' # [(x)] x ⸢zi⸣ x [
2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri
3' # az-zi-ik-ki-it-[tén
4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬
5' # [k]u-it-ma-an-aš-ma x [
6' # [n]a-aš-kán GIŠ.NÁ [
7' # [nu-u]š-ši ša-aš-t[a-
8' # [da?]-⸢a?⸣ nu-uš-ši x [
9' # [nu-u]š-ši im-ma(-)[
10' # [x-x]-TE°MEŠ° ⸢e⸣-[
11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬
12' # [x x] x [`


interface TransliterationLineResult extends TransliterationLineParseResult {
    lineIndex: number;
}

interface IState {
    transliterationOutput?: TransliterationLineResult[];
}

function renderTransliterationLineContent(content: TransliterationTextLineContent): JSX.Element {
    if (typeof content === 'string') {
        return <span className="hittite">{content}</span>;
    } else if (content.type === StringContentTypeEnum.Akadogramm) {
        return <span className="akadogramm">{content.content}</span>;
    } else if (content.type === StringContentTypeEnum.Determinativ) {
        return <span className="determinativ">{content.content}</span>;
    } else if (content.type === StringContentTypeEnum.MaterLectionis) {
        //TODO: class!
        return <span>{content.content}</span>;
    } else if (content.type === StringContentTypeEnum.Sumerogramm) {
        return <span className="sumerogramm">{content.content}</span>;
    } else if (content.type === 'Correction') {
        return <sup className="correction">{content.symbol}</sup>;
    } else if (content.type === 'NumeralContent') {
        return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
    } else {
        return <span>{content.symbol}</span>;
    }
}

function renderTransliterationLineResult(tlrs: TransliterationLineResult[]): JSX.Element {
    const maxLineNumber: number = tlrs
        .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
        .reduce((a, b) => a > b ? a : b);

    const maxLength = Math.ceil(Math.log10(maxLineNumber));

    return (
        <pre>
            {tlrs.map(({lineIndex, line, result}) => {
                    if (result) {
                        const ln = result.lineNumber.toString().padStart(maxLength, ' ');

                        return <p key={lineIndex}>
                            <sup>{ln}{result.isAbsolute ? '' : '\''}</sup>&nbsp;
                            {result.content.map((content, index) =>
                                <span key={index}>{renderTransliterationLineContent(content)}</span>
                            )}
                        </p>
                    } else {
                        const display = line.length > 100 ? line.substr(0, 100) + '...' : line;
                        return <p key={lineIndex} className="has-text-danger">{display}</p>
                    }
                }
            )}
        </pre>
    );
}

export function TransliterationInput({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');
    const [state, setState] = useState<IState>({})
    const currentUser = useSelector(activeUserSelector);
    const textAreaRef = createRef<HTMLTextAreaElement>();

    // const [createTransliteration] = useNewTransliterationInputMutation();

    if (!currentUser || currentUser.username !== manuscript.creatorUsername) {
        const url = manuscriptDataUrl.buildAbsoluteUrl({mainIdentifier: manuscript.mainIdentifier.identifier});
        return <Redirect to={url}/>;
    }

    function updateTransliteration(): void {
        setState((state) => {
            const transliterationOutput = textAreaRef.current
                ? textAreaRef.current.value
                    .split('\n')
                    .map<TransliterationLineResult>((line, lineIndex) => {
                        return {...parseTransliterationLine(line), lineIndex};
                    })
                : [];

            return {...state, transliterationOutput};
        });
    }

    /*
    function uploadTransliteration(): void {
        const toUpload: NewTransliterationInputMutationVariables = {
            jwt: '',
            mainIdentifier: '',
            values: []
        }
    }
     */

    function exportAsXml(): void {
        console.info('TODO: export as xml...');
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
                                      rows={20} onChange={updateTransliteration} defaultValue={defaultText}
                                      ref={textAreaRef}/>
                        </div>
                    </div>

                    <div className="field">

                        <button type="button" onClick={updateTransliteration} className="button is-link is-fullwidth">
                            {t('Transliteration auswerten')}!
                        </button>
                    </div>
                </div>

                <div className="column">
                    <h2 className="subtitle is-4 has-text-centered">{t('parse_result')}</h2>

                    {state.transliterationOutput && <div>
                        <div className="field">
                            {renderTransliterationLineResult(state.transliterationOutput)}
                        </div>

                        <div className="field">
                            <button type="button" className="button is-link is-fullwidth"
                                    onClick={exportAsXml}>{t('xml_export')}</button>
                        </div>
                    </div>}
                </div>

            </div>
        </div>
    );
}
