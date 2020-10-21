import React from 'react';
import {MyXmlAttribute, MyXmlElementNode, MyXmlNode} from "./xmlModel";
import {useTranslation} from "react-i18next";
import classnames from 'classnames';

interface IProps {
    node: MyXmlElementNode;
    updateNode: (node: MyXmlElementNode) => void;
}


export function XmlElementNodeEditForm({node, updateNode}: IProps) {

    const {t} = useTranslation('common');

    function addAttribute() {
        node.attributes.push({key: '', value: ''});
        updateNode(node);
    }

    function removeAttribute(index: number): void {
        node.attributes.splice(index);
        updateNode(node);
    }

    /*
    function addChildNode(): void {
        node.childNodes.push({tagName: 'todo', childNodes: [], attributes: []})
        updateNode(node);
    }
     */

    function removeChildNode(index: number): void {
        node.childNodes.splice(index, 1);
        updateNode(node);
    }

    function renderAttributeFields(attr: MyXmlAttribute, index: number): JSX.Element {
        const key = attr.key.trim().length === 0 ? `___${index}` : attr.key;

        return (
            <div key={key} className="field is-grouped">
                <div className="control is-expanded">
                    <input className="input" defaultValue={attr.key} placeholder={t('Schlüssel')}/>
                </div>
                <div className="control">
                    <button className="button is-static" tabIndex={-1}>=</button>
                </div>
                <div className="control is-expanded">
                    <input className="input" defaultValue={attr.value} placeholder={t('Wert')}/>
                </div>
                <div className="control">
                    <button type="button" className="button is-danger" onClick={() => removeAttribute(index)}>X</button>
                </div>
            </div>
        );
    }

    function renderChildNodeField(node: MyXmlNode, index: number): JSX.Element {
        return (
            <div key={index} className={classnames('field is-grouped')}>
                <div className="control is-expanded">
                    <button type="button" className="button is-static is-fullwidth">
                        {node instanceof MyXmlElementNode
                            ? <span>&lt;{node.tagName}&gt;...&lt;{node.tagName}&gt;</span>
                            : node.content}
                    </button>
                </div>
                <div className="control">
                    <button type="button" className="button is-danger" onClick={() => removeChildNode(index)}>X</button>
                </div>
            </div>
        );
    }

    return (
        <div>

            <div className="field">
                <label className="label" htmlFor="tag">{t('Tag')}:</label>
                <div className="control">
                    <input className="input" id="tag" defaultValue={node.tagName}/>
                </div>
            </div>

            <fieldset className="my-3">
                <legend className="label">{t('Attribute')}:</legend>

                {node.attributes.map(renderAttributeFields)}

                <div className="field">
                    <button className="button is-link is-fullwidth"
                            onClick={addAttribute}>{t('Attribut hinzufügen')}</button>
                </div>
            </fieldset>

            <fieldset className="my-3">
                <legend className="label">{t('Kindelemente')}:</legend>

                {node.childNodes.map(renderChildNodeField)}
            </fieldset>

        </div>
    );
}