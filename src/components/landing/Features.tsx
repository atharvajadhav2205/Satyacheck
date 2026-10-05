'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Image,
  Mic,
  FileDown,
  Link2,
  Languages,
  Zap,
  Eye,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Multi-Format Input',
    description:
      'Submit text messages, screenshots, voice notes, PDF documents, or URLs for analysis.',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description:
      'Get fact-check results in seconds, powered by advanced AI and evidence retrieval.',
  },
  {
    icon: Eye,
    title: 'Explainable Verdicts',
    description:
      'Every verdict comes with claim-level breakdowns, confidence scores, and cited sources.',
  },
  {
    icon: Languages,
    title: 'Multilingual Support',
    description:
      'Analyze content in multiple languages. Our AI understands context across languages.',
  },
  {
    icon: Link2,
    title: 'Source Verification',
    description:
      'Evidence is retrieved from trusted databases, news archives, and fact-checking organizations.',
  },
  {
    icon: FileDown,
    title: 'Export & Share',
    description:
      'Download or share your fact-check report to help others make informed decisions.',
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Built for Accuracy
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 sm:text-base">
            Everything you need to verify forwarded content with confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group rounded-xl border border-gray-100 p-6 transition-all hover:border-gray-200 hover:shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 transition-colors group-hover:bg-primary-100">
                <feature.icon className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
