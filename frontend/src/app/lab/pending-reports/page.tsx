'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Clock, User, CheckCircle, Loader2, Search, ChevronRight, Stethoscope, FlaskConical } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = {
  SAMPLE_COLLECTED: 'bg-blue-100 text-blue-700',
  LAB_PROCESSING: 'bg-indigo-100 text-indigo-700',
  DOCTOR_VERIFICATION: 'bg-cyan-100 text-cyan-700',
  REPORT_READY: 'bg-emerald-100 text-emerald-700',
};

export default function PendingReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, docRes] = await Promise.all([
          apiService.lab.getPendingReports({ limit: 50 }),
          apiService.lab.getDoctors(),
        ]);
        setReports(repRes.data?.data || []);
        setDoctors(docRes.data?.data || []);
      } catch {
        setReports([
          { id: 'b1', bookingNumber: 'ML-2024-10892', status: 'LAB_PROCESSING', patient: { firstName: 'Ravi', lastName: 'Kumar' }, bookingTests: [{ test: { name: 'Complete Blood Count (CBC)' } }, { test: { name: 'Fasting Blood Sugar' } }], sampleEntry: { barcode: 'BL20241105001' } },
          { id: 'b2', bookingNumber: 'ML-2024-10891', status: 'SAMPLE_COLLECTED', patient: { firstName: 'Priya', lastName: 'Sharma' }, bookingTests: [{ test: { name: 'Thyroid Profile (T3, T4, TSH)' } }], sampleEntry: { barcode: 'BL20241105002' } },
          { id: 'b3', bookingNumber: 'ML-2024-10890', status: 'DOCTOR_VERIFICATION', patient: { firstName: 'Amit', lastName: 'Patel' }, bookingTests: [{ test: { name: 'Lipid Profile' } }, { test: { name: 'HbA1c' } }], sampleEntry: { barcode: 'BL20241105003' } },
          { id: 'b4', bookingNumber: 'ML-2024-10889', status: 'SAMPLE_COLLECTED', patient: { firstName: 'Sunita', lastName: 'Reddy' }, bookingTests: [{ test: { name: 'Urine Routine Analysis' } }], sampleEntry: { barcode: 'BL20241105004' } },
          { id: 'b5', bookingNumber: 'ML-2024-10888', status: 'LAB_PROCESSING', patient: { firstName: 'Vikram', lastName: 'Singh' }, bookingTests: [{ test: { name: 'Liver Function Test (LFT)' } }, { test: { name: 'Kidney Function Test (KFT)' } }], sampleEntry: { barcode: 'BL20241105005' } },
          { id: 'b6', bookingNumber: 'ML-2024-10887', status: 'SAMPLE_COLLECTED', patient: { firstName: 'Ananya', lastName: 'Patel' }, bookingTests: [{ test: { name: 'Vitamin D' } }, { test: { name: 'Vitamin B12' } }], sampleEntry: null },
          { id: 'b7', bookingNumber: 'ML-2024-10886', status: 'DOCTOR_VERIFICATION', patient: { firstName: 'Suresh', lastName: 'Reddy' }, bookingTests: [{ test: { name: 'Comprehensive Full Body Checkup' } }], sampleEntry: { barcode: 'BL20241105006' } },
          { id: 'b8', bookingNumber: 'ML-2024-10885', status: 'LAB_PROCESSING', patient: { firstName: 'Lakshmi', lastName: 'Devi' }, bookingTests: [{ test: { name: 'Dengue Test (NS1)' } }], sampleEntry: { barcode: 'BL20241105007' } },
        ]);
        setDoctors([
          { id: 'd1', firstName: 'Venkatesh', lastName: 'Murthy', specialization: 'Pathology' },
          { id: 'd2', firstName: 'Sunita', lastName: 'Reddy', specialization: 'Microbiology' },
          { id: 'd3', firstName: 'Arjun', lastName: 'Mehta', specialization: 'Hematology' },
          { id: 'd4', firstName: 'Priya', lastName: 'Sharma', specialization: 'Biochemistry' },
        ]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = reports.filter((b: any) =>
    b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
    `${b.patient?.firstName} ${b.patient?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await apiService.lab.updateStatus(id, status);
      // Refresh
      const res = await apiService.lab.getPendingReports({ limit: 50 });
      setReports(res.data?.data || []);
    } catch { /* */ }
    setUpdating(null);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Pending Reports</h1>
        <p className="text-slate-500 mt-1">Manage samples awaiting processing, report entry, and verification.</p>
      </motion.div>

      <div className="card-premium p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by booking or patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card-premium p-5"><div className="skeleton h-16 w-full rounded-xl" /></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-slate-500">No pending reports</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking: any, i: number) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-premium p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${statusColors[booking.status] || 'bg-gray-100'}`}>
                      {booking.status?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{booking.bookingNumber}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {booking.patient?.firstName} {booking.patient?.lastName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FlaskConical className="w-3 h-3" /> {booking.bookingTests?.length} tests</span>
                    {booking.sampleEntry?.barcode && (
                      <span className="font-mono text-cyan-700">{booking.sampleEntry.barcode}</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {booking.bookingTests?.map((bt: any) => bt.test?.name).join(', ')}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Status Update Dropdown */}
                  <select
                    value=""
                    onChange={(e) => { if (e.target.value) handleStatusUpdate(booking.id, e.target.value); }}
                    disabled={updating === booking.id}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-cyan-500"
                  >
                    <option value="">Update Status</option>
                    <option value="SAMPLE_COLLECTED">Sample Collected</option>
                    <option value="LAB_PROCESSING">Lab Processing</option>
                    <option value="DOCTOR_VERIFICATION">Doctor Verification</option>
                  </select>

                  <button
                    onClick={() => router.push(`/lab/enter-results?booking=${booking.id}`)}
                    className="text-xs px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg font-medium hover:bg-cyan-100 transition-all flex items-center gap-1"
                  >
                    Enter Results <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
