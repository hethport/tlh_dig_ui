import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {IProps} from "./ManuscriptHelpers";
import {
    Akadogramm,
    Determinativ,
    Hittite,
    parseTransliterationLine,
    Sumerogramm,
    Supplemented,
    TransliterationLineContent,
    UnCertain
} from "@hethport/transliteration_parser";
import './TransliterationInput.sass';
import {Result} from 'parsimmon';
import {TransliterationLine} from "@hethport/transliteration_parser/dist/model";


interface TransliterationLineResult {
    lineNumber: number;
    line: string;
    result?: TransliterationLine;
}

interface IState {
    transliterationOutput?: TransliterationLineResult[];
}

function renderTransliterationLineContent(content: TransliterationLineContent): JSX.Element | string {
    if (content instanceof Supplemented) {
        const childContent = renderTransliterationLineContent(content.content);
        return <span>[{childContent}]</span>;
    } else if (content instanceof UnCertain) {
        const childContent = renderTransliterationLineContent(content.content);
        return <span>{childContent}<span className="superscript">?</span></span>;
    } else {
        if (content instanceof Hittite) {
            return <span className="hittite">{content.content}</span>;
        } else if (content instanceof Akadogramm) {
            return <span className="akadogramm">{content.content}</span>;
        } else if (content instanceof Sumerogramm) {
            return <span className="sumerogramm">{content.content}</span>;
        } else if (content instanceof Determinativ) {
            return <span className="determinativ">{content.content}</span>;
        } else {
            return JSON.stringify(content);
        }
    }
}

function renderTransliterationLineResult(tlrs: TransliterationLineResult[]): JSX.Element {
    return <table>
        <tbody>
            {tlrs.map(({lineNumber, line, result}) =>
                <tr key={lineNumber}>
                    {result
                        ? <>
                            <td className="has-text-right">
                                {result.lineNumber.number}{result.lineNumber.isAbsolute ? '' : '\''}&nbsp;#&nbsp;
                            </td>
                            <td>
                                {result.content.map((content, index) =>
                                    <span key={index}>{renderTransliterationLineContent(content)}&nbsp;</span>
                                )}
                            </td>
                        </>
                        : <td colSpan={2} className="has-text-danger">{line}</td>}
                </tr>
            )}
        </tbody>
    </table>
}

export function TransliterationInput({manuscript}: IProps): JSX.Element {

    const {t} = useTranslation('common');
    const [state, setState] = useState<IState>({})

    function updateTransliteration(textArea: HTMLTextAreaElement): void {
        const transliterationOutput = textArea.value.split('\n')
            .map((line, index) => {
                const parsed: Result<TransliterationLine> = parseTransliterationLine(line);
                return {lineNumber: index, line, result: parsed.status ? parsed.value : undefined};
            });

        setState(() => { return {transliterationOutput}});
    }

    return (
        <>
            <h1 className="title is-3 has-text-centered">
                {t('Manuskript {{mainIdentifier}}', {mainIdentifier: manuscript.mainIdentifier.identifier})}: {t('Eingabe der Transliteration')}
            </h1>

            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label htmlFor="transliteration"
                               className="label has-text-centered">{t('Transliteration')}:</label>
                        <div className="control">
                            <textarea className="textarea" id="transliteration" placeholder={t('Transliteration')}
                                      rows={20} onChange={(event) => updateTransliteration(event.target)}/>
                        </div>
                    </div>
                </div>

                <div className="column">
                    {state.transliterationOutput && renderTransliterationLineResult(state.transliterationOutput)}
                </div>
            </div>
        </>
    );
}
