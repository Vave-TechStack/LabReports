'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, Calendar, Clock, MapPin, ArrowRight,
  ArrowLeft, Check, Loader2, FlaskConical, Home, Building2,
  ChevronDown, X, ShoppingCart, Star, Shield,
  Phone, Mail, User, Users, Activity, Heart, Brain, Droplets,
  Beaker, TrendingUp, CheckCircle, Clock3, Printer,
  Award, Sparkles, Syringe,  Stethoscope
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// --- DUMMY DATA matching the tests page test IDs ---
const allTests = [
  { id: 'CBC', name: 'Complete Blood Count (CBC)', price: 500, discountPrice: 350, reportTime: '6 hours', sampleType: 'Blood', category: 'cbc' },
  { id: 'HEMOGLOBIN', name: 'Hemoglobin Test', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', category: 'cbc' },
  { id: 'WBC', name: 'WBC Count', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', category: 'cbc' },
  { id: 'PLATELET', name: 'Platelet Count', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', category: 'cbc' },
  { id: 'FBS', name: 'Fasting Blood Sugar (FBS)', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', category: 'diabetes' },
  { id: 'HBA1C', name: 'HbA1c', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'Blood', category: 'diabetes' },
  { id: 'RBS', name: 'Random Blood Sugar', price: 120, discountPrice: 80, reportTime: '6 hours', sampleType: 'Blood', category: 'diabetes' },
  { id: 'GTT', name: 'Glucose Tolerance Test (GTT)', price: 400, discountPrice: 299, reportTime: '24 hours', sampleType: 'Blood', category: 'diabetes' },
  { id: 'THYROID', name: 'Thyroid Profile (T3, T4, TSH)', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'Blood', category: 'thyroid' },
  { id: 'TSH', name: 'TSH', price: 350, discountPrice: 250, reportTime: '12 hours', sampleType: 'Blood', category: 'thyroid' },
  { id: 'T3', name: 'Free T3', price: 400, discountPrice: 299, reportTime: '12 hours', sampleType: 'Blood', category: 'thyroid' },
  { id: 'T4', name: 'Free T4', price: 400, discountPrice: 299, reportTime: '12 hours', sampleType: 'Blood', category: 'thyroid' },
  { id: 'LIPID', name: 'Lipid Profile', price: 550, discountPrice: 399, reportTime: '12 hours', sampleType: 'Blood', category: 'lipid' },
  { id: 'LDL', name: 'LDL Cholesterol', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', category: 'lipid' },
  { id: 'HDL', name: 'HDL Cholesterol', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', category: 'lipid' },
  { id: 'VLDL', name: 'VLDL & Triglycerides', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', category: 'lipid' },
  { id: 'LFT', name: 'Liver Function Test (LFT)', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'Blood', category: 'liver' },
  { id: 'BILIRUBIN', name: 'Bilirubin Test', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', category: 'liver' },
  { id: 'SGOT', name: 'SGOT/AST', price: 180, discountPrice: 130, reportTime: '6 hours', sampleType: 'Blood', category: 'liver' },
  { id: 'SGPT', name: 'SGPT/ALT', price: 180, discountPrice: 130, reportTime: '6 hours', sampleType: 'Blood', category: 'liver' },
  { id: 'KFT', name: 'Kidney Function Test (KFT)', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'Blood', category: 'kidney' },
  { id: 'CREATININE', name: 'Serum Creatinine', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', category: 'kidney' },
  { id: 'BUN', name: 'Blood Urea Nitrogen (BUN)', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', category: 'kidney' },
  { id: 'URICACID', name: 'Uric Acid', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', category: 'kidney' },
  { id: 'VITD', name: 'Vitamin D (25-OH)', price: 1200, discountPrice: 899, reportTime: '24 hours', sampleType: 'Blood', category: 'vitamin' },
  { id: 'VITB12', name: 'Vitamin B12', price: 1000, discountPrice: 750, reportTime: '24 hours', sampleType: 'Blood', category: 'vitamin' },
  { id: 'FERRITIN', name: 'Ferritin', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'Blood', category: 'vitamin' },
  { id: 'CALCIUM', name: 'Serum Calcium', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', category: 'vitamin' },
  { id: 'URINE', name: 'Urine Routine Analysis', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Urine', category: 'cbc' },
  { id: 'DENGUE', name: 'Dengue Test (NS1)', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'Blood', category: 'infection' },
  { id: 'MALARIA', name: 'Malaria Test', price: 350, discountPrice: 250, reportTime: '6 hours', sampleType: 'Blood', category: 'infection' },
  { id: 'WIDAL', name: 'Widal Test (Typhoid)', price: 300, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', category: 'infection' },
  { id: 'CRP', name: 'CRP (C-Reactive Protein)', price: 400, discountPrice: 299, reportTime: '6 hours', sampleType: 'Blood', category: 'infection' },
  { id: 'ESR', name: 'ESR', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', category: 'cbc' },
];

const packages = [
  { id: 'basic-health-checkup', name: 'Basic Health Checkup', price: 1500, discountPrice: 999, tests: 3 },
  { id: 'comprehensive-full-body-checkup', name: 'Comprehensive Full Body Checkup', price: 4000, discountPrice: 2499, tests: 7 },
  { id: 'diabetes-care-package', name: 'Diabetes Care Package', price: 2500, discountPrice: 1799, tests: 4 },
  { id: 'heart-health-package', name: 'Heart Health Package', price: 3000, discountPrice: 1999, tests: 5 },
  { id: 'women-wellness-package', name: 'Women Wellness Package', price: 3500, discountPrice: 2499, tests: 5 },
  { id: 'senior-citizen-checkup', name: 'Senior Citizen Checkup', price: 5000, discountPrice: 3499, tests: 8 },
  { id: 'child-health-package', name: 'Child Health Package', price: 2000, discountPrice: 1499, tests: 4 },
  { id: 'liver-kidney-package', name: 'Liver & Kidney Health Package', price: 2200, discountPrice: 1599, tests: 4 },
  { id: 'thyroid-vitamin-package', name: 'Thyroid & Vitamin Package', price: 2800, discountPrice: 1999, tests: 4 },
];

const doctors = [
  { id: '1', firstName: 'Venkatesh', lastName: 'Murthy', specialization: 'pathology' },
  { id: '2', firstName: 'Sunita', lastName: 'Reddy', specialization: 'microbiology' },
  { id: '3', firstName: 'Arjun', lastName: 'Mehta', specialization: 'hematology' },
  { id: '4', firstName: 'Priya', lastName: 'Sharma', specialization: 'biochemistry' },
  { id: '5', firstName: 'Rajesh', lastName: 'Kumar', specialization: 'immunology' },
  { id: '6', firstName: 'Ananya', lastName: 'Patel', specialization: 'pathology' },
  { id: '7', firstName: 'Suresh', lastName: 'Reddy', specialization: 'cardiology' },
  { id: '8', firstName: 'Lakshmi', lastName: 'Devi', specialization: 'neurology' },
  { id: '9', firstName: 'Manoj', lastName: 'Gupta', specialization: 'gastroenterology' },
  { id: '10', firstName: 'Divya', lastName: 'Nair', specialization: 'radiology' },
  { id: '11', firstName: 'Rahul', lastName: 'Verma', specialization: 'pathology' },
  { id: '12', firstName: 'Kavita', lastName: 'Singh', specialization: 'microbiology' },
];

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const branches = [
  { name: 'MediLab - Main Lab', address: '42, Tech Park Boulevard, Whitefield, Bangalore', distance: '0 km' },
  { name: 'MediLab - Koramangala', address: '123, 80 Feet Road, Koramangala, Bangalore', distance: '8.2 km' },
  { name: 'MediLab - HSR Layout', address: '45, Sector 3, HSR Layout, Bangalore', distance: '12.5 km' },
  { name: 'MediLab - Indiranagar', address: '78, Double Road, Indiranagar, Bangalore', distance: '6.8 km' },
  { name: 'MediLab - Marathahalli', address: '56, Outer Ring Road, Marathahalli, Bangalore', distance: '15.3 km' },
];

function BookTestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-selected items from query params
  const [preselectedTest, setPreselectedTest] = useState<any>(null);
  const [preselectedPackage, setPreselectedPackage] = useState<any>(null);
  const [preselectedDoctor, setPreselectedDoctor] = useState<any>(null);

  // Step 1: Test Selection
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Step 2: Personal Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  // Step 3: Appointment
  const [appointmentType, setAppointmentType] = useState<'AT_CLINIC' | 'HOME_COLLECTION'>('AT_CLINIC');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [homeAddress, setHomeAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  // Parse query params on mount
  useEffect(() => {
    const testId = searchParams.get('test');
    const pkgId = searchParams.get('package');
    const docId = searchParams.get('doctor');

    if (testId) {
      const found = allTests.find(t => t.id === testId);
      if (found) {
        setPreselectedTest(found);
        setSelectedTests([found]);
      }
    }
    if (pkgId) {
      // Match package IDs - try exact first, then partial
      const pkg = packages.find(p => p.id === pkgId || p.id.includes(pkgId) || pkgId.includes(p.id));
      if (pkg) {
        setPreselectedPackage(pkg);
        setSelectedPackage(pkg);
      }
    }
    if (docId) {
      const found = doctors.find((d: any) => d.id === docId);
      if (found) setPreselectedDoctor(found);
    }
  }, [searchParams]);

  const filteredTests = allTests.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const testTotal = selectedTests.reduce((s, t) => s + (t.discountPrice || t.price), 0);
  const pkgPrice = selectedPackage ? (selectedPackage.discountPrice || selectedPackage.price) : 0;
  const savings = selectedTests.reduce((s, t) => s + (t.price - (t.discountPrice || t.price)), 0) +
    (selectedPackage ? (selectedPackage.price - (selectedPackage.discountPrice || selectedPackage.price)) : 0);
  const totalAmount = testTotal + pkgPrice;

  const toggleTest = (test: any) => {
    if (selectedPackage) setSelectedPackage(null);
    setSelectedTests(prev =>
      prev.find(t => t.id === test.id)
        ? prev.filter(t => t.id !== test.id)
        : [...prev, test]
    );
  };

  const minDate = new Date().toISOString().split('T')[0];

  const canNextStep1 = selectedTests.length > 0 || selectedPackage !== null;
  const canNextStep2 = name && email && phone;
  const canNextStep3 = appointmentDate && appointmentTime &&
    (appointmentType === 'AT_CLINIC' || (appointmentType === 'HOME_COLLECTION' && homeAddress));

  const steps = [
    { label: 'Select', icon: Beaker },
    { label: 'Details', icon: User },
    { label: 'Appointment', icon: Calendar },
    { label: 'Confirm', icon: CheckCircle },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 2000));
      const booking = {
        bookingNumber: `ML-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`,
        patient: { name, email, phone, gender, age },
        tests: selectedTests.map(t => ({ name: t.name, price: t.discountPrice || t.price })),
        package: selectedPackage ? { name: selectedPackage.name, price: selectedPackage.discountPrice || selectedPackage.price } : null,
        doctor: preselectedDoctor ? `Dr. ${preselectedDoctor.firstName} ${preselectedDoctor.lastName}` : null,
        type: appointmentType, date: appointmentDate, time: appointmentTime,
        branch: appointmentType === 'AT_CLINIC' ? selectedBranch.name : null,
        address: appointmentType === 'HOME_COLLECTION' ? homeAddress : null,
        totalAmount, savings, status: 'CONFIRMED', createdAt: new Date().toISOString(),
      };
      setBookingData(booking);
      setBookingConfirmed(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  // SUCCESS VIEW
  if (bookingConfirmed && bookingData) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="container-premium py-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
            <div className="card-premium p-8 text-center border-2 border-emerald-100">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" /> Booking Confirmed
              </div>
              <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Test Booked Successfully!</h1>
              <p className="text-slate-500 mb-8">
                Reference:{' '}<span className="font-bold text-primary-700 font-mono text-lg">{bookingData.bookingNumber}</span>
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-slate-500">Patient</p><p className="font-medium">{bookingData.patient.name}</p></div>
                  <div><p className="text-xs text-slate-500">Contact</p><p className="font-medium">{bookingData.patient.phone}</p></div>
                  <div><p className="text-xs text-slate-500">Date</p><p className="font-medium">{bookingData.date}</p></div>
                  <div><p className="text-xs text-slate-500">Time</p><p className="font-medium">{bookingData.time}:00</p></div>
                  <div><p className="text-xs text-slate-500">Type</p><p className="font-medium">{bookingData.type === 'AT_CLINIC' ? 'Visit Lab' : 'Home Collection'}</p></div>
                  <div><p className="text-xs text-slate-500">Total</p><p className="font-bold text-primary-700">{formatCurrency(bookingData.totalAmount)}</p></div>
                </div>
                {bookingData.doctor && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-slate-500">Doctor</p>
                    <p className="font-medium text-slate-900">{bookingData.doctor}</p>
                  </div>
                )}
                {(bookingData.tests.length > 0 || bookingData.package) && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-slate-500 mb-2">Items</p>
                    <div className="flex flex-wrap gap-2">
                      {bookingData.package && <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">📦 {bookingData.package.name}</span>}
                      {bookingData.tests.map((t: any, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">{t.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left text-sm text-amber-800">
                <p className="font-medium mb-1">📋 Important Instructions</p>
                <ul className="space-y-1 text-xs">
                  <li>• Please fast for 8-12 hours before your appointment (if blood sugar / lipid tests are booked)</li>
                  <li>• Carry a valid ID proof at the time of visit</li>
                  <li>• Results will be available within 6-24 hours after sample collection</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/" className="btn-outline flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Go to Home</Link>
                <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2"><Printer className="w-4 h-4" /> Print</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-[400px] h-[400px] bg-white/20 rounded-full bottom-0 -left-20 blur-3xl" />
        </div>
        <div className="container-premium relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Book Your Test</h1>
            <p className="text-white/80 text-lg">Schedule your lab tests in just a few steps. No login required.</p>
            {preselectedDoctor && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">
                <Stethoscope className="w-4 h-4" /> Referred by Dr. {preselectedDoctor.firstName} {preselectedDoctor.lastName}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            {/* Steps */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="flex items-center justify-between">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        i < currentStep ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                        i === currentStep ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-100' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {i < currentStep ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                      </div>
                      <span className={`text-xs font-medium mt-1.5 hidden sm:block ${i <= currentStep ? 'text-slate-900' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-3 mt-[-1.5rem] ${i < currentStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <X className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: Select Tests */}
              {currentStep === 0 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                  {preselectedPackage ? (
                    <div className="card-premium p-8 text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-purple-600" />
                      </div>
                      <h2 className="text-xl font-heading font-semibold text-slate-900 mb-2">{preselectedPackage.name}</h2>
                      <p className="text-slate-500 mb-4">Includes {preselectedPackage.tests} tests</p>
                      <div className="flex items-baseline justify-center gap-2 mb-6">
                        <span className="text-3xl font-bold text-slate-900">{formatCurrency(preselectedPackage.discountPrice)}</span>
                        <span className="text-sm text-slate-400 line-through">{formatCurrency(preselectedPackage.price)}</span>
                      </div>
                      <button onClick={() => setCurrentStep(1)} className="btn-primary px-8">Proceed to Booking</button>
                    </div>
                  ) : (
                    <>
                      {/* Search */}
                      <div className="card-premium p-6 mb-6">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="text" placeholder="Search tests by name or code..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-12 py-3.5" />
                        </div>
                      </div>

                      {/* Selected summary */}
                      {selectedTests.length > 0 && (
                        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-primary-700"><ShoppingCart className="w-4 h-4 inline mr-1.5" />{selectedTests.length} test(s)</span>
                            <span className="text-lg font-bold text-primary-700">{formatCurrency(testTotal)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedTests.map(t => (
                              <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-primary-700 border border-primary-100">
                                {t.name}
                                <button onClick={() => toggleTest(t)} className="hover:text-red-500 ml-0.5"><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tests list */}
                      <div className="card-premium p-6">
                        <h3 className="font-heading font-semibold text-slate-900 mb-4">Available Tests <span className="text-sm font-normal text-slate-400">({filteredTests.length})</span></h3>
                        <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1">
                          {filteredTests.map((test) => {
                            const isSelected = selectedTests.find(t => t.id === test.id);
                            return (
                              <button key={test.id} onClick={() => toggleTest(test)}
                                className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all text-left border ${
                                  isSelected ? 'bg-primary-50 border-primary-200' : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                                }`}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'
                                }`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
                                <div className="flex-1 min-w-0 text-left">
                                  <p className="text-sm font-medium text-slate-900 truncate">{test.name}</p>
                                  <p className="text-xs text-slate-500">{test.id} • {test.sampleType} • {test.reportTime}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-bold text-slate-900">{formatCurrency(test.discountPrice)}</p>
                                  {test.discountPrice < test.price && <p className="text-xs text-slate-400 line-through">{formatCurrency(test.price)}</p>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                    <button onClick={() => setCurrentStep(1)} disabled={!canNextStep1} className="btn-primary flex items-center gap-2 px-8">
                      Next: Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Personal Details */}
              {currentStep === 1 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
                  className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" /> Your Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="input-field pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="input-field pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Your age" min={1} max={150} className="input-field" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    <button onClick={() => setCurrentStep(0)} className="btn-outline flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button onClick={() => setCurrentStep(2)} disabled={!canNextStep2} className="btn-primary flex items-center gap-2 px-8">
                      Next: Appointment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Appointment */}
              {currentStep === 2 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
                  className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" /> Appointment Details
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button onClick={() => setAppointmentType('AT_CLINIC')}
                      className={`p-5 rounded-xl border-2 text-center transition-all ${appointmentType === 'AT_CLINIC' ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                      <Building2 className={`w-8 h-8 mx-auto mb-2 ${appointmentType === 'AT_CLINIC' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-slate-900">Visit Lab</p>
                      <p className="text-xs text-slate-500">Come to our center</p>
                    </button>
                    <button onClick={() => setAppointmentType('HOME_COLLECTION')}
                      className={`p-5 rounded-xl border-2 text-center transition-all ${appointmentType === 'HOME_COLLECTION' ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                      <Home className={`w-8 h-8 mx-auto mb-2 ${appointmentType === 'HOME_COLLECTION' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-slate-900">Home Collection</p>
                      <p className="text-xs text-slate-500">Free at your door</p>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5"><Calendar className="w-4 h-4 inline mr-1" /> Date *</label>
                      <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} min={minDate} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5"><Clock className="w-4 h-4 inline mr-1" /> Time *</label>
                      <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="input-field">
                        <option value="">Select time</option>
                        {timeSlots.map(t => <option key={t} value={t}>{t}:00</option>)}
                      </select>
                    </div>
                  </div>

                  {appointmentType === 'AT_CLINIC' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-3"><Building2 className="w-4 h-4 inline mr-1" /> Center</label>
                      {branches.map(b => (
                        <button key={b.name} onClick={() => setSelectedBranch(b)}
                          className={`w-full text-left p-3 rounded-xl border-2 mb-2 transition-all ${selectedBranch.name === b.name ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                          <p className="text-sm font-medium text-slate-900">{b.name}</p>
                          <p className="text-xs text-slate-500">{b.address} • {b.distance}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {appointmentType === 'HOME_COLLECTION' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5"><MapPin className="w-4 h-4 inline mr-1" /> Home Address *</label>
                      <textarea value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} rows={3} className="input-field resize-none" placeholder="Enter your complete address with landmark" />
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (Optional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field resize-none" placeholder="Any special instructions..." />
                  </div>

                  <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button onClick={() => setCurrentStep(1)} className="btn-outline flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button onClick={() => setCurrentStep(3)} disabled={!canNextStep3} className="btn-primary flex items-center gap-2 px-8">
                      Review <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Review & Confirm */}
              {currentStep === 3 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
                  className="card-premium p-6 md:p-8">
                  <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-600" /> Review & Confirm
                  </h2>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-3"><FlaskConical className="w-4 h-4 inline mr-1.5 text-primary-600" />Items</h3>
                    {selectedPackage && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl mb-2 border border-purple-100">
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-purple-600" />
                          <p className="text-sm font-medium text-slate-900">{selectedPackage.name}</p>
                        </div>
                        <p className="text-sm font-bold">{formatCurrency(pkgPrice)}</p>
                      </div>
                    )}
                    {selectedTests.map(test => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-white rounded-xl mb-1">
                        <p className="text-sm font-medium text-slate-900">{test.name}</p>
                        <p className="text-sm font-bold">{formatCurrency(test.discountPrice)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                    <div><p className="text-xs text-slate-500">Name</p><p className="text-sm font-medium">{name}</p></div>
                    <div><p className="text-xs text-slate-500">Email</p><p className="text-sm font-medium">{email}</p></div>
                    <div><p className="text-xs text-slate-500">Phone</p><p className="text-sm font-medium">{phone}</p></div>
                    <div><p className="text-xs text-slate-500">Date/Time</p><p className="text-sm font-medium">{appointmentDate} {appointmentTime}:00</p></div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span>{formatCurrency(totalAmount + savings)}</span></div>
                      {savings > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-600">Savings</span><span className="text-emerald-600">-{formatCurrency(savings)}</span></div>}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span>Total</span><span className="text-primary-700">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button onClick={() => setCurrentStep(2)} className="btn-outline flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-2 px-8 min-w-[180px] justify-center">
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : <><CheckCircle className="w-4 h-4" /> Confirm</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BookTestPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading booking page...</p>
        </div>
      </div>
    }>
      <BookTestContent />
    </Suspense>
  );
}
