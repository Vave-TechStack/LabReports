'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Printer, Barcode, FlaskConical, Loader2, User, Calendar } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function PrintLabelsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [labelData, setLabelData] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.lab.getPendingBookings({ limit: 100 });
        setBookings(res.data?.data || []);
      } catch {
        setBookings([
          { id: 'b1', bookingNumber: 'ML-2024-10892', appointmentDate: new Date().toISOString(), patient: { firstName: 'Ravi', lastName: 'Kumar' }, bookingTests: [{ test: { name: 'CBC', code: 'CBC' } }, { test: { name: 'FBS', code: 'FBS' } }] },
          { id: 'b2', bookingNumber: 'ML-2024-10891', appointmentDate: new Date().toISOString(), patient: { firstName: 'Priya', lastName: 'Sharma' }, bookingTests: [{ test: { name: 'Thyroid Profile', code: 'THYROID' } }] },
          { id: 'b3', bookingNumber: 'ML-2024-10890', appointmentDate: new Date().toISOString(), patient: { firstName: 'Amit', lastName: 'Patel' }, bookingTests: [{ test: { name: 'Lipid Profile', code: 'LIPID' } }, { test: { name: 'HbA1c', code: 'HBA1C' } }] },
          { id: 'b4', bookingNumber: 'ML-2024-10889', appointmentDate: new Date().toISOString(), patient: { firstName: 'Sunita', lastName: 'Reddy' }, bookingTests: [{ test: { name: 'Urine Analysis', code: 'URINE' } }] },
          { id: 'b5', bookingNumber: 'ML-2024-10888', appointmentDate: new Date().toISOString(), patient: { firstName: 'Vikram', lastName: 'Singh' }, bookingTests: [{ test: { name: 'LFT', code: 'LFT' } }, { test: { name: 'KFT', code: 'KFT' } }] },
          { id: 'b6', bookingNumber: 'ML-2024-10887', appointmentDate: new Date().toISOString(), patient: { firstName: 'Ananya', lastName: 'Patel' }, bookingTests: [{ test: { name: 'Vitamin D', code: 'VITD' } }, { test: { name: 'Vitamin B12', code: 'VITB12' } }] },
          { id: 'b7', bookingNumber: 'ML-2024-10886', appointmentDate: new Date().toISOString(), patient: { firstName: 'Suresh', lastName: 'Reddy' }, bookingTests: [{ test: { name: 'Full Body Checkup', code: 'FULL' } }] },
          { id: 'b8', bookingNumber: 'ML-2024-10885', appointmentDate: new Date().toISOString(), patient: { firstName: 'Lakshmi', lastName: 'Devi' }, bookingTests: [{ test: { name: 'Dengue NS1', code: 'DENGUE' } }] },
        ]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = bookings.filter((b: any) =>
    b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
    `${b.patient?.firstName} ${b.patient?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handlePrint = async () => {
    if (selectedIds.size === 0) return;
    try {
      const firstId = Array.from(selectedIds)[0];
      const res = await apiService.lab.getPrintLabels(firstId);
      setLabelData(res.data?.data);
      // Trigger browser print
      setTimeout(() => window.print(), 300);
    } catch { /* */ }
  };

  const labelContent = labelData && (
    <div className="p-8 space-y-4 print-content">
      {Array.from(selectedIds).map((id) => (
        <div key={id} className="border-2 border-gray-800 p-4 rounded-lg inline-block mr-4 mb-4 w-64">
          <div className="text-center mb-3">
            <p className="font-bold text-sm">MediLab Diagnostics</p>
            <p className="text-[10px] text-gray-500">Sample Collection Label</p>
          </div>
          <div className="text-center mb-3">
            <p className="text-xs font-mono font-bold text-lg tracking-wider">
              {labelData?.sampleEntry?.barcode || `BL${Date.now()}`}
            </p>
          </div>
          <div className="border-t border-gray-300 pt-2 text-xs space-y-1">
            <p><span className="font-semibold">Patient:</span> {labelData?.patient?.firstName} {labelData?.patient?.lastName}</p>
            <p><span className="font-semibold">Gender:</span> {labelData?.patient?.gender || 'N/A'}</p>
            <p><span className="font-semibold">Sample:</span> {labelData?.sampleEntry?.sampleType || 'BLOOD'}</p>
            <p><span className="font-semibold">Date:</span> {formatDate(new Date().toISOString())}</p>
            <div className="border-t border-gray-200 mt-1 pt-1">
              {labelData?.bookingTests?.map((bt: any, i: number) => (
                <p key={i} className="text-[10px]">{bt.test?.name} ({bt.test?.code})</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Print Labels</h1>
          <p className="text-slate-500 mt-1">Generate and print sample collection labels.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{selectedIds.size} selected</span>
          <button onClick={handlePrint} disabled={selectedIds.size === 0} className="btn-primary flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print Labels ({selectedIds.size})
          </button>
        </div>
      </motion.div>

      <div className="card-premium p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="card-premium p-4"><div className="skeleton h-14 w-full rounded-xl" /></div>)
        ) : filtered.map((b: any) => (
          <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`card-premium p-4 cursor-pointer transition-all ${selectedIds.has(b.id) ? 'ring-2 ring-cyan-500 bg-cyan-50/30' : 'hover:bg-gray-50'}`}
            onClick={() => toggleSelect(b.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selectedIds.has(b.id) ? 'bg-cyan-600 border-cyan-600' : 'border-gray-300'}`}>
                {selectedIds.has(b.id) && <span className="text-white text-[10px]">✓</span>}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedIds.has(b.id) ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-400'}`}>
                <Barcode className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{b.patient?.firstName} {b.patient?.lastName}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{b.bookingNumber}</span>
                  <span>{b.bookingTests?.length} tests</span>
                  <span>{formatDate(b.appointmentDate)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hidden print content */}
      <div style={{ display: 'none' }}>{labelContent}</div>
    </div>
  );
}
