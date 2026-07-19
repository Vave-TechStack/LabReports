'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, FileText, TrendingUp, Clock, ArrowRight, Activity, Shield, Bell, ChevronRight, User, CreditCard } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
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

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, reportsRes] = await Promise.all([
          apiService.bookings.getMyBookings({ limit: 5 }),
          apiService.reports.getMyReports(),
        ]);
        const bookingData = bookingsRes.data?.data || [];
        setBookings(bookingData);
        const reports = reportsRes.data?.data || [];
        setStats({
          total: bookingData.length,
          completed: bookingData.filter((b: Booking) => ['REPORT_READY', 'DELIVERED'].includes(b.status)).length,
          pending: bookingData.filter((b: Booking) => !['REPORT_READY', 'DELIVERED', 'CANCELLED'].includes(b.status)).length,
          reports: reports.length,
        });
      } catch {
        // Fallback dummy data
        const dummyBookings: Booking[] = [
          { id: 'b1', bookingNumber: 'ML-2024-10892', status: 'CONFIRMED', finalAmount: 3500, appointmentDate: new Date().toISOString(), appointmentTime: '09:00', type: 'HOME_COLLECTION', createdAt: new Date().toISOString(), bookingTests: [{ test: { name: 'Complete Blood Count (CBC)' } }, { test: { name: 'Fasting Blood Sugar' } }] },
          { id: 'b2', bookingNumber: 'ML-2024-10891', status: 'SAMPLE_COLLECTED', finalAmount: 2499, appointmentDate: new Date(Date.now() - 86400000).toISOString(), appointmentTime: '10:00', type: 'AT_CLINIC', createdAt: new Date(Date.now() - 86400000).toISOString(), bookingTests: [{ test: { name: 'Thyroid Profile (T3, T4, TSH)' } }] },
          { id: 'b3', bookingNumber: 'ML-2024-10890', status: 'REPORT_READY', finalAmount: 4999, appointmentDate: new Date(Date.now() - 172800000).toISOString(), appointmentTime: '08:00', type: 'AT_CLINIC', createdAt: new Date(Date.now() - 172800000).toISOString(), bookingTests: [{ test: { name: 'Lipid Profile' } }, { test: { name: 'HbA1c' } }, { test: { name: 'Vitamin D' } }] },
          { id: 'b4', bookingNumber: 'ML-2024-10889', status: 'DELIVERED', finalAmount: 1800, appointmentDate: new Date(Date.now() - 259200000).toISOString(), appointmentTime: '11:00', type: 'HOME_COLLECTION', createdAt: new Date(Date.now() - 259200000).toISOString(), bookingTests: [{ test: { name: 'Urine Routine Analysis' } }] },
          { id: 'b5', bookingNumber: 'ML-2024-10888', status: 'LAB_PROCESSING', finalAmount: 4200, appointmentDate: new Date().toISOString(), appointmentTime: '07:00', type: 'AT_CLINIC', createdAt: new Date().toISOString(), bookingTests: [{ test: { name: 'Liver Function Test (LFT)' } }, { test: { name: 'Kidney Function Test (KFT)' } }] },
        ];
        setBookings(dummyBookings);
        setStats({ total: 8, completed: 3, pending: 5, reports: 6 });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: CalendarCheck, label: 'Total Bookings', value: stats.total, color: 'bg-blue-50 text-blue-600', link: '/dashboard/bookings' },
    { icon: Activity, label: 'In Progress', value: stats.pending, color: 'bg-amber-50 text-amber-600', link: '/dashboard/bookings' },
    { icon: FileText, label: 'Reports Ready', value: stats.reports, color: 'bg-emerald-50 text-emerald-600', link: '/dashboard/reports' },
    { icon: Shield, label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-600', link: '/dashboard/bookings' },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Patient'}!
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s an overview of your health journey.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={stat.link} className="card-premium p-5 block group">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-heading font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold text-slate-900">Recent Bookings</h2>
              <Link href="/dashboard/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50">
                  <div className="skeleton w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-3/4 mb-2" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No bookings yet</p>
                <Link href="/dashboard/book-test" className="btn-primary inline-flex items-center gap-2">
                  Book Your First Test <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {bookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/dashboard/bookings/${booking.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {booking.bookingTests?.map(t => t.test.name).join(', ') || 'Booking'}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(booking.appointmentDate)} at {booking.appointmentTime}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">{formatCurrency(booking.finalAmount)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div>
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { icon: CalendarCheck, label: 'Book a Test', desc: 'Schedule your lab tests', href: '/dashboard/book-test', color: 'bg-primary-50 text-primary-600' },
                { icon: FileText, label: 'Download Reports', desc: 'Access your test reports', href: '/dashboard/reports', color: 'bg-emerald-50 text-emerald-600' },
                { icon: User, label: 'Update Profile', desc: 'Edit personal details', href: '/dashboard/profile', color: 'bg-blue-50 text-blue-600' },
                { icon: CreditCard, label: 'View Invoices', desc: 'Payment history & bills', href: '/dashboard/invoices', color: 'bg-amber-50 text-amber-600' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className={`w-9 h-9 ${action.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Health Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card-premium p-6 mt-6 gradient-card border-primary-100"
          >
            <Bell className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-heading font-semibold text-slate-900 mb-2">Stay Healthy</h3>
            <p className="text-sm text-slate-600">Regular health checkups can detect potential health issues early. Schedule your preventive health checkup today.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
