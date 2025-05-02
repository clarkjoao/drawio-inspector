import { useBuilder } from "@/context/BuilderContext";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useEffect, useState } from "react";
import { MxCell } from "@/lib/MxGraph/MxCell";

const NodeProperties: React.FC = () => {
  const { builder, selectedCellIds } = useBuilder();
  const [cell, setCell] = useState<MxCell | null>(null);

  useEffect(() => {
    if (!builder?.tree) return;
    if (!selectedCellIds) setCell(null);
    const selected = builder?.tree?.findCellByAttribute(
      "id",
      selectedCellIds[0]
    );
    setCell(selected ?? null);
  }, [selectedCellIds]);

  return (
    <div
      className="p-4 bg-white overflow-y-auto"
      style={{ maxHeight: "calc(80vh - 50px)" }}
    >
      <Tabs defaultValue="properties">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
          <TabsTrigger value="style" className="flex-1">
            Style
          </TabsTrigger>
          {cell?.wrapper && (
            <TabsTrigger value="object" className="flex-1">
              Object
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="properties">
          {/* <CellPropertyEditor
            cell={cell}
            onChange={(updatedProperties) => {
              onUpdate({ ...cell, ...updatedProperties });
            }}
          /> */}
          <h1>properties</h1>
        </TabsContent>

        <TabsContent value="style">
          {/* <StyleEditor
            style={cell.style || {}}
            onChange={(updatedStyle) => {
              onUpdate({ ...cell, style: updatedStyle });
            }}
          /> */}
          <h1>properties</h1>
        </TabsContent>

        {cell?.wrapper && (
          <TabsContent value="object">
            {/* <ObjectWrapperEditor
              wrapper={cell.wrapper}
              onChange={(updatedWrapper) => {
                onUpdate({ ...cell, wrapper: updatedWrapper });
              }}
            /> */}
            <h1>properties</h1>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline">Close</Button>
        <Button
          onClick={() => {
            // onUpdate(cell);
            // onClose();
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default NodeProperties;
