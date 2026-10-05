'use client';

import { useState } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
}

const MAX_CHARS = 5000;

export default function TextInput({ onSubmit }: TextInputProps) {
  const [text, setText] = useState('');

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="space-y-3">
      <label htmlFor="forward-text" className="block text-sm font-medium text-gray-700">
        Paste your forwarded message
      </label>
      <div className="relative">
        <textarea
          id="forward-text"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the forwarded message you want to fact-check..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`text-xs ${
            isOverLimit ? 'text-red-600 font-medium' : 'text-gray-400'
          }`}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
        </span>
        <button
          onClick={() => onSubmit(text)}
          disabled={!text.trim() || isOverLimit}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
