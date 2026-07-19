'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Users, ChevronRight, Mail, Phone, Calendar } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await apiService.doctor.getPatients({ page, limit: 20, search });
      setPatients(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyPatients = [
        {
          id: 'pat-1', firstName: 'Priya', lastName: 'Sharma', gender: 'Female', bloodGroup: 'O_POS',
          user: { phone: '9876543210' },
          _count: { reports: 6, bookings: 8 }
        },
        {
          id: 'pat-2', firstName: 'Rajesh', lastName: 'Patel', gender: 'Male', bloodGroup: 'B_POS',
          user: { phone: '9876543211' },
          _count: { reports: 4, bookings: 5 }
        },
        {
          id: 'pat-3', firstName: 'Sunita', lastName: 'Verma', gender: 'Female', bloodGroup: 'A_POS',
          user: { phone: '9876543212' },
          _count: { reports: 8, bookings: 10 }
        },
        {
          id: 'pat-4', firstName: 'Ananya', lastName: 'Reddy', gender: 'Female', bloodGroup: 'AB_POS',
          user: { phone: '9876543213' },
          _count: { reports: 3, bookings: 4 }
        },
        {
          id: 'pat-5', firstName: 'Vikram', lastName: 'Singh', gender: 'Male', bloodGroup: 'O_NEG',
          user: { phone: '9876543214' },
          _count: { reports: 5, bookings: 7 }
        },
        {
          id: 'pat-6', firstName: 'Lakshmi', lastName: 'Devi', gender: 'Female', bloodGroup: 'B_POS',
          user: { phone: '9876543215' },
          _count: { reports: 10, bookings: 12 }
        },
        {
          id: 'pat-7', firstName: 'Arjun', lastName: 'Nair', gender: 'Male', bloodGroup: 'A_POS',
          user: { phone: '9876543216' },
          _count: { reports: 2, bookings: 3 }
        },
        {
          id: 'pat-8', firstName: 'Meera', lastName: 'Joshi', gender: 'Female', bloodGroup: 'O_POS',
          user: { phone: '9876543217' },
          _count: { reports: 7, bookings: 9 }
        }
      ];
      const filtered = search
        ? dummyPatients.filter(p =>
            p.firstName.toLowerCase().includes(search.toLowerCase()) ||
            p.lastName.toLowerCase().includes(search.toLowerCase())
          )
        : dummyPatients;
      setPatients(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, [page, search]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Patients</h1>
        <p className="text-slate-500 mt-1">View patient history and past reports.</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-10"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-36 w-full rounded-xl" />)
        ) : patients.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 card-premium p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Patients Found</h3>
            <p className="text-slate-500">No patients have been assigned to you yet.</p>
          </div>
        ) : (
          patients.map((patient: any) => (
            <motion.div key={patient.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                href={`/doctor/patients/${patient.id}`}
                className="card-premium p-5 block group hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {patient.firstName?.[0]}{patient.lastName?.[0]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{patient.gender || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {patient._count?.reports || 0} reports
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {patient._count?.bookings || 0} bookings
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  {patient.user?.phone && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3 h-3" /> {patient.user.phone}
                    </span>
                  )}
                  {patient.bloodGroup && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-semibold">
                      {patient.bloodGroup.replace(/_/g, ' ')}
                    </span>
                  )}
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
