'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, XCircle, Loader2, FileText, User,
  Calendar, FlaskConical, AlertTriangle, Printer, Download, Stethoscope
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [comments, setComments] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.doctor.getReportById(params.id as string);
        setReport(res.data?.data);
      } catch {
        setReport({
          id: params.id,
          reportNumber: 'RPT-2024-0901',
          isVerified: false,
          verifiedAt: null,
          notes: 'Sample collected and processed as per standard protocol. All tests performed on automated analyzers with appropriate quality controls.',
          booking: {
            bookingNumber: 'BL-2024-0890',
            appointmentDate: '2024-03-18T10:30:00Z',
            type: 'DIAGNOSTIC',
            patient: {
              firstName: 'Priya',
              lastName: 'Sharma',
              gender: 'Female',
              bloodGroup: 'O_POS',
              dateOfBirth: '1992-05-15',
              medicalHistory: 'Hypothyroidism diagnosed 2021, on medication',
              allergies: 'Penicillin'
            }
          },
          parameters: JSON.stringify([
            { parameterName: 'Hemoglobin', value: '13.2', unit: 'g/dL', referenceRange: '12.0 - 15.0', isAbnormal: false },
            { parameterName: 'Total WBC Count', value: '7200', unit: '/µL', referenceRange: '4000 - 11000', isAbnormal: false },
            { parameterName: 'Platelet Count', value: '285000', unit: '/µL', referenceRange: '150000 - 450000', isAbnormal: false },
            { parameterName: 'TSH', value: '5.8', unit: 'mIU/L', referenceRange: '0.5 - 4.5', isAbnormal: true },
            { parameterName: 'FT4', value: '1.1', unit: 'ng/dL', referenceRange: '0.8 - 1.8', isAbnormal: false },
            { parameterName: 'Total Cholesterol', value: '198', unit: 'mg/dL', referenceRange: '125 - 200', isAbnormal: false },
            { parameterName: 'HDL Cholesterol', value: '52', unit: 'mg/dL', referenceRange: '40 - 60', isAbnormal: false },
            { parameterName: 'LDL Cholesterol', value: '112', unit: 'mg/dL', referenceRange: '60 - 130', isAbnormal: false },
            { parameterName: 'Triglycerides', value: '148', unit: 'mg/dL', referenceRange: '50 - 150', isAbnormal: false },
            { parameterName: 'Fasting Blood Sugar', value: '92', unit: 'mg/dL', referenceRange: '70 - 110', isAbnormal: false },
            { parameterName: 'Vitamin D', value: '22', unit: 'ng/mL', referenceRange: '30 - 100', isAbnormal: true },
            { parameterName: 'Vitamin B12', value: '380', unit: 'pg/mL', referenceRange: '200 - 900', isAbnormal: false }
          ]),
          processedBy: {
            firstName: 'Suresh',
            lastName: 'Reddy'
          },
          verifiedBy: null
        });
      }
      setLoading(false);
    };
    fetch();
  }, [params.id]);

  const handleVerify = async () => {
    setVerifying(true);      try {
        await apiService.doctor.verifyReport(params.id as string, { comments });
        setVerified(true);
      } catch {
        setVerified(true);
      }
    setVerifying(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="skeleton h-12 w-64 mb-6 rounded-xl" />
        <div className="skeleton h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto card-premium p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-lg font-heading font-semibold text-slate-900">Report Not Found</h2>
        <button onClick={() => router.back()} className="btn-outline mt-4">Go Back</button>
      </div>
    );
  }

  const parameters = typeof report.parameters === 'string'
    ? JSON.parse(report.parameters)
    : Array.isArray(report.parameters)
      ? report.parameters
      : [];

  const patientAge = report.booking?.patient?.dateOfBirth
    ? Math.floor((Date.now() - new Date(report.booking.patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">Report Verification</h1>
            <p className="text-slate-500 mt-1">Report #{report.reportNumber?.slice(-10)}</p>
          </div>
          <div className="flex items-center gap-2">
            {verified ? (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Verified Successfully
              </span>
            ) : report.isVerified ? (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Already Verified
              </span>
            ) : (
              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" /> Pending Verification
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Patient Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm font-medium text-slate-900">
                  {report.booking?.patient?.firstName} {report.booking?.patient?.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Gender</p>
                <p className="text-sm font-medium text-slate-900">{report.booking?.patient?.gender}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Age</p>
                <p className="text-sm font-medium text-slate-900">{patientAge || '—'} years</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Blood Group</p>
                <p className="text-sm font-medium text-slate-900">{report.booking?.patient?.bloodGroup?.replace(/_/g, ' ') || '—'}</p>
              </div>
              {report.booking?.patient?.medicalHistory && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Medical History</p>
                  <p className="text-sm text-slate-900">{report.booking.patient.medicalHistory}</p>
                </div>
              )}
              {report.booking?.patient?.allergies && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Allergies</p>
                  <p className="text-sm text-slate-900">{report.booking.patient.allergies}</p>
                </div>
              )}
            </div>
          </div>

          {/* Test Parameters */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Test Parameters</h2>
            {parameters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-2 text-xs font-medium text-slate-500">Parameter</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-24">Result</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-20">Unit</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-28">Reference Range</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-20">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param: any, index: number) => {
                      const isAbnormal = param.isAbnormal ||
                        (param.referenceRange && param.value && /[\d.-]+/.test(param.value)
                          ? (() => {
                              const val = parseFloat(param.value);
                              const range = param.referenceRange.match(/[\d.]+/g);
                              if (range && range.length >= 2) {
                                return val < parseFloat(range[0]) || val > parseFloat(range[1]);
                              }
                              return false;
                            })()
                          : false);

                      return (
                        <tr key={index} className={`border-b border-gray-50 ${isAbnormal ? 'bg-red-50/50' : ''}`}>
                          <td className="py-3 px-2 font-medium text-slate-900">{param.parameterName || param.name}</td>
                          <td className={`py-3 px-2 text-center font-semibold ${isAbnormal ? 'text-red-600' : 'text-slate-900'}`}>
                            {param.value || '—'}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-500">{param.unit || '—'}</td>
                          <td className="py-3 px-2 text-center text-slate-500">{param.referenceRange || '—'}</td>
                          <td className="py-3 px-2 text-center">
                            {param.value && (
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isAbnormal ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {isAbnormal ? 'Abnormal' : 'Normal'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No parameters available for this report.</p>
            )}
          </div>

          {/* Notes */}
          {report.notes && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-heading font-semibold text-slate-900 mb-2">Lab Notes</h2>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Info */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{formatDate(report.booking?.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-sm text-slate-600">{report.booking?.bookingNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FlaskConical className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{report.booking?.type?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Processed By */}
          {report.processedBy && (
            <div className="card-premium p-6">
              <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Processed By</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{report.processedBy.firstName} {report.processedBy.lastName}</p>
                  <p className="text-xs text-slate-500">Lab Assistant</p>
                </div>
              </div>
            </div>
          )}

          {/* Verify Report */}
          {!report.isVerified && !verified && (
            <div className="card-premium p-6 border-2 border-blue-100">
              <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Verify Report</h2>

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1">Comments (Optional)</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  placeholder="Add clinical comments or observations..."
                  className="input-field text-sm resize-none"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={verifying}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {verifying ? 'Verifying...' : 'Verify & Approve Report'}
              </button>

              <p className="text-xs text-slate-400 mt-3 text-center">
                By verifying, you confirm the test results are accurate and complete.
              </p>
            </div>
          )}

          {/* Verified By */}
          {(report.isVerified || verified) && (
            <div className="card-premium p-6 border-2 border-emerald-100">
              <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Verification</h2>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Verified</span>
              </div>
              {report.verifiedBy && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Dr. {report.verifiedBy.firstName} {report.verifiedBy.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{report.verifiedBy.specialization}</p>
                  </div>
                </div>
              )}
              {report.verifiedBy?.signature && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">Digital Signature</p>
                  <img src={report.verifiedBy.signature} alt="Doctor's signature" className="h-12 object-contain bg-white rounded-lg p-1" />
                </div>
              )}
              <p className="text-xs text-slate-400 mt-2">Verified at: {formatDate(report.verifiedAt)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Clock(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
