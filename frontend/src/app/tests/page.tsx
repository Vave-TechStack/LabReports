'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Beaker, Shield, ChevronDown, ArrowRight, Clock, CheckCircle, Filter, FlaskConical, Droplets, Star, Heart, Brain, Activity, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
  { id: 'CBC', name: 'Complete Blood Count (CBC)', category: 'cbc', price: 500, discountPrice: 350, reportTime: '6 hours', sampleType: 'Blood', isPopular: true, parameters: '24 parameters', description: 'Measures different components of blood including RBC, WBC, hemoglobin, and platelets.' },
  { id: 'HEMOGLOBIN', name: 'Hemoglobin Test', category: 'cbc', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', description: 'Measures hemoglobin levels in blood to detect anemia.' },
  { id: 'WBC', name: 'WBC Count', category: 'cbc', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', description: 'White blood cell count to check for infections.' },
  { id: 'PLATELET', name: 'Platelet Count', category: 'cbc', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', description: 'Platelet count assessment for clotting disorders.' },
  { id: 'FBS', name: 'Fasting Blood Sugar (FBS)', category: 'diabetes', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', isPopular: true, description: 'Measures blood glucose after fasting for 8-12 hours.' },
  { id: 'HBA1C', name: 'HbA1c', category: 'diabetes', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Measures average blood sugar levels over the past 2-3 months.' },
  { id: 'RBS', name: 'Random Blood Sugar (RBS)', category: 'diabetes', price: 120, discountPrice: 80, reportTime: '6 hours', sampleType: 'Blood', description: 'Random blood glucose measurement.' },
  { id: 'GTT', name: 'Glucose Tolerance Test (GTT)', category: 'diabetes', price: 400, discountPrice: 299, reportTime: '24 hours', sampleType: 'Blood', description: 'Measures body\'s ability to metabolize glucose over time.' },
  { id: 'THYROID', name: 'Thyroid Profile (T3, T4, TSH)', category: 'thyroid', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Complete thyroid function assessment including T3, T4, and TSH levels.' },
  { id: 'TSH', name: 'TSH (Thyroid Stimulating Hormone)', category: 'thyroid', price: 350, discountPrice: 250, reportTime: '12 hours', sampleType: 'Blood', description: 'Measures TSH levels to screen for thyroid disorders.' },
  { id: 'T3', name: 'Free T3', category: 'thyroid', price: 400, discountPrice: 299, reportTime: '12 hours', sampleType: 'Blood', description: 'Free Triiodothyronine measurement for thyroid assessment.' },
  { id: 'T4', name: 'Free T4', category: 'thyroid', price: 400, discountPrice: 299, reportTime: '12 hours', sampleType: 'Blood', description: 'Free Thyroxine measurement for thyroid function.' },
  { id: 'LIPID', name: 'Lipid Profile', category: 'lipid', price: 550, discountPrice: 399, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Complete cholesterol and triglyceride assessment.' },
  { id: 'LDL', name: 'LDL Cholesterol', category: 'lipid', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', description: 'Bad cholesterol level measurement.' },
  { id: 'HDL', name: 'HDL Cholesterol', category: 'lipid', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', description: 'Good cholesterol level measurement.' },
  { id: 'VLDL', name: 'VLDL & Triglycerides', category: 'lipid', price: 250, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', description: 'Very low density lipoprotein and triglycerides.' },
  { id: 'LFT', name: 'Liver Function Test (LFT)', category: 'liver', price: 600, discountPrice: 450, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Assesses liver health by measuring enzymes, proteins, and bilirubin.' },
  { id: 'BILIRUBIN', name: 'Bilirubin Test', category: 'liver', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', description: 'Measures bilirubin levels for liver and gall bladder function.' },
  { id: 'SGOT', name: 'SGOT/AST', category: 'liver', price: 180, discountPrice: 130, reportTime: '6 hours', sampleType: 'Blood', description: 'Liver enzyme measurement for liver cell damage.' },
  { id: 'SGPT', name: 'SGPT/ALT', category: 'liver', price: 180, discountPrice: 130, reportTime: '6 hours', sampleType: 'Blood', description: 'Liver enzyme measurement for liver function.' },
  { id: 'KFT', name: 'Kidney Function Test (KFT)', category: 'kidney', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Evaluates kidney function through blood urea, creatinine, and electrolytes.' },
  { id: 'CREATININE', name: 'Serum Creatinine', category: 'kidney', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', description: 'Measures creatinine to assess kidney filtration.' },
  { id: 'BUN', name: 'Blood Urea Nitrogen (BUN)', category: 'kidney', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', description: 'Measures urea levels for kidney function.' },
  { id: 'URICACID', name: 'Uric Acid', category: 'kidney', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', description: 'Uric acid measurement for gout and kidney assessment.' },
  { id: 'VITD', name: 'Vitamin D (25-OH)', category: 'vitamin', price: 1200, discountPrice: 899, reportTime: '24 hours', sampleType: 'Blood', isPopular: true, description: 'Measures vitamin D levels in blood for deficiency assessment.' },
  { id: 'VITB12', name: 'Vitamin B12', category: 'vitamin', price: 1000, discountPrice: 750, reportTime: '24 hours', sampleType: 'Blood', isPopular: true, description: 'Measures vitamin B12 levels for deficiency and anemia.' },
  { id: 'FERRITIN', name: 'Ferritin', category: 'vitamin', price: 500, discountPrice: 380, reportTime: '12 hours', sampleType: 'Blood', description: 'Iron storage protein measurement.' },
  { id: 'CALCIUM', name: 'Serum Calcium', category: 'vitamin', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Blood', description: 'Calcium level measurement for bone and metabolic health.' },
  { id: 'MALARIA', name: 'Malaria Test', category: 'infection', price: 350, discountPrice: 250, reportTime: '6 hours', sampleType: 'Blood', description: 'Detection of malaria parasite in blood.' },
  { id: 'DENGUE', name: 'Dengue Test (NS1)', category: 'infection', price: 800, discountPrice: 599, reportTime: '12 hours', sampleType: 'Blood', isPopular: true, description: 'Early detection of dengue virus NS1 antigen.' },
  { id: 'WIDAL', name: 'Widal Test (Typhoid)', category: 'infection', price: 300, discountPrice: 199, reportTime: '12 hours', sampleType: 'Blood', description: 'Detection of typhoid fever antibodies.' },
  { id: 'URINE', name: 'Urine Routine Analysis', category: 'cbc', price: 200, discountPrice: 150, reportTime: '6 hours', sampleType: 'Urine', description: 'Complete urine analysis for various health indicators.' },
  { id: 'CRP', name: 'CRP (C-Reactive Protein)', category: 'infection', price: 400, discountPrice: 299, reportTime: '6 hours', sampleType: 'Blood', description: 'Inflammation marker measurement.' },
  { id: 'ESR', name: 'ESR (Erythrocyte Sedimentation Rate)', category: 'cbc', price: 150, discountPrice: 100, reportTime: '6 hours', sampleType: 'Blood', description: 'Measures inflammation levels in the body.' },
];

export default function TestsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filtered = allTests.filter(test => {
    const matchCategory = activeCategory === 'all' || test.category === activeCategory;
    const matchSearch = !searchQuery || 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const popularTests = allTests.filter(t => t.isPopular);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
                <Beaker className="w-4 h-4" /> 1000+ Tests Available
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Find the Right Test</h1>
              <p className="text-lg text-white/80 mb-8">Browse our comprehensive range of diagnostic tests with accurate results and quick turnaround.</p>
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search test name, code, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-slate-900 placeholder:text-gray-400 outline-none shadow-xl text-base"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Tests */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" /> Popular Tests
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTests.slice(0, 6).map((test, i) => (
                  <motion.div
                    key={test.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }} className="card-premium p-5 flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="font-medium text-slate-900 text-sm">{test.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-bold text-slate-900">{formatCurrency(test.discountPrice)}</span>
                        <span className="text-xs text-slate-400 line-through">{formatCurrency(test.price)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/book-test?test=${test.id}`}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-100 transition-all shrink-0"
                    >
                      Book Now
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories & Tests */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setShowMobileFilter(false); }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Category Filter Toggle */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-slate-700 mb-4"
          >
            <Filter className="w-4 h-4" /> Filter by Category
            {showMobileFilter ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMobileFilter && (
            <div className="lg:hidden flex flex-wrap gap-2 mb-4 p-4 bg-white rounded-xl border border-gray-100">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setShowMobileFilter(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-slate-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No tests found</h3>
              <p className="text-slate-500 mb-4">Try a different search term or category.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="btn-outline text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((test, i) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    layout
                    className="card-premium p-5 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                          <FlaskConical className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 text-sm leading-tight">{test.name}</h3>
                          <span className="text-[10px] text-gray-400 font-mono">{test.id}</span>
                        </div>
                      </div>
                      {test.isPopular && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{test.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.reportTime}</span>
                      <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {test.sampleType}</span>
                      <span>{test.parameters}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-bold text-slate-900">{formatCurrency(test.discountPrice)}</span>
                        {test.discountPrice < test.price && (
                          <span className="text-xs text-slate-400 line-through ml-2">{formatCurrency(test.price)}</span>
                        )}
                      </div>
                      <Link
                        href={`/book-test?test=${test.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-all"
                      >
                        Book <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-slate-500 mb-4">Showing {filtered.length} of {allTests.length} tests</p>
            <Link href="/book-home-collection" className="inline-flex items-center gap-2 btn-primary px-8 py-3.5">
              Book Home Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
