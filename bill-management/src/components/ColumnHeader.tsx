import { Plus, X } from 'lucide-react';
import { ColumnHeaderProps } from '../types/spreadsheetTypes';

const ColumnHeader = ({ 
  title, 
  onAddColumnLeft, 
  onAddColumnRight,
  onRemove 
}: ColumnHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-50 border-b p-2 font-medium group">
      <div className="flex items-center justify-between">
        {onAddColumnLeft && (
          <button 
            onClick={onAddColumnLeft}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
          >
            <Plus size={14} />
          </button>
        )}
        
        <span className="mx-2">{title}</span>

        <div className="flex items-center">
          {onAddColumnRight && (
            <button 
              onClick={onAddColumnRight}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
            >
              <Plus size={14} />
            </button>
          )}
          {onRemove && (
            <button 
              onClick={onRemove}
              className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnHeader;