import { useState } from 'react';
import PlayerControls from './components/PlayerControls';
import SongInfo from './components/SongInfo';
import ProgressBar from './components/ProgressBar';
import VolumeControl from './components/VolumeControl';
import Playlist from './components/Playlist';
import useAudioPlayer from './hooks/useAudioPlayer';
import { Song } from './types/playerTypes';

const initialPlaylist: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 203,
    coverArt: 'https://i.scdn.co/image/ab67616d00001e02c5910f1aae8210bc0636b9e9',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    coverArt: 'https://i.scdn.co/image/ab67616d00001e02c5910f1aae8210bc0636b9e9',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    duration: 230,
    coverArt: 'https://i.scdn.co/image/ab67616d00001e02a3a0e9c7d7b9d6e3b0e1d5e0',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

function App() {
  const {
    playerState,
    playSong,
    togglePlayPause,
    handleNext,
    handlePrevious,
    handleShuffle,
    handleRepeat,
    handleVolumeChange,
    handleProgressChange,
  } = useAudioPlayer(initialPlaylist);

  const [showPlaylist, setShowPlaylist] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <SongInfo song={playerState.currentSong} />
        
        <div className="w-full max-w-md mt-8">
          <ProgressBar
            progress={playerState.progress}
            currentTime={playerState.currentTime}
            duration={playerState.currentSong?.duration || 0}
            onChange={handleProgressChange}
          />
          
          <PlayerControls
            isPlaying={playerState.isPlaying}
            onPlayPause={togglePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onShuffle={handleShuffle}
            onRepeat={handleRepeat}
          />
          
          <VolumeControl
            volume={playerState.volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      {/* Playlist toggle */}
      <button
        onClick={() => setShowPlaylist(!showPlaylist)}
        className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded-full hover:bg-gray-700"
      >
        {showPlaylist ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Playlist */}
      {showPlaylist && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 z-10 overflow-y-auto">
          <Playlist
            songs={playerState.playlist}
            currentSong={playerState.currentSong}
            onSelectSong={playSong}
          />
        </div>
      )}
    </div>
  );
}

export default App;