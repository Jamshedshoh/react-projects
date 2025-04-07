import { SongInfoProps } from '../types/playerTypes';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const SongInfo = ({ song }: SongInfoProps) => {
  if (!song) {
    return (
      <div className="text-center">
        <div className="w-48 h-48 bg-gray-800 rounded-lg mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold">No song selected</h2>
        <p className="text-gray-400">Select a song to play</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <img
        src={song.coverArt}
        alt={`${song.title} album cover`}
        className="w-48 h-48 rounded-lg mx-auto object-cover shadow-lg"
      />
      <h2 className="mt-4 text-xl font-semibold">{song.title}</h2>
      <p className="text-gray-400">{song.artist}</p>
      <p className="text-gray-500 text-sm">{song.album}</p>
      <p className="text-gray-500 text-sm mt-1">{formatTime(song.duration)}</p>
    </div>
  );
};

export default SongInfo;