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

  findById(id: string): MxCell | undefined {
    return this.cells.find((c) => c.id === id);
  }

  getCellsInLayer(layerId: string): MxCell[] {
    return this.cells.filter((c) => c.parent === layerId);
  }

  getLayerIds(): string[] {
    return Array.from(this.layers);
  }

  getChildren(parentId: string): MxCell[] {
    return this.cells.filter((c) => c.parent === parentId);
  }

  getDescendants(parentId: string): MxCell[] {
    const descendants: MxCell[] = [];
    const queue = [parentId];

    while (queue.length) {
      const current = queue.shift()!;
      const children = this.getChildren(current);
      descendants.push(...children);
      queue.push(...children.map((c) => c.id!));
    }
    return descendants;
  }

  isAncestor(ancestorId: string, descendantId: string): boolean {
    let current = this.findById(descendantId);
    while (current && current.parent) {
      if (current.parent === ancestorId) return true;
      current = this.findById(current.parent);
    }
    return false;
  }

  movePosition(cellId: string, position: "before" | "after", targetId: string) {
    const fromIndex = this.cells.findIndex((c) => c.id === cellId);
    const toIndex = this.cells.findIndex((c) => c.id === targetId);
    debugger;
    if (fromIndex < 0) {
      throw new Error(`Cell with id "${cellId}" not found`);
    }
    if (toIndex < 0) {
      throw new Error(`Target cell with id "${targetId}" not found`);
    }

    if (cellId === targetId) {
      console.warn(
        `movePosition: Ignoring move of cell "${cellId}" relative to itself`
      );
      return;
    }

    const [cell] = this.cells.splice(fromIndex, 1); // Remove cell

    // Adjust target index if removal happened before insertion
    let insertIndex = toIndex;
    if (fromIndex < toIndex) {
      insertIndex -= 1;
    }

    if (position === "before") {
      this.cells.splice(insertIndex, 0, cell);
    } else if (position === "after") {
      this.cells.splice(insertIndex + 1, 0, cell);
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
