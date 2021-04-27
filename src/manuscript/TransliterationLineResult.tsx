import React from "react";
import {isDeterminativ} from "../model/wordContent/determinativ";
import {TransliterationLine} from "../model/transliterationLine";
import {isAoSign} from "../model/wordContent/sign";
import {getSymbolForDamageType, isDamageContent} from "../model/wordContent/damages";
import {isCorrectionContent} from "../model/wordContent/corrections";
import {isAkkadogramm, isSumerogramm} from "../model/wordContent/multiStringContent";
import {AOWord} from "../model/sentenceContent/word";
import {isMaterLectionis} from "../model/wordContent/materLectionis";
import {isNumeralContent} from "../model/wordContent/numeralContent";
import {isAoNote} from "../model/wordContent/footNote";
import {isAoKolonMark} from "../model/wordContent/kolonMark";
import {AOWordContent} from "../model/wordContent/wordContent";

function renderWordContent(content: AOWordContent): JSX.Element {
  if (typeof content === 'string') {
    return <span>{content}</span>;
  } else if (isAkkadogramm(content)) {
    return <span className="akkadogramm">
      {content.contents.map((c, index) => <span key={index}>{renderWordContent(c)}</span>)}
    </span>;
  } else if (isSumerogramm(content)) {
    return <span className="sumerogramm">
      {content.contents.map((c, index) => <span key={index}>{renderWordContent(c)}</span>)}
    </span>;
  } else if (isDamageContent(content)) {
    return <span>{getSymbolForDamageType(content.damageType)}</span>;
  } else if (isCorrectionContent(content)) {
    return <sup className="correction">{content.c}</sup>;
  } else if (isDeterminativ(content)) {
    return <span className="determinativ">{content.content}</span>;
  } else if (isMaterLectionis(content)) {
    return <span className="materLectionis">{content.content}</span>;
  } else if (isNumeralContent(content)) {
    return <span className="numberal">{content.content}</span>;
  } else if (isAoSign(content)) {
    return <span className="has-text-warning">TODO: {content.content}!</span>
  } else if (isAoNote(content)) {
    return <span className="has-text-warning">TODO: {content.content}!</span>
  } else if (isAoKolonMark(content)) {
    return <span className="has-text-warning">TODO: {content.content}!</span>
  } else {
    // Illegible Content
    return <span>x</span>;
  }
}

// Single word

export function renderWord({trans, content}: AOWord): JSX.Element {
  return <>
    {content.length > 0
      ? content.map((c, i) => <span className="hittie" key={i}>{renderWordContent(c)}</span>)
      : <span className="has-text-danger">{trans}</span>}
  </>
}

// Single line

export function renderLine({lineInput, result}: TransliterationLine): JSX.Element {
  if (result) {
    const {lineNumber, words} = result;

    return <>
      <sup>{lineNumber}</sup>
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
  return (
    <div className="box">
      {lines.map((lineParseResult, lineIndex) =>
        <p key={lineIndex} className="hittite">{renderLine(lineParseResult)}</p>
      )}
    </div>
  );
}