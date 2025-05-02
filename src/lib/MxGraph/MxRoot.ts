import { MxCell } from "./MxCell";
export class MxRoot {
  cells: MxCell[] = [];
  defaultLayer: MxCell;
  layers: Set<string> = new Set();

  constructor(cells: MxCell[] = [], defaultLayer?: MxCell) {
    this.cells = cells;
    this.defaultLayer = defaultLayer || cells[0];
  }

  static fromElement(el: Element): MxRoot {
    const cells: MxCell[] = [];

    // Convert child nodes into MxCell instances, only considering element nodes (skip text/comments)
    if (el) {
      el.childNodes.forEach((node: any) => {
        if (node.nodeType === 1) {
          cells.push(MxCell.fromElement(node as Element));
        }
      });
    }

    // mxGraph rule: layer with id="0" is considered default; fallback to first cell without parent
    const defaultLayer = cells.find((c) => c.id === "0" || !c.parent);

    if (!defaultLayer || !defaultLayer.id) {
      throw new Error("Could not find default layer");
    }

    const root = new MxRoot(cells, defaultLayer);

    // mxGraph rule: layers are cells that are not vertices/edges and have default layer as parent
    cells.forEach((c) => {
      if (c.markIfLayer(defaultLayer.id)) {
        root.layers.add(c.id!); // Add to layers set for easy lookup, enforcing uniqueness
      }
    });
    debugger;
    return root;
  }

  toElement(doc: Document): Element {
    const rootElement = doc.createElement("root");
    this.cells.forEach((cell) => rootElement.appendChild(cell.toElement(doc)));
    return rootElement;
  }

  add(cell: MxCell) {
    this.cells.push(cell);
  }

  remove(cell: MxCell) {
    const index = this.cells.indexOf(cell);
    if (index !== -1) {
      this.cells.splice(index, 1);
    }
  }
}
