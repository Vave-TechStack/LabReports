'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, ChevronRight, GraduationCap, Award } from 'lucide-react';
import { apiService } from '@/lib/api';
import { getInitials } from '@/lib/utils';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  experience: number;
  bio: string | null;
  consultationFee: number | null;
}

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiService.doctors.getAll({ limit: 4 });
        setDoctors(response.data?.data || []);
      } catch { /* */ }
    };
    fetchDoctors();
  }, []);

  if (doctors.length === 0) return null;

  return (
    <section className="section-padding bg-surface">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-4">
            <Stethoscope className="w-4 h-4" />
            Our Experts
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Meet Our Expert Doctors
          </h2>
          <p className="text-lg text-slate-600">
            Our team of experienced pathologists and doctors ensure accurate diagnosis and quality care.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="card-premium p-6 text-center group"
            >
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">{getInitials(doctor.firstName, doctor.lastName)}</span>
              </div>
              <h3 className="font-heading font-semibold text-slate-900">Dr. {doctor.firstName} {doctor.lastName}</h3>
              <p className="text-sm text-primary-600 font-medium mb-3">{doctor.specialization}</p>
              <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {doctor.qualification}</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {doctor.experience}+ yrs</span>
              </div>
              {doctor.bio && <p className="text-xs text-slate-500 line-clamp-2">{doctor.bio}</p>}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/doctors" className="inline-flex items-center gap-2 btn-outline font-semibold px-8 py-3.5">
            View All Doctors <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
