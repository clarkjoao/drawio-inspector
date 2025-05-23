import { ObjectWrapper } from "./ObjectWrapper";
import { MxGeometry } from "./MxGeometry";
import { XmlUtils } from "./xml.utils";
import { MxStyle } from "./MxStyle";

export class MxCell {
  id?: string;
  value?: string;
  style?: MxStyle;
  vertex?: "0" | "1";
  edge?: "0" | "1";
  parent?: string;
  source?: string;
  target?: string;
  connectable?: "0" | "1";
  collapsed?: "0" | "1";
  wrapper?: ObjectWrapper;
  children?: MxGeometry | ObjectWrapper;
  visible?: "0" | "1";

  isLayer = false;

  constructor(props: Partial<MxCell> = {}) {
    if (
      props.style &&
      !(props.style instanceof MxStyle) &&
      typeof props.style === "object"
    ) {
      props.style = new MxStyle(props.style);
    }

    Object.assign(this, props);

    if (this.vertex === "1" && this.edge === "1") {
      throw new Error(
        `Cell cannot be both a vertex and an edge (id: ${this.id})`
      );
    }
  }

  get getId(): string {
    return this.wrapper?.id ?? this.id ?? "";
  }

  get getLabel(): string {
    if (this.wrapper?.label && this.wrapper.label.trim() !== "") {
      return this.wrapper.label.trim();
    }

    if (
      this.wrapper?.customAttributes["label"] &&
      this.wrapper.customAttributes["label"].trim() !== ""
    ) {
      return this.wrapper.customAttributes["label"].trim();
    }

    if (typeof this.value === "string" && this.value.trim() !== "") {
      return this.value.trim();
    }

    if (this.style?.shape) {
      return this.style.shape;
    }

    if (this.isGroup) {
      return `Group - ${this.id}`;
    }

    if (this.isLayer && !this.wrapper?.label) {
      return "Background"; // default name by drawio
    }

    return this.getId; // if we can not defined any name, i sent id
  }

  get isVertex(): boolean {
    return this.vertex === "1";
  }

  get isEdge(): boolean {
    return this.edge === "1";
  }

  get isGroup(): boolean {
    return this.isVertex && this.connectable === "0" && !!this.style?.group;
  }

  markIfLayer(rootId = "0"): boolean {
    this.isLayer = !this.isVertex && !this.isEdge && this.parent === rootId;
    return this.isLayer;
  }

  static fromElement(el: Element): MxCell {
    if (el.nodeName === "UserObject" || el.nodeName === "object") {
      const wrapper = ObjectWrapper.fromElement(el);

      const innerCellEl = Array.from(el.children).find(
        (c) => c.nodeName === "mxCell"
      ) as Element | undefined;

      if (!innerCellEl) {
        throw new Error(`<${el.nodeName}> is missing an inner <mxCell>`);
      }

      const cell = MxCell.fromElement(innerCellEl);
      cell.wrapper = wrapper;

      // We are seeting id for be more easely work with it, but we need remove id from cell
      // before convert to xml, because when we have a wrapper, id should be exists only in wrapper
      cell.id = wrapper.id;

      return cell;
    }

    const cell = new MxCell({
      id: el.getAttribute("id") || undefined,
      value: el.hasAttribute("value")
        ? el.getAttribute("value") ?? ""
        : undefined, //NOTE: let the value "" or undefined makes difference on Drawio, because if the value is undefined drawio will use label of fallback!
      style: el.hasAttribute("style")
        ? MxStyle.parse(el.getAttribute("style") ?? "")
        : undefined,
      vertex: el.getAttribute("vertex") as "0" | "1" | undefined,
      edge: el.getAttribute("edge") as "0" | "1" | undefined,
      parent: el.getAttribute("parent") || undefined,
      source: el.getAttribute("source") || undefined,
      target: el.getAttribute("target") || undefined,
      connectable: el.getAttribute("connectable") as "0" | "1" | undefined,
      collapsed: el.getAttribute("collapsed") as "0" | "1" | undefined,
      visible:
        (el.getAttribute("visible") as "0" | "1" | undefined) || undefined,
    });

    for (const child of Array.from(el.children)) {
      if (child.nodeName === "mxGeometry") {
        cell.children = MxGeometry.fromElement(child);
      } else {
        console.warn(
          "Found child not mapped",
          el.id,
          el.nodeName,
          child.nodeName
        );
      }
    }

    return cell;
  }

  toElement(doc: Document): Element {
    const cellEl = doc.createElement("mxCell");

    //NOTE: With this check, some cell with value="" are been removing the attr, need check if can be a problema
    if (!this.wrapper) {
      if (this.value === "") {
        // need keeps value ""
        cellEl.setAttribute("value", "");
      } else if (typeof this.value === "string") {
        const safeValue = XmlUtils.escapeString(this.value);
        cellEl.setAttribute("value", safeValue);
      }
    }

    if (this.style) {
      const styleStr = MxStyle.stringify(this.style);
      cellEl.setAttribute("style", styleStr);
    } else if (this.style === null || this.style === undefined) {
      // continue because does not e exists the attrs
    } else {
      cellEl.setAttribute("style", "");
    }

    if (this.collapsed) cellEl.setAttribute("collapsed", this.collapsed);
    if (this.parent) cellEl.setAttribute("parent", this.parent);
    if (this.vertex) cellEl.setAttribute("vertex", this.vertex);
    if (this.connectable) cellEl.setAttribute("connectable", this.connectable);
    if (this.source) cellEl.setAttribute("source", this.source);
    if (this.target) cellEl.setAttribute("target", this.target);
    if (this.edge) cellEl.setAttribute("edge", this.edge);
    if (this.visible) cellEl.setAttribute("visible", this.visible);

    if (this.children) {
      cellEl.appendChild(this.children.toElement(doc));
    }

    if (this.wrapper) {
      const wrapperEl = this.wrapper.toElement(doc);

      wrapperEl.appendChild(cellEl);
      return wrapperEl;
    }

    // we only set id at cell, if doesnot exists wrapper
    if (this.id && !this.wrapper) {
      cellEl.setAttribute("id", this.id);
    }

    return cellEl;
  }
}
