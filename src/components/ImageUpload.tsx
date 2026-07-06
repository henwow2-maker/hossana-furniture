import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTimeout(() => {
        onChange(result);
        setIsUploading(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative group cursor-pointer border-2 border-dashed rounded-[30px] transition-all duration-300 min-h-[180px] flex flex-col items-center justify-center p-6",
          isDragging ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/50 bg-black/40",
          value && "border-solid border-white/5"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden" 
          accept="image/*"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-gold animate-spin" />
            <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Uploading...</p>
          </div>
        ) : value ? (
          <div className="relative w-full h-full min-h-[140px] flex items-center justify-center">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-2xl max-h-[220px]"
            />
            <button 
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
               <p className="text-[10px] uppercase tracking-widest text-white font-bold bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md">Change Image</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-gold/10 transition-colors">
               <Upload className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-xs text-white font-medium mb-1">Click or drag image to upload</p>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Recommended: Web optimized square ratio</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 py-0.5">
        <div className="h-px bg-white/5 flex-1" />
        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold font-mono">Or</span>
        <div className="h-px bg-white/5 flex-1" />
      </div>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <input 
          type="text"
          placeholder="Paste external image URL..."
          value={value && value.startsWith('data:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/40 border border-white/10 text-xs text-white rounded-xl focus:border-gold outline-none p-3.5 pl-3.5 pr-10 placeholder:text-gray-600 transition-colors"
        />
        {value && !value.startsWith('data:') && (
          <button 
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
