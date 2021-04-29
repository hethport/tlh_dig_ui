import React, {Fragment} from "react";
import {Paragraph} from "../../model/paragraph";
import {AOSentenceContent} from "../../model/sentence";
import {isAOWord} from "../../model/sentenceContent/word";
import {renderWord} from "../../manuscript/TransliterationLineResult";

interface IProps {
  paragraph: Paragraph;
}

function renderSentenceContent(sc: AOSentenceContent): JSX.Element {
  if (isAOWord(sc)) {
    return <>
      <pre>{JSON.stringify(sc.content, null, 2)}</pre>
      <pre>{renderWord(sc)}</pre>
    </>;
  } else {
    /*
    if (isAOManuscripts(sc)) {
    } else if (isAOGap(sc)) {
    } else if (isAOLineBreak(sc)) {
    }
     */
    return <div>{JSON.stringify(sc)}</div>
  }
}

export function ParagraphRender(
{
  paragraph
}
: IProps): JSX.Element
{

  const contents: AOSentenceContent[] = paragraph.s.content;

  return <>
    {contents.map((c, index) => <Fragment key={index}>{renderSentenceContent(c)}</Fragment>)}
  </>;
}