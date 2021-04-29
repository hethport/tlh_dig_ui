import {AOBody, aoBodyFormat} from "./documentBody";
import {AOHeader, aoHeaderFormat} from "./documentHeader";
import {childElementReader, XmlFormat} from "./xmlLib";
import {transformResultContent, zipResult} from "../functional/result";

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
  read: (el) => {
    const header = childElementReader(el, 'AOHeader', aoHeaderFormat);
    const body = childElementReader(el, 'body', aoBodyFormat);

    console.info(header);
    console.info(body);

    return transformResultContent(
      zipResult(header, body),
      ([header, body]) => aoXml(extractGenericAttributes(el), header, body),
      (errs) => errs.flat()
    )
  },
  write: ({attributes, aoHeader, body}) => []
}

function aoXml(attributes: GenericAttribute[], aoHeader: AOHeader, body: AOBody): AOXml {
  return {type: 'AOXml', attributes, aoHeader, body}
}
