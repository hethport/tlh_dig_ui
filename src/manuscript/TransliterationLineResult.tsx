import React from "react";
import {TransliterationWordParseResult} from "../model/transliterationTextLineParseResult";
import {classForStringContentType} from "../model/stringContent";
import {symbolForCorrection} from "../model/corrections";
import {getSymbolForDamageType} from "../model/damages";
import {TransliterationLineParseResult} from "../transliterationParser/parser";
import {TransliterationWordContentInputUnion} from "../generated/graphql";

function renderTransliterationLineContent(
  {
    numeralContent,
    correctionContent,
    damageContent,
    markContent,
    stringContent
  }: TransliterationWordContentInputUnion
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
  } else {
    throw new Error("");
  }
}

// Single word

function TransliterationWordParseResultComponent({wordInput, result}: TransliterationWordParseResult): JSX.Element {
  return <>
    {result
      ? result.content.map((c, i) => <span key={i}>{renderTransliterationLineContent(c)}</span>)
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