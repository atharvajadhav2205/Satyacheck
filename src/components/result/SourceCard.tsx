import { ExternalLink } from 'lucide-react';
import { Source } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface SourceCardProps {
  source: Source;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-gray-900 leading-snug">
            {source.title}
          </h4>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span className="font-medium text-gray-500">{source.publisher}</span>
            <span>·</span>
            <span>{formatDate(source.publishedDate)}</span>
          </div>
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label={`Visit ${source.publisher}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-3">
        {source.snippet}
      </p>
    </div>
  );
}
