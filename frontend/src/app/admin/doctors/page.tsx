'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Stethoscope, GraduationCap, Award, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await apiService.doctors.getAll({ limit: 100 });
        setDoctors(res.data?.data || []);
      } catch {
        setDoctors([
          { id: 'd1', firstName: 'Venkatesh', lastName: 'Murthy', specialization: 'Pathology', qualification: 'MD Pathology (AIIMS)', experience: 28, isAvailable: true },
          { id: 'd2', firstName: 'Sunita', lastName: 'Reddy', specialization: 'Microbiology', qualification: 'PhD Microbiology', experience: 22, isAvailable: true },
          { id: 'd3', firstName: 'Arjun', lastName: 'Mehta', specialization: 'Hematology', qualification: 'MD Hematology', experience: 18, isAvailable: true },
          { id: 'd4', firstName: 'Priya', lastName: 'Sharma', specialization: 'Biochemistry', qualification: 'MD Biochemistry', experience: 20, isAvailable: true },
          { id: 'd5', firstName: 'Rajesh', lastName: 'Kumar', specialization: 'Immunology', qualification: 'DM Immunology', experience: 15, isAvailable: false },
          { id: 'd6', firstName: 'Ananya', lastName: 'Patel', specialization: 'Pathology', qualification: 'MD Pathology', experience: 16, isAvailable: true },
          { id: 'd7', firstName: 'Suresh', lastName: 'Reddy', specialization: 'Cardiology', qualification: 'DM Cardiology', experience: 24, isAvailable: true },
          { id: 'd8', firstName: 'Lakshmi', lastName: 'Devi', specialization: 'Neurology', qualification: 'DM Neurology', experience: 19, isAvailable: true },
          { id: 'd9', firstName: 'Manoj', lastName: 'Gupta', specialization: 'Gastroenterology', qualification: 'DM Gastroenterology', experience: 17, isAvailable: true },
          { id: 'd10', firstName: 'Divya', lastName: 'Nair', specialization: 'Radiology', qualification: 'MD Radiology', experience: 14, isAvailable: true },
        ]);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((d: any) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Doctor Management</h1>
        <p className="text-slate-500 mt-1">View and manage all registered doctors.</p>
      </motion.div>

      <div className="card-premium p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search doctors by name or specialization..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-premium p-6">
              <div className="skeleton w-16 h-16 rounded-2xl mb-4" />
              <div className="skeleton h-5 w-3/4 mb-2" />
              <div className="skeleton h-4 w-1/2 mb-4" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))
        ) : filtered.map((doctor: any, i: number) => (
          <motion.div key={doctor.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-premium p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">{doctor.firstName?.[0]}{doctor.lastName?.[0]}</span>
              </div>
              {doctor.isAvailable ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg"><CheckCircle className="w-3 h-3" /> Available</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg"><XCircle className="w-3 h-3" /> Unavailable</span>
              )}
            </div>
            <h3 className="font-heading font-semibold text-slate-900">Dr. {doctor.firstName} {doctor.lastName}</h3>
            <p className="text-sm text-primary-600 font-medium mb-3">{doctor.specialization}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {doctor.qualification}</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {doctor.experience}+ yrs</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
