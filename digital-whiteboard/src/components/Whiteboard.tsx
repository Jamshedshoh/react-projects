// src/components/Whiteboard.tsx
import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";
import { COLORS } from "../constants/colors";
import Slider from "./Slider";

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.7;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctxRef.current = ctx;
    }
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !ctxRef.current) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
      <h1 className="text-2xl font-bold">Digital Whiteboard</h1>

      <div className="flex gap-2 flex-wrap w-200 h-200">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`w-20 h-20 p-5 rounded-full border-2 ${
              color === c ? "border-gray-800" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>

      <div className="w-48">
        <label className="text-sm text-gray-700" htmlFor="slider">
          Brush Size: {lineWidth}px
        </label>
        <Slider value={lineWidth} onChange={setLineWidth} min={1} max={20} />
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md"
      />

      <Button variant="danger" onClick={clearCanvas}>
        Clear
      </Button>
    </div>
  );
};

export default Whiteboard;
