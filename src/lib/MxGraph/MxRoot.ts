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

  addBeforeOrAfter(
    newCell: MxCell,
    targetId: string,
    position: "before" | "after"
  ) {
    const index = this.cells.findIndex((c) => c.id === targetId);
    if (index === -1) {
      throw new Error(`Target cell with id "${targetId}" not found`);
    }

    if (position === "before") {
      this.cells.splice(index, 0, newCell);
    } else if (position === "after") {
      this.cells.splice(index + 1, 0, newCell);
    } else {
      throw new Error(
        `Invalid position "${position}", expected "before" or "after"`
      );
    }
  }

  remove(
    cellId: string,
    options: { recursive: boolean } = { recursive: false }
  ) {
    const cell = this.cells.find((c) => c.id === cellId);
    if (!cell) return;

    const parentId = cell.parent;

    this.cells = this.cells.filter((c) => c !== cell);

    if (options.recursive) {
      const idsToRemove = new Set([cell.id]);

      let changed = true;
      while (changed) {
        changed = false;
        this.cells.forEach((c) => {
          if (c.parent && idsToRemove.has(c.parent)) {
            idsToRemove.add(c.id!);
            changed = true;
          }
        });
      }

      this.cells = this.cells.filter((c) => !idsToRemove.has(c.id!));
    } else {
      this.cells.forEach((c) => {
        if (c.parent === cell.id) {
          c.parent = parentId;
        }
      });
    }
  }
}
