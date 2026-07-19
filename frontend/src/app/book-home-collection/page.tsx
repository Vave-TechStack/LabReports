'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, CalendarCheck, Clock, Phone, MapPin, Shield, ChevronRight, ArrowRight, CheckCircle, Star, Users, Syringe, Truck, Loader2, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const steps = [
  { icon: CalendarCheck, title: 'Book Online', description: 'Schedule a convenient time slot for home collection.' },
  { icon: Syringe, title: 'Trained Phlebotomist Visit', description: 'Our expert visits your home with sterile equipment.' },
  { icon: Clock, title: 'Quick Processing', description: 'Samples processed in our NABL accredited lab.' },
  { icon: CheckCircle, title: 'Digital Reports', description: 'Get reports via WhatsApp, email, or patient portal.' },
];

const coverage = [
  'Bangalore - All Areas', 'Mumbai - All Areas', 'Delhi - NCR Region', 'Chennai - All Areas',
  'Hyderabad - All Areas', 'Pune - All Areas', 'Kolkata - All Areas', 'Ahmedabad - All Areas',
  'Jaipur - All Areas', 'Chandigarh - Tricity', 'Lucknow - All Areas', 'Bhopal - All Areas',
];

export default function BookHomeCollectionPage() {
  const [formState, setFormState] = useState<'form' | 'submitting' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', city: 'Bangalore', date: '', time: 'Morning', notes: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    await new Promise(r => setTimeout(r, 2000));
    setFormState('success');
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[500px] h-[500px] bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-[400px] h-[400px] bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
                <Home className="w-4 h-4" /> Free Home Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Get Tested at<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">Your Doorstep</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Skip the clinic visit! Our trained phlebotomists will collect samples from your home. Free service with all tests and packages.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Free Service', 'Trained Staff', 'Sterile Equipment', 'Digital Reports'].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/90">
                    <Check className="w-3 h-3 text-emerald-300" /> {tag}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-center mb-6">
                  <Truck className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                  <h3 className="text-xl font-heading font-bold text-white">Free Home Collection</h3>
                  <p className="text-white/70 text-sm">Available in 200+ cities across India</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['NABL Accredited', 'ISO Certified', '500+ Centers', '4.9 Rating'].map((stat) => (
                    <div key={stat} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-white font-semibold text-sm">{stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">Getting tested from the comfort of your home is simple and hassle-free.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-premium p-6 text-center group"
              >
                <div className="relative mb-4 inline-block">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form + Coverage */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Schedule Home Collection</h2>
              <p className="text-slate-500 mb-8">Fill in your details and we'll confirm your appointment within 30 minutes.</p>

              {formState === 'success' ? (
                <div className="card-premium p-8 text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">Booking Confirmed! 🎉</h3>
                  <p className="text-slate-500 mb-4">Our team will contact you within 30 minutes to confirm the visit details.</p>
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm text-emerald-800 font-medium">Booking Reference: <span className="font-mono">ML-{Date.now().toString(36).toUpperCase()}</span></p>
                    <p className="text-xs text-emerald-600 mt-1">Please keep your phone handy for confirmation.</p>
                  </div>
                  <Link href="/tests" className="btn-primary inline-flex items-center gap-2">
                    Browse Tests <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card-premium p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <input type="text" required className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                      <input type="tel" required className="input-field" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                    <input type="email" required className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Address *</label>
                    <textarea required rows={3} className="input-field" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">City *</label>
                      <select className="input-field" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}>
                        <option>Bangalore</option><option>Mumbai</option><option>Delhi</option><option>Chennai</option>
                        <option>Hyderabad</option><option>Pune</option><option>Kolkata</option><option>Ahmedabad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
                      <input type="date" required className="input-field" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Time *</label>
                      <select className="input-field" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                        <option>Morning (7-11 AM)</option><option>Afternoon (12-4 PM)</option><option>Evening (4-8 PM)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (Optional)</label>
                    <textarea rows={2} className="input-field" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                  </div>
                  <button type="submit" disabled={formState === 'submitting'} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                    {formState === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Home className="w-4 h-4" />}
                    {formState === 'submitting' ? 'Submitting...' : 'Request Home Collection'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Coverage Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="card-premium p-6 mb-6">
                <h3 className="font-heading font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" /> Service Coverage
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {coverage.map((city) => (
                    <div key={city} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {city}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-premium p-6">
                <h3 className="font-heading font-semibold text-slate-900 mb-4">Why Home Collection?</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield, title: 'Safe & Hygienic', desc: 'All equipment is sterilized and single-use only.' },
                    { icon: Clock, title: 'Flexible Timing', desc: 'Choose morning, afternoon, or evening slots.' },
                    { icon: Truck, title: 'Free Service', desc: 'No extra charges for home collection.' },
                    { icon: Users, title: 'Trained Professionals', desc: 'Experienced phlebotomists with gentle technique.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
