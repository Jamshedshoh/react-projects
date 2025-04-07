import { PlaylistProps } from '../types/playerTypes';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const Playlist = ({ songs, currentSong, onSelectSong }: PlaylistProps) => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Playlist</h2>
      <div className="space-y-2">
        {songs.map(song => (
          <div
            key={song.id}
            onClick={() => onSelectSong(song)}
            className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-800 ${
              currentSong?.id === song.id ? 'bg-gray-800' : ''
            }`}
          >
            <img
              src={song.coverArt}
              alt={`${song.title} album cover`}
              className="w-12 h-12 rounded mr-4 object-cover"
            />
            <div className="flex-1">
              <h3 className={`font-medium ${currentSong?.id === song.id ? 'text-white' : 'text-gray-200'}`}>
                {song.title}
              </h3>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
            <span className="text-sm text-gray-500">{formatTime(song.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;