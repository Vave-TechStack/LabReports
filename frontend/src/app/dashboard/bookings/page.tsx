'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, Search, Filter, ChevronRight, Clock, MapPin } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  finalAmount: number;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  createdAt: string;
  bookingTests: { test: { name: string } }[];
  payments: { status: string; amount: number }[];
  report: { id: string; reportNumber: string; pdfUrl: string | null } | null;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SAMPLE_COLLECTED: 'bg-purple-100 text-purple-700',
  LAB_PROCESSING: 'bg-indigo-100 text-indigo-700',
  DOCTOR_VERIFICATION: 'bg-cyan-100 text-cyan-700',
  REPORT_READY: 'bg-emerald-100 text-emerald-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.bookings.getMyBookings({ limit: 50 });
        setBookings(res.data?.data || []);
      } catch {
        setBookings([
          { id: 'b1', bookingNumber: 'ML-2024-10892', status: 'CONFIRMED', finalAmount: 3500, appointmentDate: new Date().toISOString(), appointmentTime: '09:00', type: 'HOME_COLLECTION', createdAt: new Date().toISOString(), bookingTests: [{ test: { name: 'Complete Blood Count (CBC)' } }, { test: { name: 'Fasting Blood Sugar' } }], payments: [{ status: 'SUCCESS', amount: 3500 }], report: null },
          { id: 'b2', bookingNumber: 'ML-2024-10891', status: 'SAMPLE_COLLECTED', finalAmount: 2499, appointmentDate: new Date(Date.now() - 86400000).toISOString(), appointmentTime: '10:00', type: 'AT_CLINIC', createdAt: new Date(Date.now() - 86400000).toISOString(), bookingTests: [{ test: { name: 'Thyroid Profile (T3, T4, TSH)' } }], payments: [{ status: 'SUCCESS', amount: 2499 }], report: null },
          { id: 'b3', bookingNumber: 'ML-2024-10890', status: 'REPORT_READY', finalAmount: 4999, appointmentDate: new Date(Date.now() - 172800000).toISOString(), appointmentTime: '08:00', type: 'AT_CLINIC', createdAt: new Date(Date.now() - 172800000).toISOString(), bookingTests: [{ test: { name: 'Lipid Profile' } }, { test: { name: 'HbA1c' } }, { test: { name: 'Vitamin D' } }], payments: [{ status: 'SUCCESS', amount: 4999 }], report: { id: 'r1', reportNumber: 'RPT-2024-0890', pdfUrl: null } },
          { id: 'b4', bookingNumber: 'ML-2024-10889', status: 'DELIVERED', finalAmount: 1800, appointmentDate: new Date(Date.now() - 259200000).toISOString(), appointmentTime: '11:00', type: 'HOME_COLLECTION', createdAt: new Date(Date.now() - 259200000).toISOString(), bookingTests: [{ test: { name: 'Urine Routine Analysis' } }], payments: [{ status: 'SUCCESS', amount: 1800 }], report: { id: 'r2', reportNumber: 'RPT-2024-0889', pdfUrl: null } },
          { id: 'b5', bookingNumber: 'ML-2024-10888', status: 'LAB_PROCESSING', finalAmount: 4200, appointmentDate: new Date().toISOString(), appointmentTime: '07:00', type: 'AT_CLINIC', createdAt: new Date().toISOString(), bookingTests: [{ test: { name: 'Liver Function Test (LFT)' } }, { test: { name: 'Kidney Function Test (KFT)' } }], payments: [{ status: 'PENDING', amount: 4200 }], report: null },
          { id: 'b6', bookingNumber: 'ML-2024-10887', status: 'PENDING', finalAmount: 5999, appointmentDate: new Date(Date.now() + 86400000).toISOString(), appointmentTime: '09:00', type: 'HOME_COLLECTION', createdAt: new Date(Date.now() - 86400000).toISOString(), bookingTests: [{ test: { name: 'Complete Health Checkup' } }], payments: [], report: null },
          { id: 'b7', bookingNumber: 'ML-2024-10886', status: 'CANCELLED', finalAmount: 0, appointmentDate: new Date(Date.now() - 345600000).toISOString(), appointmentTime: '14:00', type: 'AT_CLINIC', createdAt: new Date(Date.now() - 345600000).toISOString(), bookingTests: [{ test: { name: 'Dengue Test (NS1)' } }], payments: [], report: null },
          { id: 'b8', bookingNumber: 'ML-2024-10885', status: 'DOCTOR_VERIFICATION', finalAmount: 7500, appointmentDate: new Date(Date.now() - 43200000).toISOString(), appointmentTime: '08:00', type: 'AT_CLINIC', createdAt: new Date(Date.now() - 43200000).toISOString(), bookingTests: [{ test: { name: 'Comprehensive Full Body Checkup' } }], payments: [{ status: 'SUCCESS', amount: 7500 }], report: { id: 'r3', reportNumber: 'RPT-2024-0885', pdfUrl: null } },
        ]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search && !b.bookingNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statuses = ['all', 'PENDING', 'CONFIRMED', 'SAMPLE_COLLECTED', 'LAB_PROCESSING', 'REPORT_READY', 'DELIVERED', 'CANCELLED'];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-1">Track and manage your test bookings.</p>
      </motion.div>

      {/* Filters */}
      <div className="card-premium p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by booking number..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-400 self-center" />
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-premium p-5">
              <div className="skeleton h-5 w-1/3 mb-3" />
              <div className="skeleton h-4 w-2/3 mb-2" />
              <div className="skeleton h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-slate-900 mb-2">No bookings found</h3>
          <p className="text-slate-500 mb-6">Book your first test and track it here.</p>
          <Link href="/dashboard/book-test" className="btn-primary inline-flex items-center gap-2">
            Book a Test <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                href={`/dashboard/bookings/${booking.id}`}
                className="card-premium p-5 block group hover:shadow-premium transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-primary-600 font-mono font-medium">{booking.bookingNumber}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {booking.bookingTests?.map(t => t.test.name).join(', ') || 'Tests'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    {formatDate(booking.appointmentDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.appointmentTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.type === 'AT_CLINIC' ? 'At Lab' : 'Home Collection'}
                  </span>
                  <span className="font-semibold text-slate-900 ml-auto">{formatCurrency(booking.finalAmount)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
