import { XmlUtils } from "./xml.utils";

export type MxAction =
  | { show: { cells?: string[]; tags?: string[] } }
  | { hide: { cells?: string[]; tags?: string[] } }
  | { style: { cells: string[]; key: string; value: string } }
  | { toggleStyle: { cells: string[]; key: string; defaultValue?: string } }
  | { select: { cells: string[] } }
  | { highlight: { cells: string[]; color?: string; duration?: number; opacity?: number } }
  | { scroll: { cells: string[] } }
  | { viewbox: { cells: string[]; fitWindow?: boolean } };

export class MxActions {
  private actions: MxAction[] = [];
  private title: string = "Untitled Action";

  constructor(title?: string) {
    if (title) this.title = title;
  }

  setTitle(title: string) {
    this.title = title;
  }

  add(action: MxAction): this {
    this.actions.push(action);
    return this;
  }

  clear(): this {
    this.actions = [];
    return this;
  }

  toJSON(): { title: string; actions: MxAction[] } {
    return {
      title: this.title,
      actions: this.actions
    };
  }

  toLink(): string {
    const json = this.toJSON();
    const encoded = XmlUtils.escapeString(JSON.stringify(json));
    return `data:action/json,${encoded}`;
  }

  static fromJSON(obj: { title: string; actions: MxAction[] }): MxActions {
    const instance = new MxActions(obj.title);
    obj.actions.forEach((action) => instance.add(action));
    return instance;
  }

  static fromLink(link: string): MxActions | null {
    if (!link.startsWith("data:action/json,")) return null;
    const jsonStr = decodeURIComponent(link.substring("data:action/json,".length));
    try {
      const parsed = JSON.parse(XmlUtils.unescapeString(jsonStr));
      return MxActions.fromJSON(parsed);
    } catch (e) {
      console.error("Failed to parse MxActions from link:", e);
      return null;
    }
  }

  getActions(): MxAction[] {
    return [...this.actions];
  }

  removeByType(type: keyof MxAction): this {
    this.actions = this.actions.filter((a) => !a.hasOwnProperty(type));
    return this;
  }
}
