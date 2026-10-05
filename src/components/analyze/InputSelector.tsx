'use client';

import { FileText, Image, Mic, FileDown, Link2 } from 'lucide-react';
import { InputType } from '@/lib/types';

interface InputSelectorProps {
  selected: InputType;
  onSelect: (type: InputType) => void;
}

const inputOptions: { type: InputType; icon: typeof FileText; label: string }[] = [
  { type: 'text', icon: FileText, label: 'Text' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'voice', icon: Mic, label: 'Voice' },
  { type: 'pdf', icon: FileDown, label: 'PDF' },
  { type: 'url', icon: Link2, label: 'URL' },
];

export default function InputSelector({ selected, onSelect }: InputSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {inputOptions.map((opt) => {
        const isActive = selected === opt.type;
        return (
          <button
            key={opt.type}
            onClick={() => onSelect(opt.type)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? 'border-primary-300 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={isActive}
          >
            <opt.icon className="h-4 w-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
