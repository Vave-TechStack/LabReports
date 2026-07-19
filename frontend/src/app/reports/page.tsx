'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, FileText, Download, Phone, Mail, Calendar, Shield, ArrowRight, ChevronDown, Eye, Printer, CheckCircle, Loader2, FileDown, Clock, User, FlaskConical, Barcode } from 'lucide-react';

const sampleReports = [
  { id: 'RPT-2024-10892', patient: 'Ravi Kumar', date: '2024-12-15', test: 'Complete Blood Count (CBC)', status: 'Ready', lab: 'MediLab - Main Lab', type: 'Blood' },
  { id: 'RPT-2024-10891', patient: 'Priya Sharma', date: '2024-12-14', test: 'Thyroid Profile', status: 'Ready', lab: 'MediLab - Koramangala', type: 'Blood' },
  { id: 'RPT-2024-10890', patient: 'Amit Patel', date: '2024-12-14', test: 'Lipid Profile + HbA1c', status: 'Ready', lab: 'MediLab - HSR Layout', type: 'Blood' },
  { id: 'RPT-2024-10889', patient: 'Sunita Reddy', date: '2024-12-13', test: 'Urine Routine Analysis', status: 'Ready', lab: 'MediLab - Main Lab', type: 'Urine' },
  { id: 'RPT-2024-10888', patient: 'Vikram Singh', date: '2024-12-13', test: 'Liver Function Test', status: 'Ready', lab: 'MediLab - Main Lab', type: 'Blood' },
  { id: 'RPT-2024-10887', patient: 'Ananya Patel', date: '2024-12-12', test: 'Vitamin D + B12', status: 'Ready', lab: 'MediLab - Indiranagar', type: 'Blood' },
  { id: 'RPT-2024-10886', patient: 'Suresh Reddy', date: '2024-12-12', test: 'Comprehensive Full Body Checkup', status: 'Ready', lab: 'MediLab - Main Lab', type: 'Multiple' },
  { id: 'RPT-2024-10885', patient: 'Lakshmi Devi', date: '2024-12-11', test: 'Dengue NS1', status: 'Ready', lab: 'MediLab - Marathahalli', type: 'Blood' },
  { id: 'RPT-2024-10884', patient: 'Manoj Gupta', date: '2024-12-11', test: 'Diabetes Care Package', status: 'Ready', lab: 'MediLab - Main Lab', type: 'Blood' },
  { id: 'RPT-2024-10883', patient: 'Divya Nair', date: '2024-12-10', test: 'Women Wellness Package', status: 'Ready', lab: 'MediLab - Koramangala', type: 'Multiple' },
];

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filtered = sampleReports.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.test.toLowerCase().includes(search.toLowerCase())
  );

  const handleGetReports = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 right-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <FileText className="w-4 h-4" /> Download Reports
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Access Your Lab Reports
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Download your test reports instantly. Enter your registered mobile number or email to get started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Get Reports Form */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-xl mx-auto">
            {submitted ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-heading font-semibold text-slate-900 mb-2">Reports Found! 🎉</h2>
                <p className="text-slate-500 mb-6">We found 10 reports linked to your account. Download them below.</p>
                
                <div className="space-y-3 mb-6">
                  {sampleReports.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-slate-900">{r.test}</p>
                          <p className="text-xs text-slate-500">{r.id} • {r.date}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-all">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-slate-400">+5 more reports available</p>
                </div>

                <button onClick={() => setSubmitted(false)} className="btn-outline text-sm">Search Again</button>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleGetReports} className="card-premium p-6 space-y-4">
                <h2 className="text-lg font-heading font-semibold text-slate-900 mb-2">Get Your Reports</h2>
                <p className="text-sm text-slate-500 mb-4">Enter your registered mobile number or email to receive your reports.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Or Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  <Search className="w-4 h-4" /> Find My Reports
                </button>
                <p className="text-xs text-slate-400 text-center">By continuing, you agree to receive reports via WhatsApp & email</p>
              </motion.form>
            )}
          </div>
        </div>
      </section>

      {/* Sample Reports Table */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Recent Reports</h2>
            <p className="text-slate-500">Browse recently generated reports from our labs.</p>
          </motion.div>

          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, report ID, or test..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>

          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Report ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Patient</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Test</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Lab</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-primary-700">{r.id}</td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">{r.patient}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{r.test}</td>
                      <td className="py-3 px-4 text-sm text-slate-500">{r.date}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{r.lab}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-100 transition-all">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-500 mt-4">No reports found matching your search.</p>
          )}
        </div>
      </section>

      {/* How to Access */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Ways to Access Your Reports</h2>
            <p className="text-slate-500">We make it easy to access your health reports anytime, anywhere.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mail, title: 'Email', desc: 'Reports sent directly to your registered email address.' },
              { icon: Phone, title: 'WhatsApp', desc: 'Instant delivery via WhatsApp with a secure download link.' },
              { icon: FileText, title: 'Patient Portal', desc: 'Access all your reports online through our secure portal.' },
              { icon: Printer, title: 'Print at Lab', desc: 'Get a printed copy at any of our collection centers.' },
            ].map((item, i) => (
              <motion.div
                key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-premium p-6 text-center"
              >
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
