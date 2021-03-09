import React from "react";
import {classForStringContentType, StringContent} from "../model/stringContent";
import {LineParseResult} from "../transliterationParser/parser";
import {NumeralContent, Word, WordContent} from "../model/oldTransliteration";
import {MarkContent} from "../model/markContent";
import {getCssClassForMultiStringContentType, MultiStringContent} from "../model/multiStringContent";

function renderWordContent(content: WordContent): JSX.Element {
  if (content instanceof MultiStringContent) {
    return <span className={getCssClassForMultiStringContentType(content.type)}>{content.contents}</span>;
  } else {
    if (typeof content === 'string') {
      /*
      if (correctionContent) {
        return <sup className="correction">{symbolForCorrection(correctionContent)}</sup>;
      } else if (damageContent) {
        return <span>{getSymbolForDamageType(damageContent)}</span>;
      } else
       */
      return <span>TODO!</span>;
    } else if (content instanceof StringContent) {
      return <span className={classForStringContentType(content.type)}>{content.content}</span>;
    } else if (content instanceof MarkContent) {
      return <span className="has-text-warning">TODO: {content.content}!</span>
    } else if (content instanceof NumeralContent) {
      return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
    } else {
      return <span>'x'</span>;
    }
  }
}

// Single word

function renderWordInput({input, content}: Word): JSX.Element {
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