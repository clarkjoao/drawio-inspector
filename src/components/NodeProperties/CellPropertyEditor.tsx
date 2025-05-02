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

interface CellPropertyEditorProps {
  cell: MxCell;
  onChange: (updatedProperties: Partial<MxCell>) => void;
}

const CellPropertyEditor = ({ cell, onChange }: CellPropertyEditorProps) => {
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
  }, [cell]);

  const handleChange = (key: keyof MxCell, value: any) => {
    const updatedProperties = { ...properties, [key]: value };
    setProperties(updatedProperties);
    onChange(updatedProperties);
  };

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

      <div className="space-y-2">
        <Label htmlFor="parent">Parent ID</Label>
        <Select
          value={properties.vertex}
          onValueChange={(value) => handleChange("vertex", value as "0" | "1")}
        >
          <SelectTrigger id="vertex">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Yes</SelectItem>
            <SelectItem value="0">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {cell.isEdge && (
        <>
          <div className="space-y-2">
            <Label htmlFor="source">Source ID</Label>
            <Input
              id="source"
              value={properties.source}
              onChange={(e) => handleChange("source", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target ID</Label>
            <Input
              id="target"
              value={properties.target}
              onChange={(e) => handleChange("target", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CellPropertyEditor;
