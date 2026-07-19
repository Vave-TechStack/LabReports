'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Calendar, Phone, Mail, FileText, Clock,
  CheckCircle, AlertTriangle, FlaskConical, ChevronRight
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function PatientHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.doctor.getPatientHistory(params.id as string);
        setPatient(res.data?.data);
      } catch {
        setPatient({
          id: params.id,
          firstName: 'Priya',
          lastName: 'Sharma',
          gender: 'Female',
          bloodGroup: 'O_POS',
          dateOfBirth: '1992-05-15',
          medicalHistory: 'Hypothyroidism diagnosed 2021, on medication',
          allergies: 'Penicillin, Sulfa drugs',
          address: 'Hyderabad, Telangana',
          user: { email: 'priya.sharma@email.com', phone: '9876543210' },
          reports: [
            {
              id: 'rep-1', isVerified: true,
              booking: { bookingNumber: 'BL-2024-0890' },
              createdAt: '2024-03-15T10:30:00Z'
            },
            {
              id: 'rep-2', isVerified: true,
              booking: { bookingNumber: 'BL-2024-0855' },
              createdAt: '2024-02-20T09:15:00Z'
            },
            {
              id: 'rep-3', isVerified: false,
              booking: { bookingNumber: 'BL-2024-0910' },
              createdAt: '2024-03-18T14:00:00Z'
            }
          ],
          bookings: [
            {
              id: 'bkg-1', bookingNumber: 'BL-2024-0890',
              status: 'REPORT_READY',
              appointmentDate: '2024-03-14T10:30:00Z'
            },
            {
              id: 'bkg-2', bookingNumber: 'BL-2024-0855',
              status: 'DELIVERED',
              appointmentDate: '2024-02-19T09:15:00Z'
            },
            {
              id: 'bkg-3', bookingNumber: 'BL-2024-0910',
              status: 'LAB_RESULT_ENTERED',
              appointmentDate: '2024-03-18T14:00:00Z'
            },
            {
              id: 'bkg-4', bookingNumber: 'BL-2024-0790',
              status: 'CANCELLED',
              appointmentDate: '2024-01-28T11:00:00Z'
            }
          ]
        });
      }
      setLoading(false);
    };
    fetch();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="skeleton h-12 w-64 mb-6 rounded-xl" />
        <div className="skeleton h-48 w-full mb-4 rounded-2xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto card-premium p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-lg font-heading font-semibold text-slate-900">Patient Not Found</h2>
        <button onClick={() => router.back()} className="btn-outline mt-4">Go Back</button>
      </div>
    );
  }

  const patientAge = patient.dateOfBirth
    ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </button>

      {/* Patient Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-blue-600">
              {patient.firstName?.[0]}{patient.lastName?.[0]}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-heading font-bold text-slate-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
              {patientAge && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {patientAge} years</span>}
              {patient.gender && <span>{patient.gender}</span>}
              {patient.bloodGroup && (
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs font-semibold">
                  {patient.bloodGroup.replace(/_/g, ' ')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              {patient.user?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {patient.user.email}</span>}
              {patient.user?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {patient.user.phone}</span>}
            </div>
          </div>
        </div>

        {(patient.medicalHistory || patient.allergies) && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            {patient.medicalHistory && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Medical History</p>
                <p className="text-sm text-slate-900">{patient.medicalHistory}</p>
              </div>
            )}
            {patient.allergies && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Allergies</p>
                <p className="text-sm text-slate-900">{patient.allergies}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reports History */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Report History</h2>
            <span className="text-xs text-slate-500">{patient.reports?.length || 0} reports</span>
          </div>

          {patient.reports?.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No reports yet.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {patient.reports?.map((report: any) => (
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
                      {report.booking?.bookingNumber}
                    </p>
                    <p className="text-[10px] text-slate-500">{formatDate(report.createdAt)}</p>
                  </div>
                  <span className={`text-[10px] font-semibold ${report.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {report.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Recent Bookings</h2>
            <span className="text-xs text-slate-500">{patient.bookings?.length || 0} bookings</span>
          </div>

          {patient.bookings?.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No bookings yet.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {patient.bookings?.map((booking: any) => (
                <div key={booking.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate font-mono">
                      {booking.bookingNumber}
                    </p>
                    <p className="text-[10px] text-slate-500">{formatDate(booking.appointmentDate)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    booking.status === 'REPORT_READY' || booking.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : booking.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
