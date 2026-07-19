'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, FileText, ChevronRight, Filter, CheckCircle, Clock, X } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (statusFilter) params.status = statusFilter;
      const res = await apiService.doctor.getReports(params);
      setReports(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const allDummyReports = [
        {
          id: 'rep-v1', isVerified: true, reportNumber: 'RPT-2024-0901',
          patient: { firstName: 'Priya', lastName: 'Sharma', gender: 'Female', bloodGroup: 'O_POS' },
          booking: { bookingNumber: 'BL-2024-0890' },
          createdAt: '2024-03-18T10:30:00Z'
        },
        {
          id: 'rep-v2', isVerified: true, reportNumber: 'RPT-2024-0908',
          patient: { firstName: 'Ananya', lastName: 'Reddy', gender: 'Female', bloodGroup: 'AB_POS' },
          booking: { bookingNumber: 'BL-2024-0887' },
          createdAt: '2024-03-17T14:00:00Z'
        },
        {
          id: 'rep-p1', isVerified: false, reportNumber: 'RPT-2024-0901',
          patient: { firstName: 'Priya', lastName: 'Sharma', gender: 'Female', bloodGroup: 'O_POS' },
          booking: { bookingNumber: 'BL-2024-0890' },
          createdAt: '2024-03-18T10:30:00Z'
        },
        {
          id: 'rep-p2', isVerified: false, reportNumber: 'RPT-2024-0902',
          patient: { firstName: 'Rajesh', lastName: 'Patel', gender: 'Male', bloodGroup: 'B_POS' },
          booking: { bookingNumber: 'BL-2024-0889' },
          createdAt: '2024-03-18T11:00:00Z'
        },
        {
          id: 'rep-p3', isVerified: false, reportNumber: 'RPT-2024-0903',
          patient: { firstName: 'Sunita', lastName: 'Verma', gender: 'Female', bloodGroup: 'A_POS' },
          booking: { bookingNumber: 'BL-2024-0888' },
          createdAt: '2024-03-18T09:15:00Z'
        },
        {
          id: 'rep-p4', isVerified: false, reportNumber: 'RPT-2024-0904',
          patient: { firstName: 'Vikram', lastName: 'Singh', gender: 'Male', bloodGroup: 'O_NEG' },
          booking: { bookingNumber: 'BL-2024-0886' },
          createdAt: '2024-03-17T14:30:00Z'
        },
        {
          id: 'rep-p5', isVerified: false, reportNumber: 'RPT-2024-0905',
          patient: { firstName: 'Lakshmi', lastName: 'Devi', gender: 'Female', bloodGroup: 'B_POS' },
          booking: { bookingNumber: 'BL-2024-0885' },
          createdAt: '2024-03-17T08:45:00Z'
        },
        {
          id: 'rep-p6', isVerified: false, reportNumber: 'RPT-2024-0906',
          patient: { firstName: 'Arjun', lastName: 'Nair', gender: 'Male', bloodGroup: 'A_POS' },
          booking: { bookingNumber: 'BL-2024-0884' },
          createdAt: '2024-03-16T16:00:00Z'
        },
        {
          id: 'rep-p7', isVerified: false, reportNumber: 'RPT-2024-0907',
          patient: { firstName: 'Meera', lastName: 'Joshi', gender: 'Female', bloodGroup: 'O_POS' },
          booking: { bookingNumber: 'BL-2024-0883' },
          createdAt: '2024-03-16T12:20:00Z'
        },
        {
          id: 'rep-p8', isVerified: false, reportNumber: 'RPT-2024-0908',
          patient: { firstName: 'Ananya', lastName: 'Reddy', gender: 'Female', bloodGroup: 'AB_POS' },
          booking: { bookingNumber: 'BL-2024-0887' },
          createdAt: '2024-03-18T07:30:00Z'
        }
      ];
      let filtered = allDummyReports;
      if (search) {
        filtered = filtered.filter(r =>
          r.patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
          r.patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
          r.booking.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
          r.reportNumber.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (statusFilter === 'verified') {
        filtered = filtered.filter(r => r.isVerified);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(r => !r.isVerified);
      }
      setReports(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, [page, search, statusFilter]);

  const statusChips = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Verified', value: 'verified' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">All Reports</h1>
        <p className="text-slate-500 mt-1">Browse and search all verified and pending reports.</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, booking #, or report #..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {statusChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => { setStatusFilter(chip.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === chip.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)
        ) : reports.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Reports Found</h3>
            <p className="text-slate-500">No reports match your search criteria.</p>
          </div>
        ) : (
          reports.map((report: any) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                href={`/doctor/reports/${report.id}`}
                className="card-premium p-4 flex items-center gap-4 group hover:shadow-lg transition-all"
              >
                <div className={`w-10 h-10 ${report.isVerified ? 'bg-emerald-50' : 'bg-amber-50'} rounded-xl flex items-center justify-center shrink-0`}>
                  {report.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      {report.patient?.firstName} {report.patient?.lastName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-slate-600">
                      {report.patient?.gender}
                    </span>
                    {report.patient?.bloodGroup && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold">
                        {report.patient.bloodGroup.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono">{report.booking?.bookingNumber}</span>
                    <span>•</span>
                    <span>{formatDate(report.createdAt)}</span>
                    <span>•</span>
                    <span className="font-mono">#{report.reportNumber?.slice(-8)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {report.isVerified ? 'Verified' : 'Pending'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                page === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
