import { MxPoint } from "./MxPoint";

export class MxGeometry {
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  relative?: string;
  as?: string;
  sourcePoint?: MxPoint;
  targetPoint?: MxPoint;
  points: MxPoint[] = [];

  constructor(props: Partial<MxGeometry> = {}) {
    Object.assign(this, props);
  }

  static fromElement(el: Element): MxGeometry {
    const geom = new MxGeometry({
      x: el.getAttribute("x") || undefined,
      y: el.getAttribute("y") || undefined,
      width: el.getAttribute("width") || undefined,
      height: el.getAttribute("height") || undefined,
      relative: el.getAttribute("relative") || undefined,
      as: el.getAttribute("as") || "geometry"
    });

    for (const child of Array.from(el.children)) {
      if (child.nodeName === "mxPoint") {
        const asAttr = child.getAttribute("as");
        const x = parseFloat(child.getAttribute("x") || "0");
        const y = parseFloat(child.getAttribute("y") || "0");

        if (asAttr === "sourcePoint") {
          geom.sourcePoint = new MxPoint(x, y);
        } else if (asAttr === "targetPoint") {
          geom.targetPoint = new MxPoint(x, y);
        }
      }
      if (child.nodeName === "Array" && child.getAttribute("as") === "points") {
        for (const pointEl of Array.from(child.children)) {
          if (pointEl.nodeName === "mxPoint") {
            const x = parseFloat(pointEl.getAttribute("x") || "0");
            const y = parseFloat(pointEl.getAttribute("y") || "0");
            geom.points.push(new MxPoint(x, y));
          }
        }
      }
    }

    return geom;
  }

  toElement(doc: Document): Element {
    const geometryEl = doc.createElement("mxGeometry");

    if (this.x) geometryEl.setAttribute("x", this.x);
    if (this.y) geometryEl.setAttribute("y", this.y);
    if (this.width) geometryEl.setAttribute("width", this.width);
    if (this.height) geometryEl.setAttribute("height", this.height);
    if (this.relative) geometryEl.setAttribute("relative", this.relative);

    geometryEl.setAttribute("as", this.as ?? "geometry");

    if (this.sourcePoint) {
      const sourceEl = doc.createElement("mxPoint");
      sourceEl.setAttribute("as", "sourcePoint");
      sourceEl.setAttribute("x", this.sourcePoint.x.toString());
      sourceEl.setAttribute("y", this.sourcePoint.y.toString());
      geometryEl.appendChild(sourceEl);
    }

    if (this.targetPoint) {
      const targetEl = doc.createElement("mxPoint");
      targetEl.setAttribute("as", "targetPoint");
      targetEl.setAttribute("x", this.targetPoint.x.toString());
      targetEl.setAttribute("y", this.targetPoint.y.toString());
      geometryEl.appendChild(targetEl);
    }

    if (this.points.length > 0) {
      const arrayEl = doc.createElement("Array");
      arrayEl.setAttribute("as", "points");
      for (const point of this.points) {
        const pointEl = doc.createElement("mxPoint");
        pointEl.setAttribute("x", point.x.toString());
        pointEl.setAttribute("y", point.y.toString());
        arrayEl.appendChild(pointEl);
      }
      geometryEl.appendChild(arrayEl);
    }

    return geometryEl;
  }
}
