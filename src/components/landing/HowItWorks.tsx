'use client';

import { motion } from 'framer-motion';
import { Upload, ScanSearch, FileCheck } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Submit Content',
    description:
      'Paste a forwarded message, upload an image, voice note, PDF, or enter a URL.',
  },
  {
    icon: ScanSearch,
    title: 'AI Analyzes Claims',
    description:
      'Our AI extracts claims, searches reliable sources, and cross-references evidence.',
  },
  {
    icon: FileCheck,
    title: 'Get Your Verdict',
    description:
      'Receive an explainable verdict with confidence scores, claims breakdown, and sources.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 sm:text-base">
            Three simple steps to verify any forwarded content.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50">
                <step.icon className="h-5 w-5 text-primary-600" />
              </div>
              <span className="mt-4 block text-xs font-medium text-primary-600">
                Step {index + 1}
              </span>
              <h3 className="mt-1 text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
