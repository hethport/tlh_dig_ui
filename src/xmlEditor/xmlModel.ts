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

export class MyXmlPCData {
    constructor(public content: string) {
    }
}

export interface MyXmlAttribute {
    key: string;
    value: string;
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
    return {key: attr.name, value: attr.value};
}

function convertNodeToMyXmlNode(node: Node): MyXmlNode {
    if (node instanceof Element) {
        return new MyXmlElementNode(
            node.tagName,
            Array.from(node.childNodes).map(convertNodeToMyXmlNode),
            Array.from(node.attributes).map(readAttribute)
        )
    } else if (node instanceof CharacterData) {
        return new MyXmlPCData(node.data);
    } else {
        console.error(JSON.stringify(node, null, 2));
        throw new Error('TODO!');
    }
}

export function readXmlString(xmlContent: string): MyXmlNode {
    const xmlDocument: XMLDocument = new DOMParser().parseFromString(xmlContent, 'application/xml');

    return convertNodeToMyXmlNode(xmlDocument.documentElement);
}

export async function readXmlFile(file: File): Promise<MyXmlNode> {
    const fileContent = await readFileContent(file);

    return readXmlString(fileContent);
}
