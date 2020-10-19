// Helper function

export function readFileContent(file: File): Promise<string> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = (event) => {
      resolve(event.target!.result as string);
    };

    fileReader.onerror = (event) => {
      fileReader.abort();
      reject(event.target!.error);
    };

    fileReader.readAsText(file);
  });
}

// Model

export interface MyXmlPCData {
  content: string;
}

export class MyXmlAttribute {
  constructor(public key: string, public value: string) {
  }
}

export class MyXmlElementNode {
  constructor(
    public tagName: string,
    public childNodes: MyXmlNode[],
    public attributes: MyXmlAttribute[]
  ) {
  }
}

export type MyXmlNode = MyXmlElementNode | MyXmlPCData;

function readAttribute(attr: Attr): MyXmlAttribute {
  return new MyXmlAttribute(attr.name, attr.value);
}

function convertNodeToMyXmlNode(node: Node): MyXmlNode {
  if (node instanceof Element) {
    return new MyXmlElementNode(
      node.tagName,
      Array.from(node.childNodes).map(convertNodeToMyXmlNode),
      Array.from(node.attributes).map(readAttribute)
    )
  } else if (node instanceof CharacterData) {
    return {content: node.data};
  } else {
    console.error(JSON.stringify(node, null, 2));
    throw new Error('TODO!');
  }
}

export async function readXmlFile(file: File): Promise<MyXmlNode> {
  const fileContent = await readFileContent(file);

  const xmlDocument: XMLDocument = new DOMParser().parseFromString(fileContent, 'application/xml');

  return convertNodeToMyXmlNode(xmlDocument.documentElement);
}
