import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Track } from '../types';
import PlayerControls from './PlayerControls';
import TrackList from './TrackList';
import FileUpload from './FileUpload';

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type === 'audio/mpeg') {
        const url = URL.createObjectURL(file);
        setTracks(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url
        }]);
      }
    });
  };

  const playTrack = useCallback(async (track: Track) => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        }
        setCurrentTrack(track);
        audioRef.current.src = track.url;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing track:', error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying]);

  const togglePlayPause = useCallback(async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
          setIsPlaying(false);
        } else if (currentTrack) {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error toggling play/pause:', error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, currentTrack]);

  const skipTrack = useCallback((direction: 'forward' | 'back') => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let newIndex;
    
    if (direction === 'forward') {
      newIndex = (currentIndex + 1) % tracks.length;
    } else {
      newIndex = currentIndex - 1 < 0 ? tracks.length - 1 : currentIndex - 1;
    }
    
    playTrack(tracks[newIndex]);
  }, [currentTrack, tracks, playTrack]);

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.volume = newMuted ? 0 : volume;
      setIsMuted(newMuted);
    }
  }, [isMuted, volume]);

  const removeTrack = useCallback((trackId: string) => {
    if (currentTrack?.id === trackId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentTrack(null);
      setIsPlaying(false);
    }
    setTracks(prev => prev.filter(t => t.id !== trackId));
  }, [currentTrack]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
        <div className="flex flex-col gap-8">
          <FileUpload onFileUpload={handleFileUpload} />
          
          <PlayerControls
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            onPlayPause={togglePlayPause}
            onSkipTrack={skipTrack}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onMute={toggleMute}
          />

          <audio
            ref={audioRef}
            onEnded={() => skipTrack('forward')}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="hidden"
          />

          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            onTrackSelect={playTrack}
            onTrackRemove={removeTrack}
          />
        </div>
      </div>
    </div>
  );
}