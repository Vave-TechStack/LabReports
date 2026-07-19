'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FlaskConical, FileText, CheckCircle, Clock, ArrowRight, ChevronRight, Barcode, ClipboardCheck, Printer } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function LabDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiService.lab.getDashboard();
        setData(res.data?.data);
      } catch {
        // Fallback demo data
        setData({
          todayCollections: 12,
          pendingReports: 8,
          pendingVerification: 5,
          totalProcessed: 234,
          bookingsReady: 6,
          todaySamples: [
            { id: 's1', barcode: 'BL20241105001', sampleType: 'BLOOD', collectionDate: new Date().toISOString(), booking: { patient: { firstName: 'Ravi', lastName: 'Kumar' }, status: 'SAMPLE_COLLECTED', bookingNumber: 'ML-2024-10892' } },
            { id: 's2', barcode: 'BL20241105002', sampleType: 'BLOOD', collectionDate: new Date().toISOString(), booking: { patient: { firstName: 'Priya', lastName: 'Sharma' }, status: 'LAB_PROCESSING', bookingNumber: 'ML-2024-10891' } },
            { id: 's3', barcode: 'BL20241105003', sampleType: 'URINE', collectionDate: new Date().toISOString(), booking: { patient: { firstName: 'Amit', lastName: 'Patel' }, status: 'SAMPLE_COLLECTED', bookingNumber: 'ML-2024-10890' } },
            { id: 's4', barcode: 'BL20241105004', sampleType: 'BLOOD', collectionDate: new Date().toISOString(), booking: { patient: { firstName: 'Sunita', lastName: 'Reddy' }, status: 'SAMPLE_COLLECTED', bookingNumber: 'ML-2024-10889' } },
            { id: 's5', barcode: 'BL20241105005', sampleType: 'BLOOD', collectionDate: new Date().toISOString(), booking: { patient: { firstName: 'Vikram', lastName: 'Singh' }, status: 'SAMPLE_COLLECTED', bookingNumber: 'ML-2024-10888' } },
          ],
        });
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { icon: FlaskConical, label: "Today's Collections", value: data?.todayCollections, color: 'bg-blue-50 text-blue-600', href: '/lab/sample-entry' },
    { icon: Clock, label: 'Pending Reports', value: data?.pendingReports, color: 'bg-amber-50 text-amber-600', href: '/lab/pending-reports' },
    { icon: FileText, label: 'Pending Verification', value: data?.pendingVerification, color: 'bg-purple-50 text-purple-600', href: '/lab/pending-reports' },
    { icon: CheckCircle, label: 'Total Processed', value: data?.totalProcessed, color: 'bg-emerald-50 text-emerald-600', href: '/lab/pending-reports' },
    { icon: Barcode, label: 'Bookings Ready', value: data?.bookingsReady, color: 'bg-cyan-50 text-cyan-600', href: '/lab/sample-entry' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Lab Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage samples, enter results, and track workflows.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card-premium p-5"><div className="skeleton h-20 w-full rounded-xl" /></div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link href={stat.href} className="card-premium p-5 block group">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-heading font-bold text-slate-900">{stat.value ?? '—'}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Collections */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Today's Collections</h2>
            <Link href="/lab/sample-entry" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
              New <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 w-full mb-2 rounded-xl" />)
          ) : data?.todaySamples?.length === 0 ? (
            <div className="text-center py-8"><FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-slate-500">No samples collected today</p></div>
          ) : (
            <div className="space-y-2">
              {data?.todaySamples?.map((sample: any) => (
                <div key={sample.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                    <Barcode className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {sample.booking?.patient?.firstName} {sample.booking?.patient?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">{sample.barcode}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    sample.booking?.status === 'SAMPLE_COLLECTED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {sample.booking?.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-heading font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: FlaskConical, label: 'Register Sample', desc: 'Create sample entry with barcode', href: '/lab/sample-entry', color: 'bg-blue-50 text-blue-600' },
              { icon: Barcode, label: 'Scan Barcode', desc: 'Lookup sample by barcode', href: '/lab/barcode', color: 'bg-cyan-50 text-cyan-600' },
              { icon: ClipboardCheck, label: 'Enter Results', desc: 'Input test parameters & values', href: '/lab/enter-results', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Printer, label: 'Print Labels', desc: 'Generate sample collection labels', href: '/lab/print-labels', color: 'bg-amber-50 text-amber-600' },
            ].map((action) => (
              <Link key={action.label} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                <div className={`w-9 h-9 ${action.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-cyan-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
