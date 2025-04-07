import { useEffect, useCallback } from "react";
import { WhiteboardProps, WhiteboardElement } from "../types/whiteboardTypes";

const Whiteboard = ({
  color,
  brushSize,
  tool,
  elements,
  setElements,
  isDrawing,
  setIsDrawing,
  whiteboardRef,
}: WhiteboardProps) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "pen" || tool === "eraser") {
      setIsDrawing(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      setElements([
        ...elements,
        {
          type: "path",
          points: [{ x: offsetX, y: offsetY }],
          color: tool === "eraser" ? "#ffffff" : color,
          size: brushSize,
        },
      ]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const lastElement = elements[elements.length - 1];

    if (lastElement && lastElement.type === "path") {
      const updatedLastElement: WhiteboardElement = {
        ...lastElement,
        points: [...lastElement.points, { x: offsetX, y: offsetY }],
      };
      const newElements = [...elements];
      newElements[elements.length - 1] = updatedLastElement;
      setElements(newElements);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawElement = useCallback(
    (ctx: CanvasRenderingContext2D, element: WhiteboardElement) => {
      if (!element) return;

      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (element.type === "path") {
        ctx.beginPath();
        element.points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    },
    []
  );

  useEffect(() => {
    const canvas = whiteboardRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      drawElement(ctx, element);
    });
  }, [elements, drawElement, whiteboardRef]);

  return (
    <div className="flex-1 overflow-hidden">
      <canvas
        ref={whiteboardRef}
        width={window.innerWidth}
        height={window.innerHeight - 64}
        className="bg-white cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default Whiteboard;
