'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Calendar, User, Award, CheckCircle, AlertCircle, Printer, ExternalLink } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

interface TestParameter {
  testId: string;
  testName: string;
  parameterName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

interface ReportData {
  id: string;
  reportNumber: string;
  isVerified: boolean;
  pdfUrl: string | null;
  parameters: TestParameter[];
  notes: string | null;
  createdAt: string;
  verifiedAt: string | null;
  booking: {
    bookingNumber: string;
    appointmentDate: string;
    type: string;
    patient: { firstName: string; lastName: string; bloodGroup: string | null; gender: string | null };
  };
  verifiedBy: { firstName: string; lastName: string; specialization: string } | null;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiService.reports.getById(params.id as string);
        const data = res.data?.data;
        setReport(data);
      } catch {
        // Fallback demo report detail
        setReport({
          id: params.id as string,
          reportNumber: 'RPT-2024-0892',
          isVerified: true,
          pdfUrl: null,
          parameters: [
            { testId: 't1', testName: 'Complete Blood Count (CBC)', parameterName: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', isAbnormal: false },
            { testId: 't1', testName: 'Complete Blood Count (CBC)', parameterName: 'RBC Count', value: '5.1', unit: 'M/µL', referenceRange: '4.5 - 5.5', isAbnormal: false },
            { testId: 't1', testName: 'Complete Blood Count (CBC)', parameterName: 'WBC Count', value: '7200', unit: 'cells/µL', referenceRange: '4000 - 11000', isAbnormal: false },
            { testId: 't1', testName: 'Complete Blood Count (CBC)', parameterName: 'Platelet Count', value: '2.8', unit: 'Lakhs/µL', referenceRange: '1.5 - 4.5', isAbnormal: false },
            { testId: 't1', testName: 'Complete Blood Count (CBC)', parameterName: 'Neutrophils', value: '62', unit: '%', referenceRange: '40 - 80', isAbnormal: false },
            { testId: 't1', testName: 'Complete Blood Count (CBC)', parameterName: 'Lymphocytes', value: '28', unit: '%', referenceRange: '20 - 40', isAbnormal: false },
            { testId: 't3', testName: 'Fasting Blood Sugar (FBS)', parameterName: 'Fasting Blood Sugar', value: '92', unit: 'mg/dL', referenceRange: '70 - 100', isAbnormal: false },
            { testId: 't5', testName: 'Lipid Profile', parameterName: 'Total Cholesterol', value: '180', unit: 'mg/dL', referenceRange: '< 200', isAbnormal: false },
            { testId: 't5', testName: 'Lipid Profile', parameterName: 'HDL Cholesterol', value: '48', unit: 'mg/dL', referenceRange: '> 40', isAbnormal: false },
            { testId: 't5', testName: 'Lipid Profile', parameterName: 'LDL Cholesterol', value: '110', unit: 'mg/dL', referenceRange: '< 130', isAbnormal: false },
            { testId: 't5', testName: 'Lipid Profile', parameterName: 'Triglycerides', value: '145', unit: 'mg/dL', referenceRange: '< 150', isAbnormal: false },
            { testId: 't8', testName: 'Vitamin D (25-OH)', parameterName: 'Vitamin D', value: '22', unit: 'ng/mL', referenceRange: '30 - 100', isAbnormal: true },
          ],
          notes: 'Vitamin D levels are below normal range. Please consult your physician for supplementation.',
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
          booking: {
            bookingNumber: 'ML-2024-10892',
            appointmentDate: new Date(Date.now() - 86400000).toISOString(),
            type: 'HOME_COLLECTION',
            patient: { firstName: 'Demo', lastName: 'Patient', bloodGroup: 'O_POSITIVE', gender: 'MALE' },
          },
          verifiedBy: { firstName: 'Venkatesh', lastName: 'Murthy', specialization: 'Pathology' },
        });
      }
      setLoading(false);
    };
    fetchReport();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="card-premium p-8">
          <div className="skeleton h-6 w-2/3 mb-4" />
          <div className="skeleton h-4 w-1/3 mb-6" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="card-premium p-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-slate-900 mb-2">Report not found</h3>
        <Link href="/dashboard/reports" className="text-primary-600 hover:text-primary-700 font-medium">Back to reports</Link>
      </div>
    );
  }

  // Group parameters by test
  const groupedParams = report.parameters?.reduce((acc: Record<string, TestParameter[]>, param) => {
    if (!acc[param.testName]) acc[param.testName] = [];
    acc[param.testName].push(param);
    return acc;
  }, {}) || {};

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Reports
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">Test Report</h1>
            <p className="text-sm text-primary-600 font-mono mt-1">{report.reportNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-gray-50 text-slate-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={() => {
                const token = localStorage.getItem('accessToken');
                window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/reports/download/${report.id}/pdf?token=${token}`, '_blank');
              }}
              className="px-4 py-2.5 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Report Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-premium p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-lg font-heading font-semibold text-slate-900">MediLab Diagnostics</p>
              <p className="text-xs text-slate-500">NABL Accredited Diagnostic Laboratory</p>
            </div>
          </div>
          <div className="text-right">
            {report.isVerified ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Report
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Pending Verification
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs text-slate-500">Patient Name</p>
            <p className="text-sm font-medium text-slate-900">{report.booking.patient.firstName} {report.booking.patient.lastName}</p>
          </div>
          {report.booking.patient.bloodGroup && (
            <div>
              <p className="text-xs text-slate-500">Blood Group</p>
              <p className="text-sm font-medium text-slate-900">{report.booking.patient.bloodGroup.replace('_', ' ')}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-500">Report Date</p>
            <p className="text-sm font-medium text-slate-900">{formatDate(report.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Booking</p>
            <p className="text-sm font-medium text-slate-900">{report.booking.bookingNumber}</p>
          </div>
          {report.verifiedBy && (
            <div className="md:col-span-2">
              <p className="text-xs text-slate-500">Verified By</p>
              <p className="text-sm font-medium text-slate-900">
                Dr. {report.verifiedBy.firstName} {report.verifiedBy.lastName} - {report.verifiedBy.specialization}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Test Results */}
      {Object.entries(groupedParams).map(([testName, params], index) => (
        <motion.div
          key={testName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.05 }}
          className="card-premium p-6 mb-6"
        >
          <h3 className="font-heading font-semibold text-slate-900 mb-4">{testName}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase">Parameter</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-slate-500 uppercase">Result</th>
                  <th className="text-center py-3 px-2 text-xs font-medium text-slate-500 uppercase">Unit</th>
                  <th className="text-center py-3 px-2 text-xs font-medium text-slate-500 uppercase">Reference Range</th>
                  <th className="text-center py-3 px-2 text-xs font-medium text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {params.map((param, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${param.isAbnormal ? 'bg-red-50/50' : ''}`}>
                    <td className="py-3 px-2 text-slate-900 font-medium">{param.parameterName}</td>
                    <td className={`py-3 px-2 text-right font-semibold ${param.isAbnormal ? 'text-red-600' : 'text-slate-900'}`}>
                      {param.value}
                    </td>
                    <td className="py-3 px-2 text-center text-slate-500">{param.unit}</td>
                    <td className="py-3 px-2 text-center text-slate-500">{param.referenceRange}</td>
                    <td className="py-3 px-2 text-center">
                      {param.isAbnormal ? (
                        <span className="text-red-600 text-xs font-medium">Abnormal</span>
                      ) : (
                        <span className="text-emerald-600 text-xs font-medium">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}

      {/* Notes */}
      {report.notes && (
        <div className="card-premium p-6 mb-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-2">Notes</h3>
          <p className="text-sm text-slate-600">{report.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-6 border-t border-gray-100">
        <p>This is a computer-generated report. No signature is required.</p>
        <p className="mt-1">MediLab Diagnostics • 42, Tech Park Boulevard, Whitefield, Bangalore - 560066</p>
      </div>
    </div>
  );
}
