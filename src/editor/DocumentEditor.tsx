import React, {useState} from "react";
import {FileLoader} from '../forms/FileLoader';
import {loadXml} from './xmlLoader';
import {AOXml} from "./document";
import {AOText, AOTextContent} from "./documentBody";
import {isAOParagraph} from "../model/paragraph";
import {ParagraphRender} from "./documentRender/paragraph";

interface IState {
  documentSource: string;
  aoXml: AOXml;
}

interface DocumentTextIProps {
  text: AOText;
}

function DocumentText({text}: DocumentTextIProps): JSX.Element {
  const contents: AOTextContent[] = text.content;

  return (
    <div>
      {contents.map((c) =>
        isAOParagraph(c)
          ? <ParagraphRender paragraph={c}/>
          : <p>{JSON.stringify(c, null, 2)}</p>
      )}
    </div>
  );
}

export function DocumentEditor(): JSX.Element {

  const [state, setState] = useState<IState | undefined>();

  async function readFile(file: File): Promise<void> {
    const [documentSource, aoXml] = await loadXml(file);

    setState(() => {
      return {documentSource, aoXml}
    });
  }

  return (
    <div className="container">
      {state
        ? <div className="columns">
          <div className="column">
            <DocumentText text={state.aoXml.body.div1.text}/>
          </div>
          <div className="column">
            <pre>{state.documentSource}</pre>
            {/*state.documentSource.split("\n").map((line, index) => <p key={index}>{line}</p>)*/}
          </div>
        </div>
        : <FileLoader accept="text/xml" onLoad={readFile}/>}
    </div>
  );
}