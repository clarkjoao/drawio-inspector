import React, { useState } from "react";
import { ChevronRight, ChevronDown, Layers, Folder, File } from "lucide-react";
import { useBuilder } from "@/context/BuilderContext";
import { MxCell } from "@/lib/MxGraph/MxCell";

const NodeTree: React.FC = () => {
  const { builder, selectedCellIds, setSelectedCellIds } = useBuilder();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  if (!builder?.tree.root) {
    return <div className="text-gray-500 text-sm">Loading builder...</div>;
  }

  const root = builder.tree.root;
  const rootLayerId = root.defaultLayer?.id || "0";

  const nodesByParent: Record<string, MxCell[]> = {};
  root.cells.forEach((cell) => {
    const parentId = cell.parent || rootLayerId;
    if (!nodesByParent[parentId]) nodesByParent[parentId] = [];
    nodesByParent[parentId].push(cell);
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  const handleSelectNode = (
    event: React.MouseEvent<HTMLDivElement>,
    node: MxCell
  ) => {
    if (!node.id) return;

    if (node.isLayer && !expandedNodes.has(node.id)) {
      toggleNode(node.id);
    }

    const isMultiSelect =
      event.shiftKey ||
      (navigator.platform.includes("Mac") ? event.metaKey : event.ctrlKey);

    if (isMultiSelect) {
      const newSelection = selectedCellIds.includes(node.id)
        ? selectedCellIds.filter((id) => id !== node.id)
        : [...selectedCellIds, node.id];
      setSelectedCellIds(newSelection);
    } else {
      setSelectedCellIds([node.id]);
    }
  };

  const handleDragStart = (event: React.DragEvent, nodeId: string) => {
    event.dataTransfer.setData("application/node-id", nodeId);
  };

  const handleDrop = (event: React.DragEvent, targetId: string) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("application/node-id");

    if (!sourceId || !builder || sourceId === targetId) return;

    alert("Drag-and-drop not implemented yet.");
  };

  const allowDrop = (event: React.DragEvent) => event.preventDefault();

  const getIcon = (cell: MxCell) => {
    if (cell.isLayer) return <Layers className="h-4 w-4" />;
    if (cell.isGroup) return <Folder className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getTypeTag = (cell: MxCell) =>
    cell.isLayer ? "Layer" : cell.isGroup ? "Group" : "Node";

  const getCellDisplayName = (cell: MxCell) => {
    if (typeof cell.value === "string" && cell.value.trim()) return cell.value;
    if (cell.style?.shape) return cell.style.shape;
    if (cell.isGroup) return "Group";
    if (cell.isLayer) return "Background";
    return "Unnamed";
  };

  const getExtraLabels = (cell: MxCell) => {
    const extras: string[] = [];
    if (cell.isVertex) extras.push("(V)");
    if (cell.isEdge) extras.push("(E)");
    if (cell.connectable === "0") extras.push("(NC)");
    return extras;
  };

  const renderNode = (node: MxCell, level: number = 0): React.ReactNode => {
    if (!node.id) return null;

    const isExpanded = expandedNodes.has(node.id);
    const isHiddenOrLocked = node.style?.isLocked || node.style?.isHidden;
    const label = getCellDisplayName(node);
    const children = nodesByParent[node.id] || [];
    const hasChildren = children.length > 0;

    return (
      <div
        key={node.id}
        className="mb-1"
        onDragOver={allowDrop}
        onDrop={(e) => handleDrop(e, node.id!)}
      >
        <div
          className={`flex items-center py-1 px-1 rounded text-sm ${
            isHiddenOrLocked ? "bg-gray-100 text-red-800" : "hover:bg-gray-100"
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, node.id!)}
        >
          <div
            className="w-5 flex items-center justify-center cursor-pointer"
            onClick={() => hasChildren && toggleNode(node.id!)}
          >
            {hasChildren && (
              <button className="focus:outline-none">
                {isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            )}
          </div>

          <div
            className="ml-1 cursor-pointer flex-grow truncate"
            style={{ paddingLeft: `${level * 8}px` }}
            onClick={(e) => !isHiddenOrLocked && handleSelectNode(e, node)}
            title={label}
          >
            <div className="flex items-center gap-2">
              {getIcon(node)}
              <span className="text-xs text-gray-600 bg-gray-200 rounded px-1">
                {getTypeTag(node)}
              </span>
              {getExtraLabels(node).map((extra, idx) => (
                <span
                  key={idx}
                  className="text-xs text-gray-500 bg-gray-200 rounded px-1 ml-1"
                >
                  {extra}
                </span>
              ))}
            </div>
            <div className="text-sm font-medium text-gray-800">{label}</div>
          </div>
        </div>

        {hasChildren && isExpanded && !isHiddenOrLocked && (
          <div className="ml-4">
            {children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const treeRoots = root.cells.filter((cell) => cell.parent === rootLayerId);

  return (
    <div className="text-gray-800">
      {treeRoots.map((rootNode) => renderNode(rootNode))}
    </div>
  );
};

export default NodeTree;
