import React, {useState} from 'react';
import {MyXmlAttribute, MyXmlElementNode, MyXmlNode, MyXmlPCData, readXmlFile, readXmlString} from "./xmlModel";
import './XmlEditor.sass';
import {XmlElementNodeEditForm} from "./XmlElementNodeEditForm";
import classnames from 'classnames';


const defaultXml = `
<bookstore>
  <book category="children">
    <title>Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
  <book category="web">
    <title>Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price>39.95</price>
  </book>
</bookstore>`;


interface IState {
    selectedFile?: File;
    readDocument?: MyXmlNode;
    editedNode?: MyXmlElementNode;
}


function renderAttributes(attributes: MyXmlAttribute[]): string | null {
    const attributesToRender = attributes
        .filter((attr) => attr.key.trim().length !== 0);

    if (attributesToRender.length === 0) {
        return null;
    } else {
        const singleAttributes = attributesToRender
            .map((attr) => `${attr.key}="${attr.value}"`);

        return ' ' + singleAttributes.join(' ');
    }
}

function renderNode(
    node: MyXmlNode,
    toggleNode: (node: MyXmlElementNode) => void,
    currentNode?: MyXmlElementNode
): JSX.Element {
    if (node instanceof MyXmlElementNode) {
        const buttonClasses = classnames("button", {'is-link': currentNode && node === currentNode});

        if (node.childNodes.length === 1 && node.childNodes[0] instanceof MyXmlPCData) {
            const pcDataChildNode: MyXmlPCData = node.childNodes[0];

            return <div className="xmlLine">
                <div className="field has-addons">
                    <div className="control">
                        <button className={buttonClasses} onClick={() => toggleNode(node)}>
                            &lt;{node.tagName}{renderAttributes(node.attributes)}&gt;
                        </button>
                    </div>
                    <div className="control">
                        <input className="input" defaultValue={pcDataChildNode.content.replace('\n', '\\n')}/>
                    </div>
                    <div className="control">
                        <div className="control">
                            <button className={buttonClasses} onClick={() => toggleNode(node)}>
                                &lt;/{node.tagName}&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        } else {
            return <div className="xmlLine">
                <button className={buttonClasses} onClick={() => toggleNode(node)}>
                    &lt;{node.tagName}{renderAttributes(node.attributes)}&gt;
                </button>
                {node.childNodes.map((childNode, index) =>
                    <span key={index}>{renderNode(childNode, toggleNode, currentNode)}</span>
                )}
                <button className={buttonClasses} onClick={() => toggleNode(node)}>
                    &lt;/{node.tagName}{renderAttributes(node.attributes)}&gt;
                </button>
            </div>
        }
    } else {
        return <div className="field is-grouped">
            <div className="control">
                <input className="input" defaultValue={node.content.replace('\n', '\\n')}/>
            </div>
        </div>;
    }
}

export function XmlEditor(): JSX.Element {

    const [state, setState] = useState<IState>({
        // TODO: remove field (only for testing purposes)!
        readDocument: readXmlString(defaultXml)
    });

    function handleFileSelect(files: FileList | null): void {
        setState((currentState) => {
            return {...currentState, selectedFile: (files && files.length > 0) ? files[0] : undefined};
        });
    }

    async function readFile(): Promise<void> {
        if (!state.selectedFile) {
            alert('Sie haben keine Datei ausgewählt!');
            return;
        }

        const readDocument = await readXmlFile(state.selectedFile);

        setState((currentState) => {
            return {...currentState, readDocument};
        });
    }

    function handleNodeClick(node: MyXmlElementNode): void {
        setState((currentState) => {
            const editedNode = currentState.editedNode && currentState.editedNode === node ? undefined : node;
            return {...currentState, editedNode};
        });
    }

    function handleNodeUpdate(node: MyXmlElementNode): void {
        setState((currentState) => {
            return {...currentState, editedNode: node};
        });
    }

    return (
        <div className="container is-fluid">
            <h1 className="title is-3 has-text-centered">XMLEditor</h1>

            <div className="field">
                <label htmlFor="xmlFile" className="label">Xml Datei:</label>
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input type="file" className="input"
                               onChange={(event) => handleFileSelect(event.target.files)}/>
                    </div>
                    <div className="control">
                        <button type="button" onClick={readFile} className="button is-link">Datei einlesen</button>
                    </div>
                </div>
            </div>

            <div className="columns">
                <div className="column">
                    {state.readDocument &&
                    <pre>{renderNode(state.readDocument, handleNodeClick, state.editedNode)}</pre>}
                </div>
                <div className="column">
                    {state.editedNode &&
                    <XmlElementNodeEditForm node={state.editedNode} updateNode={handleNodeUpdate}/>}
                </div>
            </div>

        </div>
    );
}