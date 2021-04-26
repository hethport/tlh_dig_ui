import React, {useState} from "react";
import {FileLoader} from '../forms/FileLoader';
import {loadXml} from './xmlLoader';
import {AOXml} from "./document";

interface IState {
  documentSource: string;
  aoXml: AOXml;
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
            <pre>{JSON.stringify(state.aoXml.body, null, 2)}</pre>
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