'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Users, TrendingUp, CalendarCheck, ArrowRight, CheckCircle, Star, Clock, Shield, Dumbbell, Apple, Moon, Smile, Leaf, Activity, Sparkles, Loader2, Phone, Mail } from 'lucide-react';

const programs = [
  { icon: Heart, title: 'Heart Health Program', duration: '3 months', description: 'Comprehensive cardiac wellness program with regular monitoring, dietary guidance, and exercise planning for heart health.', price: 5999, discountPrice: 4499, features: ['Lipid Profile & Cardiac Markers', 'Monthly ECG', 'Dietician Consultation', 'Exercise Plan', 'Stress Management'], popular: true },
  { icon: Activity, title: 'Diabetes Management', duration: '6 months', description: 'Complete diabetes care program with regular HbA1c monitoring, nutrition counseling, and lifestyle management.', price: 8999, discountPrice: 6999, features: ['Monthly HbA1c Tracking', 'Diet & Nutrition Plan', 'Endocrinologist Consult', 'Fitness Tracking', '24/7 Support'], popular: true },
  { icon: Dumbbell, title: 'Weight Management', duration: '3 months', description: 'Science-backed weight management program with personalized diet plans, fitness routines, and progress tracking.', price: 4999, discountPrice: 3499, features: ['BMI & Body Composition', 'Custom Diet Plan', 'Personal Training Guide', 'Weekly Progress Review', 'Motivation Support'], popular: false },
  { icon: Leaf, title: 'Detox & Cleanse', duration: '1 month', description: 'Guided detox program to eliminate toxins, boost immunity, and rejuvenate your body with natural methods.', price: 2999, discountPrice: 1999, features: ['Liver Function Panel', 'Nutritional Detox Plan', 'Herbal Supplement Guide', 'Hydration Tracking', 'Post-Detox Assessment'], popular: false },
  { icon: Moon, title: 'Sleep Wellness', duration: '6 weeks', description: 'Improve your sleep quality with our comprehensive sleep wellness program including tracking and behavioral therapy.', price: 3999, discountPrice: 2999, features: ['Sleep Quality Assessment', 'Sleep Hygiene Plan', 'Relaxation Techniques', 'Melatonin Level Check', 'Stress Reduction'], popular: false },
  { icon: Smile, title: 'Mental Wellness', duration: '3 months', description: 'Holistic mental health program with counseling sessions, mindfulness training, and stress management techniques.', price: 6999, discountPrice: 5499, features: ['Psychologist Sessions', 'Mindfulness Training', 'Stress Assessment', 'CBT Techniques', 'Support Group Access'], popular: true },
  { icon: Users, title: 'Senior Wellness', duration: '6 months', description: 'Comprehensive wellness program designed specifically for seniors focusing on age-related health management.', price: 7999, discountPrice: 5999, features: ['Full Body Checkup', 'Bone Density Scan', 'Cognitive Assessment', 'Nutrition Plan', 'Social Engagement'], popular: false },
  { icon: Apple, title: 'Nutrition Coaching', duration: '3 months', description: 'One-on-one nutrition coaching with certified dietitians to help you achieve your health goals.', price: 4499, discountPrice: 3499, features: ['Personalized Meal Plan', 'Vitamin Panel', 'Weekly Diet Review', 'Recipe Guide', 'Supplement Advice'], popular: false },
];

export default function WellnessPage() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? programs : programs.slice(0, 6);
  const [selected, setSelected] = useState<any>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async (program: any) => {
    setSelected(program);
    setEnrolling(true);
    await new Promise(r => setTimeout(r, 2000));
    setEnrolled(true);
    setEnrolling(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 right-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Wellness Programs
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Transform Your Health & Wellness
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Expert-guided wellness programs designed to help you achieve your health goals with personalized care and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }} className={`card-premium p-6 relative ${p.popular ? 'ring-2 ring-primary-500' : ''}`}
                >
                  {p.popular && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-semibold rounded-full shadow-lg">
                      Popular
                    </div>
                  )}
                  <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-xs text-primary-600 font-medium mb-2">{p.duration}</p>
                  <p className="text-sm text-slate-500 mb-4">{p.description}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-heading font-bold text-slate-900">₹{p.discountPrice}</span>
                    <span className="text-sm text-slate-400 line-through">₹{p.price}</span>
                    <span className="text-xs text-emerald-600 font-medium ml-auto">
                      Save {Math.round((1 - p.discountPrice / p.price) * 100)}%
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleEnroll(p)} disabled={enrolling && selected?.title === p.title}
                    className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all flex items-center justify-center gap-2">
                    {enrolling && selected?.title === p.title ? <><Loader2 className="w-4 h-4 animate-spin" /> Enrolling...</> : 'Enroll Now'}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {programs.length > 6 && (
            <div className="text-center mt-10">
              <button onClick={() => setShowAll(!showAll)} className="btn-outline inline-flex items-center gap-2">
                {showAll ? 'Show Less' : `View All ${programs.length} Programs`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enrollment Success */}
      {enrolled && (
        <section className="pb-16">
          <div className="container-premium max-w-lg mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-8 text-center border-2 border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-2">Enrolled Successfully! 🎉</h2>
              <p className="text-slate-500 mb-4">You're now enrolled in <strong>{selected?.title}</strong>.</p>
              <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left text-sm text-amber-800">
                <p className="font-medium mb-1">📋 What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Our wellness team will contact you within 24 hours</li>
                  <li>• You'll receive a welcome kit with program details</li>
                  <li>• Your first consultation will be scheduled</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setEnrolled(false)} className="btn-outline text-sm">Browse More</button>
                <Link href="/" className="btn-primary text-sm">Go to Home</Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Why Join Our Wellness Programs?</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Expert Guidance', desc: 'Programs designed and supervised by certified healthcare professionals.' },
              { icon: TrendingUp, title: 'Track Progress', desc: 'Regular assessments and progress tracking to keep you motivated.' },
              { icon: Shield, title: 'Holistic Approach', desc: 'Comprehensive care addressing physical, mental, and emotional health.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-premium p-6 text-center">
                <b.icon className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
