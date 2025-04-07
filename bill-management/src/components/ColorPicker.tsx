import { ColorPickerProps } from "../types/whiteboardTypes";

const ColorPicker = ({ color, setColor }: ColorPickerProps) => {
  const colors: string[] = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#c0c0c0",
    "#808080",
  ];

  return (
    <div className="flex items-center space-x-1">
      {colors.map((c) => (
        <button
          key={c}
          className={`w-6 h-6 rounded-full border ${
            color === c ? "ring-2 ring-offset-2 ring-blue-500" : ""
          }`}
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        />
      ))}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8 border rounded-md cursor-pointer"
      />
    </div>
  );
};

export default ColorPicker;
