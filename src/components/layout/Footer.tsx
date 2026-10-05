import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary-600" />
              <span className="text-base font-semibold text-gray-900">
                SatyaCheck
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              AI-powered fact checking for forwarded messages. Verify before you
              share.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/analyze"
                  className="text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                  Analyze Content
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                  History
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-400">API (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-gray-500">How It Works</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Methodology</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">FAQ</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-gray-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Contact</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} SatyaCheck. Built to fight misinformation.
          </p>
        </div>
      </div>
    </footer>
  );
}
