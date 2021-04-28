import React, {Fragment} from "react";
import {Paragraph} from "../../model/paragraph";
import {AOSentenceContent} from "../../model/sentence";
import {WordRender} from "./word";
import {isAOWord} from "../../model/sentenceContent/word";

interface IProps {
  paragraph: Paragraph;
}

function renderSentenceContent(sc: AOSentenceContent): JSX.Element {
  if (isAOWord(sc)) {
    return <WordRender word={sc}/>;
  } else {
    /*
    if (isAOManuscripts(sc)) {
    } else if (isAOGap(sc)) {
    } else if (isAOLineBreak(sc)) {
    }
     */
    return <div>{JSON.stringify(sc, null, 2)}</div>
  }
}

export function ParagraphRender({paragraph}: IProps): JSX.Element {

  const contents: AOSentenceContent[] = paragraph.s.content;

  return <>
    {contents.map((c, index) => <Fragment key={index}>{renderSentenceContent(c)}</Fragment>)}
  </>;
}