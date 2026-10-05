'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Loader2, Trash2, AlertTriangle, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HistoryCard from '@/components/history/HistoryCard';
import { HistoryItem } from '@/lib/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/history`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/analysis/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      const res = await fetch(`${API_URL}/api/history`, { method: 'DELETE' });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to clear history:', err);
    } finally {
      setClearing(false);
      setShowClearModal(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                History
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Your previous fact-check analyses.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && !loading && (
                <button
                  onClick={() => setShowClearModal(true)}
                  className="hidden items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50 hover:border-red-300 sm:inline-flex"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              )}
              <Link
                href="/analyze"
                className="hidden items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 sm:inline-flex"
              >
                New Analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {loading ? (
             <div className="mt-16 flex flex-col items-center justify-center">
               <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
             </div>
          ) : error ? (
             <div className="mt-16 rounded-lg bg-red-50 p-6 border border-red-200 text-center">
               <p className="text-sm text-red-600">{error}</p>
             </div>
          ) : history.length > 0 ? (
            <div className="mt-8 space-y-3">
              {history.map((item) => (
                <div key={item.id} className={`transition-opacity ${deletingId === item.id ? 'opacity-50 pointer-events-none' : ''}`}>
                  <HistoryCard item={item} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-gray-900">
                No analyses yet
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your fact-check history will appear here.
              </p>
              <Link
                href="/analyze"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                Check Your First Forward
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Mobile CTAs */}
          <div className="mt-6 flex flex-col gap-2 sm:hidden">
            {history.length > 0 && !loading && (
              <button
                onClick={() => setShowClearModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear All History
              </button>
            )}
            <Link
              href="/analyze"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              New Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowClearModal(false)}
              className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Clear All History?
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                This will permanently delete all {history.length} analyses and their associated data. This action cannot be undone.
              </p>
              <div className="mt-6 flex w-full gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={clearing}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                >
                  {clearing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Clearing...
                    </span>
                  ) : (
                    'Delete All'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
