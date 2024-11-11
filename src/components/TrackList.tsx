import React from 'react';
import { Trash2 } from 'lucide-react';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
  onTrackRemove: (trackId: string) => void;
}

export default function TrackList({
  tracks,
  currentTrack,
  onTrackSelect,
  onTrackRemove,
}: TrackListProps) {
  return (
    <div className="space-y-2">
      {tracks.map(track => (
        <div
          key={track.id}
          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
            currentTrack?.id === track.id
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <button
            onClick={() => onTrackSelect(track)}
            className="flex-1 text-left truncate pr-4"
          >
            {track.name}
          </button>
          <div className="flex items-center gap-2">
            <a
              href={track.url}
              download={track.name}
              className="text-white/60 hover:text-white transition-colors p-1"
              onClick={e => e.stopPropagation()}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTrackRemove(track.id);
              }}
              className="text-white/60 hover:text-red-400 transition-colors p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}