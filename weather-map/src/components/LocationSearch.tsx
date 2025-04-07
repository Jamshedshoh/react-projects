import { useState } from 'react';
import { LocationSearchProps } from '../types/weatherTypes';
import { Search } from 'lucide-react';

const LocationSearch = ({ onSearch }: LocationSearchProps) => {
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search for a location..."
          className="w-full p-4 pl-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default LocationSearch;