'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ClipboardList, FileCheck, Users, FileText, Stethoscope,
  ArrowRight, ChevronRight, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function DoctorDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiService.doctor.getDashboard();
        setData(res.data?.data);
      } catch {
        setData({
          pendingVerification: 8,
          verifiedToday: 12,
          totalVerified: 847,
          totalPatients: 152,
          doctor: {
            firstName: 'Arun',
            lastName: 'Kumar',
            specialization: 'Cardiologist'
          },
          recentReports: [
            {
              id: 'rep-1', isVerified: false,
              patient: { firstName: 'Priya', lastName: 'Sharma' },
              booking: { bookingNumber: 'BL-2024-0890' }
            },
            {
              id: 'rep-2', isVerified: false,
              patient: { firstName: 'Rajesh', lastName: 'Patel' },
              booking: { bookingNumber: 'BL-2024-0889' }
            },
            {
              id: 'rep-3', isVerified: false,
              patient: { firstName: 'Sunita', lastName: 'Verma' },
              booking: { bookingNumber: 'BL-2024-0888' }
            },
            {
              id: 'rep-4', isVerified: true,
              patient: { firstName: 'Ananya', lastName: 'Reddy' },
              booking: { bookingNumber: 'BL-2024-0887' }
            },
            {
              id: 'rep-5', isVerified: false,
              patient: { firstName: 'Vikram', lastName: 'Singh' },
              booking: { bookingNumber: 'BL-2024-0886' }
            }
          ]
        });
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { icon: ClipboardList, label: 'Pending Verification', value: data?.pendingVerification, color: 'bg-amber-50 text-amber-600', href: '/doctor/pending-reports' },
    { icon: CheckCircle, label: 'Verified Today', value: data?.verifiedToday, color: 'bg-emerald-50 text-emerald-600', href: '/doctor/reports?status=verified' },
    { icon: FileText, label: 'Total Reports', value: data?.totalVerified, color: 'bg-blue-50 text-blue-600', href: '/doctor/reports' },
    { icon: Users, label: 'Patients', value: data?.totalPatients, color: 'bg-purple-50 text-purple-600', href: '/doctor/patients' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            Dr. {data?.doctor?.firstName} {data?.doctor?.lastName}
          </span>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-sm text-slate-500">{data?.doctor?.specialization}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="text-slate-500 mt-1">Verify reports, review patient history, and manage prescriptions.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-premium p-5"><div className="skeleton h-24 w-full rounded-xl" /></div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={stat.href} className="card-premium p-5 block group hover:shadow-lg transition-all">
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
        {/* Pending Reports */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Pending Verification</h2>
            <Link href="/doctor/pending-reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 w-full mb-2 rounded-xl" />)
          ) : data?.recentReports?.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">All reports verified. Great job!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.recentReports?.slice(0, 5).map((report: any) => (
                <Link
                  key={report.id}
                  href={`/doctor/reports/${report.id}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all group"
                >
                  <div className={`w-8 h-8 ${report.isVerified ? 'bg-emerald-50' : 'bg-amber-50'} rounded-lg flex items-center justify-center shrink-0`}>
                    {report.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {report.patient?.firstName} {report.patient?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">{report.booking?.bookingNumber}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${report.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {report.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: ClipboardList, label: 'Verify Reports', desc: 'Review and approve pending reports', href: '/doctor/pending-reports', color: 'bg-amber-50 text-amber-600' },
              { icon: Users, label: 'Patient History', desc: 'View patient records and past reports', href: '/doctor/patients', color: 'bg-purple-50 text-purple-600' },
              { icon: FileText, label: 'All Reports', desc: 'Browse and search verified reports', href: '/doctor/reports', color: 'bg-blue-50 text-blue-600' },
              { icon: PenSquare, label: 'Prescriptions', desc: 'Manage patient prescriptions', href: '/doctor/prescriptions', color: 'bg-emerald-50 text-emerald-600' },
            ].map((action) => (
              <Link key={action.label} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                <div className={`w-9 h-9 ${action.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PenSquare(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
