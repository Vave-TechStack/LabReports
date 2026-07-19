'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Search, FlaskConical, FileQuestion, CalendarCheck, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-slate-900">
              Medi<span className="text-primary-600">Lab</span>
            </span>
          </Link>

          <div className="card-premium p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6"
            >
              <FileQuestion className="w-12 h-12 text-primary-600" />
            </motion.div>

            <h1 className="text-6xl font-heading font-bold text-slate-900 mb-2">404</h1>
            <p className="text-lg text-slate-500 mb-2">Page Not Found</p>
            <p className="text-sm text-slate-400 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="space-y-3 mb-8">
              <Link href="/" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                <Home className="w-4 h-4" /> Go to Homepage
              </Link>
              <Link href="/tests" className="btn-outline w-full flex items-center justify-center gap-2 py-3">
                <Search className="w-4 h-4" /> Browse Tests
              </Link>
              <Link href="/book-appointment" className="btn-outline w-full flex items-center justify-center gap-2 py-3">
                <CalendarCheck className="w-4 h-4" /> Book an Appointment
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs text-slate-400 mb-3">Need help? Contact us:</p>
              <a href="tel:+918088000100" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                <Phone className="w-4 h-4" /> +91 80880 00100
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
