import { useState, useEffect, useRef } from "react";
import { Song, PlayerState } from "../types/playerTypes";

const useAudioPlayer = (initialPlaylist: Song[]) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    volume: 0.7,
    progress: 0,
    playlist: initialPlaylist,
    currentTime: 0,
  });

  // Handle song changes
  useEffect(() => {
    if (playerState.currentSong) {
      audioRef.current.src = playerState.currentSong.audioSrc;
      if (playerState.isPlaying) {
        audioRef.current.play();
      }
    }
  }, [playerState.currentSong]);

  // Handle play/pause
  useEffect(() => {
    if (playerState.isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playerState.isPlaying]);

  // Handle volume changes
  useEffect(() => {
    audioRef.current.volume = playerState.volume;
  }, [playerState.volume]);

  // Update progress
  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setPlayerState((prev) => ({
        ...prev,
        progress: (audio.currentTime / audio.duration) * 100 || 0,
        currentTime: audio.currentTime,
      }));
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleNext);
    };
  }, []);

  const togglePlayPause = () => {
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const playSong = (song: Song) => {
    setPlayerState((prev) => ({
      ...prev,
      currentSong: song,
      isPlaying: true,
    }));
  };

  const handleNext = () => {
    if (!playerState.currentSong) return;

    const currentIndex = playerState.playlist.findIndex(
      (song) => song.id === playerState.currentSong?.id
    );
    const nextIndex = (currentIndex + 1) % playerState.playlist.length;
    playSong(playerState.playlist[nextIndex]);
  };

  const handlePrevious = () => {
    if (!playerState.currentSong) return;

    const currentIndex = playerState.playlist.findIndex(
      (song) => song.id === playerState.currentSong?.id
    );
    const prevIndex =
      (currentIndex - 1 + playerState.playlist.length) %
      playerState.playlist.length;
    playSong(playerState.playlist[prevIndex]);
  };

  const handleShuffle = () => {
    const shuffled = [...playerState.playlist].sort(() => Math.random() - 0.5);
    setPlayerState((prev) => ({
      ...prev,
      playlist: shuffled,
    }));
  };

  const handleRepeat = () => {
    audioRef.current.loop = !audioRef.current.loop;
  };

  const handleVolumeChange = (volume: number) => {
    setPlayerState((prev) => ({
      ...prev,
      volume,
    }));
  };

  const handleProgressChange = (progress: number) => {
    if (!playerState.currentSong) return;

    const audio = audioRef.current;
    audio.currentTime = (progress / 100) * audio.duration;
    setPlayerState((prev) => ({
      ...prev,
      progress,
      currentTime: audio.currentTime,
    }));
  };

  return {
    playerState,
    playSong,
    togglePlayPause,
    handleNext,
    handlePrevious,
    handleShuffle,
    handleRepeat,
    handleVolumeChange,
    handleProgressChange,
  };
};

export default useAudioPlayer;
