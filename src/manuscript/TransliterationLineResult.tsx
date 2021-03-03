import React from "react";
import {classForStringContentType} from "../model/stringContent";
import {symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType} from "../model/damages";
import {LineParseResult} from "../transliterationParser/parser";
import {WordContentInputUnion, WordInput} from "../generated/graphql";

function renderWordContent(
  {numeralContent, correctionContent, damageContent, markContent, stringContent, xContent}: WordContentInputUnion
): JSX.Element {
  if (stringContent) {
    return <span className={classForStringContentType(stringContent.type)}>{stringContent.content}</span>;
  } else if (correctionContent) {
    return <sup className="correction">{symbolForCorrection(correctionContent)}</sup>;
  } else if (damageContent) {
    return <span>{getSymbolForDamageType(damageContent)}</span>;
  } else if (markContent) {
    return <span className="has-text-warning">TODO: {markContent.content}!</span>
  } else if (numeralContent) {
    return numeralContent.isSubscript ? <sub>{numeralContent.content}</sub> : <span>{numeralContent.content}</span>;
  } else if (xContent) {
    return <span>'x'</span>;
  } else {
    return <div>TODO!</div>;
    // throw new Error("");
  }
}

// Single word

function renderWordInput({input, content}: WordInput): JSX.Element {
  return <>
    {content.length > 0
      ? content.map((c, i) => <span key={i}>{renderWordContent(c)}</span>)
      : <span className="has-text-danger">{input}</span>}
  </>
}

// Single line

function renderLine({lineInput, result}: LineParseResult, maxLength: number): JSX.Element {
  if (result) {
    const {lineNumber, lineNumberIsAbsolute, words} = result;

    const ln = lineNumber.toString().padStart(maxLength, ' ') + (lineNumberIsAbsolute ? '' : '\'');

    return <>
      <sup>{ln}</sup>
      &nbsp;
      {words.map((wordInput, index) => <span key={index}>{renderWordInput(wordInput)}&nbsp;</span>)}
    </>;
  } else {
    return (
      <span className="has-text-danger">
        {lineInput.length > 100 ? `${lineInput.substr(0, 100)}...` : lineInput}
      </span>
    );
  }
}

// All lines

interface IProps {
  lines: LineParseResult[];
}

export function TransliterationLineParseResultsComponent({lines}: IProps): JSX.Element {

  const maxLineNumber: number = lines
    .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
    .reduce((a, b) => a > b ? a : b, 0);

  const maxLength = Math.ceil(Math.log10(maxLineNumber));

  return (
    <div className="box">
      {lines.map((lineParseResult, lineIndex) =>
        <p key={lineIndex}>{renderLine(lineParseResult, maxLength)}</p>
      )}
    </div>
  );
}