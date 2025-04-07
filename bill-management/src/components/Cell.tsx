import { useState, useEffect, useRef } from "react";
import { CellProps } from "../types/spreadsheetTypes";

const Cell = ({ value, isEditing, onChange, onEdit }: CellProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onEdit(false);
      onChange(localValue);
    } else if (e.key === "Escape") {
      onEdit(false);
      setLocalValue(value);
    }
  };

  const handleBlur = () => {
    onEdit(false);
    onChange(localValue);
  };

  return (
    <div className="border-b border-r p-0 overflow-hidden">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="w-full h-full p-2 border-blue-300 border-2 focus:outline-none"
          value={localValue ?? ""}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <div
          className="w-full h-full p-2 hover:bg-gray-50 cursor-cell"
          onClick={() => onEdit(true)}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default Cell;
