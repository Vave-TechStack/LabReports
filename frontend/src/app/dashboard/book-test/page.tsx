'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Clock, MapPin, CreditCard, ArrowRight, 
  ArrowLeft, Check, Loader2, FlaskConical, Home, Building2, 
  ChevronDown, X, ShoppingCart, Trash2 
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Test {
  id: string;
  name: string;
  code: string;
  price: number;
  discountPrice: number | null;
  category: { name: string };
}

const steps = ['Select Tests', 'Appointment Details', 'Review & Pay'];

export default function BookTestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState<Test[]>([]);
  const [appointmentType, setAppointmentType] = useState<'AT_CLINIC' | 'HOME_COLLECTION'>('AT_CLINIC');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await apiService.tests.getAll({ limit: 100 });
        setTests(res.data?.data || []);
      } catch {
        setTests([
          { id: 't1', name: 'Complete Blood Count (CBC)', code: 'CBC', price: 500, discountPrice: 350, category: { name: 'Complete Blood Count' } },
          { id: 't2', name: 'Thyroid Profile (T3, T4, TSH)', code: 'THYROID', price: 800, discountPrice: 599, category: { name: 'Thyroid' } },
          { id: 't3', name: 'Fasting Blood Sugar (FBS)', code: 'FBS', price: 150, discountPrice: 100, category: { name: 'Diabetes' } },
          { id: 't4', name: 'HbA1c', code: 'HBA1C', price: 600, discountPrice: 450, category: { name: 'Diabetes' } },
          { id: 't5', name: 'Lipid Profile', code: 'LIPID', price: 550, discountPrice: 399, category: { name: 'Lipid Profile' } },
          { id: 't6', name: 'Liver Function Test (LFT)', code: 'LFT', price: 600, discountPrice: 450, category: { name: 'Liver Function' } },
          { id: 't7', name: 'Kidney Function Test (KFT)', code: 'KFT', price: 500, discountPrice: 380, category: { name: 'Kidney Function' } },
          { id: 't8', name: 'Vitamin D Test', code: 'VITD', price: 1200, discountPrice: 899, category: { name: 'Vitamin & Minerals' } },
          { id: 't9', name: 'Vitamin B12 Test', code: 'VITB12', price: 1000, discountPrice: 750, category: { name: 'Vitamin & Minerals' } },
          { id: 't10', name: 'Dengue Test (NS1)', code: 'DENGUE', price: 800, discountPrice: 599, category: { name: 'Infectious Diseases' } },
          { id: 't11', name: 'Urine Routine Analysis', code: 'URINE', price: 200, discountPrice: 150, category: { name: 'Complete Blood Count' } },
          { id: 't12', name: 'Malaria Test', code: 'MALARIA', price: 350, discountPrice: 250, category: { name: 'Infectious Diseases' } },
        ]);
      }
      setLoading(false);
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTest = (test: Test) => {
    setSelectedTests(prev =>
      prev.find(t => t.id === test.id)
        ? prev.filter(t => t.id !== test.id)
        : [...prev, test]
    );
  };

  const totalAmount = selectedTests.reduce((sum, t) => sum + (t.discountPrice || t.price), 0);
  const savings = selectedTests.reduce((sum, t) => sum + (t.price - (t.discountPrice || t.price)), 0);
  const minDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (selectedTests.length === 0) return;
    if (!appointmentDate || !appointmentTime) return;
    if (appointmentType === 'HOME_COLLECTION' && !address) return;

    setSubmitting(true);
    setError('');
    try {
      const response = await apiService.bookings.create({
        testIds: selectedTests.map(t => t.id),
        type: appointmentType,
        appointmentDate,
        appointmentTime,
        address: appointmentType === 'HOME_COLLECTION' ? address : undefined,
        notes,
      });

      if (response.data.success) {
        const bookingId = response.data.data.id;
        // Create payment order
        const paymentRes = await apiService.payments.createOrder({
          bookingId,
          gateway: 'RAZORPAY',
        });

        if (paymentRes.data.success) {
          router.push(`/dashboard/bookings/${bookingId}?payment=true`);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Book a Test</h1>
        <p className="text-slate-500 mt-1">Schedule your lab tests in just a few steps.</p>
      </motion.div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 ${index <= currentStep ? 'text-primary-600' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                index < currentStep ? 'bg-primary-600 text-white' :
                index === currentStep ? 'bg-primary-50 text-primary-700 border-2 border-primary-500' :
                'bg-gray-100 text-gray-400'
              }`}>
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-sm font-medium hidden md:inline">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 ${index < currentStep ? 'bg-primary-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Select Tests */}
        {currentStep === 0 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-premium p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Selected Tests Summary */}
            {selectedTests.length > 0 && (
              <div className="bg-primary-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-700">{selectedTests.length} test(s) selected</span>
                  <span className="text-sm font-bold text-primary-700">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTests.map(t => (
                    <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-primary-700">
                      {t.name}
                      <button onClick={() => toggleTest(t)} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tests List */}
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50">
                  <div className="skeleton w-5 h-5 rounded" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-3/4 mb-2" />
                    <div className="skeleton h-3 w-1/4" />
                  </div>
                </div>
              ))
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-1">
                {filteredTests.map((test) => {
                  const isSelected = selectedTests.find(t => t.id === test.id);
                  return (
                    <button
                      key={test.id}
                      onClick={() => toggleTest(test)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                        isSelected ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{test.name}</p>
                        <p className="text-xs text-slate-500">{test.category?.name} • {test.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{formatCurrency(test.discountPrice || test.price)}</p>
                        {test.discountPrice && (
                          <p className="text-xs text-slate-400 line-through">{formatCurrency(test.price)}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep(1)}
                disabled={selectedTests.length === 0}
                className="btn-primary flex items-center gap-2"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Appointment Details */}
        {currentStep === 1 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-6">Appointment Details</h2>

            {/* Appointment Type */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setAppointmentType('AT_CLINIC')}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  appointmentType === 'AT_CLINIC' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className={`w-8 h-8 mx-auto mb-2 ${appointmentType === 'AT_CLINIC' ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-slate-900">Visit Lab</p>
                <p className="text-xs text-slate-500 mt-1">Come to our collection center</p>
              </button>
              <button
                onClick={() => setAppointmentType('HOME_COLLECTION')}
                className={`p-5 rounded-xl border-2 text-center transition-all ${
                  appointmentType === 'HOME_COLLECTION' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Home className={`w-8 h-8 mx-auto mb-2 ${appointmentType === 'HOME_COLLECTION' ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-slate-900">Home Collection</p>
                <p className="text-xs text-slate-500 mt-1">Free collection at your door</p>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1" /> Appointment Date
                </label>
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} min={minDate} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Clock className="w-4 h-4 inline mr-1" /> Appointment Time
                </label>
                <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="input-field">
                  <option value="">Select time</option>
                  {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                    <option key={t} value={t}>{t}:00</option>
                  ))}
                </select>
              </div>
            </div>

            {appointmentType === 'HOME_COLLECTION' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <MapPin className="w-4 h-4 inline mr-1" /> Home Collection Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete address for home collection"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes..."
                rows={2}
                className="input-field resize-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(0)} className="btn-outline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!appointmentDate || !appointmentTime || (appointmentType === 'HOME_COLLECTION' && !address)}
                className="btn-primary flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Pay */}
        {currentStep === 2 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-6">Review & Confirm</h2>

            {/* Selected Tests */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-slate-700">Selected Tests</h3>
              {selectedTests.map(test => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{test.name}</p>
                    <p className="text-xs text-slate-500">{test.code}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(test.discountPrice || test.price)}</p>
                </div>
              ))}
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-slate-500">Type</p>
                <p className="text-sm font-medium text-slate-900">{appointmentType === 'AT_CLINIC' ? 'Visit Lab' : 'Home Collection'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-sm font-medium text-slate-900">{appointmentDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Time</p>
                <p className="text-sm font-medium text-slate-900">{appointmentTime}:00</p>
              </div>
              {appointmentType === 'HOME_COLLECTION' && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm font-medium text-slate-900">{address}</p>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-100 pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">{formatCurrency(totalAmount + savings)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-{formatCurrency(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                  <span className="text-slate-900">Total</span>
                  <span className="text-primary-700">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button onClick={() => setCurrentStep(1)} className="btn-outline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {submitting ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
