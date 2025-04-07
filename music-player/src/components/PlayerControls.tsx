import { PlayerControlsProps } from "../types/playerTypes";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";

const PlayerControls = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  onRepeat,
}: PlayerControlsProps) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={onShuffle}
        className="p-2 text-gray-400 hover:text-white"
        aria-label="Shuffle"
      >
        <Shuffle size={20} />
      </button>

      <button
        onClick={onPrevious}
        className="p-2 text-gray-400 hover:text-white"
        aria-label="Previous"
      >
        <SkipBack size={24} />
      </button>

      <button
        onClick={onPlayPause}
        className="p-3 bg-white text-black rounded-full hover:bg-gray-200"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={24} fill="currentColor" />
        ) : (
          <Play size={24} fill="currentColor" />
        )}
      </button>

      <button
        onClick={onNext}
        className="p-2 text-gray-400 hover:text-white"
        aria-label="Next"
      >
        <SkipForward size={24} />
      </button>

      <button
        onClick={onRepeat}
        className="p-2 text-gray-400 hover:text-white"
        aria-label="Repeat"
      >
        <Repeat size={20} />
      </button>
    </div>
  );
};

export default PlayerControls;
