import React from "react";
import {TransliterationWordContent, TransliterationWordParseResult} from "../model/transliterationTextLineParseResult";
import {TransliterationLineParseResult} from "../transliterationParser/parser";
import {classForStringContentType, isStringContentInput} from "../model/stringContent";
import {isCorrection, symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType, isDamage} from "../model/damages";
import {isMarkContent} from "../model/markContent";

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
  } else if (isMarkContent(content)) {
    return <span>TODO: {content}!</span>
  } else {
    return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
  }
}

function renderTransliterationWordParseResult({wordInput, result}: TransliterationWordParseResult): JSX.Element {
  return <>
    {result
      ? result.contents.map((c, i) => <span key={i}>{renderTransliterationLineContent(c)}</span>)
      : <span>{wordInput}</span>}
  </>;
}

export function TransliterationLineResultComponent({lines}: IProps): JSX.Element {

  const maxLineNumber: number = lines
    .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
    .reduce((a, b) => a > b ? a : b, 0);

  const maxLength = Math.ceil(Math.log10(maxLineNumber));

  return (
    <div className="my-3 box has-background-grey-lighter">
      {lines.map(({transliterationLineInput, result}, lineIndex) => {
          if (result) {
            const ln = result.lineNumber.toString().padStart(maxLength, ' ');

            return (
              <p key={lineIndex}>
                <sup>{ln}{result.lineNumberIsAbsolute ? '' : '\''}</sup>
                &nbsp;
                {result.content.map((word, index) => <span key={index}>
                {renderTransliterationWordParseResult(word)}&nbsp;</span>
                )}
              </p>
            );
          } else {
            const display = transliterationLineInput.length > 100 ? `${transliterationLineInput.substr(0, 100)}...` : transliterationLineInput;
            return <p key={lineIndex} className="has-text-danger">{display}</p>
          }
        }
      )}
    </div>
  );
}