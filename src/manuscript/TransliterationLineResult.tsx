import React from "react";
import {TransliterationWord, TransliterationWordContent} from "../model/transliterationTextLine";
import {
    ManuscriptSide,
    TransliterationLineInput,
    TransliterationLineResultInput,
    TransliterationWordContentInputUnion,
    TransliterationWordInput,
    useUploadTransliterationMutation
} from "../generated/graphql";
import {useTranslation} from "react-i18next";
import {TransliterationLineParseResult} from "../transliterationParser/parser";
import {classForStringContentType, isStringContentInput} from "../model/stringContent";
import {isCorrection, symbolForCorrection} from "../model/corrections";
import {isDamage} from "../model/damages";

interface IProps {
    mainIdentifier: string;
    lines: TransliterationLineParseResult[];
}

function renderTransliterationLineContent(content: TransliterationWordContent): JSX.Element {
    if (isStringContentInput(content)) {
        return <span className={classForStringContentType(content.type)}>{content.content}</span>;
    } else if (isCorrection(content)) {
        return <sup className="correction">{symbolForCorrection(content)}</sup>;
    } else if (isDamage(content)) {
        return <span>{content.symbol}</span>;
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

export function TransliterationLineResultComponent({mainIdentifier, lines}: IProps): JSX.Element {

    const {t} = useTranslation('common');
    const [uploadTransliteration] = useUploadTransliterationMutation();

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

    function upload(): void {
        console.info('TODO: upload!');

        const values: TransliterationLineInput[] = lines
            .map<TransliterationLineInput>(({transliterationLineInput, result}, lineIndex) => {

                let content: TransliterationLineResultInput | undefined = result
                    ? {
                        isAbsolute: result.isAbsolute,
                        lineNumber: result.lineNumber,
                        words: result.content.map(convertWord)
                    }
                    : undefined;

                return {lineIndex, transliterationLineInput, result: content}
            });

        uploadTransliteration({variables: {mainIdentifier, values}})
            .catch((error) => console.error('Could not upload transliteration:\n' + error));
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

            <div className="buttons">
                <button type="button" className="button is-link is-fullwidth"
                        onClick={exportAsXml}>{t('xml_export')}</button>
                <button type="button" className="button is-link is-fullwidth"
                        onClick={upload}>{t('create_transliteration')}</button>
            </div>
        </div>
    );
}