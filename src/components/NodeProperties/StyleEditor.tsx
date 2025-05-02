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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MxStyle } from "@/lib/MxGraph/MxStyle";

interface StyleEditorProps {
  style: MxStyle;
  onChange: (updatedStyle: MxStyle) => void;
}

const StyleEditor = ({ style, onChange }: StyleEditorProps) => {
  const [localStyle, setLocalStyle] = useState<MxStyle>(style);

  useEffect(() => {
    setLocalStyle(style);
  }, [style]);

  const handleChange = (key: keyof MxStyle, value: any) => {
    const updatedStyle = { ...localStyle, [key]: value };
    // setLocalStyle(updatedStyle);
    // onChange(updatedStyle);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="appearance">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="appearance" className="flex-1">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="text" className="flex-1">
            Text
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shape">Shape</Label>
            <Select
              value={localStyle.shape}
              onValueChange={(value) => handleChange("shape", value)}
            >
              <SelectTrigger id="shape">
                <SelectValue placeholder="Select shape..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectangle">Rectangle</SelectItem>
                <SelectItem value="ellipse">Ellipse</SelectItem>
                <SelectItem value="rhombus">Rhombus</SelectItem>
                <SelectItem value="hexagon">Hexagon</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="actor">Actor</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fillColor">Fill Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: localStyle.fillColor || "#ffffff" }}
                />
                <Input
                  id="fillColor"
                  value={localStyle.fillColor || ""}
                  onChange={(e) => handleChange("fillColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strokeColor">Stroke Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{
                    backgroundColor: localStyle.strokeColor || "#000000",
                  }}
                />
                <Input
                  id="strokeColor"
                  value={localStyle.strokeColor || ""}
                  onChange={(e) => handleChange("strokeColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="rounded"
              checked={localStyle.rounded === "1"}
              onCheckedChange={(checked) =>
                handleChange("rounded", checked ? "1" : "0")
              }
            />
            <Label htmlFor="rounded">Rounded Corners</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="html"
              checked={localStyle.html === "1"}
              onCheckedChange={(checked) =>
                handleChange("html", checked ? "1" : "0")
              }
            />
            <Label htmlFor="html">Allow HTML</Label>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              id="fontSize"
              value={localStyle.fontSize || ""}
              onChange={(e) => handleChange("fontSize", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontColor">Font Color</Label>
            <div className="flex gap-2">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: localStyle.fontColor || "#000000" }}
              />
              <Input
                id="fontColor"
                value={localStyle.fontColor || ""}
                onChange={(e) => handleChange("fontColor", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="align">Horizontal Alignment</Label>
            <Select
              value={localStyle.align}
              onValueChange={(value) => handleChange("align", value)}
            >
              <SelectTrigger id="align">
                <SelectValue placeholder="Select alignment..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verticalAlign">Vertical Alignment</Label>
            <Select
              value={localStyle.verticalAlign}
              onValueChange={(value) => handleChange("verticalAlign", value)}
            >
              <SelectTrigger id="verticalAlign">
                <SelectValue placeholder="Select alignment..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whiteSpace">Text Wrapping</Label>
            <Select
              value={localStyle.whiteSpace}
              onValueChange={(value) => handleChange("whiteSpace", value)}
            >
              <SelectTrigger id="whiteSpace">
                <SelectValue placeholder="Select wrapping..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wrap">Wrap</SelectItem>
                <SelectItem value="nowrap">No Wrap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="perimeter">Perimeter</Label>
            <Select
              value={localStyle.perimeter}
              onValueChange={(value) => handleChange("perimeter", value)}
            >
              <SelectTrigger id="perimeter">
                <SelectValue placeholder="Select perimeter..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectanglePerimeter">Rectangle</SelectItem>
                <SelectItem value="ellipsePerimeter">Ellipse</SelectItem>
                <SelectItem value="rhombusPerimeter">Rhombus</SelectItem>
                <SelectItem value="trianglePerimeter">Triangle</SelectItem>
                <SelectItem value="hexagonPerimeter">Hexagon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overflow">Overflow</Label>
            <Select
              value={localStyle.overflow}
              onValueChange={(value) => handleChange("overflow", value)}
            >
              <SelectTrigger id="overflow">
                <SelectValue placeholder="Select overflow..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="locked"
              checked={localStyle.locked === "1"}
              onCheckedChange={(checked) =>
                handleChange("locked", checked ? "1" : "0")
              }
            />
            <Label htmlFor="locked">Locked</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="group"
              checked={localStyle.group}
              onCheckedChange={(checked) => handleChange("group", checked)}
            />
            <Label htmlFor="group">Group</Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleEditor;
