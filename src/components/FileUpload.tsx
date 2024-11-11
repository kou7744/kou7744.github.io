import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  return (
    <div className="relative group">
      <input
        type="file"
        accept=".mp3,audio/mpeg"
        multiple
        onChange={onFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center w-full p-6 border-2 border-dashed border-white/30 rounded-xl cursor-pointer group-hover:border-white/50 transition-all"
      >
        <div className="flex flex-col items-center gap-2 text-white/80 group-hover:text-white">
          <Upload className="w-8 h-8" />
          <span className="text-sm font-medium">Upload MP3 Files</span>
        </div>
      </label>
    </div>
  );
}