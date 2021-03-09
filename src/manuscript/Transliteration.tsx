import React from "react";
import {
  NumeralContent,
  TransliterationLine,
  Word,
  WordContent,
  wordContentIsMultiStringContent
} from "../model/oldTransliteration";
import {classForStringContentType, StringContent} from "../model/stringContent";
import {getCssClassForMultiStringContentType} from "../model/multiStringContent";
import {MarkContent} from "../model/markContent";

// Word content

function renderWordContent(content: WordContent): JSX.Element {
  if (wordContentIsMultiStringContent(content)) {
    return <span className={getCssClassForMultiStringContentType(content.type)}>TODO!</span>
  } else {
    if (typeof content === 'string') {
      // Text, Correction, Damage!
      return <span className="hittite">{content}</span>;
    } else {
      let y = content;

      if (content instanceof StringContent) {
        return <span className={classForStringContentType(content.type)}>{content.content}</span>;
      } else if (content instanceof NumeralContent) {
        return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
      } else if (content instanceof MarkContent) {
        return <span>TODO: Mark Content...</span>
      } else {
        return <span>x</span>
      }
    }
  }
}

// Single word

function renderWord({input, content}: Word): JSX.Element {
  return <>
    {content.length > 0
      ? content.map((c, i) => <span key={i}>{renderWordContent(c)}</span>)
      : <span className="has-text-danger">{input}</span>
    }
  </>
}

// Single line

function renderLine({lineInput, result}: TransliterationLine, maxLength: number): JSX.Element {
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
  lines: TransliterationLine[];
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