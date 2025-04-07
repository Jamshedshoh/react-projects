import { useRef, useEffect } from "react";
import Cell from "./Cell";
import ColumnHeader from "./ColumnHeader";
import { SpreadsheetProps } from "../types/spreadsheetTypes";
import { Plus, Table2 } from "lucide-react";

const Spreadsheet = ({
  data,
  onCellChange,
  onCellEdit,
  onAddColumn,
  onAddRow,
}: SpreadsheetProps) => {
  const spreadsheetRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside cells to stop editing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        spreadsheetRef.current &&
        !spreadsheetRef.current.contains(e.target as Node)
      ) {
        data.rows.forEach((row, rowIndex) => {
          data.columns.forEach((columnId) => {
            if (row[columnId].isEditing) {
              onCellEdit(rowIndex, columnId, false);
            }
          });
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [data, onCellEdit]);

  return (
    <div ref={spreadsheetRef} className="flex-1 overflow-auto">
      <div className="inline-block min-w-full border rounded-lg shadow-sm bg-white">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${
              data.columns.length + 1
            }, minmax(120px, 1fr))`,
          }}
        >
          {/* Top-left corner cell */}
          <div className="sticky top-0 left-0 z-20 bg-gray-50 border-b border-r p-2 font-medium flex items-center justify-center">
            <Table2 size={16} />
          </div>

          {/* Column headers */}
          {data.columns.map((column, colIndex) => (
            <ColumnHeader
              key={column}
              title={column}
              onAddColumnLeft={colIndex === 0 ? onAddColumn : undefined}
              onAddColumnRight={
                colIndex === data.columns.length - 1 ? onAddColumn : undefined
              }
            />
          ))}

          {/* Rows */}
          {data.rows.map((row, rowIndex) => (
            <>
              {/* Row number */}
              <div
                key={`row-${rowIndex}`}
                className="sticky left-0 z-10 bg-gray-50 border-r p-2 text-center font-medium"
              >
                {rowIndex + 1}
              </div>

              {/* Cells */}
              {data.columns.map((columnId) => (
                <Cell
                  key={`${rowIndex}-${columnId}`}
                  value={row[columnId].value}
                  isEditing={row[columnId].isEditing}
                  onChange={(value) => onCellChange(rowIndex, columnId, value)}
                  onEdit={(isEditing) =>
                    onCellEdit(rowIndex, columnId, isEditing)
                  }
                />
              ))}
            </>
          ))}

          {/* Add row button */}
          <div className="col-span-1 sticky left-0">
            <button
              onClick={onAddRow}
              className="w-full p-2 text-center text-gray-500 hover:bg-gray-100 border-t"
            >
              <Plus size={16} className="mx-auto" />
            </button>
          </div>
          {data.columns.map((_, i) => (
            <div key={`empty-${i}`} className="border-t"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
