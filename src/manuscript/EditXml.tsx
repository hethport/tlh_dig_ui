import React, {useState} from 'react';

interface IState {
  selectedFile?: File;
  readDocument?: XMLDocument;
}

function readXmlFile(file: File): Promise<XMLDocument> {
  const fileReader = new FileReader();

  return new Promise<Document>((resolve, reject) => {

    fileReader.onload = ((event) => {
      const fileContent = event.target!.result as string;

      const xmlContent: XMLDocument = new DOMParser().parseFromString(fileContent, 'application/xml');

      resolve(xmlContent);
    });

    fileReader.onerror = (event) => {
      fileReader.abort();
      reject(event.target!.error);
    }

    fileReader.readAsText(file);
  });
}

function renderNode(node: Node): JSX.Element | string {
  console.info(node);
  if (node instanceof Attr) {
    return <span>{node.name}="{node.value}"</span>
  } else if (node instanceof CharacterData) {
    return <span>{node.data}</span>;
  } else if (node instanceof Document) {
    const children = Array.from(node.childNodes);
    return <>
      {children.map((childNode, index) => <span key={index}>{renderNode(childNode)}</span>)}
    </>
  } else if (node instanceof Element) {
    return <span>&lt;{node.tagName}&gt;</span>
  } else {
    return <span>{JSON.stringify(node, null, 2)}</span>
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

    console.info(readDocument);

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