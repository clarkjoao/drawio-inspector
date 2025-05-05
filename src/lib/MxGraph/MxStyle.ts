// Updated MxStyle with fromElement and toElement methods

export type MxShape =
  | "rectangle"
  | "ellipse"
  | "rhombus"
  | "triangle"
  | "hexagon"
  | "actor"
  | "cloud"
  | "cylinder"
  | "document"
  | "note"
  | "folder"
  | "card"
  | "cube"
  | "doubleEllipse"
  | "group"
  | "swimlane"
  | "label"
  | "text"
  | "cross"
  | "plus"
  | "process"
  | "parallelogram"
  | "manualInput"
  | "internalStorage"
  | "delay"
  | "start"
  | "end"
  | "state"
  | "decision"
  | "data"
  | "database";

export type MxOverflow = "visible" | "hidden" | "fill" | "width" | "crop";
export type MxWhiteSpace = "wrap" | "nowrap" | "preserve" | "inherit";
export type MxAlign = "left" | "center" | "right";
export type MxVerticalAlign = "top" | "middle" | "bottom";

export class MxStyle {
  shape?: MxShape;
  perimeter?: string;
  html?: "0" | "1";
  whiteSpace?: MxWhiteSpace;
  overflow?: MxOverflow;
  rounded?: "0" | "1";
  fillColor?: string;
  strokeColor?: string;
  fontSize?: string;
  fontColor?: string;
  align?: MxAlign;
  verticalAlign?: MxVerticalAlign;
  locked?: "0" | "1";
  group: boolean = false;

  custom: Record<string, string> = {};

  private static readonly knownAttributes = [
    "shape",
    "perimeter",
    "html",
    "whiteSpace",
    "overflow",
    "rounded",
    "fillColor",
    "strokeColor",
    "fontSize",
    "fontColor",
    "align",
    "verticalAlign",
    "locked",
  ] as const;

  constructor(
    props: Partial<
      Record<(typeof MxStyle.knownAttributes)[number] | string, any>
    > = {}
  ) {
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined && value !== null && value !== "") {
        const safeValue = String(value);

        if ((MxStyle.knownAttributes as readonly string[]).includes(key)) {
          (this as any)[key] = safeValue;
        } else {
          this.custom[key] = safeValue;
        }
      }
    }
  }

  static parse(styleStr: string): MxStyle {
    const style = new MxStyle();
    if (!styleStr) return style;

    const pairs = styleStr.split(";").filter(Boolean);

    if (pairs.includes("group")) {
      style.group = true;
    }

    for (const pair of pairs) {
      const [rawKey, rawValue] = pair.split("=");
      const key = rawKey.trim();
      const value = (rawValue ?? "").trim();

      if (!key) continue;

      if ((MxStyle.knownAttributes as readonly string[]).includes(key)) {
        (style as any)[key] = value;
      } else {
        style.custom[key] = value;
      }
    }

    return style;
  }

  get isLocked(): boolean {
    return this.locked === "1";
  }

  setLocked(value: boolean) {
    this.locked = value ? "1" : "0";
  }

  get isHidden(): boolean {
    return this.overflow === "hidden";
  }

  setHidden(value: boolean) {
    this.overflow = value ? "hidden" : "visible";
  }

  static stringify(style: MxStyle): string {
    const entries: string[] = [];

    for (const key of MxStyle.knownAttributes) {
      const value = style[key];
      if (value !== undefined && value !== null && value !== "") {
        entries.push(`${key}=${String(value)}`);
      }
    }

    for (const [key, value] of Object.entries(style.custom)) {
      if (key) {
        entries.push(value === "" ? key : `${key}=${String(value)}`);
      }
    }

    return entries.join(";");
  }

  toString(): string {
    if (this.group) return "group";
    return MxStyle.stringify(this);
  }

  toObject(): Record<string, string> {
    const obj: Record<string, string> = {};

    for (const key of MxStyle.knownAttributes) {
      const value = this[key];
      if (value !== undefined && value !== null && value !== "") {
        obj[key] = String(value);
      }
    }

    for (const [key, value] of Object.entries(this.custom)) {
      obj[key] = String(value);
    }

    return obj;
  }

  merge(other: Record<string, any>): void {
    for (const [key, value] of Object.entries(other)) {
      if (value !== undefined && value !== null && value !== "") {
        const safeValue = String(value);

        if ((MxStyle.knownAttributes as readonly string[]).includes(key)) {
          (this as any)[key] = safeValue;
        } else {
          this.custom[key] = safeValue;
        }
      }
    }
  }
}
