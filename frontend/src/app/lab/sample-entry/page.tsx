'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Barcode, FlaskConical, Loader2, CheckCircle, Clock, MapPin } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';

export default function SampleEntryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [sampleType, setSampleType] = useState('BLOOD');
  const [collectionPlace, setCollectionPlace] = useState('Lab');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.lab.getPendingBookings({ limit: 50 });
        setBookings(res.data?.data || []);
      } catch {
        setBookings([
          { id: 'b1', bookingNumber: 'ML-2024-10892', appointmentDate: new Date().toISOString(), patient: { firstName: 'Ravi', lastName: 'Kumar', phone: '+919876543210' }, bookingTests: [{ test: { name: 'Complete Blood Count (CBC)' } }, { test: { name: 'Fasting Blood Sugar' } }] },
          { id: 'b2', bookingNumber: 'ML-2024-10891', appointmentDate: new Date(Date.now() - 86400000).toISOString(), patient: { firstName: 'Priya', lastName: 'Sharma', phone: '+919876543211' }, bookingTests: [{ test: { name: 'Thyroid Profile (T3, T4, TSH)' } }] },
          { id: 'b3', bookingNumber: 'ML-2024-10890', appointmentDate: new Date(Date.now() - 86400000).toISOString(), patient: { firstName: 'Amit', lastName: 'Patel', phone: '+919876543212' }, bookingTests: [{ test: { name: 'Lipid Profile' } }, { test: { name: 'HbA1c' } }] },
          { id: 'b4', bookingNumber: 'ML-2024-10889', appointmentDate: new Date().toISOString(), patient: { firstName: 'Sunita', lastName: 'Reddy', phone: '+919876543213' }, bookingTests: [{ test: { name: 'Urine Routine Analysis' } }] },
          { id: 'b5', bookingNumber: 'ML-2024-10888', appointmentDate: new Date().toISOString(), patient: { firstName: 'Vikram', lastName: 'Singh', phone: '+919876543214' }, bookingTests: [{ test: { name: 'Liver Function Test (LFT)' } }, { test: { name: 'Kidney Function Test (KFT)' } }] },
          { id: 'b6', bookingNumber: 'ML-2024-10887', appointmentDate: new Date(Date.now() + 86400000).toISOString(), patient: { firstName: 'Ananya', lastName: 'Patel', phone: '+919876543215' }, bookingTests: [{ test: { name: 'Vitamin D' } }, { test: { name: 'Vitamin B12' } }] },
          { id: 'b7', bookingNumber: 'ML-2024-10886', appointmentDate: new Date(Date.now() - 172800000).toISOString(), patient: { firstName: 'Suresh', lastName: 'Reddy', phone: '+919876543216' }, bookingTests: [{ test: { name: 'Comprehensive Full Body Checkup' } }] },
          { id: 'b8', bookingNumber: 'ML-2024-10885', appointmentDate: new Date().toISOString(), patient: { firstName: 'Lakshmi', lastName: 'Devi', phone: '+919876543217' }, bookingTests: [{ test: { name: 'Dengue Test (NS1)' } }] },
        ]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b: any) =>
    b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
    `${b.patient?.firstName} ${b.patient?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);
    try {
      const res = await apiService.lab.createSampleEntry({
        bookingId: selectedBooking.id,
        sampleType,
        collectionPlace,
        notes,
      });
      setResult(res.data?.data);
    } catch { /* */ }
    setSubmitting(false);
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">Sample Registered!</h2>
          <p className="text-slate-500 mb-6">Sample has been registered successfully.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Barcode:</span><span className="font-mono font-bold text-cyan-700 text-lg">{result.barcode}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Patient:</span><span className="font-medium">{result.booking?.patient?.firstName} {result.booking?.patient?.lastName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Sample:</span><span>{result.sampleType}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setResult(null); setSelectedBooking(null); setSearch(''); }} className="btn-outline flex-1">New Entry</button>
            <button onClick={() => router.push('/lab/enter-results')} className="btn-primary flex-1">Enter Results</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Sample Entry</h1>
        <p className="text-slate-500 mt-1">Register a sample collection with barcode generation.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Booking Selection */}
        <div className="card-premium p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-4">Select Booking</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by booking ID or patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 text-sm" />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-xl" />)
            ) : filtered.map((b: any) => (
              <button key={b.id} onClick={() => setSelectedBooking(b)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  selectedBooking?.id === b.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-100 hover:border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-cyan-700">{b.bookingNumber}</span>
                  <span className="text-xs text-slate-500">{formatDate(b.appointmentDate)}</span>
                </div>
                <p className="text-sm font-medium text-slate-900">{b.patient?.firstName} {b.patient?.lastName}</p>
                <p className="text-xs text-slate-500 truncate">
                  {b.bookingTests?.map((bt: any) => bt.test?.name).join(', ')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Sample Details Form */}
        <div className="card-premium p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-4">Sample Details</h3>
          {selectedBooking ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 text-sm">
                <p className="font-medium text-slate-900">{selectedBooking.patient?.firstName} {selectedBooking.patient?.lastName}</p>
                <p className="text-xs text-slate-500">{selectedBooking.patient?.phone}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Sample Type</label>
                <select value={sampleType} onChange={(e) => setSampleType(e.target.value)} className="input-field text-sm">
                  {['BLOOD', 'URINE', 'STOOL', 'SPUTUM', 'SWAB', 'TISSUE', 'OTHER'].map(t => (
                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Collection Place</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={collectionPlace} onChange={(e) => setCollectionPlace(e.target.value)} placeholder="e.g., Room 101, Collection Center" className="input-field pl-10 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Any special notes about this sample..." className="input-field text-sm resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Barcode className="w-4 h-4" />}
                {submitting ? 'Generating...' : 'Generate Barcode & Register'}
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-slate-500">Select a confirmed booking to register sample collection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
