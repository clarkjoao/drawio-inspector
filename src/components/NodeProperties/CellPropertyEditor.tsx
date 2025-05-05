import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MxCell } from "@/lib/MxGraph/MxCell";
import { Textarea } from "../ui/textarea";
import { useBuilder } from "@/context/BuilderContext";

interface CellPropertyEditorProps {
  cell: MxCell;
  onChange: (updatedProperties: Partial<MxCell>) => void;
}

const CellPropertyEditor = ({ cell, onChange }: CellPropertyEditorProps) => {
  const { builder } = useBuilder();
  const [properties, setProperties] = useState<Partial<MxCell>>({
    id: cell.id || "",
    value: cell.value || "",
    vertex: cell.vertex || "0",
    edge: cell.edge || "0",
    parent: cell.parent || "",
    source: cell.source || "",
    target: cell.target || "",
  });

  useEffect(() => {
    setProperties({
      id: cell.id || "",
      value: cell.value || "",
      vertex: cell.vertex || "0",
      edge: cell.edge || "0",
      parent: cell.parent || "",
      source: cell.source || "",
      target: cell.target || "",
    });
  }, [cell?.id]);

  const handleChange = (key: keyof MxCell, value: any) => {
    const updatedProperties = { ...properties, [key]: value };
    setProperties(updatedProperties);
    onChange(updatedProperties);
  };

  const parentIdList = builder?.tree.listAllowParentIds();
  const cellConnectables = builder?.tree.listAllowConnectables();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="id">ID</Label>
        <Input
          id="id"
          value={properties.id}
          onChange={(e) => handleChange("id", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Value</Label>
        <Textarea
          id="value"
          value={properties.value}
          onChange={(e) => handleChange("value", e.target.value)}
        />
      </div>

      <Separator />

      {!cell.isLayer && (
        <div className="space-y-2">
          <Label htmlFor="parent">Parent ID</Label>
          <Select
            value={properties.parent}
            disabled={!parentIdList}
            onValueChange={(value) => handleChange("parent", value)}
          >
            <SelectTrigger id="vertex">
              <SelectValue placeholder={"Select..."} />
            </SelectTrigger>
            <SelectContent>
              {parentIdList?.map((cell) => {
                const id = cell.getId;
                const label = cell.getLabel;

                return <SelectItem value={id}>{label || id}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {cell.isEdge && (
        <>
          <div className="space-y-2">
            <Label htmlFor="source">Source ID</Label>
            <Select
              value={properties.source}
              disabled={!parentIdList}
              onValueChange={(value) => handleChange("source", value)}
            >
              <SelectTrigger id="vertex">
                <SelectValue placeholder={"Select..."} />
              </SelectTrigger>
              <SelectContent>
                {cellConnectables?.map((cell) => {
                  const id = cell.getId;
                  const label = cell.getLabel;

                  return <SelectItem value={id}>{label || id}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target ID</Label>
            <Select
              value={properties.target}
              disabled={!parentIdList}
              onValueChange={(value) => handleChange("source", value)}
            >
              <SelectTrigger id="vertex">
                <SelectValue placeholder={"Select..."} />
              </SelectTrigger>
              <SelectContent>
                {cellConnectables?.map((cell) => {
                  const id = cell.getId;
                  const label = cell.getLabel;

                  return <SelectItem value={id}>{label || id}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default CellPropertyEditor;
