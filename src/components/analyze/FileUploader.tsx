'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, Mic } from 'lucide-react';

interface FileUploaderProps {
  accept: string;
  label: string;
  description: string;
  icon: 'image' | 'voice' | 'pdf';
  onSubmit: (file: File) => void;
}

const iconMap = {
  image: Image,
  voice: Mic,
  pdf: FileText,
};

export default function FileUploader({
  accept,
  label,
  description,
  icon,
  onSubmit,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const Icon = iconMap[icon];

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const removeFile = () => setFile(null);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
            dragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
            <Upload className="h-5 w-5 text-primary-600" />
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Drag & drop your file here, or{' '}
            <label className="cursor-pointer font-medium text-primary-600 hover:text-primary-700">
              browse
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </p>
          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
              <Icon className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => file && onSubmit(file)}
          disabled={!file}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
