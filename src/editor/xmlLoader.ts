import {AOXml, aoXmlFormat} from './document';

// Helper types and functions
export interface XmlReader<T> {
  read: (el: Element) => T
}

export interface XmlWriter<T> {
  write: (t: T) => string[];
}

export interface XmlFormat<T> extends XmlReader<T>, XmlWriter<T> {
}

export function attributeReader<T>(el: Element, name: string, f: (v: string | null) => T): T {
  return f(el.getAttribute(name));
}

export function childElementReader<T>(el: Element, tagName: string, childElementFormat: XmlFormat<T>): T {
  return childElementFormat.read(el.getElementsByTagName(tagName)[0]);
}

interface UnionElementConfig<T> {
  name: string;
  reader: XmlReader<T>;
}

export function unionElementReader<T>(options: UnionElementConfig<T>[]): XmlReader<T> {
  return {
    read: (el) => {
      const formatConfig: UnionElementConfig<T> | undefined = options.find(({name}) => name === el.tagName);

      if (formatConfig) {
        return formatConfig.reader.read(el);
      } else {
        throw new Error(`Illegal tag name ${el.tagName} found!`)
      }
    }
  };
}

// Document elements

async function readDocumentFile(file: File): Promise<string> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onloadend = () => resolve(fileReader.result as string);

    fileReader.onerror = reject;

    fileReader.readAsText(file);
  });
}

export async function loadXml(file: File): Promise<[string, AOXml]> {
  const content = await readDocumentFile(file);

  const doc = new DOMParser().parseFromString(content, 'text/xml');

  const aoXmlNode: Element = doc.getElementsByTagName('AOxml')[0];

  const aoXml: AOXml = aoXmlFormat.read(aoXmlNode);

  return Promise.resolve([content, aoXml]);
}