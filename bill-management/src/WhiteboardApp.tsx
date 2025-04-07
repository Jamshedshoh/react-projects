import { useState, useRef } from "react";
import Toolbar from "./components/Toolbar";
import Whiteboard from "./components/Whiteboard";
import { Tool, WhiteboardElement } from "./types/whiteboardTypes";

function WhiteboardApp() {
  const [color, setColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [tool, setTool] = useState<Tool>("pen");
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const whiteboardRef = useRef<HTMLCanvasElement>(null);

  const clearWhiteboard = () => {
    setElements([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        tool={tool}
        setTool={setTool}
        clearWhiteboard={clearWhiteboard}
      />
      <Whiteboard
        color={color}
        brushSize={brushSize}
        tool={tool}
        elements={elements}
        setElements={setElements}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        whiteboardRef={whiteboardRef}
      />
    </div>
  );
}

export default WhiteboardApp;
