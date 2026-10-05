'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InputSelector from '@/components/analyze/InputSelector';
import TextInput from '@/components/analyze/TextInput';
import FileUploader from '@/components/analyze/FileUploader';
import UrlInput from '@/components/analyze/UrlInput';
import AnalysisProgress from '@/components/analyze/AnalysisProgress';
import { InputType, AnalysisStep } from '@/lib/types';
import { Languages } from 'lucide-react';

export default function AnalyzePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<InputType>('text');
  const [language, setLanguage] = useState<string>('English');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { label: 'Content received', status: 'pending' },
    { label: 'Extracting claims & searching evidence...', status: 'pending' }
  ]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const startAnalysisText = async (text: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSteps([
      { label: 'Content received', status: 'done' },
      { label: 'Analyzing content...', status: 'active' }
    ]);
    
    try {
      const res = await fetch(`${API_URL}/api/analyze/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language })
      });
      
      if (!res.ok) {
        let message = 'Analysis failed';
        try {
          const errData = await res.json();
          message = errData.detail || message;
        } catch {}
        throw new Error(message);
      }
      const data = await res.json();
      
      setSteps([
        { label: 'Content received', status: 'done' },
        { label: 'Analysis complete', status: 'done' }
      ]);
      router.push(`/result/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect to the analysis engine. Please ensure the backend is running.');
      setIsAnalyzing(false);
    }
  };

  const startAnalysisUrl = async (url: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSteps([
      { label: 'Content received', status: 'done' },
      { label: 'Analyzing URL...', status: 'active' }
    ]);
    
    try {
      const res = await fetch(`${API_URL}/api/analyze/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language })
      });
      
      if (!res.ok) {
        let message = 'Analysis failed';
        try {
          const errData = await res.json();
          message = errData.detail || message;
        } catch {}
        throw new Error(message);
      }
      const data = await res.json();
      router.push(`/result/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect to the analysis engine.');
      setIsAnalyzing(false);
    }
  };

  const startAnalysisFile = async (file: File, type: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setSteps([
      { label: 'File uploaded', status: 'done' },
      { label: 'Extracting text and analyzing...', status: 'active' }
    ]);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    
    try {
      const res = await fetch(`${API_URL}/api/analyze/${type}`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        let message = 'Analysis failed';
        try {
          const errData = await res.json();
          message = errData.detail || message;
        } catch {}
        throw new Error(message);
      }
      const data = await res.json();
      router.push(`/result/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect to the analysis engine.');
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {!isAnalyzing ? (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Analyze Content
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Paste a forward, upload a file, or enter a URL to fact-check.
                </p>
              </div>

              {errorMsg && (
                <div className="mt-6 rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                 <InputSelector
                    selected={selectedType}
                    onSelect={setSelectedType}
                  />
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                    </select>
                  </div>
              </div>

              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mt-2">
                  {selectedType === 'text' && (
                    <TextInput onSubmit={(text) => startAnalysisText(text)} />
                  )}
                  {selectedType === 'image' && (
                    <FileUploader
                      accept="image/*"
                      label="Upload an image or screenshot"
                      description="PNG, JPG, or WEBP up to 10MB"
                      icon="image"
                      onSubmit={(f) => startAnalysisFile(f, 'image')}
                    />
                  )}
                  {selectedType === 'voice' && (
                    <FileUploader
                      accept="audio/*"
                      label="Upload a voice note"
                      description="MP3, WAV, M4A, or OGG up to 25MB"
                      icon="voice"
                      onSubmit={(f) => startAnalysisFile(f, 'audio')}
                    />
                  )}
                  {selectedType === 'pdf' && (
                    <FileUploader
                      accept=".pdf"
                      label="Upload a PDF document"
                      description="PDF up to 20MB"
                      icon="pdf"
                      onSubmit={(f) => startAnalysisFile(f, 'pdf')}
                    />
                  )}
                  {selectedType === 'url' && (
                    <UrlInput onSubmit={(url) => startAnalysisUrl(url)} />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="py-16">
              <AnalysisProgress steps={steps} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
