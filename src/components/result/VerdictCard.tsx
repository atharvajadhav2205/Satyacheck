'use client';

import { VerdictType } from '@/lib/types';
import { getVerdictConfig } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

interface VerdictCardProps {
  verdict: VerdictType;
  confidence: number;
  explanation: string;
}

const verdictIcons = {
  supported: CheckCircle2,
  contradicted: XCircle,
  misleading: AlertTriangle,
  insufficient: HelpCircle,
};

export default function VerdictCard({
  verdict,
  confidence,
  explanation,
}: VerdictCardProps) {
  const config = getVerdictConfig(verdict);
  const Icon = verdictIcons[verdict];

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-6 sm:p-8`}
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-5">
        <div className="flex-shrink-0">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${config.bg}`}
          >
            <Icon className={`h-7 w-7 ${config.color}`} />
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <span className={`text-lg font-bold ${config.color}`}>
              {config.label}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badgeBg}`}
            >
              {confidence}% confidence
            </span>
          </div>
          <div className="mt-2 text-sm leading-relaxed text-gray-600">
            {explanation.includes('•') ? (
              <>
                <p className="mb-3 text-gray-800">
                  {explanation.split('•')[0].trim()}
                </p>
                <ul className="space-y-2">
                  {explanation
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
              <p>{explanation}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
