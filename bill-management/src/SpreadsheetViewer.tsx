import { useState } from "react";
import Toolbar from "./components/Toolbar";
import Spreadsheet from "./components/SpreadSheet";
import { CellValue, SpreadsheetData } from "./types/spreadsheetTypes";

const generateId = () => Math.random().toString(36).substring(2, 9);

function SpreadsheetViewer() {
  const [data, setData] = useState<SpreadsheetData>({
    columns: ["A", "B", "C"],
    rows: [
      {
        A: { value: "Product", isEditing: false },
        B: { value: "Price", isEditing: false },
        C: { value: "Stock", isEditing: false },
      },
      {
        A: { value: "Apple", isEditing: false },
        B: { value: 1.99, isEditing: false },
        C: { value: 100, isEditing: false },
      },
      {
        A: { value: "Banana", isEditing: false },
        B: { value: 0.99, isEditing: false },
        C: { value: 150, isEditing: false },
      },
    ],
  });

  const handleCellChange = (
    rowIndex: number,
    columnId: string,
    value: CellValue
  ) => {
    setData((prev) => {
      const newData = { ...prev };
      newData.rows[rowIndex][columnId] = {
        ...newData.rows[rowIndex][columnId],
        value,
      };
      return newData;
    });
  };

  const handleCellEdit = (
    rowIndex: number,
    columnId: string,
    isEditing: boolean
  ) => {
    setData((prev) => {
      const newData = { ...prev };
      newData.rows[rowIndex][columnId] = {
        ...newData.rows[rowIndex][columnId],
        isEditing,
      };
      return newData;
    });
  };

  const addColumn = () => {
    const newCol = String.fromCharCode(65 + data.columns.length);
    setData((prev) => ({
      ...prev,
      columns: [...prev.columns, newCol],
      rows: prev.rows.map((row) => ({
        ...row,
        [newCol]: { value: "", isEditing: false },
      })),
    }));
  };

  const addRow = () => {
    setData((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        prev.columns.reduce(
          (acc, col) => ({ ...acc, [col]: { value: "", isEditing: false } }),
          {}
        ),
      ],
    }));
  };

  const saveData = () => {
    console.log("Saved data:", data);
    alert("Spreadsheet data saved (check console)");
  };

  const exportData = (format: "csv" | "json") => {
    if (format === "csv") {
      const headers = data.columns.join(",");
      const rows = data.rows
        .map((row) => data.columns.map((col) => row[col].value).join(","))
        .join("\n");
      const csv = `${headers}\n${rows}`;
      console.log("CSV:", csv);
      alert("Exported as CSV (check console)");
    } else {
      console.log("JSON:", JSON.stringify(data, null, 2));
      alert("Exported as JSON (check console)");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar
        onAddColumn={addColumn}
        onAddRow={addRow}
        onSave={saveData}
        onExport={exportData}
      />
      <Spreadsheet
        data={data}
        onCellChange={handleCellChange}
        onCellEdit={handleCellEdit}
        onAddColumn={addColumn}
        onAddRow={addRow}
      />
    </div>
  );
}

export default SpreadsheetViewer;
