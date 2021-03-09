import React from "react";
import {StringContent} from "../model/stringContent";
import {NumeralContent, TransliterationLine, Word, WordContent} from "../model/oldTransliteration";
import {MarkContent} from "../model/markContent";
import {DamageContent, getSymbolForDamageType} from "../model/damages";
import {CorrectionContent, symbolForCorrection} from "../model/corrections";
import {MultiStringContent} from "../model/multiStringContent";

function renderWordContent(content: WordContent): JSX.Element {
  if (content instanceof MultiStringContent) {
    return <span className={content.cssClass()}>
      {content.contents.map((c, index) => <span key={index}>{renderWordContent(c)}</span>)}
    </span>;
  } else {
    if (typeof content === 'string') {
      return <span>{content}</span>;
    } else if (content instanceof DamageContent) {
      return <span>{getSymbolForDamageType(content.damageType)}</span>;
    } else if (content instanceof CorrectionContent) {
      return <sup className="correction">{symbolForCorrection(content.correctionType)}</sup>;
    } else if (content instanceof StringContent) {
      return <span className={content.cssClass()}>{content.content}</span>;
    } else if (content instanceof MarkContent) {
      return <span className="has-text-warning">TODO: {content.content}!</span>
    } else if (content instanceof NumeralContent) {
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