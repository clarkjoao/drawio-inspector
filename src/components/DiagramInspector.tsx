import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import NodeTree from "./NodeTree";
import NodeProperties from "./NodeProperties";

const DiagramInspector: React.FC = () => {
  const [collapsed, setCollapsed] = useState({
    tree: false,
    props: false,
    actions: false,
  });

  const handleCollapse = (key: keyof typeof collapsed) => {
    return (isCollapsed: boolean, _panelId: string) => {
      setCollapsed((prev) => ({ ...prev, [key]: isCollapsed }));
    };
  };

  const renderPanel = (title: string, content: React.ReactNode) => {
    return (
      <div className="relative flex flex-col h-full bg-white overflow-hidden">
        <div className="pt-6 px-2 overflow-auto h-full">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">{title}</h3>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-b-lg shadow-xl overflow-hidden flex flex-col relative resize both"
      style={{
        width: "900px",
        height: "500px",
        maxWidth: "1200px",
        maxHeight: "600px",
        minWidth: "600px",
        minHeight: "400px",
      }}
    >
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel
          defaultSize={25}
          minSize={25}
          collapsedSize={2}
          collapsible
          onCollapse={() => handleCollapse("tree")}
        >
          {renderPanel("Nodes Tree", <NodeTree />)}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel
          defaultSize={25}
          minSize={25}
          collapsedSize={2}
          collapsible
          onCollapse={() => handleCollapse("props")}
        >
          {renderPanel("Properties", <NodeProperties />)}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel
          defaultSize={50}
          minSize={25}
          collapsedSize={2}
          collapsible
          onCollapse={() => handleCollapse("actions")}
        >
          {renderPanel("Node Action", <h1 />)}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DiagramInspector;
