'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquareText, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VerdictCard from '@/components/result/VerdictCard';
import ClaimCard from '@/components/result/ClaimCard';
import SourceCard from '@/components/result/SourceCard';
import { AnalysisResult } from '@/lib/types';
import { formatDate, getInputTypeLabel } from '@/lib/utils';

export default function ResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const fetchResult = async () => {
      try {
        const res = await fetch(`${API_URL}/api/analysis/${id}`);
        if (!res.ok) throw new Error('Result not found');
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load the analysis result.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Loading results...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !result) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="rounded-lg bg-red-50 p-6 border border-red-200 text-center">
            <h2 className="text-lg font-semibold text-red-700">Error</h2>
            <p className="mt-2 text-sm text-red-600">{error || 'Result not found'}</p>
            <Link href="/analyze" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">
              Start a new analysis
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {/* Back link */}
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Start a new analysis
          </Link>

          {/* Header */}
          <div className="mt-8">
            <h1 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
              Fact Check Result
            </h1>
            <div className="mt-3 flex items-center gap-3">
               <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                 {getInputTypeLabel(result.inputType)}
               </span>
               <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                 {result.language || 'English'}
               </span>
               <span className="text-xs text-gray-400">{formatDate(result.analyzedAt)}</span>
            </div>
          </div>

          {/* Extracted content for multimodal */}
          {result.inputType !== 'text' && result.inputType !== 'url' && result.originalText && (
             <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Extracted Text</h3>
               <p className="mt-2 text-sm leading-relaxed text-gray-700 break-words whitespace-pre-wrap max-h-40 overflow-y-auto">
                 {result.originalText}
               </p>
             </div>
          )}
          {result.inputType === 'text' && (
             <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Input Text</h3>
               <p className="mt-2 text-sm leading-relaxed text-gray-700 break-words whitespace-pre-wrap max-h-40 overflow-y-auto">
                 {result.originalText || result.inputPreview}
               </p>
             </div>
          )}

          {/* Overall Verdict */}
          <div className="mt-8">
            <VerdictCard
              verdict={result.overallVerdict}
              confidence={result.overallConfidence}
              explanation={result.overallExplanation}
            />
          </div>

          {/* Claims */}
          <section className="mt-12">
            <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">
              Claims Analyzed
            </h2>
            <div className="space-y-4">
              {result.claims.map((claim, index) => (
                <ClaimCard key={claim.id} claim={claim} index={index} />
              ))}
            </div>
          </section>

          {/* Sources */}
          <section className="mt-12">
            <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">
              Evidence & Sources
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.sources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-8 sm:flex-row justify-center">
            <Link
              href="/analyze"
              className="rounded-lg bg-primary-600 px-8 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow"
            >
              Check Another Forward
            </Link>
            <Link
              href="/history"
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-center text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm"
            >
              View History
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
