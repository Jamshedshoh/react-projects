import { Plus, Save, Download, Table2 } from 'lucide-react';
import { ToolbarProps } from '../types/spreadsheetTypes';

const SpreadsheetToolbar = ({ onAddColumn, onAddRow, onSave, onExport }: ToolbarProps) => {
  return (
    <div className="bg-white shadow-sm p-2 flex items-center space-x-4 border-b">
      <div className="flex items-center space-x-2">
        <button
          onClick={onAddColumn}
          className="flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <Plus size={16} className="mr-1" />
          <span>Add Column</span>
        </button>
        <button
          onClick={onAddRow}
          className="flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <Plus size={16} className="mr-1" />
          <span>Add Row</span>
        </button>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="flex items-center px-3 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100"
        >
          <Save size={16} className="mr-1" />
          <span>Save</span>
        </button>
        <div className="relative group">
          <button className="flex items-center px-3 py-1 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100">
            <Download size={16} className="mr-1" />
            <span>Export</span>
          </button>
          <div className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
            <button 
              onClick={() => onExport('csv')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              CSV
            </button>
            <button 
              onClick={() => onExport('json')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetToolbar;