export class MxPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromObject(obj: { x: number; y: number }): MxPoint {
    return new MxPoint(obj.x, obj.y);
  }

  toElement(doc: Document): Element {
    const pointEl = doc.createElement("mxPoint");
    pointEl.setAttribute("x", this.x.toString());
    pointEl.setAttribute("y", this.y.toString());
    return pointEl;
  }
}
