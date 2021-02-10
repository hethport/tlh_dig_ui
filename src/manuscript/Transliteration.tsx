import React from "react";
import {TransliterationLineFragment, TransliterationWordContentFragment} from "../generated/graphql";
import {classForStringContentType} from "../model/stringContent";
import {symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType} from "../model/damages";

interface IProps {
  lines: TransliterationLineFragment [];
}


function renderTransliterationLineContent(content: TransliterationWordContentFragment): JSX.Element {
  if (content.__typename === 'StringContent') {
    return <span className={classForStringContentType(content.stringContentType)}>{content.content}</span>;
  } else if (content.__typename === 'CorrectionContent') {
    return <sup className="correction">{symbolForCorrection(content.correctionType)}</sup>;
  } else if (content.__typename === 'DamageContent') {
    return <span>{getSymbolForDamageType(content.damageType)}</span>;
  } else if (content.__typename === 'NumeralContent') {
    return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
  } else {
    return <></>;
  }
}


export function Transliteration({lines}: IProps): JSX.Element {

  const maxLineNumber: number = lines
    .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
    .reduce((a, b) => a > b ? a : b, 0);

  const maxLength = Math.ceil(Math.log10(maxLineNumber));

  return (
    <pre>
            {lines.map(({transliterationLineInput, result}, lineIndex) => {
                if (result) {
                  const ln = result.lineNumber.toString().padStart(maxLength, ' ');

                  return (
                    <p key={lineIndex}>
                      <sup>{ln}{result.isAbsolute ? '' : '\''}</sup>
                      &nbsp;
                      {result.words.map((word, index) =>
                        <span key={index}>
                                            {word.content.map((c, i) =>
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
  );
}