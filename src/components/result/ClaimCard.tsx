'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Claim } from '@/lib/types';
import { getVerdictConfig } from '@/lib/utils';

interface ClaimCardProps {
  claim: Claim;
  index: number;
}

export default function ClaimCard({ claim, index }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = getVerdictConfig(claim.verdict);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 p-5 text-left"
        aria-expanded={expanded}
      >
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{claim.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badgeBg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
              {config.label}
            </span>
            <span className="text-xs text-gray-400">
              {claim.confidence}% confidence
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 pt-1">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="text-sm leading-relaxed text-gray-600">
            {claim.explanation.includes('•') ? (
              <>
                <p className="mb-3 text-gray-800">
                  {claim.explanation.split('•')[0].trim()}
                </p>
                <ul className="space-y-2">
                  {claim.explanation
                    .split('•')
                    .slice(1)
                    .map((part, idx) => {
                      const trimmed = part.trim();
                      if (!trimmed) return null;
                      return (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-2 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span>{trimmed}</span>
                        </li>
                      );
                    })}
                </ul>
              </>
            ) : (
              <p>{claim.explanation}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
