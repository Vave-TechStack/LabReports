'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Users, Briefcase, ClipboardCheck, TrendingUp, Shield, Heart, ArrowRight, CheckCircle, Star, Phone, Mail, CalendarCheck, Award, BarChart3, HeadphonesIcon, Clock } from 'lucide-react';

const services = [
  { icon: ClipboardCheck, title: 'Employee Health Checkups', description: 'Annual health checkup programs for your employees with customized packages based on age, gender, and risk factors.' },
  { icon: Briefcase, title: 'Corporate Wellness Programs', description: 'Comprehensive wellness initiatives including health talks, fitness challenges, and preventive health screenings.' },
  { icon: TrendingUp, title: 'Bulk Testing & Discounts', description: 'Special corporate rates for bulk testing. Save up to 40% on regular test prices for your organization.' },
  { icon: Shield, title: 'On-site Sample Collection', description: 'We set up collection camps at your premises for hassle-free employee health checkups with minimal disruption.' },
  { icon: Heart, title: 'Pre-employment Checkups', description: 'Streamlined pre-employment health screening with digital reports integrated with your HR systems.' },
  { icon: BarChart3, title: 'Health Analytics Dashboard', description: 'Get anonymized health trends and insights of your workforce to design better wellness strategies.' },
];

const benefits = [
  { icon: TrendingUp, text: 'Save up to 40% on bulk tests', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Clock, text: 'Priority processing & dedicated account manager', color: 'bg-blue-50 text-blue-600' },
  { icon: Award, text: 'NABL accredited labs with ISO certification', color: 'bg-purple-50 text-purple-600' },
  { icon: HeadphonesIcon, text: '24/7 dedicated corporate support helpline', color: 'bg-amber-50 text-amber-600' },
  { icon: CheckCircle, text: 'Digital reports with API integration option', color: 'bg-cyan-50 text-cyan-600' },
  { icon: Shield, text: '100% data privacy and HIPAA compliance', color: 'bg-rose-50 text-rose-600' },
];

const clients = ['Tata Consultancy Services', 'Infosys', 'Wipro', 'Accenture', 'Deloitte', 'KPMG', 'Amazon', 'Google', 'Microsoft', 'Reliance Industries', 'HDFC Bank', 'ICICI Bank'];

const plans = [
  { name: 'Basic', price: '499', per: 'employee/year', features: ['Annual health checkup', 'Basic blood tests (10 parameters)', 'Digital reports', 'Email support'], popular: false },
  { name: 'Standard', price: '999', per: 'employee/year', features: ['Annual health checkup', 'Comprehensive tests (30+ parameters)', 'Digital reports + Dashboard', 'On-site collection camp (1/year)', 'Dedicated support'], popular: true },
  { name: 'Premium', price: '1999', per: 'employee/year', features: ['Annual + Mid-year checkup', 'Full body checkup (60+ parameters)', 'Health analytics dashboard', 'On-site collection camp (2/year)', 'Dedicated account manager', 'Wellness webinars', 'API integration'], popular: false },
];

export default function CorporateServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-96 h-96 bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" /> Corporate Services
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Employee Health,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">Our Priority</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Comprehensive corporate health solutions tailored for your organization. Keep your workforce healthy, productive, and happy.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="tel:+918088000100" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all">
                  <Phone className="w-4 h-4" /> Call Our Team
                </a>
                <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                  Enquire Now
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '200+', label: 'Corporate Clients' },
                    { value: '5L+', label: 'Employee Tests' },
                    { value: '40%', label: 'Avg. Savings' },
                    { value: '4.9', label: 'Client Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">What We Offer</h2>
            <p className="text-lg text-slate-600">End-to-end corporate health solutions designed for organizations of all sizes.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="card-premium p-6"
              >
                <s.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="font-heading font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Why Partner With Us?</h2>
            <p className="text-lg text-slate-600">We make employee healthcare simple, efficient, and impactful.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.text} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100"
              >
                <div className={`w-10 h-10 ${b.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <b.icon className="w-5 h-5" />
                </div>
                <p className="text-sm text-slate-700">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Simple Pricing</h2>
            <p className="text-lg text-slate-600">Choose the plan that fits your organization's needs. Custom packages available for large enterprises.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`card-premium p-6 relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-heading font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-heading font-bold text-slate-900">₹{plan.price}</span>
                  <span className="text-sm text-slate-500 ml-1">{plan.per}</span>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className={`block w-full text-center py-3 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                      : 'border-2 border-gray-200 text-slate-700 hover:border-primary-500 hover:text-primary-700'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Trusted By</h2>
            <p className="text-slate-500">India's leading companies trust MediLab for their employee healthcare needs.</p>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {clients.map((client, i) => (
              <motion.div
                key={client} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-md transition-all"
              >
                <p className="text-sm font-medium text-slate-700">{client}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-hero">
        <div className="container-premium text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to Transform Employee Healthcare?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Talk to our corporate team for a customized health solution for your organization.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+918088000100" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all">
                <Phone className="w-4 h-4" /> +91 80880 00100
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                <Mail className="w-4 h-4" /> Send Enquiry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
