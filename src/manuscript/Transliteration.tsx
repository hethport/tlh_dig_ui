import React from "react";
import {LineFragment, WordContentFragment, WordFragment} from "../generated/graphql";
import {classForStringContentType} from "../model/stringContent";
import {symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType} from "../model/damages";


// Word content

function renderWordContent(content: WordContentFragment): JSX.Element {
  if (content.__typename === 'StringContent') {
    return <span className={classForStringContentType(content.stringContentType)}>{content.content}</span>;
  } else if (content.__typename === 'CorrectionContent') {
    return <sup className="correction">{symbolForCorrection(content.correctionType)}</sup>;
  } else if (content.__typename === 'DamageContent') {
    return <span>{getSymbolForDamageType(content.damageType)}</span>;
  } else if (content.__typename === 'NumeralContent') {
    return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
  } else if (content.__typename === 'MarkContent') {
    return <span>TODO: Mark Content...</span>
  } else if (content.__typename === 'XContent') {
    return <span>x</span>;
  } else {
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
      <sup>{ln}</sup>
      &nbsp;
      {words.map((word, index) => <span key={index}>{renderWord(word)}&nbsp;</span>)}
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