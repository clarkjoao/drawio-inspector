import { MxGraphModel } from "./MxGraphModel";
import { XmlUtils } from "./xml.utils";
import { MxRoot } from "./MxRoot";
import { MxCell } from "./MxCell";

export class MxBuilder {
  private model: MxGraphModel;

  constructor(model?: MxGraphModel) {
    this.model = model ?? new MxGraphModel(new MxRoot());
  }

  static fromXml(xml: string): MxBuilder {
    const model = MxGraphModel.fromXml(xml);
    return new MxBuilder(model);
  }

  get root() {
    return this.model.root;
  }

  toXml(): string {
    return XmlUtils.autoFixEscapes(this.model.toElement());
  }

  findCellByAttribute(
    attribute: keyof MxCell,
    value: string
  ): MxCell | undefined {
    return this.model.root.cells.find((cell) => {
      const cellValue = cell[attribute];

      if (typeof cellValue === "object" && cellValue !== null) {
        return JSON.stringify(cellValue) === value;
      }

      return cellValue === value;
    });
  }

  listAllowParentIds() {
    return this.model.root.cells.filter((cell) => cell.isGroup || cell.isLayer);
  }

  listAllowConnectables() {
    return this.model.root.cells.filter(
      (cell) => cell.isVertex && !cell.isEdge && !cell.isGroup && !cell.isLayer
    );
  }

  listLayers() {
    const defaultLayerId = this.model.root.defaultLayer.id;
    return this.model.root.cells.filter(
      (cell) => cell.isLayer && cell.getId !== defaultLayerId
    );
  }
}
