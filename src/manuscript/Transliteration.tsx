import React from "react";
import {LineFragment, WordContentFragment, WordFragment} from "../generated/graphql";
import {classForStringContentType} from "../model/stringContent";
import {symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType} from "../model/damages";


// Word content

function renderWordContent(content: WordContentFragment): JSX.Element {
  switch (content.__typename) {
    case 'StringContent':
      return <span className={classForStringContentType(content.stringContentType)}>{content.content}</span>;
    case "CorrectionContent":
      return <sup className="correction">{symbolForCorrection(content.correctionType)}</sup>;
    case "DamageContent":
      return <span>{getSymbolForDamageType(content.damageType)}</span>;
    case "IllegibleContent":
      return <span>x</span>;
    case "MarkContent":
      return <span>TODO: Mark Content...</span>
    case "NumeralContent":
      return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
    default:
      return <></>;
  }
}

// Single word

function renderWord({input, content}: WordFragment): JSX.Element {
  return <>
    {content.length > 0
      ? content.map((c, i) => <span key={i}>{renderWordContent(c)}</span>)
      : <span className="has-text-danger">{input}</span>
    }
  </>
}

// Single line

function renderLine({lineInput, result}: LineFragment, maxLength: number): JSX.Element {
  if (result) {
    const {lineNumber, isAbsolute, words} = result;

    const ln = lineNumber.toString().padStart(maxLength, ' ') + (isAbsolute ? '' : '\'');

    return <>
      <sup>{ln}</sup>&nbsp;{words.map((word) => <span key={word.input}>{renderWord(word)}&nbsp;</span>)}
    </>;
  } else {
    return <span className="has-text-danger">
      {lineInput.length > 100 ? `${lineInput.substr(0, 100)}...` : lineInput}
    </span>
  }
}

// All lines

interface IProps {
  lines: LineFragment[];
}

export function Transliteration({lines}: IProps): JSX.Element {

  const maxLineNumber: number = lines
    .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
    .reduce((a, b) => a > b ? a : b, 0);

  const maxLength = Math.ceil(Math.log10(maxLineNumber));

  return (
    <pre>
        {lines.map((line, lineIndex) =>
          <p key={lineIndex}>{renderLine(line, maxLength)}</p>
        )}
    </pre>
  );
}