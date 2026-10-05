'use client';

import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';
import { AnalysisStep } from '@/lib/types';

interface AnalysisProgressProps {
  steps: AnalysisStep[];
}

export default function AnalysisProgress({ steps }: AnalysisProgressProps) {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mx-auto flex h-12 w-12 items-center justify-center"
        >
          <Loader2 className="h-8 w-8 text-primary-600" />
        </motion.div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Analyzing your content
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          This usually takes a few seconds.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <motion.li
              key={step.label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              {step.status === 'done' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              )}
              {step.status === 'active' && (
                <div className="flex h-6 w-6 items-center justify-center">
                  <motion.div
                    className="h-2.5 w-2.5 rounded-full bg-primary-600"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                </div>
              )}
              {step.status === 'pending' && (
                <div className="flex h-6 w-6 items-center justify-center">
                  <Circle className="h-3 w-3 text-gray-300" />
                </div>
              )}
              <span
                className={`text-sm ${
                  step.status === 'done'
                    ? 'text-gray-700'
                    : step.status === 'active'
                      ? 'font-medium text-gray-900'
                      : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
