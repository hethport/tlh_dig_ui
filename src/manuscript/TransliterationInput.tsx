import React, {createRef, useState} from 'react';
import {useTranslation} from "react-i18next";
import {IProps} from "./ManuscriptHelpers";
import {TransliterationWord, TransliterationWordContent} from '../model/transliterationTextLine';
import {parseTransliterationLine, TransliterationLineParseResult} from "../transliterationParser/parser"
import './TransliterationInput.sass';
import {useSelector} from "react-redux";
import {activeUserSelector} from "../store/store";
import {homeUrl} from "../urls";
import {Redirect} from 'react-router-dom';
import {ManuscriptSide, StringContentTypeEnum} from "../generated/graphql";

interface TransliterationLineResult extends TransliterationLineParseResult {
    lineIndex: number;
}

interface IState {
    transliterationOutput?: TransliterationLineResult[];
}

function renderTransliterationLineContent(content: TransliterationWordContent, index: number): JSX.Element {
    if (typeof content === 'string') {
        return <span key={index} className="hittite">{content}</span>;
    } else if (content.type === StringContentTypeEnum.Akadogramm) {
        return <span key={index} className="akadogramm">{content.content}</span>;
    } else if (content.type === StringContentTypeEnum.Determinativ) {
        return <span key={index} className="determinativ">{content.content}</span>;
    } else if (content.type === StringContentTypeEnum.MaterLectionis) {
        //TODO: class!
        return <span key={index}>{content.content}</span>;
    } else if (content.type === StringContentTypeEnum.Sumerogramm) {
        return <span key={index} className="sumerogramm">{content.content}</span>;
    } else if (content.type === 'Correction') {
        return <sup key={index} className="correction">{content.symbol}</sup>;
    } else if (content.type === 'NumeralContent') {
        return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
    } else {
        return <span key={index}>{content.symbol}</span>;
    }
}

function renderTransliterationWord({content}: TransliterationWord): JSX.Element {
    return <span>{content.map(renderTransliterationLineContent)}&nbsp;</span>;
}

function renderTransliterationLineResult(tlrs: TransliterationLineResult[]): JSX.Element {
    const maxLineNumber: number = tlrs
        .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
        .reduce((a, b) => a > b ? a : b, 0);

    const maxLength = Math.ceil(Math.log10(maxLineNumber));

    return (
        <pre>
            {tlrs.map(({lineIndex, line, result}) => {
                    if (result) {
                        const ln = result.lineNumber.toString().padStart(maxLength, ' ');

                        return <p key={lineIndex}>
                            <sup>{ln}{result.isAbsolute ? '' : '\''}</sup>&nbsp;
                            {result.content.map((content, index) =>
                                <span key={index}>{renderTransliterationWord(content)}</span>
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

function saveBlob(content: string, fileName: string): void {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.hidden = true;

    const file = new Blob([content]);

    const url = window.URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
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
                    .map<TransliterationLineResult>((line, lineIndex) => {
                        return {...parseTransliterationLine(line), lineIndex};
                    })
                : [];

            return {...state, transliterationOutput};
        });
    }

    function exportAsXml(): void {
        if (!state.transliterationOutput) {
            return;
        }

        // FIXME: get ManuscriptSide!
        const xmlLinesOuptut = state.transliterationOutput
            .map((line) => line.result ? line.result.xmlify(manuscript.mainIdentifier.identifier, ManuscriptSide.Front) : '')
            .join('\n\n\n');

        const xmlOutput = `<AOxml>
${xmlLinesOuptut}
</AOxml>`;

        saveBlob(xmlOutput, manuscript.mainIdentifier.identifier + '.xml');
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
