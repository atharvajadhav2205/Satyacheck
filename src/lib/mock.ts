import { AnalysisResult, HistoryItem } from './types';

export const mockResult: AnalysisResult = {
  id: 'result-001',
  inputType: 'text',
  inputPreview:
    'NASA has confirmed that the Earth will experience 15 days of complete darkness in November 2025 due to a rare planetary alignment involving Venus and Jupiter.',
  overallVerdict: 'contradicted',
  overallConfidence: 94,
  overallExplanation:
    'This claim has been widely debunked by NASA and multiple credible astronomical organizations. No planetary alignment can cause prolonged darkness on Earth. This is a recurring hoax that resurfaces periodically on social media.',
  claims: [
    {
      id: 'claim-1',
      text: 'NASA confirmed 15 days of darkness in November 2025.',
      verdict: 'contradicted',
      confidence: 97,
      explanation:
        'NASA has issued no such statement. This claim originates from a satirical article from 2015 that continues to be reshared as real news.',
      evidenceIds: ['src-1', 'src-2'],
    },
    {
      id: 'claim-2',
      text: 'A rare planetary alignment of Venus and Jupiter will block sunlight.',
      verdict: 'contradicted',
      confidence: 95,
      explanation:
        'Planetary alignments do not have the ability to block sunlight from reaching Earth. Venus and Jupiter are far too small and distant relative to the Sun to cause any noticeable effect on Earth\'s illumination.',
      evidenceIds: ['src-2', 'src-3'],
    },
    {
      id: 'claim-3',
      text: 'The Earth will experience complete darkness for an extended period.',
      verdict: 'contradicted',
      confidence: 91,
      explanation:
        'No known astronomical phenomenon can cause the entire Earth to experience complete darkness for 15 days. The Earth\'s rotation ensures continuous day-night cycles.',
      evidenceIds: ['src-1', 'src-3', 'src-4'],
    },
  ],
  sources: [
    {
      id: 'src-1',
      title: 'No, NASA Did Not Predict 15 Days of Darkness',
      publisher: 'Snopes',
      publishedDate: '2024-10-15',
      snippet:
        'This recurring hoax claims NASA confirmed an upcoming period of total darkness. NASA has never made such a prediction, and the original claim traces back to a satirical news article.',
      url: 'https://www.snopes.com/fact-check/15-days-of-darkness/',
    },
    {
      id: 'src-2',
      title: 'Planetary Alignments Do Not Cause Darkness on Earth',
      publisher: 'NASA Science',
      publishedDate: '2024-09-20',
      snippet:
        'Planetary alignments are a normal occurrence and have no measurable effect on Earth. They cannot block sunlight or cause extended periods of darkness.',
      url: 'https://science.nasa.gov/solar-system/',
    },
    {
      id: 'src-3',
      title: 'Debunking the "Days of Darkness" Myth',
      publisher: 'Reuters Fact Check',
      publishedDate: '2024-11-01',
      snippet:
        'Fact-checkers have repeatedly debunked claims about upcoming periods of complete darkness. There is no scientific basis for these claims.',
      url: 'https://www.reuters.com/fact-check/',
    },
    {
      id: 'src-4',
      title: 'Understanding Planetary Motion and Light',
      publisher: 'European Space Agency',
      publishedDate: '2024-08-12',
      snippet:
        'The planets in our solar system are far too small relative to the Sun to block any meaningful amount of sunlight from reaching Earth during alignments.',
      url: 'https://www.esa.int/',
    },
  ],
  analyzedAt: '2025-10-03T12:30:00Z',
};

export const mockHistory: HistoryItem[] = [
  {
    id: 'result-001',
    date: '2025-10-03',
    inputType: 'text',
    shortClaim: 'NASA confirmed 15 days of darkness in November 2025',
    verdict: 'contradicted',
    confidence: 94,
  },
  {
    id: 'result-002',
    date: '2025-10-02',
    inputType: 'image',
    shortClaim: 'WHO recommends drinking warm water to prevent COVID-19',
    verdict: 'misleading',
    confidence: 78,
  },
  {
    id: 'result-003',
    date: '2025-10-01',
    inputType: 'url',
    shortClaim: 'India to implement 4-day work week from January 2026',
    verdict: 'insufficient',
    confidence: 45,
  },
  {
    id: 'result-004',
    date: '2025-09-29',
    inputType: 'text',
    shortClaim: 'Vitamin C supplements can cure the common cold within 24 hours',
    verdict: 'contradicted',
    confidence: 88,
  },
  {
    id: 'result-005',
    date: '2025-09-28',
    inputType: 'pdf',
    shortClaim: 'Electric vehicles produce more lifetime emissions than petrol cars',
    verdict: 'contradicted',
    confidence: 91,
  },
  {
    id: 'result-006',
    date: '2025-09-27',
    inputType: 'voice',
    shortClaim: 'The Reserve Bank of India is launching a digital rupee for all citizens',
    verdict: 'supported',
    confidence: 82,
  },
  {
    id: 'result-007',
    date: '2025-09-25',
    inputType: 'text',
    shortClaim: 'Eating carrots significantly improves night vision',
    verdict: 'misleading',
    confidence: 72,
  },
  {
    id: 'result-008',
    date: '2025-09-24',
    inputType: 'image',
    shortClaim: 'New study proves that 5G towers cause health problems',
    verdict: 'contradicted',
    confidence: 96,
  },
];
