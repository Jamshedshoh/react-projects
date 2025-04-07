import "./index.css"; // Make sure Tailwind styles are applied

// src/App.tsx
import React from "react";
import Whiteboard from "./components/Whiteboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Whiteboard />
    </div>
  );
}

export default App;
