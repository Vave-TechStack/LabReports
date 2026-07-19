'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Shield, ArrowRight, Heart, Brain, Activity, Users, Star, Clock, CheckCircle, ChevronDown, Search, TrendingUp, FlaskConical } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const packages = [
  {
    id: 'basic-health-checkup',
    name: 'Basic Health Checkup',
    shortDescription: 'Essential health screening package covering all basic parameters.',
    description: 'Perfect for annual health checkups. Covers CBC, blood sugar, and urine analysis to give you a baseline of your health status.',
    price: 1500, discountPrice: 999, reportTime: '24 hours', isPopular: true, savings: 33,
    tests: ['Complete Blood Count (CBC)', 'Fasting Blood Sugar (FBS)', 'Urine Routine Analysis'],
    includes_home_collection: true, icon: Heart,
  },
  {
    id: 'comprehensive-full-body-checkup',
    name: 'Comprehensive Full Body Checkup',
    shortDescription: 'Complete health assessment with 40+ parameters.',
    description: 'Our most popular package! Includes CBC, thyroid, lipid profile, liver function, kidney function, and more. Covers all major health indicators.',
    price: 4000, discountPrice: 2499, reportTime: '36 hours', isPopular: true, savings: 38,
    tests: ['Complete Blood Count (CBC)', 'Thyroid Profile (T3, T4, TSH)', 'HbA1c', 'Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'Urine Routine Analysis'],
    includes_home_collection: true, icon: Activity,
  },
  {
    id: 'diabetes-care-package',
    name: 'Diabetes Care Package',
    shortDescription: 'Complete diabetes monitoring and management package.',
    description: 'Comprehensive package for diabetes patients. Includes FBS, HbA1c, lipid profile, and kidney function for complete diabetes management.',
    price: 2500, discountPrice: 1799, reportTime: '24 hours', isPopular: true, savings: 28,
    tests: ['Fasting Blood Sugar (FBS)', 'HbA1c', 'Lipid Profile', 'Kidney Function Test (KFT)'],
    includes_home_collection: true, icon: TrendingUp,
  },
  {
    id: 'heart-health-package',
    name: 'Heart Health Package',
    shortDescription: 'Comprehensive cardiac risk assessment.',
    description: 'Designed for early detection of cardiovascular risks. Includes lipid profile, cardiac enzymes, and inflammatory markers.',
    price: 3000, discountPrice: 1999, reportTime: '24 hours', isPopular: true, savings: 33,
    tests: ['Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'CRP (C-Reactive Protein)', 'ECG'],
    includes_home_collection: true, icon: Heart,
  },
  {
    id: 'women-wellness-package',
    name: 'Women Wellness Package',
    shortDescription: 'Specialized health checkup for women.',
    description: 'Tailored for women\'s health needs including thyroid assessment, vitamin levels, complete blood count, and hormonal profile.',
    price: 3500, discountPrice: 2499, reportTime: '36 hours', savings: 29,
    tests: ['Complete Blood Count (CBC)', 'Thyroid Profile', 'Vitamin D', 'Vitamin B12', 'Iron Studies'],
    includes_home_collection: true, icon: Users,
  },
  {
    id: 'senior-citizen-checkup',
    name: 'Senior Citizen Checkup',
    shortDescription: 'Comprehensive health checkup for seniors.',
    description: 'Comprehensive package designed for elderly health monitoring. Includes all major parameters for age-related health management.',
    price: 5000, discountPrice: 3499, reportTime: '48 hours', isPopular: true, savings: 30,
    tests: ['Complete Blood Count (CBC)', 'Thyroid Profile', 'HbA1c', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'Vitamin D', 'Vitamin B12'],
    includes_home_collection: true, icon: Shield,
  },
  {
    id: 'child-health-package',
    name: 'Child Health Package',
    shortDescription: 'Essential health checkup for children.',
    description: 'Specially designed for children aged 1-18 years. Covers growth assessment, nutritional status, and common childhood health parameters.',
    price: 2000, discountPrice: 1499, reportTime: '24 hours', savings: 25,
    tests: ['Complete Blood Count (CBC)', 'Vitamin D', 'Iron Studies', 'Urine Routine Analysis'],
    includes_home_collection: false, icon: Users,
  },
  {
    id: 'liver-kidney-package',
    name: 'Liver & Kidney Health Package',
    shortDescription: 'Complete liver and kidney function assessment.',
    description: 'Dedicated package for liver and kidney health assessment with comprehensive enzyme and filtration markers.',
    price: 2200, discountPrice: 1599, reportTime: '24 hours', savings: 27,
    tests: ['Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'Complete Blood Count (CBC)', 'Urine Routine Analysis'],
    includes_home_collection: true, icon: FlaskConical,
  },
  {
    id: 'thyroid-vitamin-package',
    name: 'Thyroid & Vitamin Package',
    shortDescription: 'Thyroid function and vitamin deficiency check.',
    description: 'Perfect for those experiencing fatigue, weight changes, or suspected thyroid/vitamin deficiencies.',
    price: 2800, discountPrice: 1999, reportTime: '24 hours', savings: 29,
    tests: ['Thyroid Profile (T3, T4, TSH)', 'Vitamin D', 'Vitamin B12', 'Complete Blood Count (CBC)'],
    includes_home_collection: true, icon: Activity,
  },
];

const benefits = [
  { icon: CheckCircle, text: 'Free home sample collection' },
  { icon: CheckCircle, text: 'NABL accredited labs' },
  { icon: CheckCircle, text: 'Digital reports within 24-48 hrs' },
  { icon: CheckCircle, text: 'Expert doctor consultation' },
  { icon: CheckCircle, text: 'Valid for 6 months from purchase' },
  { icon: CheckCircle, text: 'Easy rescheduling & cancellation' },
];

export default function PackagesPage() {
  const [showAll, setShowAll] = useState(false);
  const visiblePackages = showAll ? packages : packages.slice(0, 6);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-[400px] h-[400px] bg-white/20 rounded-full top-40 -right-20 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" /> Health Packages
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Save More with Our Health Packages
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Curated health checkup packages designed for every need. Get comprehensive screening at the best prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 py-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 text-xs text-slate-600"
              >
                <b.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                {b.text}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {packages.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No packages available</h3>
                <p className="text-slate-500">Check back soon for our health packages.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visiblePackages.map((pkg, index) => {
                  const Icon = pkg.icon;
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ y: -6 }}
                      className="card-premium p-6 group relative overflow-hidden"
                    >
                      {pkg.isPopular && (
                        <div className="absolute top-4 right-4">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold rounded-full shadow-lg">
                            <Star className="w-3 h-3 fill-white" /> Bestseller
                          </div>
                        </div>
                      )}
                      <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-slate-900 mb-2">{pkg.name}</h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{pkg.shortDescription}</p>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-heading font-bold text-slate-900">{formatCurrency(pkg.discountPrice)}</span>
                        <span className="text-sm text-slate-400 line-through">{formatCurrency(pkg.price)}</span>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Save {pkg.savings}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Reports in {pkg.reportTime}</span>
                      </div>

                      <div className="space-y-1.5 mb-6">
                        {pkg.tests.slice(0, 5).map((test, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {test}
                          </div>
                        ))}
                        {pkg.tests.length > 5 && (
                          <p className="text-xs text-primary-600 font-medium ml-5">+{pkg.tests.length - 5} more tests</p>
                        )}
                      </div>

                      {pkg.includes_home_collection && (
                        <div className="text-[10px] text-primary-600 bg-primary-50 rounded-lg px-3 py-1.5 mb-4 inline-block font-medium">
                          🏠 Free Home Collection Included
                        </div>
                      )}

                      <Link
                        href={`/book-test?package=${pkg.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 group"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {packages.length > 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 btn-outline font-semibold px-8 py-3.5"
              >
                {showAll ? 'Show Less' : `View All ${packages.length} Packages`}
                <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ/Info */}
      <section className="section-padding bg-white">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: 'How do health packages work?', a: 'Choose a package, book an appointment, and our phlebotomist will visit your home for sample collection. Reports are delivered digitally within 24-48 hours.' },
              { q: 'Can I customize a package?', a: 'Yes, you can add additional tests to any package. Contact our customer support for customization options.' },
              { q: 'Is home collection available for all packages?', a: 'Most packages include free home collection. Some specialized packages may require lab visits for specific tests.' },
              { q: 'How long is the package valid?', a: 'Health packages are valid for 6 months from the date of purchase. Unused packages can be cancelled within 7 days for a full refund.' },
            ].map((faq, i) => (
              <motion.details
                key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card-premium p-5 group cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium text-slate-900 list-none">
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
