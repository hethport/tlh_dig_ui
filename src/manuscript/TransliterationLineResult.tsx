import React from "react";
import {TransliterationWordContent} from "../model/transliterationTextLine";
import {ManuscriptSide} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {TransliterationLineParseResult} from "../transliterationParser/parser";
import {classForStringContentType, isStringContentInput} from "../model/stringContent";
import {isCorrection, symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType, isDamage} from "../model/damages";

interface IProps {
    mainIdentifier: string;
    lines: TransliterationLineParseResult[];
    updateTransliteration: () => void;
    transliterationIsUpToDate?: boolean;
}

function renderTransliterationLineContent(content: TransliterationWordContent): JSX.Element {
    if (isStringContentInput(content)) {
        return <span className={classForStringContentType(content.type)}>{content.content}</span>;
    } else if (isCorrection(content)) {
        return <sup className="correction">{symbolForCorrection(content)}</sup>;
    } else if (isDamage(content)) {
        return <span>{getSymbolForDamageType(content.type)}</span>;
    } else {
        return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
    }
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

export function TransliterationLineResultComponent(
    {mainIdentifier, lines, updateTransliteration, transliterationIsUpToDate}: IProps
): JSX.Element {

    const {t} = useTranslation('common');

    const maxLineNumber: number = lines
        .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
        .reduce((a, b) => a > b ? a : b, 0);

    const maxLength = Math.ceil(Math.log10(maxLineNumber));

    function exportAsXml(): void {
        // FIXME: get ManuscriptSide!
        const xmlLinesOutput = lines
            .map((line) => line.result ? line.result.xmlify(mainIdentifier, ManuscriptSide.Front) : '')
            .join('\n\n\n');

        const xmlOutput = '<AOxml>\n' + xmlLinesOutput + '\n</AOxml>';

        saveBlob(xmlOutput, mainIdentifier + '.xml');
    }

    return (
        <div>
            <div className="field">
                <pre>
                    {lines.map(({transliterationLineInput, result}, lineIndex) => {
                            if (result) {
                                const ln = result.lineNumber.toString().padStart(maxLength, ' ');

                                return (
                                    <p key={lineIndex}>
                                        <sup>{ln}{result.isAbsolute ? '' : '\''}</sup>
                                        &nbsp;
                                        {result.content.map((word, index) =>
                                                <span key={index}>
                                            {word.contents.map((c, i) =>
                                                <span key={i}>{renderTransliterationLineContent(c)}</span>)
                                            }&nbsp;
                                        </span>
                                        )}
                                    </p>
                                );
                            } else {
                                const display = transliterationLineInput.length > 100 ? `${transliterationLineInput.substr(0, 100)}...` : transliterationLineInput;
                                return <p key={lineIndex} className="has-text-danger">{display}</p>
                            }
                        }
                    )}
                </pre>
            </div>

            <div className="columns">
                <div className="column">
                    <button type="button" className="button is-link is-fullwidth" onClick={exportAsXml}>
                        {t('xml_export')}
                    </button>
                </div>
                <div className="column">
                    <button type="button" className="button is-link is-fullwidth" onClick={updateTransliteration}
                            disabled={transliterationIsUpToDate}>
                        {t('create_transliteration')}
                    </button>
                </div>
            </div>
        </div>
    );
}