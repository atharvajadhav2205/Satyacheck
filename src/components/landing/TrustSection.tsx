'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Database, BookOpen, Award } from 'lucide-react';

const trustPoints = [
  {
    icon: Database,
    stat: '50+',
    label: 'Verified Sources',
    description: 'Cross-referencing trusted news outlets, fact-checkers, and academic databases.',
  },
  {
    icon: ShieldCheck,
    stat: '95%',
    label: 'Accuracy Rate',
    description: 'Validated against human fact-checker benchmarks across multiple categories.',
  },
  {
    icon: BookOpen,
    stat: 'Transparent',
    label: 'Explainable AI',
    description: 'Every verdict includes cited evidence and reasoning you can verify yourself.',
  },
  {
    icon: Award,
    stat: 'Open',
    label: 'Methodology',
    description: 'Our approach is documented and open for review by researchers and the public.',
  },
];

export default function TrustSection() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Why Trust Our Verdicts?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 sm:text-base">
            Built on transparency, evidence, and rigorous methodology.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.label}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50">
                <point.icon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="mt-4 text-2xl font-bold text-gray-900">
                {point.stat}
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-700">
                {point.label}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
