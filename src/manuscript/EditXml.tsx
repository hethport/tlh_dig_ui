import React, {useState} from 'react';
import {MyXmlAttribute, MyXmlElementNode, MyXmlNode, readXmlFile} from "../xmlStuff/xmlModel";

interface IState {
  selectedFile?: File;
  readDocument?: MyXmlNode;
}

function renderAttributes(attributes: MyXmlAttribute[]): string | null {
  if (attributes.length === 0) {
    return null;
  } else {
    return ' ' + attributes.map((attr) => `${attr.key}="${attr.value}"`).join(' ');
  }
}

function renderNode(node: MyXmlNode): JSX.Element | string {
  if (node instanceof MyXmlElementNode) {
    const children = Array.from(node.childNodes);

    const renderedAttributes = renderAttributes(node.attributes);

    return <>
      <button className="button">&lt;{node.tagName}{renderedAttributes}&gt;</button>
      {children.map((childNode, index) =>
        <span key={index}>{renderNode(childNode)}</span>
      )}
      <button className="button is-static">&lt;/{node.tagName}&gt;</button>
    </>;
  } else {
    return node.content;
  }
}

export function EditXml(): JSX.Element {

  const [state, setState] = useState<IState>({});

  function handleFileSelect(files: FileList | null): void {
    setState(() => {
      return {selectedFile: (files && files.length > 0) ? files[0] : undefined}
    });
  }

  async function readFile(): Promise<void> {
    if (!state.selectedFile) {
      alert('Sie haben keine Datei ausgewählt!');
      return;
    }

    const readDocument = await readXmlFile(state.selectedFile);

    setState(() => {
      return {readDocument}
    });
  }

  return <div className="container">
    <h1 className="title is-3 has-text-centered">Edit XML</h1>

    <div className="field">
      <label htmlFor="xmlFile" className="label">Xml Datei:</label>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input type="file" className="input" onChange={(event) => handleFileSelect(event.target.files)}/>
        </div>
        <div className="control">
          <button type="button" onClick={readFile} className="button is-link">Datei einlesen</button>
        </div>
      </div>
    </div>

    {state.readDocument && <pre>{renderNode(state.readDocument)}</pre>}

  </div>;
}