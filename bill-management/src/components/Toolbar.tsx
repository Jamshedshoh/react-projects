import {
  Pen,
  Eraser,
  Circle,
  Square,
  Type,
  Move,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import ColorPicker from "./ColorPicker";
import { Tool, ToolbarProps } from "../types/whiteboardTypes";

interface ToolItem {
  name: Tool;
  icon: React.ReactNode;
}

const Toolbar = ({
  color,
  setColor,
  brushSize,
  setBrushSize,
  tool,
  setTool,
  clearWhiteboard,
}: ToolbarProps) => {
  const tools: ToolItem[] = [
    { name: "pen", icon: <Pen size={20} /> },
    { name: "eraser", icon: <Eraser size={20} /> },
    { name: "circle", icon: <Circle size={20} /> },
    { name: "rectangle", icon: <Square size={20} /> },
    { name: "text", icon: <Type size={20} /> },
    { name: "select", icon: <Move size={20} /> },
  ];

  return (
    <div className="bg-white shadow-md p-2 flex items-center justify-between">
      <div className="flex space-x-2">
        {tools.map((t) => (
          <button
            key={t.name}
            className={`p-2 rounded-md ${
              tool === t.name
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setTool(t.name)}
            title={t.name}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <ColorPicker color={color} setColor={setColor} />

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center">{brushSize}</span>
          <button
            onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={clearWhiteboard}
          className="p-2 rounded-md text-red-600 hover:bg-red-50"
          title="Clear"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
