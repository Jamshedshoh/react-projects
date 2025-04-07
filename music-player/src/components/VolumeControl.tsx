import { VolumeControlProps } from '../types/playerTypes';
import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

const VolumeControl = ({ volume, onChange }: VolumeControlProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  const toggleMute = () => {
    if (isMuted) {
      onChange(prevVolume);
    } else {
      setPrevVolume(volume);
      onChange(0);
    }
    setIsMuted(!isMuted);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    onChange(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  return (
    <div className="flex items-center mt-4">
      <button onClick={toggleMute} className="text-gray-400 hover:text-white mr-2">
        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={handleChange}
        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;