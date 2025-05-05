import React, { useState, useEffect } from "react";
import { Maximize, Minimize, X } from "lucide-react";
import DiagramInspector from "./DiagramInspector";
import { Button } from "./ui/button";
import { MenubarComponents } from "./MenuBarComponents";
// import { CustomElements } from "./CustomElements";

const FloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 20 });
  const [panelPosition, setPanelPosition] = useState({ x: 100, y: 100 });
  const [isDraggingButton, setIsDraggingButton] = useState(false);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const toggleInspector = () => setIsOpen((prev) => !prev);
  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDraggingButton(true);
    setDragStart({
      x: e.clientX - buttonPosition.x,
      y: e.clientY - buttonPosition.y,
    });
  };

  const handlePanelMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDraggingPanel(true);
    setDragStart({
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingButton) {
        setButtonPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isDraggingPanel) {
        setPanelPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingButton(false);
      setIsDraggingPanel(false);
    };

    if (isDraggingButton || isDraggingPanel) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingButton, isDraggingPanel, dragStart]);

  return (
    <>
      <div
        className={`fixed z-50 ${
          isDraggingButton ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ left: `${buttonPosition.x}px`, top: `${buttonPosition.y}px` }}
        onMouseDown={handleButtonMouseDown}
      >
        <button
          onClick={toggleInspector}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
          aria-label="Open Diagram Inspector"
        >
          <Maximize size={20} />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed z-50"
          style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
        >
          <div
            className="flex justify-between items-center bg-blue-600 text-white px-3 py-2 rounded-t-lg cursor-move"
            onMouseDown={handlePanelMouseDown}
          >
            <h2 className="text-sm font-semibold">Diagram Inspector</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-700 p-1 rounded-full"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-700 p-1 rounded-full"
                onClick={toggleInspector}
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <MenubarComponents />
              <DiagramInspector />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingButton;
