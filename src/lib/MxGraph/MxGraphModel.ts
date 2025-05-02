import { MxRoot } from "./MxRoot";

export class MxGraphModel {
  root: MxRoot;
  attributes: Record<string, string>;

  constructor(root: MxRoot, attributes: Record<string, string> = {}) {
    this.root = root;
    this.attributes = attributes;
  }

  static fromXml(xml: string): MxGraphModel {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const modelNode = doc.querySelector("mxGraphModel");
    const attrs: Record<string, string> = {};

    if (modelNode) {
      for (const attr of Array.from(modelNode.attributes)) {
        attrs[attr.name] = attr.value;
      }
    }

    const rootNode = modelNode?.querySelector("root");
    if (!rootNode) {
      throw new Error("XML Invalid, root tags is missing");
    }
    const root = MxRoot.fromElement(rootNode);
    return new MxGraphModel(root, attrs);
  }

  toElement(): string {
    const doc = document.implementation.createDocument("", "", null);
    const modelElement = doc.createElement("mxGraphModel");

    Object.entries(this.attributes).forEach(([key, value]) => {
      modelElement.setAttribute(key, value);
    });

    modelElement.appendChild(this.root.toElement(doc));
    doc.appendChild(modelElement);

    return new XMLSerializer().serializeToString(doc);
  }
}
