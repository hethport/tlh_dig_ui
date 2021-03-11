import React from "react";
import {cssClassForStringContent, isStringContent} from "../model/stringContent";
import {isNumeralContent, TransliterationLine, Word, WordContent} from "../model/oldTransliteration";
import {isMarkContent} from "../model/markContent";
import {getSymbolForDamageType, isDamageContent} from "../model/damages";
import {isCorrectionContent, symbolForCorrection} from "../model/corrections";
import {cssClassForMultiStringContent, isMultiStringContent} from "../model/multiStringContent";

function renderWordContent(content: WordContent): JSX.Element {
  if (isMultiStringContent(content)) {
    return <span className={cssClassForMultiStringContent(content)}>
      {content.contents.map((c, index) => <span key={index}>{renderWordContent(c)}</span>)}
    </span>;
  } else {
    if (typeof content === 'string') {
      return <span>{content}</span>;
    } else if (isDamageContent(content)) {
      return <span>{getSymbolForDamageType(content.damageType)}</span>;
    } else if (isCorrectionContent(content)) {
      return <sup className="correction">{symbolForCorrection(content.correctionType)}</sup>;
    } else if (isStringContent(content)) {
      return <span className={cssClassForStringContent(content)}>{content.content}</span>;
    } else if (isMarkContent(content)) {
      return <span className="has-text-warning">TODO: {content.content}!</span>
    } else if (isNumeralContent(content)) {
      return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
    } else {
      // Illegible Content
      return <span>x</span>;
    }
  }
}

// Single word

export function renderWord({input, content}: Word): JSX.Element {
  return <>
    {content.length > 0
      ? content.map((c, i) => <span className="hittie" key={i}>{renderWordContent(c)}</span>)
      : <span className="has-text-danger">{input}</span>}
  </>
}

// Single line

export function renderLine({lineInput, result}: TransliterationLine, maxLength: number): JSX.Element {
  if (result) {
    const {lineNumber, lineNumberIsAbsolute, words} = result;

    const ln = lineNumber.toString().padStart(maxLength, ' ') + (lineNumberIsAbsolute ? '' : '\'');

    return <>
      <sup>{ln}</sup>
      &nbsp;
      {words.map((wordInput, index) => <span key={index}>{renderWord(wordInput)}&nbsp;</span>)}
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
  lines: TransliterationLine[];
}

export function Transliteration({lines}: IProps): JSX.Element {

  const maxLineNumber: number = lines
    .flatMap((tlr) => tlr.result ? [tlr.result.lineNumber] : [])
    .reduce((a, b) => a > b ? a : b, 0);

  const maxLength = Math.ceil(Math.log10(maxLineNumber));

  return (
    <div className="box">
      {lines.map((lineParseResult, lineIndex) =>
        <p key={lineIndex} className="hittite">{renderLine(lineParseResult, maxLength)}</p>
      )}
    </div>
  );
}