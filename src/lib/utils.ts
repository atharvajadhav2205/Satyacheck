import { VerdictType } from './types';

export function getVerdictConfig(verdict: VerdictType) {
  switch (verdict) {
    case 'supported':
      return {
        label: 'Supported',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dotColor: 'bg-emerald-500',
        badgeBg: 'bg-emerald-100 text-emerald-800',
      };
    case 'contradicted':
      return {
        label: 'Contradicted',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dotColor: 'bg-red-500',
        badgeBg: 'bg-red-100 text-red-800',
      };
    case 'misleading':
      return {
        label: 'Misleading / Partially True',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dotColor: 'bg-amber-500',
        badgeBg: 'bg-amber-100 text-amber-800',
      };
    case 'insufficient':
      return {
        label: 'Insufficient Evidence',
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        dotColor: 'bg-slate-400',
        badgeBg: 'bg-slate-100 text-slate-700',
      };
  }
}

export function getInputTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    text: 'Text',
    image: 'Image',
    voice: 'Voice',
    pdf: 'PDF',
    url: 'URL',
  };
  return labels[type] || type;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
