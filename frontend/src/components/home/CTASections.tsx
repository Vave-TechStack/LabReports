'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Smartphone, ArrowRight, FileText, QrCode, CheckCircle } from 'lucide-react';

export function DownloadReportsCTA() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-3">
                Download Your Reports Online
              </h3>
              <p className="text-slate-600 mb-6">
                Access your lab reports anytime, anywhere. Login to your secure patient portal to view, download, and share your reports with your doctor.
              </p>
              <ul className="space-y-3 mb-8">
                {['Instant PDF download', 'Share with doctors', 'Track medical history', 'Print at home'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/reports" className="btn-primary inline-flex items-center gap-2 w-fit">
                <FileText className="w-4 h-4" />
                Download Reports
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:flex bg-gradient-to-br from-primary-50 to-blue-50 items-center justify-center p-12">
              <div className="w-48 h-48 gradient-primary rounded-3xl flex items-center justify-center shadow-premium">
                <Download className="w-20 h-20 text-white/80" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function MobileAppCTA() {
  return (
    <section className="section-padding gradient-primary overflow-hidden">
      <div className="container-premium relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Smartphone className="w-12 h-12 text-emerald-300 mb-6" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Download Our Mobile App
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Book tests, track samples, view reports, and manage your health on the go.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Instant booking', 'Real-time tracking', 'Push notifications', 'Secure reports', 'Family management', 'Health history'].map((f) => (
                <span key={f} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-sm text-white/90">{f}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
                <Smartphone className="w-6 h-6" />
                <div>
                  <p className="text-xs text-gray-400">Download on</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </Link>
              <Link href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
                <Smartphone className="w-6 h-6" />
                <div>
                  <p className="text-xs text-gray-400">Download on</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="w-64 h-96 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 font-medium">MediLab App</p>
                <p className="text-white/50 text-sm">Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function HomeCollectionCTA() {
  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            <div className="hidden lg:flex bg-gradient-to-br from-emerald-50 to-teal-50 items-center justify-center p-12">
              <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center shadow-premium">
                <QrCode className="w-20 h-20 text-primary-600" />
              </div>
            </div>
            <div className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-3">
                Free Home Sample Collection
              </h3>
              <p className="text-slate-600 mb-6">
                Stay home, we&apos;ll come to you. Our trained phlebotomists will collect your samples from the comfort of your home. Free within 5 km radius.
              </p>
              <ul className="space-y-3 mb-8">
                {['Trained & certified phlebotomists', 'Free collection within city limits', 'Flexible time slots', 'Same-day collection available', 'Contactless payment', 'Reports delivered online'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/book-home-collection" className="btn-primary inline-flex items-center gap-2 w-fit">
                Book Home Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
