export type Tool = 'pen' | 'eraser' | 'circle' | 'rectangle' | 'text' | 'select'

export interface Point {
  x: number
  y: number
}

export interface WhiteboardElement {
  type: 'path' | 'circle' | 'rectangle' | 'text'
  points: Point[]
  color: string
  size: number
  text?: string
}

export interface ToolbarProps {
  color: string
  setColor: (color: string) => void
  brushSize: number
  setBrushSize: (size: number) => void
  tool: Tool
  setTool: (tool: Tool) => void
  clearWhiteboard: () => void
}

export interface ColorPickerProps {
  color: string
  setColor: (color: string) => void
}

export interface WhiteboardProps {
  color: string
  brushSize: number
  tool: Tool
  elements: WhiteboardElement[]
  setElements: (elements: WhiteboardElement[]) => void
  isDrawing: boolean
  setIsDrawing: (drawing: boolean) => void
  whiteboardRef: React.RefObject<HTMLCanvasElement>
}