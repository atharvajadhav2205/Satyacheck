import Link from 'next/link';
import { ArrowRight, FileText, Image, Mic, FileDown, Link2, Trash2 } from 'lucide-react';
import { HistoryItem } from '@/lib/types';
import { getVerdictConfig, formatDate, getInputTypeLabel } from '@/lib/utils';

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
}

const inputIcons = {
  text: FileText,
  image: Image,
  voice: Mic,
  pdf: FileDown,
  url: Link2,
};

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const config = getVerdictConfig(item.verdict);
  const Icon = inputIcons[item.inputType];

  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md sm:p-5">
      <Link
        href={`/result/${item.id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`View result for ${item.shortClaim}`}
      />

      {/* Input type icon */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-primary-50">
        <Icon className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {item.shortClaim}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span>{formatDate(item.date)}</span>
          <span>·</span>
          <span>{getInputTypeLabel(item.inputType)}</span>
          <span>·</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeBg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
            {config.label}
          </span>
          <span className="text-xs text-gray-400">
            {item.confidence}%
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="relative z-10 flex-shrink-0 rounded-lg p-2 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        aria-label={`Delete analysis ${item.shortClaim}`}
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Arrow */}
      <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-primary-600" />
    </div>
  );
}
