import {AOBody, aoBodyFormat} from "./documentBody";
import {AOHeader, aoHeaderFormat} from "./documentHeader";
import {childElementReader, mapResult, XmlFormat, zipResult} from "./xmlLib";

interface GenericAttribute {
  name: string;
  value: string;
}

function genericAttribute(name: string, value: string): GenericAttribute {
  return {name, value};
}

function extractGenericAttributes(el: Element): GenericAttribute[] {
  return Array.from(el.attributes).map(({name, value}) => genericAttribute(name, value))
}

// AOXml

export interface AOXml {
  type: 'AOXml',
  attributes: GenericAttribute[];
  aoHeader: AOHeader;
  body: AOBody;
}

export const aoXmlFormat: XmlFormat<AOXml> = {
  read: (el) => mapResult(
    zipResult(
      childElementReader(el, 'AOHeader', aoHeaderFormat),
      childElementReader(el, 'body', aoBodyFormat)
    ),
    ([header, body]) => aoXml(extractGenericAttributes(el), header, body)
  ),
  write: ({attributes, aoHeader, body}) => []
}

function aoXml(attributes: GenericAttribute[], aoHeader: AOHeader, body: AOBody): AOXml {
  return {type: 'AOXml', attributes, aoHeader, body}
}
