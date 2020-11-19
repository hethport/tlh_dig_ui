import React, {createRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import {IProps} from "./ManuscriptHelpers";
import {TransliterationLine, TransliterationLineContent} from "../transliterationParser/model";
import {parseTransliterationLine} from "../transliterationParser/parser"
import './TransliterationInput.sass';
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {manuscriptDataUrl} from "../urls";
import {Redirect} from 'react-router-dom';

const defaultText = `$ Bo 2019/1 # KBo 71.91 • Datierung jh. • CTH 470 • Duplikate – • Fundort Büyükkale, westliche Befestigungsmauer, Schutt der Altgrabungen Planquadrat 338/348; 8,99-2,85; –-–; Niveau 1104,71 • Fund-Nr. 19-5000-5004 • Maße 62 x 45 x 22 mm
1' # [(x)] x ⸢zi⸣ x [
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


interface TransliterationLineResult {
    lineNumber: number;
    line: string;
    result?: TransliterationLine;
}

interface IState {
    transliterationOutput?: TransliterationLineResult[];
}

function renderTransliterationLineContent(content: TransliterationLineContent): JSX.Element {
    if (typeof content === 'string') {
        return <span className="hittite">{content}</span>;
    } else if (content.type === 'Akkadogramm') {
        return <span className="akadogramm">{content.content}</span>;
    } else if (content.type === 'Sumerogramm') {
        return <span className="sumerogramm">{content.content}</span>;
    } else if (content.type === 'Determinativ') {
        return <span className="determinativ">{content.content}</span>;
    } else if (content.type === 'Correction') {
        return <sup className="correction">{content.symbol}</sup>;
    } else {
        return <span>{content.symbol}</span>;
    }
}

function renderTransliterationLineResult(tlrs: TransliterationLineResult[]): JSX.Element {
    const maxLineNumber: number = tlrs
        .map((tlr) => tlr.lineNumber)
        .reduce((a, b) => a > b ? a : b);

    const maxLength = Math.ceil(Math.log10(maxLineNumber));

    return (
        <pre>
            {tlrs.map(({lineNumber, line, result}) => {
                    if (result) {
                        const ln = result.lineNumber.number.toString().padStart(maxLength, ' ');

                        return <p key={lineNumber}>
                            {ln}{result.lineNumber.isAbsolute ? '' : '\''}&nbsp;#&nbsp;
                            {result.content.map((content, index) =>
                                <span key={index}>{renderTransliterationLineContent(content)}</span>
                            )}
                        </p>
                    } else {
                        const display = line.length > 100 ? line.substr(0, 100) + '...' : line;
                        return <p key={lineNumber} className="has-text-danger">{display}</p>
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

    if (!currentUser || currentUser.username !== manuscript.creatorUsername) {
        const url = manuscriptDataUrl.buildAbsoluteUrl({mainIdentifier: manuscript.mainIdentifier.identifier});
        return <Redirect to={url}/>;
    }

    function updateTransliteration(): void {
        setState((state) => {
            const transliterationOutput = textAreaRef.current
                ? textAreaRef.current.value
                    .split('\n')
                    .map<TransliterationLineResult>((line, index) => {
                        return {lineNumber: index, line, result: parseTransliterationLine(line)};
                    })
                : [];

            return {...state, transliterationOutput};
        });
    }

    return (
        <div className="container is-fluid">
            <h2 className="subtitle is-3 has-text-centered">{t('Eingabe der Transliteration')}</h2>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label htmlFor="transliteration"
                               className="label has-text-centered">{t('Transliteration')}:</label>
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
                    {state.transliterationOutput && renderTransliterationLineResult(state.transliterationOutput)}
                </div>
            </div>
        </div>
    );
}
