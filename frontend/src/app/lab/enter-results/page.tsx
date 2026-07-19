'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ClipboardCheck, Loader2, CheckCircle, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function EnterResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [parameters, setParameters] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = bookings.filter((b: any) =>
    b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
    `${b.patient?.firstName} ${b.patient?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectBooking = (booking: any) => {
    setSelectedBooking(booking);
    // Initialize parameters from test definitions
    const params: any[] = [];
    booking.bookingTests?.forEach((bt: any) => {
      const testParams = bt.test?.parameters;
      if (Array.isArray(testParams) && testParams.length > 0) {
        testParams.forEach((tp: any) => {
          params.push({
            testId: bt.test.id,
            testName: bt.test.name,
            parameterName: tp.name || tp.parameterName || '',
            unit: tp.unit || '',
            referenceRange: tp.referenceRange || '',
            value: '',
            isAbnormal: false,
          });
        });
      } else {
        // No predefined parameters, add a default one
        params.push({
          testId: bt.test.id,
          testName: bt.test.name,
          parameterName: '',
          unit: '',
          referenceRange: '',
          value: '',
          isAbnormal: false,
        });
      }
    });
    setParameters(params.length > 0 ? params : [{ testId: '', testName: 'Result', parameterName: 'Value', unit: '', referenceRange: '', value: '', isAbnormal: false }]);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.lab.getPendingReports({ limit: 50 });
        const data = res.data?.data || [];
        setBookings(data);
        const bookingId = searchParams.get('booking');
        if (bookingId) {
          const found = data.find((b: any) => b.id === bookingId);
          if (found) selectBooking(found);
        }
      } catch {
        const demo = [
          {
            id: 'b1', bookingNumber: 'ML-2024-10892',
            patient: { firstName: 'Ravi', lastName: 'Kumar' },
            bookingTests: [{
              test: {
                id: 't1', name: 'Complete Blood Count (CBC)',
                parameters: [
                  { name: 'Hemoglobin', unit: 'g/dL', referenceRange: '13-17', minValue: 13, maxValue: 17 },
                  { name: 'WBC Count', unit: 'cells/\u00B5L', referenceRange: '4000-11000', minValue: 4000, maxValue: 11000 },
                  { name: 'RBC Count', unit: 'M/\u00B5L', referenceRange: '4.5-5.5', minValue: 4.5, maxValue: 5.5 },
                ],
              },
            }],
          },
          {
            id: 'b2', bookingNumber: 'ML-2024-10891',
            patient: { firstName: 'Priya', lastName: 'Sharma' },
            bookingTests: [{
              test: {
                id: 't2', name: 'Thyroid Profile',
                parameters: [
                  { name: 'TSH', unit: 'mIU/L', referenceRange: '0.5-5.0', minValue: 0.5, maxValue: 5.0 },
                  { name: 'T3', unit: 'ng/dL', referenceRange: '80-200', minValue: 80, maxValue: 200 },
                  { name: 'T4', unit: '\u00B5g/dL', referenceRange: '5-12', minValue: 5, maxValue: 12 },
                ],
              },
            }],
          },
          {
            id: 'b3', bookingNumber: 'ML-2024-10890',
            patient: { firstName: 'Amit', lastName: 'Patel' },
            bookingTests: [{
              test: {
                id: 't3', name: 'Lipid Profile',
                parameters: [
                  { name: 'Total Cholesterol', unit: 'mg/dL', referenceRange: '200', minValue: 0, maxValue: 200 },
                  { name: 'HDL', unit: 'mg/dL', referenceRange: '40', minValue: 40, maxValue: 100 },
                  { name: 'LDL', unit: 'mg/dL', referenceRange: '130', minValue: 0, maxValue: 130 },
                  { name: 'Triglycerides', unit: 'mg/dL', referenceRange: '150', minValue: 0, maxValue: 150 },
                ],
              },
            }],
          },
          {
            id: 'b4', bookingNumber: 'ML-2024-10889',
            patient: { firstName: 'Sunita', lastName: 'Reddy' },
            bookingTests: [{
              test: {
                id: 't4', name: 'Fasting Blood Sugar',
                parameters: [
                  { name: 'FBS', unit: 'mg/dL', referenceRange: '70-100', minValue: 70, maxValue: 100 },
                ],
              },
            }],
          },
        ];
        setBookings(demo);
        const bookingId = searchParams.get('booking');
        if (bookingId) {
          const found = demo.find((b: any) => b.id === bookingId);
          if (found) selectBooking(found);
        }
      }
      setLoading(false);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateParam = (index: number, field: string, value: any) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-detect abnormal based on reference ranges if numeric
    if ((field === 'value' || field === 'referenceRange') && updated[index].minValue && updated[index].maxValue) {
      const val = parseFloat(updated[index].value);
      if (!isNaN(val)) {
        updated[index].isAbnormal = val < updated[index].minValue || val > updated[index].maxValue;
      }
    }
    setParameters(updated);
  };

  const addParameter = () => {
    setParameters([...parameters, { testId: selectedBooking?.bookingTests?.[0]?.test?.id || '', testName: '', parameterName: '', unit: '', referenceRange: '', value: '', isAbnormal: false }]);
  };

  const removeParameter = (index: number) => {
    if (parameters.length <= 1) return;
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await apiService.reports.create({
        bookingId: selectedBooking.id,
        parameters: parameters.map(p => ({
          testId: p.testId,
          parameterName: p.parameterName,
          value: p.value,
          unit: p.unit,
          referenceRange: p.referenceRange,
          isAbnormal: p.isAbnormal,
        })),
        notes,
      });
      if (res.data?.success) {
        setSubmitted(true);
        // Update status to DOCTOR_VERIFICATION happens server-side
      }
    } catch { /* */ }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">Results Submitted!</h2>
          <p className="text-slate-500 mb-6">Report has been sent for doctor verification.</p>
          <div className="flex gap-3">
            <button onClick={() => { setSubmitted(false); setSelectedBooking(null); setParameters([]); setNotes(''); setSearch(''); }} className="btn-outline flex-1">New Entry</button>
            <button onClick={() => router.push('/lab/pending-reports')} className="btn-primary flex-1">View Pending</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Enter Test Results</h1>
        <p className="text-slate-500 mt-1">Input test parameters and values for processing.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Selection */}
        <div className="card-premium p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-4">Select Booking</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 text-sm" />
          </div>
          <div className="max-h-[500px] overflow-y-auto space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-xl" />)
            ) : filtered.map((b: any) => (
              <button key={b.id} onClick={() => selectBooking(b)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  selectedBooking?.id === b.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'
                }`}>
                <p className="text-xs font-mono text-emerald-700 mb-1">{b.bookingNumber}</p>
                <p className="text-sm font-medium text-slate-900">{b.patient?.firstName} {b.patient?.lastName}</p>
                <p className="text-xs text-slate-500 truncate">
                  {b.bookingTests?.map((t: any) => t.test?.name).join(', ')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Results Form */}
        <div className="lg:col-span-2 card-premium p-6">
          {selectedBooking ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-semibold text-slate-900">Test Parameters</h3>
                  <p className="text-xs text-slate-500">{selectedBooking.patient?.firstName} {selectedBooking.patient?.lastName} — {selectedBooking.bookingNumber}</p>
                </div>
                <button onClick={addParameter} className="btn-outline !py-1.5 !px-3 text-sm flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 w-1/4">Parameter</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-20">Value</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-20">Unit</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-24">Reference Range</th>
                      <th className="text-center py-2 px-2 text-xs font-medium text-slate-500 w-16">Status</th>
                      <th className="text-center py-2 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param, index) => (
                      <tr key={index} className="border-b border-gray-50">
                        <td className="py-2 px-2">
                          <input type="text" value={param.parameterName} onChange={(e) => updateParam(index, 'parameterName', e.target.value)}
                            placeholder="Parameter name" className="input-field text-xs py-1.5" />
                        </td>
                        <td className="py-2 px-2">
                          <input type="text" value={param.value} onChange={(e) => updateParam(index, 'value', e.target.value)}
                            placeholder="Result" className={`input-field text-xs py-1.5 text-center font-semibold ${param.value && param.isAbnormal ? 'text-red-600' : ''}`} />
                        </td>
                        <td className="py-2 px-2">
                          <input type="text" value={param.unit} onChange={(e) => updateParam(index, 'unit', e.target.value)}
                            placeholder="Unit" className="input-field text-xs py-1.5 text-center" />
                        </td>
                        <td className="py-2 px-2">
                          <input type="text" value={param.referenceRange} onChange={(e) => updateParam(index, 'referenceRange', e.target.value)}
                            placeholder="Range" className="input-field text-xs py-1.5 text-center" />
                        </td>
                        <td className="py-2 px-2 text-center">
                          {param.value && (
                            <span className={`text-[10px] font-semibold ${param.isAbnormal ? 'text-red-600' : 'text-emerald-600'}`}>
                              {param.isAbnormal ? 'Abnormal' : 'Normal'}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button onClick={() => removeParameter(index)} className="p-1 hover:bg-red-50 rounded text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Clinical notes, observations..." className="input-field text-sm resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </>
          ) : (
            <div className="text-center py-16">
              <ClipboardCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-slate-500">Select a booking to enter results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
