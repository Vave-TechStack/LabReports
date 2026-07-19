'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, CalendarCheck, Eye } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getBookings({ page, limit: 15, search, status: statusFilter || undefined });
      setBookings(res.data?.data || []);
      setTotalPages(res.data?.meta?.totalPages || 1);
    } catch {
      // Fallback demo data
      const demoBookings = [
        { id: 'b1', bookingNumber: 'ML-2024-10892', patient: { firstName: 'Ravi', lastName: 'Kumar', phone: '+919876543210' }, appointmentDate: new Date(), status: 'CONFIRMED', finalAmount: 3500 },
        { id: 'b2', bookingNumber: 'ML-2024-10891', patient: { firstName: 'Priya', lastName: 'Sharma', phone: '+919876543211' }, appointmentDate: new Date(), status: 'SAMPLE_COLLECTED', finalAmount: 2499 },
        { id: 'b3', bookingNumber: 'ML-2024-10890', patient: { firstName: 'Amit', lastName: 'Patel', phone: '+919876543212' }, appointmentDate: new Date(Date.now() - 86400000), status: 'REPORT_READY', finalAmount: 4999 },
        { id: 'b4', bookingNumber: 'ML-2024-10889', patient: { firstName: 'Sunita', lastName: 'Reddy', phone: '+919876543213' }, appointmentDate: new Date(Date.now() - 86400000), status: 'PENDING', finalAmount: 1800 },
        { id: 'b5', bookingNumber: 'ML-2024-10888', patient: { firstName: 'Vikram', lastName: 'Singh', phone: '+919876543214' }, appointmentDate: new Date(), status: 'LAB_PROCESSING', finalAmount: 4200 },
        { id: 'b6', bookingNumber: 'ML-2024-10887', patient: { firstName: 'Ananya', lastName: 'Patel', phone: '+919876543215' }, appointmentDate: new Date(Date.now() - 172800000), status: 'DELIVERED', finalAmount: 5999 },
        { id: 'b7', bookingNumber: 'ML-2024-10886', patient: { firstName: 'Suresh', lastName: 'Reddy', phone: '+919876543216' }, appointmentDate: new Date(), status: 'DOCTOR_VERIFICATION', finalAmount: 7500 },
        { id: 'b8', bookingNumber: 'ML-2024-10885', patient: { firstName: 'Lakshmi', lastName: 'Devi', phone: '+919876543217' }, appointmentDate: new Date(Date.now() - 259200000), status: 'CANCELLED', finalAmount: 0 },
        { id: 'b9', bookingNumber: 'ML-2024-10884', patient: { firstName: 'Manoj', lastName: 'Gupta', phone: '+919876543218' }, appointmentDate: new Date(), status: 'CONFIRMED', finalAmount: 1299 },
        { id: 'b10', bookingNumber: 'ML-2024-10883', patient: { firstName: 'Divya', lastName: 'Nair', phone: '+919876543219' }, appointmentDate: new Date(Date.now() - 86400000), status: 'REPORT_READY', finalAmount: 8999 },
      ];
      setBookings(demoBookings);
      setTotalPages(3);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await apiService.bookings.updateStatus(id, status);
      fetchBookings();
    } catch { /* */ }
    setUpdating(null);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Booking Management</h1>
        <p className="text-slate-500 mt-1">View, filter, and manage all patient bookings.</p>
      </motion.div>

      {/* Filters */}
      <div className="card-premium p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by booking ID or patient..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </form>
          <div className="flex gap-2">
            {['', 'PENDING', 'CONFIRMED', 'LAB_PROCESSING', 'REPORT_READY', 'DELIVERED', 'CANCELLED'].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-purple-600 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Booking ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Patient</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="p-4"><div className="skeleton h-10 w-full rounded-lg" /></td></tr>
                ))
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-500">No bookings found</td></tr>
              ) : (
                bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-primary-600">{booking.bookingNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{booking.patient?.firstName} {booking.patient?.lastName}</p>
                      <p className="text-xs text-slate-500">{booking.patient?.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{formatDate(booking.appointmentDate)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${statusColors[booking.status] || 'bg-gray-100'}`}>{booking.status?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{formatCurrency(booking.finalAmount)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value=""
                          onChange={(e) => { if (e.target.value) handleStatusUpdate(booking.id, e.target.value); }}
                          disabled={updating === booking.id}
                          className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-500"
                        >
                          <option value="">Update Status</option>
                          <option value="CONFIRMED">Confirm</option>
                          <option value="SAMPLE_COLLECTED">Sample Collected</option>
                          <option value="LAB_PROCESSING">Lab Processing</option>
                          <option value="DOCTOR_VERIFICATION">Doctor Verification</option>
                          <option value="REPORT_READY">Report Ready</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancel</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
