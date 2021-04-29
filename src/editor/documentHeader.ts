import {attributeReader, childElementReader, flattenResults, mapResult, success, XmlFormat, zipResult} from "./xmlLib";

// AOHeader

export interface AOHeader {
  type: 'AOHeader';
  docId: AODocID;
  meta: AOMeta;
}

export const aoHeaderFormat: XmlFormat<AOHeader> = {
  read: (el) => mapResult(
    zipResult(
      childElementReader(el, 'docID', aoDocIdFormat),
      childElementReader(el, 'meta', aoMetaFormat)
    ),
    ([docId, meta]) => aoHeader(docId, meta)
  ),
  write: ({docId, meta}) => ['<AOHeader>', ...aoDocIdFormat.write(docId), ...aoMetaFormat.write(meta), '</AOHeader>']
};

function aoHeader(docId: AODocID, meta: AOMeta): AOHeader {
  return {type: 'AOHeader', docId, meta};
}

// AODocId

export interface AODocID {
  type: 'AODocId';
  content: string;
}

const aoDocIdFormat: XmlFormat<AODocID> = {
  read: (el) => success(aoDocId(el.textContent || '')),
  write: ({content}) => [`<docId>${content}</docId>`]
};

function aoDocId(content: string): AODocID {
  return {type: 'AODocId', content};
}

// AOMeta

export interface AOMeta {
  type: 'AOMeta';
  creationDate: DatedAttributeElement;
  kor2: DatedAttributeElement;
  aoXmlCreation: DatedAttributeElement;
  annotation: AOAnnotation;
}

const aoMetaFormat: XmlFormat<AOMeta> = {
  read: (el: Element) => mapResult(
    zipResult(
      zipResult(
        childElementReader(el, 'creation-date', datedStringElementFormat),
        childElementReader(el, 'kor2', datedStringElementFormat)
      ),
      zipResult(
        childElementReader(el, 'AOxml-creation', datedStringElementFormat),
        childElementReader(el, 'annotation', aoAnnotationFormat)
      ),
    ),
    ([[cd, kor2], [xmlCreation, annotation]]) => aoMeta(cd, kor2, xmlCreation, annotation)
  ),
  write: ({}) => []
}

function aoMeta(creationDate: DatedAttributeElement, kor2: DatedAttributeElement, aoXmlCreation: DatedAttributeElement, annotation: AOAnnotation): AOMeta {
  return {type: 'AOMeta', creationDate, kor2, aoXmlCreation, annotation};
}

// AOAnnotation

export interface AOAnnotation {
  type: 'AOAnnotation';
  content: AOAnnot[];
}

const aoAnnotationFormat: XmlFormat<AOAnnotation> = {
  read: (el) => mapResult(
    flattenResults(Array.from(el.children).map((el) => aoAnnotFormat.read(el))),
    (annots) => aoAnnotation(annots)
  ),
  write: ({content}) => []
};

function aoAnnotation(content: AOAnnot[]): AOAnnotation {
  return {type: 'AOAnnotation', content};
}

// AOAnnot

export interface AOAnnot extends DatedAttributeElement {
  type: 'AOAnnot';
  editor: string;
}

const aoAnnotFormat: XmlFormat<AOAnnot> = {
  read: (el) => success(
    aoAnnot(
      attributeReader(el, 'date', (v) => v || ''),
      attributeReader(el, 'editor', (v) => v || '')
    )
  ),
  write: ({date, editor}) => []
};

function aoAnnot(date: string, editor: string): AOAnnot {
  return {type: 'AOAnnot', date, editor};
}

// Dated Attribute Element

export interface DatedAttributeElement {
  date: string;
}

function datedAttributeElement(date: string): DatedAttributeElement {
  return {date};
}

const datedStringElementFormat: XmlFormat<DatedAttributeElement> = {
  read: (el) => success(datedAttributeElement(attributeReader(el, 'date', (v) => v || ''))),
  write: ({}) => []
}
