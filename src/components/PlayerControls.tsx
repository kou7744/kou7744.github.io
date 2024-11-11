import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Track } from '../types';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

interface PlayerControlsProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onSkipTrack: (direction: 'forward' | 'back') => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
}

export default function PlayerControls({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onSkipTrack,
  onSeek,
  onVolumeChange,
  onMute,
}: PlayerControlsProps) {
  if (!currentTrack) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-white/90 font-medium truncate w-full text-center">
        {currentTrack.name}
      </h2>
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />
      <div className="flex items-center justify-between w-full">
        <VolumeControl
          volume={volume}
          onVolumeChange={onVolumeChange}
          onMute={onMute}
          isMuted={isMuted}
        />
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSkipTrack('back')}
            className="text-white/80 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={onPlayPause}
            className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all text-white"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </button>
          <button
            onClick={() => onSkipTrack('forward')}
            className="text-white/80 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        <div className="w-24" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
}