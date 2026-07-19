'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, Calendar, Clock, MapPin, ArrowRight,
  ArrowLeft, Check, Loader2, FlaskConical, Home, Building2,
  ChevronDown, X, ShoppingCart, Star, Shield,
  Phone, Mail, User, Users, Activity, Heart, Brain, Droplets,
  Beaker, TrendingUp, CheckCircle, Clock3, Printer,
  Award, Sparkles, Syringe
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// --- Dummy Data ---
const categories = [
  { id: 'all', name: 'All Tests', icon: Beaker },
  { id: 'cbc', name: 'Complete Blood Count', icon: Droplets },
  { id: 'diabetes', name: 'Diabetes', icon: Activity },
  { id: 'thyroid', name: 'Thyroid', icon: Heart },
  { id: 'lipid', name: 'Lipid Profile', icon: Brain },
  { id: 'liver', name: 'Liver Function', icon: FlaskConical },
  { id: 'kidney', name: 'Kidney Function', icon: Shield },
  { id: 'vitamin', name: 'Vitamin & Minerals', icon: Star },
  { id: 'infection', name: 'Infectious Diseases', icon: Activity },
];

const allTests = [
  { id: 'CBC', name: 'Complete Blood Count (CBC)', category: 'cbc', price: 500, discountPrice: 350, reportTime: '6 hours', sampleType: 'Blood', parameters: '24 parameters', isPopular: true, description: 'Measures RBC, WBC, hemoglobin, and platelets.' },
  { id: 'HEMOGLOBIN', name: 'Hemoglobin Test', category: 'cbc', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', description: 'Measures hemoglobin levels to detect anemia.' },
  { id: 'FBS', name: 'Fasting Blood Sugar (FBS)', category: 'diabetes', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', isPopular: true, description: 'Measures blood glucose after 8-12 hours fasting.' },
  { id: 'HBA1C', name: 'HbA1c', category: 'diabetes', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Average blood sugar over 2-3 months.' },
  { id: 'RBS', name: 'Random Blood Sugar', category: 'diabetes', price: 120, discountPrice: 80, reportTime: '6 hours', sampleType: 'Blood', description: 'Random blood glucose measurement.' },
  { id: 'THYROID', name: 'Thyroid Profile (T3, T4, TSH)', category: 'thyroid', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Complete thyroid function assessment.' },
  { id: 'TSH', name: 'TSH', category: 'thyroid', price: 350, discountPrice: 250, reportTime: '12 hours', sampleType: 'Blood', description: 'Thyroid Stimulating Hormone.' },
  { id: 'LIPID', name: 'Lipid Profile', category: 'lipid', price: 550, discountPrice: 399, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Cholesterol and triglycerides.' },
  { id: 'LDL', name: 'LDL Cholesterol', category: 'lipid', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', description: 'Bad cholesterol.' },
  { id: 'HDL', name: 'HDL Cholesterol', category: 'lipid', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', description: 'Good cholesterol.' },
  { id: 'LFT', name: 'Liver Function Test (LFT)', category: 'liver', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Liver enzymes and bilirubin.' },
  { id: 'KFT', name: 'Kidney Function Test (KFT)', category: 'kidney', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Kidney filtration markers.' },
  { id: 'VITD', name: 'Vitamin D (25-OH)', category: 'vitamin', price: 1200, discountPrice: 899, reportTime: '24 hours', sampleType: 'Blood', isPopular: true, description: 'Vitamin D deficiency check.' },
  { id: 'VITB12', name: 'Vitamin B12', category: 'vitamin', price: 1000, discountPrice: 750, reportTime: '24 hours', sampleType: 'Blood', isPopular: true, description: 'Vitamin B12 levels.' },
  { id: 'URINE', name: 'Urine Routine Analysis', category: 'cbc', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Urine', description: 'Complete urine analysis.' },
  { id: 'DENGUE', name: 'Dengue Test (NS1)', category: 'infection', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Dengue virus detection.' },
  { id: 'MALARIA', name: 'Malaria Test', category: 'infection', price: 350, discountPrice: 250, reportTime: '6 hours', sampleType: 'Blood', description: 'Malaria parasite detection.' },
  { id: 'CRP', name: 'CRP (C-Reactive Protein)', category: 'infection', price: 400, discountPrice: 299, reportTime: '6 hours', sampleType: 'Blood', description: 'Inflammation marker.' },
  { id: 'FERRITIN', name: 'Ferritin', category: 'vitamin', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'Blood', description: 'Iron storage protein.' },
  { id: 'URICACID', name: 'Uric Acid', category: 'kidney', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', description: 'Uric acid for gout.' },
];

const healthPackages = [
  { id: 'basic', name: 'Basic Health Checkup', price: 1500, discountPrice: 999, savings: 33, tests: ['CBC', 'FBS', 'Urine Analysis'], icon: Heart, popular: false },
  { id: 'comprehensive', name: 'Comprehensive Full Body', price: 4000, discountPrice: 2499, savings: 38, tests: ['CBC', 'Thyroid', 'HbA1c', 'Lipid Profile', 'LFT', 'KFT', 'Urine'], icon: Activity, popular: true },
  { id: 'diabetes', name: 'Diabetes Care Package', price: 2500, discountPrice: 1799, savings: 28, tests: ['FBS', 'HbA1c', 'Lipid Profile', 'KFT'], icon: TrendingUp, popular: true },
  { id: 'heart', name: 'Heart Health Package', price: 3000, discountPrice: 1999, savings: 33, tests: ['Lipid Profile', 'LFT', 'KFT', 'CRP'], icon: Heart, popular: true },
  { id: 'thyroid', name: 'Thyroid & Vitamin', price: 2800, discountPrice: 1999, savings: 29, tests: ['Thyroid', 'Vitamin D', 'Vitamin B12', 'CBC'], icon: Activity, popular: false },
  { id: 'women', name: 'Women Wellness', price: 3500, discountPrice: 2499, savings: 29, tests: ['CBC', 'Thyroid', 'Vitamin D', 'Vitamin B12', 'Iron'], icon: Users, popular: false },
];

const timeSlots = [
  { value: '07:00', label: '7:00 AM - 8:00 AM' },
  { value: '08:00', label: '8:00 AM - 9:00 AM' },
  { value: '09:00', label: '9:00 AM - 10:00 AM' },
  { value: '10:00', label: '10:00 AM - 11:00 AM' },
  { value: '11:00', label: '11:00 AM - 12:00 PM' },
  { value: '12:00', label: '12:00 PM - 1:00 PM' },
  { value: '13:00', label: '1:00 PM - 2:00 PM' },
  { value: '14:00', label: '2:00 PM - 3:00 PM' },
  { value: '15:00', label: '3:00 PM - 4:00 PM' },
  { value: '16:00', label: '4:00 PM - 5:00 PM' },
  { value: '17:00', label: '5:00 PM - 6:00 PM' },
  { value: '18:00', label: '6:00 PM - 7:00 PM' },
  { value: '19:00', label: '7:00 PM - 8:00 PM' },
];

const branches = [
  { name: 'MediLab - Main Lab', address: '42, Tech Park Boulevard, Whitefield, Bangalore - 560066', distance: '0 km' },
  { name: 'MediLab - Koramangala', address: '123, 80 Feet Road, Koramangala, Bangalore', distance: '8.2 km' },
  { name: 'MediLab - HSR Layout', address: '45, Sector 3, HSR Layout, Bangalore', distance: '12.5 km' },
  { name: 'MediLab - Indiranagar', address: '78, Double Road, Indiranagar, Bangalore', distance: '6.8 km' },
  { name: 'MediLab - Marathahalli', address: '56, Outer Ring Road, Marathahalli, Bangalore', distance: '15.3 km' },
];

// --- Steps ---
const steps = [
  { label: 'Select Tests', icon: Beaker },
  { label: 'Your Details', icon: User },
  { label: 'Appointment', icon: Calendar },
  { label: 'Confirm', icon: CheckCircle },
];

// Main Component
export default function BookAppointmentPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Test Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPackageSelector, setShowPackageSelector] = useState(false);

  // Step 2: Personal Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Step 3: Appointment
  const [appointmentType, setAppointmentType] = useState<'AT_CLINIC' | 'HOME_COLLECTION'>('AT_CLINIC');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [homeAddress, setHomeAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Step 4: Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  // Filter tests
  const filteredTests = allTests.filter(t => {
    const matchCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Computed amounts
  const testTotal = selectedTests.reduce((s, t) => s + (t.discountPrice || t.price), 0);
  const packagePrice = selectedPackage ? (selectedPackage.discountPrice || selectedPackage.price) : 0;
  const savings = selectedTests.reduce((s, t) => s + (t.price - (t.discountPrice || t.price)), 0) +
    (selectedPackage ? (selectedPackage.price - (selectedPackage.discountPrice || selectedPackage.price)) : 0);
  const totalAmount = testTotal + packagePrice;

  const toggleTest = (test: any) => {
    if (selectedPackage) setSelectedPackage(null);
    setSelectedTests(prev =>
      prev.find(t => t.id === test.id)
        ? prev.filter(t => t.id !== test.id)
        : [...prev, test]
    );
  };

  const selectPackage = (pkg: any) => {
    setSelectedPackage(selectedPackage?.id === pkg.id ? null : pkg);
    setSelectedTests([]);
  };

  const minDate = new Date().toISOString().split('T')[0];

  const canProceedToStep2 = selectedTests.length > 0 || selectedPackage !== null;

  const canProceedToStep3 = name && email && phone;

  const canProceedToStep4 = appointmentDate && appointmentTime &&
    (appointmentType === 'AT_CLINIC' || (appointmentType === 'HOME_COLLECTION' && homeAddress));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    // Simulate API call with delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedBooking = {
        bookingNumber: `ML-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`,
        patient: { name, email, phone, gender, age },
        tests: selectedTests.map(t => ({ name: t.name, price: t.discountPrice || t.price })),
        package: selectedPackage ? { name: selectedPackage.name, price: selectedPackage.discountPrice || selectedPackage.price } : null,
        type: appointmentType,
        date: appointmentDate,
        time: appointmentTime,
        branch: appointmentType === 'AT_CLINIC' ? selectedBranch.name : null,
        address: appointmentType === 'HOME_COLLECTION' ? homeAddress : null,
        totalAmount,
        savings,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      setBookingData(generatedBooking);
      setBookingConfirmed(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  // --- SUCCESS VIEW ---
  if (bookingConfirmed && bookingData) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="container-premium py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card-premium p-8 text-center border-2 border-emerald-100">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" /> Booking Confirmed
              </div>
              <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">
                Appointment Booked Successfully!
              </h1>
              <p className="text-slate-500 mb-8">
                Your booking reference number is{' '}
                <span className="font-bold text-primary-700 font-mono text-lg">{bookingData.bookingNumber}</span>
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Patient Name</p>
                    <p className="font-medium text-slate-900">{bookingData.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Contact</p>
                    <p className="font-medium text-slate-900">{bookingData.patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="font-medium text-slate-900">{bookingData.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Time</p>
                    <p className="font-medium text-slate-900">{bookingData.time}:00</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Type</p>
                    <p className="font-medium text-slate-900">
                      {bookingData.type === 'AT_CLINIC' ? 'Visit Lab' : 'Home Collection'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Amount</p>
                    <p className="font-bold text-primary-700">{formatCurrency(bookingData.totalAmount)}</p>
                  </div>
                </div>
                {bookingData.type === 'AT_CLINIC' && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-slate-500 mb-1">Collection Center</p>
                    <p className="font-medium text-slate-900">{bookingData.branch}</p>
                  </div>
                )}
                {bookingData.type === 'HOME_COLLECTION' && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-slate-500 mb-1">Home Collection Address</p>
                    <p className="font-medium text-slate-900">{bookingData.address}</p>
                  </div>
                )}
                {(bookingData.tests.length > 0 || bookingData.package) && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-slate-500 mb-2">Tests Booked</p>
                    <div className="flex flex-wrap gap-2">
                      {bookingData.package && (
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                          📦 {bookingData.package.name}
                        </span>
                      )}
                      {bookingData.tests.map((t: any, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
                          {t.name}
                        </span>
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
                  <li>• You will receive an SMS confirmation shortly</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/" className="btn-outline flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Go to Home
                </Link>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-[400px] h-[400px] bg-white/20 rounded-full bottom-0 -left-20 blur-3xl" />
        </div>
        <div className="container-premium relative z-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" /> Book Your Appointment
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
              Schedule Your Health Checkup
            </h1>
            <p className="text-white/80 text-lg">
              Choose from 1,000+ tests or curated health packages. Free home collection available.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              {[
                { icon: Award, value: 'NABL', label: 'Accredited' },
                { icon: Clock, value: '6-24 hrs', label: 'Report Time' },
                { icon: Users, value: '2M+', label: 'Patients' },
                { icon: Star, value: '4.9', label: 'Rating' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                >
                  <s.icon className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-white/70">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z" fill="#F8FAFC" /></svg>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="max-w-5xl mx-auto">
            {/* Steps Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        index < currentStep
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : index === currentStep
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-100'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {index < currentStep ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                      </div>
                      <span className={`text-xs font-medium mt-1.5 hidden sm:block ${
                        index <= currentStep ? 'text-slate-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-3 mt-[-1.5rem] ${
                        index < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
                      }`} />
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
              {/* ======== STEP 1: SELECT TESTS ======== */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Package Selector Toggle */}
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setShowPackageSelector(false)}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                        !showPackageSelector
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                          : 'bg-white text-slate-600 border border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <FlaskConical className="w-4 h-4 inline mr-2" />
                      Individual Tests
                    </button>
                    <button
                      onClick={() => setShowPackageSelector(true)}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                        showPackageSelector
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-white text-slate-600 border border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Heart className="w-4 h-4 inline mr-2" />
                      Health Packages
                    </button>
                  </div>

                  {!showPackageSelector ? (
                    <>
                      {/* Search & Categories */}
                      <div className="card-premium p-6 mb-6">
                        <div className="relative mb-4">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search tests by name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12 py-3.5"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                activeCategory === cat.id
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                              }`}
                            >
                              <cat.icon className="w-3.5 h-3.5" />
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Selected Tests Summary */}
                      {selectedTests.length > 0 && (
                        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-primary-700">
                              <ShoppingCart className="w-4 h-4 inline mr-1.5" />
                              {selectedTests.length} test(s) selected
                            </span>
                            <span className="text-lg font-bold text-primary-700">{formatCurrency(testTotal)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedTests.map(t => (
                              <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-primary-700 border border-primary-100">
                                {t.name}
                                <button onClick={() => toggleTest(t)} className="hover:text-red-500 ml-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tests Grid */}
                      <div className="card-premium p-6">
                        <h3 className="font-heading font-semibold text-slate-900 mb-4">
                          {activeCategory === 'all' ? 'All Tests' : categories.find(c => c.id === activeCategory)?.name || 'Tests'}
                          <span className="text-sm font-normal text-slate-400 ml-2">({filteredTests.length})</span>
                        </h3>

                        {filteredTests.length === 0 ? (
                          <div className="text-center py-12">
                            <Beaker className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">No tests found. Try a different search.</p>
                          </div>
                        ) : (
                          <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1">
                            {filteredTests.map((test) => {
                              const isSelected = selectedTests.find(t => t.id === test.id);
                              return (
                                <button
                                  key={test.id}
                                  onClick={() => toggleTest(test)}
                                  className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all text-left border ${
                                    isSelected
                                      ? 'bg-primary-50 border-primary-200'
                                      : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                    isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'
                                  }`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{test.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                      <span className="font-mono">{test.id}</span>
                                      <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" />{test.reportTime}</span>
                                      <span>{test.sampleType}</span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-slate-900">{formatCurrency(test.discountPrice)}</p>
                                    {test.discountPrice < test.price && (
                                      <p className="text-xs text-slate-400 line-through">{formatCurrency(test.price)}</p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Health Packages */
                    <div className="grid md:grid-cols-2 gap-4">
                      {healthPackages.map((pkg, i) => {
                        const Icon = pkg.icon;
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <motion.button
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => selectPackage(pkg)}
                            className={`card-premium p-5 text-left border-2 transition-all ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-200'
                                : 'border-gray-100 hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isSelected ? 'bg-purple-600' : 'bg-purple-50'
                                }`}>
                                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-purple-600'}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">{pkg.name}</p>
                                  <div className="flex items-baseline gap-2 mt-0.5">
                                    <span className="text-lg font-bold text-slate-900">{formatCurrency(pkg.discountPrice)}</span>
                                    <span className="text-xs text-slate-400 line-through">{formatCurrency(pkg.price)}</span>
                                  </div>
                                </div>
                              </div>
                              {pkg.popular && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-semibold rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mb-2">Includes {pkg.tests.length} tests:</p>
                            <div className="flex flex-wrap gap-1">
                              {pkg.tests.map((t, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-slate-600">{t}</span>
                              ))}
                            </div>
                            {pkg.savings && (
                              <p className="text-xs text-emerald-600 font-medium mt-2">Save {pkg.savings}%</p>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    <Link href="/tests" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Browse All Tests
                    </Link>
                    <button
                      onClick={() => setCurrentStep(1)}
                      disabled={!canProceedToStep2}
                      className="btn-primary flex items-center gap-2 px-8"
                    >
                      Next: Your Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ======== STEP 2: PERSONAL DETAILS ======== */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" /> Your Personal Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Your age"
                        min={1}
                        max={150}
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="Street address"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-6">
                    <p className="font-medium mb-1">🔒 Your data is safe</p>
                    <p className="text-xs text-blue-600">Your personal information is encrypted and used only for booking purposes.</p>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button onClick={() => setCurrentStep(0)} className="btn-outline flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!canProceedToStep3}
                      className="btn-primary flex items-center gap-2 px-8"
                    >
                      Next: Appointment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ======== STEP 3: APPOINTMENT ======== */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" /> Select Appointment Time
                  </h2>

                  {/* Appointment Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Appointment Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setAppointmentType('AT_CLINIC')}
                        className={`p-5 rounded-xl border-2 text-center transition-all ${
                          appointmentType === 'AT_CLINIC'
                            ? 'border-primary-500 bg-primary-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className={`w-8 h-8 mx-auto mb-2 ${appointmentType === 'AT_CLINIC' ? 'text-primary-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-slate-900">Visit Lab</p>
                        <p className="text-xs text-slate-500 mt-1">Come to our collection center</p>
                      </button>
                      <button
                        onClick={() => setAppointmentType('HOME_COLLECTION')}
                        className={`p-5 rounded-xl border-2 text-center transition-all ${
                          appointmentType === 'HOME_COLLECTION'
                            ? 'border-primary-500 bg-primary-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Home className={`w-8 h-8 mx-auto mb-2 ${appointmentType === 'HOME_COLLECTION' ? 'text-primary-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-slate-900">Home Collection</p>
                        <p className="text-xs text-slate-500 mt-1">Free collection at your door</p>
                      </button>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <Calendar className="w-4 h-4 inline mr-1" /> Appointment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={minDate}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <Clock className="w-4 h-4 inline mr-1" /> Appointment Time <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map(slot => (
                          <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Branch Selection (for AT_CLINIC) */}
                  {appointmentType === 'AT_CLINIC' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        <Building2 className="w-4 h-4 inline mr-1" /> Select Collection Center
                      </label>
                      <div className="space-y-2">
                        {branches.map((branch, i) => (
                          <button
                            key={branch.name}
                            onClick={() => setSelectedBranch(branch)}
                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
                              selectedBranch.name === branch.name
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-slate-900">{branch.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{branch.address}</p>
                              </div>
                              <span className="text-xs text-primary-600 font-medium">{branch.distance}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Home Collection Address */}
                  {appointmentType === 'HOME_COLLECTION' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <MapPin className="w-4 h-4 inline mr-1" /> Home Collection Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        placeholder="Enter your complete address with landmark for home sample collection"
                        rows={3}
                        className="input-field resize-none"
                      />
                      <p className="text-xs text-slate-400 mt-1.5">Free home collection within 10 km radius of our centers</p>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Special Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific instructions or medical conditions we should know about..."
                      rows={2}
                      className="input-field resize-none"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button onClick={() => setCurrentStep(1)} className="btn-outline flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={!canProceedToStep4}
                      className="btn-primary flex items-center gap-2 px-8"
                    >
                      Next: Review <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ======== STEP 4: REVIEW & CONFIRM ======== */}
              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="card-premium p-6 md:p-8"
                >
                  <h2 className="text-xl font-heading font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-600" /> Review Your Booking
                  </h2>

                  {/* Selected Tests/Package */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-primary-600" /> Selected Items
                    </h3>
                    {selectedPackage && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl mb-2 border border-purple-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{selectedPackage.name}</p>
                            <p className="text-xs text-slate-500">Health Package</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(packagePrice)}</p>
                      </div>
                    )}
                    {selectedTests.length > 0 && (
                      <div className="space-y-2">
                        {selectedTests.map(test => (
                          <div key={test.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                                <FlaskConical className="w-4 h-4 text-primary-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{test.name}</p>
                                <p className="text-xs text-slate-500">{test.id} • {test.reportTime}</p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{formatCurrency(test.discountPrice)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                    <h3 className="text-sm font-medium text-slate-700 col-span-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-primary-600" /> Personal Details
                    </h3>
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="text-sm font-medium text-slate-900">{name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium text-slate-900">{email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Gender / Age</p>
                      <p className="text-sm font-medium text-slate-900 capitalize">{gender || '-'} / {age || '-'}</p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                    <h3 className="text-sm font-medium text-slate-700 col-span-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary-600" /> Appointment
                    </h3>
                    <div>
                      <p className="text-xs text-slate-500">Type</p>
                      <p className="text-sm font-medium text-slate-900">
                        {appointmentType === 'AT_CLINIC' ? 'Visit Lab' : 'Home Collection'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-sm font-medium text-slate-900">{appointmentDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="text-sm font-medium text-slate-900">
                        {timeSlots.find(s => s.value === appointmentTime)?.label || appointmentTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm font-medium text-slate-900">
                        {appointmentType === 'AT_CLINIC' ? selectedBranch.name : 'Your Home'}
                      </p>
                    </div>
                    {appointmentType === 'HOME_COLLECTION' && (
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="text-sm font-medium text-slate-900">{homeAddress}</p>
                      </div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Payment Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="text-slate-900">{formatCurrency(totalAmount + savings)}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600">Discount / Savings</span>
                          <span className="text-emerald-600 font-medium">-{formatCurrency(savings)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>GST (included)</span>
                        <span>{formatCurrency(Math.round(totalAmount * 0.18))}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span className="text-slate-900">Total Amount</span>
                        <span className="text-primary-700">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-emerald-50 rounded-xl">
                    {[
                      { icon: Shield, text: '100% Safe & Secure' },
                      { icon: Award, text: 'NABL Accredited Labs' },
                      { icon: Syringe, text: 'Certified Phlebotomists' },
                      { icon: Clock3, text: 'Reports in 6-24 hrs' },
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-700">
                        <badge.icon className="w-4 h-4" />
                        {badge.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button onClick={() => setCurrentStep(2)} className="btn-outline flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn-primary flex items-center gap-2 px-8 min-w-[180px] justify-center"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Confirm Booking</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about booking a test</p>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: 'How do I book a test?', a: 'Simply select the tests you need from our catalog, enter your personal details, choose an appointment time, and confirm your booking. It takes less than 2 minutes!' },
              { q: 'Is home sample collection available?', a: 'Yes! We offer free home sample collection within 10 km of any of our collection centers. Our trained phlebotomist will visit your home at the scheduled time.' },
              { q: 'How long does it take to get reports?', a: 'Most reports are available within 6-24 hours. Some specialized tests may take up to 48 hours. You will receive a notification when your reports are ready.' },
              { q: 'Do I need to fast before the test?', a: 'For tests like Fasting Blood Sugar (FBS) and Lipid Profile, fasting for 8-12 hours is required. For other tests, no preparation is needed. You will receive specific instructions based on your selected tests.' },
              { q: 'Can I cancel or reschedule my appointment?', a: 'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time at no charge. Contact our support team for assistance.' },
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-premium p-4 group cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium text-slate-900 list-none text-sm">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
