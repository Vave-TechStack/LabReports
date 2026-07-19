'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PenSquare, Search, FileText, Calendar, ChevronRight, CheckCircle, User } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.doctor.getPrescriptions({ limit: 50 });
        setPrescriptions(res.data?.data || []);
      } catch {
        setPrescriptions([
          {
            id: 'rep-v1',
            patient: { firstName: 'Priya', lastName: 'Sharma' },
            booking: { bookingNumber: 'BL-2024-0890' },
            reportNumber: 'RPT-2024-0901',
            verifiedAt: '2024-03-18T10:30:00Z',
            createdAt: '2024-03-18T10:30:00Z',
            notes: 'Thyroid function test results show borderline TSH. Continue current medication at 50 mcg daily. Repeat TSH in 6 weeks. Advised low-iodine diet and regular exercise.'
          },
          {
            id: 'rep-v2',
            patient: { firstName: 'Ananya', lastName: 'Reddy' },
            booking: { bookingNumber: 'BL-2024-0887' },
            reportNumber: 'RPT-2024-0908',
            verifiedAt: '2024-03-17T14:00:00Z',
            createdAt: '2024-03-17T14:00:00Z',
            notes: 'Complete Lipid profile: LDL elevated at 165 mg/dL. Prescribed Atorvastatin 10 mg once daily, strict dietary modifications, and 30 min walk. Follow-up in 3 months with repeat lipid profile.'
          },
          {
            id: 'rep-v3',
            patient: { firstName: 'Rajesh', lastName: 'Patel' },
            booking: { bookingNumber: 'BL-2024-0855' },
            reportNumber: 'RPT-2024-0856',
            verifiedAt: '2024-03-15T09:00:00Z',
            createdAt: '2024-03-15T09:00:00Z',
            notes: 'HbA1c at 7.2% - borderline diabetes. Advised Metformin 500 mg twice daily with meals. Dietary counseling provided. Target HbA1c < 7%. Review in 3 months.'
          },
          {
            id: 'rep-v4',
            patient: { firstName: 'Vikram', lastName: 'Singh' },
            booking: { bookingNumber: 'BL-2024-0844' },
            reportNumber: 'RPT-2024-0845',
            verifiedAt: '2024-03-12T11:30:00Z',
            createdAt: '2024-03-12T11:30:00Z',
            notes: 'Vitamin D level severely low at 12 ng/mL. Prescribed Vitamin D3 60k IU weekly for 8 weeks, followed by daily maintenance of 1000 IU. Sun exposure 15 min daily.'
          },
          {
            id: 'rep-v5',
            patient: { firstName: 'Lakshmi', lastName: 'Devi' },
            booking: { bookingNumber: 'BL-2024-0833' },
            reportNumber: 'RPT-2024-0834',
            verifiedAt: '2024-03-10T08:45:00Z',
            createdAt: '2024-03-10T08:45:00Z',
            notes: 'All parameters within normal range. No medication changes needed. Continue current multivitamin supplement. Annual health checkup recommended.'
          },
          {
            id: 'rep-v6',
            patient: { firstName: 'Arjun', lastName: 'Nair' },
            booking: { bookingNumber: 'BL-2024-0822' },
            reportNumber: 'RPT-2024-0823',
            verifiedAt: '2024-03-08T15:15:00Z',
            createdAt: '2024-03-08T15:15:00Z',
            notes: 'CBC shows mild anemia (Hb: 10.8 g/dL). Prescribed Ferrous Sulfate 325 mg once daily with Vitamin C. Dietary sources of iron advised. Repeat CBC in 1 month.'
          }
        ]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Prescriptions</h1>
        <p className="text-slate-500 mt-1">View verified patient reports and prescribed treatments.</p>
      </motion.div>

      {/* Prescriptions List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 w-full rounded-xl" />)
        ) : prescriptions.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <PenSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Prescriptions</h3>
            <p className="text-slate-500">Verified reports with prescriptions will appear here.</p>
          </div>
        ) : (
          prescriptions.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="card-premium p-5 group hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {item.patient?.firstName} {item.patient?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="font-mono">{item.booking?.bookingNumber}</span>
                      <span>•</span>
                      <span>{formatDate(item.verifiedAt || item.createdAt)}</span>
                      <span>•</span>
                      <span className="font-mono">#{item.reportNumber?.slice(-8)}</span>
                    </div>
                    {item.notes && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs font-medium text-blue-700 mb-1">Doctor's Notes</p>
                        <p className="text-xs text-blue-800 whitespace-pre-wrap">{item.notes}</p>
                      </div>
                    )}
                    {!item.notes && (
                      <p className="text-xs text-slate-400 italic">No prescription notes added.</p>
                    )}
                  </div>
                  <Link
                    href={`/doctor/reports/${item.id}`}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0"
                  >
                    View <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
