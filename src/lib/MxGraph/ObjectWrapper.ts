import { XmlUtils } from "./xml.utils";

export class ObjectWrapper {
  id: string;
  label?: string;
  link?: string;
  tags: string[] = [];
  tooltip?: string;
  placeholder?: string;
  type?: string;
  description?: string;
  customAttributes: Record<string, string>;
  originalTag?: "UserObject" | "object";
  visible?: "0" | "1";

  constructor(props: Partial<ObjectWrapper> = {}) {
    if (!props.id) {
      throw new Error("Object Wrapper must have id");
    }
    this.id = props.id;
    this.label = props.label;
    this.link = props.link;
    this.tooltip = props.tooltip;
    this.placeholder = props.placeholder;
    this.type = props.type;
    this.description = props.description;
    this.customAttributes = props.customAttributes || {};
    this.visible = props.visible || undefined;

    if (Array.isArray(props.tags)) {
      this.tags = props.tags.map((t) => t.trim()).filter((t) => t.length > 0);
    }
  }

  static fromElement(el: Element): ObjectWrapper {
    const id = el.getAttribute("id");

    if (!id) {
      throw new Error("Object Wrapper must have id");
    }
    const wrapper = new ObjectWrapper({ id });

    const knownAttributes = [
      "id",
      "label",
      "link",
      "tags",
      "tooltip",
      "placeholder",
      "type",
      "description",
      "visible",
    ];

    Array.from(el.attributes).forEach(({ name, value }) => {
      if (knownAttributes.includes(name)) {
        if (name === "tags") {
          wrapper.tags = XmlUtils.unescapeString(value)
            .split(/\s+/)
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        } else {
          (wrapper as any)[name] = XmlUtils.unescapeString(value);
        }
      } else {
        wrapper.customAttributes[name] = value;
      }
    });

    if (el.nodeName === "object" || el.nodeName === "UserObject") {
      wrapper.originalTag = el.nodeName;
    }

    return wrapper;
  }

  toElement(doc: Document): Element {
    const tag = this.originalTag || "object";
    const el = doc.createElement(tag);

    if (this.label) el.setAttribute("label", XmlUtils.escapeString(this.label));
    if (this.link) el.setAttribute("link", XmlUtils.escapeString(this.link));
    if (this.visible) el.setAttribute("visible", this.visible);
    if (this.tags.length > 0) {
      const tagString = this.tags.join(" ");
      el.setAttribute("tags", XmlUtils.escapeString(tagString));
    }
    if (this.tooltip)
      el.setAttribute("tooltip", XmlUtils.escapeString(this.tooltip));
    if (this.placeholder)
      el.setAttribute("placeholder", XmlUtils.escapeString(this.placeholder));
    if (this.type) el.setAttribute("type", XmlUtils.escapeString(this.type));
    if (this.description)
      el.setAttribute("description", XmlUtils.escapeString(this.description));

    Object.entries(this.customAttributes).forEach(([k, v]) => {
      el.setAttribute(k, XmlUtils.escapeString(v));
    });

    if (this.id) el.setAttribute("id", this.id);

    return el;
  }
}
