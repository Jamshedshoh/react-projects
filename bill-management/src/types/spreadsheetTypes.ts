export type CellValue = string | number | boolean | null;
export type CellFormula = string;

export interface Cell {
  value: CellValue;
  formula?: CellFormula;
  isEditing: boolean;
}

export interface SpreadsheetData {
  columns: string[];
  rows: Record<string, Cell>[];
}

export interface ToolbarProps {
  onAddColumn: () => void;
  onAddRow: () => void;
  onSave: () => void;
  onExport: (format: 'csv' | 'json') => void;
}

export interface SpreadsheetProps {
  data: SpreadsheetData;
  onCellChange: (rowIndex: number, columnId: string, value: CellValue) => void;
  onCellEdit: (rowIndex: number, columnId: string, isEditing: boolean) => void;
  onAddColumn: () => void;
  onAddRow: () => void;
}

export interface CellProps {
  value: CellValue;
  isEditing: boolean;
  onChange: (value: CellValue) => void;
  onEdit: (isEditing: boolean) => void;
}

export interface ColumnHeaderProps {
  title: string;
  onAddColumnLeft?: () => void;
  onAddColumnRight?: () => void;
  onRemove?: () => void;
}