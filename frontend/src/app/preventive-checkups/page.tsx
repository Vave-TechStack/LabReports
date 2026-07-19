'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Heart, Activity, Brain, Users, Stethoscope, ArrowRight, CheckCircle, Clock, Star, Apple, Dumbbell, Moon, Droplets, Smile, CalendarCheck } from 'lucide-react';

const categories = [
  { icon: Heart, title: 'Cardiovascular Health', description: 'Heart disease screening, blood pressure monitoring, cholesterol checks, and cardiac risk assessment.', checks: ['Blood Pressure', 'ECG', 'Lipid Profile', 'Stress Test'] },
  { icon: Brain, title: 'Neurological Health', description: 'Brain health assessment, cognitive function screening, and neurological disorder detection.', checks: ['Cognitive Assessment', 'Neurological Exam', 'Brain Imaging'] },
  { icon: Activity, title: 'Metabolic Health', description: 'Diabetes screening, thyroid function, vitamin deficiency, and hormonal health checks.', checks: ['Blood Sugar', 'HbA1c', 'Thyroid Profile', 'Vitamin Panel'] },
  { icon: Shield, title: 'Cancer Screening', description: 'Early detection screening for common cancers including breast, cervical, prostate, and colon.', checks: ['Mammography', 'Pap Smear', 'PSA Test', 'Colonoscopy'] },
  { icon: Users, title: 'Women\'s Health', description: 'Comprehensive wellness checks tailored for women at every life stage.', checks: ['Pelvic Exam', 'Bone Density', 'Hormone Panel', 'Thyroid'] },
  { icon: Stethoscope, title: 'Men\'s Health', description: 'Essential health screenings for men including prostate, heart, and metabolic health.', checks: ['PSA Test', 'Cardiac Assessment', 'Testosterone', 'Lipid Profile'] },
];

const ageGroups = [
  { range: '20-30', title: 'Young Adults', desc: 'Baseline health screening for early detection', tests: ['CBC', 'Blood Sugar', 'Lipid Profile', 'Thyroid'], price: 1499 },
  { range: '30-45', title: 'Mid-Life Essentials', desc: 'Comprehensive screening for preventive care', tests: ['Full Body Checkup', 'Diabetes Panel', 'Cardiac Risk', 'Vitamin Panel'], price: 2499 },
  { range: '45-60', title: 'Senior Care', desc: 'Advanced screening with cancer markers', tests: ['Complete Wellness', 'Cancer Markers', 'Bone Density', 'Hormone Panel'], price: 3999 },
  { range: '60+', title: 'Silver Years', desc: 'Comprehensive geriatric health assessment', tests: ['Geriatric Panel', 'Cognitive Screen', 'Full Body + Imaging'], price: 5499 },
];

const tips = [
  { icon: Apple, title: 'Balanced Diet', desc: 'Eat a variety of fruits, vegetables, whole grains, and lean proteins.' },
  { icon: Dumbbell, title: 'Regular Exercise', desc: 'At least 30 minutes of moderate activity, 5 days a week.' },
  { icon: Moon, title: 'Quality Sleep', desc: 'Aim for 7-8 hours of restful sleep every night.' },
  { icon: Droplets, title: 'Stay Hydrated', desc: 'Drink at least 8 glasses of water daily for optimal health.' },
  { icon: Smile, title: 'Stress Management', desc: 'Practice mindfulness, meditation, or yoga for mental wellness.' },
  { icon: CalendarCheck, title: 'Regular Checkups', desc: 'Schedule annual health checkups for preventive care.' },
];

export default function PreventiveCheckupsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-96 h-96 bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" /> Preventive Health
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Prevention is Better Than Cure<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">Stay Ahead of Health Issues</span>
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              Early detection through regular preventive health checkups can save lives. Discover potential health risks before they become serious.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Early Detection', 'Peace of Mind', 'Save Costs', 'Better Health'].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '70%', label: 'Diseases detectable early' },
              { value: '30%', label: 'Lower healthcare costs' },
              { value: '95%', label: 'Treatment success rate' },
              { value: '2M+', label: 'Lives impacted' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 card-premium"
              >
                <p className="text-3xl font-heading font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Preventive Checkups */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Why It Matters</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2 mb-6">
                The Power of Preventive Healthcare
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Regular preventive health checkups are your first line of defense against serious health conditions. Early detection can significantly improve treatment outcomes and reduce healthcare costs.
                </p>
                <p>
                  According to the World Health Organization, 70% of diseases can be detected early through regular screening. Yet, most people skip annual checkups due to busy schedules or lack of awareness.
                </p>
                <p>
                  At MediLab Diagnostics, we make preventive healthcare easy, accessible, and affordable. Our comprehensive health packages are designed to detect potential health risks at an early, treatable stage.
                </p>
              </div>
              <Link href="/packages" className="inline-flex items-center gap-2 btn-primary mt-6 px-8 py-3.5">
                View Health Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '90%', label: 'Preventable', emoji: '🛡️' },
                { value: '5x', label: 'Lower Cost', emoji: '💰' },
                { value: '95%', label: 'Survival Rate', emoji: '❤️' },
                { value: '30min', label: 'Checkup Time', emoji: '⏱️' },
              ].map((item, i) => (
                <div key={i} className="card-premium p-5 text-center">
                  <span className="text-3xl mb-2 block">{item.emoji}</span>
                  <p className="text-2xl font-heading font-bold text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Screening Categories */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Screening Categories</h2>
            <p className="text-lg text-slate-600">Comprehensive health screening across all major health domains.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="card-premium p-6"
              >
                <cat.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="font-heading font-semibold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.checks.map((check) => (
                    <span key={check} className="text-xs bg-gray-100 text-slate-600 px-2.5 py-1 rounded-lg">{check}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Age-Based Recommendations */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Checkups by Age Group</h2>
            <p className="text-lg text-slate-600">Age-specific health screening recommendations for optimal wellness.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ageGroups.map((group, i) => (
              <motion.div
                key={group.range} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-premium p-6 text-center group"
              >
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-lg font-bold text-white">{group.range}</span>
                </div>
                <h3 className="font-heading font-semibold text-slate-900">{group.title}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">{group.desc}</p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {group.tests.map((test) => (
                    <span key={test} className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{test}</span>
                  ))}
                </div>
                <p className="text-lg font-bold text-slate-900">₹{group.price}</p>
                <Link href="/book-home-collection" className="mt-3 inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700">
                  Book Now <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tips */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Healthy Living Tips</h2>
            <p className="text-lg text-slate-600">Simple lifestyle changes for better health and wellness.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <tip.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{tip.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-hero">
        <div className="container-premium text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Start Your Health Journey Today</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Book a preventive health checkup and take the first step towards a healthier, happier life.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book-home-collection" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all">
                Book Home Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                Speak to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
