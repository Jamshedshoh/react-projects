import "./App.css";
import BillManager from "./BillManager";
import WhiteboardApp from "./WhiteboardApp";
import SpreadsheetViewer from "./SpreadsheetViewer";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<"bills" | "whiteboard" | "spreadsheet">("bills");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-2 p-4">
        <button
          onClick={() => setActiveTab("bills")}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "bills"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Bill Manager
        </button>
        <button
          onClick={() => setActiveTab("whiteboard")}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "whiteboard"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Whiteboard
        </button>
        <button
          onClick={() => setActiveTab("spreadsheet")}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "spreadsheet"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Spreadsheet
        </button>
      </div>

      {activeTab === "bills" ? <BillManager /> : activeTab === "whiteboard" ? <WhiteboardApp /> : <SpreadsheetViewer />}
    </div>
  );
}

export default App;
