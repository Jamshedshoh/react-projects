export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverArt: string;
  audioSrc: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playlist: Song[];
  currentTime: number;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
}

export interface ProgressBarProps {
  progress: number;
  currentTime: number;
  duration: number;
  onChange: (progress: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export interface SongInfoProps {
  song: Song | null;
}

export interface PlaylistProps {
  songs: Song[];
  currentSong: Song | null;
  onSelectSong: (song: Song) => void;
}