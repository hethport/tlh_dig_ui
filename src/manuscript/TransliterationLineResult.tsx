import React from "react";
import {TransliterationWordContent, TransliterationWordParseResult} from "../model/transliterationTextLineParseResult";
import {classForStringContentType, isStringContentInput} from "../model/stringContent";
import {isCorrection, symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType, isDamage} from "../model/damages";
import {isMarkContent} from "../model/markContent";
import {TransliterationLineParseResult} from "../transliterationParser/parser";

function renderTransliterationLineContent(content: TransliterationWordContent): JSX.Element {
  if (isStringContentInput(content)) {
    return <span className={classForStringContentType(content.type)}>{content.content}</span>;
  } else if (isCorrection(content)) {
    return <sup className="correction">{symbolForCorrection(content)}</sup>;
  } else if (isDamage(content)) {
    return <span>{getSymbolForDamageType(content)}</span>;
  } else if (isMarkContent(content)) {
    return <span className="has-text-warning">TODO: {content.content}!</span>
  } else {
    return content.isSubscript ? <sub>{content.content}</sub> : <span>{content.content}</span>;
  }
}

// Single word

function TransliterationWordParseResultComponent({wordInput, result}: TransliterationWordParseResult): JSX.Element {
  return <>
    {result
      ? result.contents.map((c, i) => <span key={i}>{renderTransliterationLineContent(c)}</span>)
      : <span className="has-text-danger">{wordInput}</span>}
  </>;
}

// Single line

function TransliterationLineParseResultComponent(
  {transliterationLineInput, result}: TransliterationLineParseResult): JSX.Element {
  if (result) {
    return (
      <p>
        <sup>{result.lineNumber}{result.lineNumberIsAbsolute ? '' : '\''}</sup>
        &nbsp;
        {result.content.map((word, index) =>
          <span key={index}>
            <TransliterationWordParseResultComponent wordInput={word.wordInput} result={word.result}/>&nbsp;
          </span>
        )}
      </p>
    );
  } else {
    return (
      <p className="has-text-danger">
        {transliterationLineInput.length > 100
          ? `${transliterationLineInput.substr(0, 100)}...`
          : transliterationLineInput}
      </p>
    );
  }
}

// All lines

interface IProps {
  lineResults: TransliterationLineParseResult[];
}

export function TransliterationLineParseResultsComponent({lineResults}: IProps): JSX.Element {
  return (
    <div className="my-3 box has-background-grey-lighter">
      {lineResults.map((lineParseResult, lineIndex) =>
        <TransliterationLineParseResultComponent
          key={lineIndex}
          transliterationLineInput={lineParseResult.transliterationLineInput}
          result={lineParseResult.result}/>
      )}
    </div>
  );
}