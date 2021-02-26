import React from "react";
import {TransliterationWordContent} from "../model/transliterationTextLine";
import {TransliterationLineParseResult} from "../transliterationParser/parser";
import {classForStringContentType, isStringContentInput} from "../model/stringContent";
import {isCorrection, symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType, isDamage} from "../model/damages";

interface IProps {
  lines: TransliterationLineParseResult[];
}

function renderTransliterationLineContent(content: TransliterationWordContent): JSX.Element {
  if (isStringContentInput(content)) {
    return <span className={classForStringContentType(content.type)}>{content.content}</span>;
  } else if (isCorrection(content)) {
    return <sup className="correction">{symbolForCorrection(content)}</sup>;
  } else if (isDamage(content)) {
    return <span>{getSymbolForDamageType(content)}</span>;
  } else {
    return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
  }
}

export function TransliterationLineResultComponent({lines}: IProps): JSX.Element {

  const maxLineNumber: number = lines
    .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
    .reduce((a, b) => a > b ? a : b, 0);

  const maxLength = Math.ceil(Math.log10(maxLineNumber));

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
    </div>
  );
}