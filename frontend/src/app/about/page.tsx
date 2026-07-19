'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Award, Microscope, Users, Heart, Target, ChevronRight, CheckCircle, Star, FlaskConical, Building2, Clock, MapPin } from 'lucide-react';

const milestones = [
  { year: '2012', title: 'Founded in Bangalore', description: 'Started with a single lab and a vision to make quality diagnostics accessible.' },
  { year: '2014', title: 'NABL Accreditation', description: 'Received NABL accreditation, setting new standards for quality.' },
  { year: '2016', title: 'Pan-India Expansion', description: 'Expanded to 50+ cities with 200+ collection centers.' },
  { year: '2018', title: 'Digital Transformation', description: 'Launched online booking, home collection, and digital reports.' },
  { year: '2020', title: 'COVID-19 Response', description: 'Processed over 5 lakh COVID tests, contributing to national efforts.' },
  { year: '2024', title: '2 Million+ Patients', description: 'Trusted by over 2 million patients with 500+ collection centers.' },
];

const leadership = [
  { name: 'Dr. Venkatesh Murthy', role: 'Founder & Chief Pathologist', qualification: 'MD Pathology (AIIMS)', experience: '28+ years', image: 'VM' },
  { name: 'Dr. Sunita Reddy', role: 'COO & Lab Director', qualification: 'PhD Microbiology', experience: '22+ years', image: 'SR' },
  { name: 'Dr. Arjun Mehta', role: 'Head of Operations', qualification: 'MBA Healthcare (IIM-A)', experience: '18+ years', image: 'AM' },
  { name: 'Dr. Priya Sharma', role: 'Chief Quality Officer', qualification: 'MD Biochemistry', experience: '20+ years', image: 'PS' },
];

const values = [
  { icon: Target, title: 'Accuracy First', description: 'Every test undergoes multiple quality checks before results are released.' },
  { icon: Heart, title: 'Patient-Centric', description: 'We put patient comfort and convenience at the heart of everything we do.' },
  { icon: Shield, title: 'Integrity', description: 'Uncompromising ethical standards in every aspect of our operations.' },
  { icon: Award, title: 'Excellence', description: 'Continuous improvement and innovation in diagnostic methodologies.' },
  { icon: Users, title: 'Teamwork', description: 'Collaborative approach combining expertise from multiple disciplines.' },
  { icon: Microscope, title: 'Innovation', description: 'Adopting cutting-edge technology for better, faster diagnoses.' },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative section-padding gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 right-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" /> About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Transforming Diagnostics<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">for a Healthier India</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              MediLab Diagnostics is one of India's leading diagnostic laboratories, committed to providing accurate, accessible, and affordable healthcare diagnostics to millions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '2M+', label: 'Patients Trusted' },
              { icon: Award, value: '500+', label: 'Collection Centers' },
              { icon: FlaskConical, value: '1000+', label: 'Tests Offered' },
              { icon: Star, value: '4.9/5', label: 'Patient Rating' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 card-premium"
              >
                <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl font-heading font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2 mb-6">
                A Journey of Excellence in Diagnostics
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Founded in 2012 by Dr. Venkatesh Murthy, a visionary pathologist from AIIMS, MediLab Diagnostics began with a simple mission: to make world-class diagnostic services accessible to every Indian.
                </p>
                <p>
                  What started as a single laboratory in Bangalore has grown into one of India's most trusted diagnostic networks, with over 500 collection centers across 200+ cities. Our journey has been driven by an unwavering commitment to accuracy, innovation, and patient care.
                </p>
                <p>
                  Today, MediLab processes over 50,000 tests daily, serving more than 2 million patients annually. Our state-of-the-art laboratories are equipped with fully automated analyzers from Roche, Abbott, and Siemens, ensuring precision and reliability in every test result.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 gradient-primary rounded-2xl opacity-80" />
                  <div className="h-32 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">🔬</span>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-32 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">🧪</span>
                  </div>
                  <div className="h-48 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">🏥</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-lg text-slate-600">From a single lab to a nationwide network, our growth story is fueled by your trust.</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary-500 to-primary-200 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="card-premium p-6 inline-block max-w-md">
                      <span className="text-sm font-bold text-primary-600">{m.year}</span>
                      <h3 className="text-lg font-heading font-semibold text-slate-900 mt-1">{m.title}</h3>
                      <p className="text-sm text-slate-500 mt-2">{m.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 gradient-primary rounded-full items-center justify-center shrink-0 shadow-lg shadow-primary-500/30 z-10">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600">The principles that guide everything we do at MediLab Diagnostics.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="card-premium p-6"
              >
                <v.icon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="font-heading font-semibold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Our Leadership</h2>
            <p className="text-lg text-slate-600">Meet the experts leading our mission of diagnostic excellence.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((person, i) => (
              <motion.div
                key={person.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="card-premium p-6 text-center group"
              >
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">{person.image}</span>
                </div>
                <h3 className="font-heading font-semibold text-slate-900">{person.name}</h3>
                <p className="text-sm text-primary-600 font-medium mt-1">{person.role}</p>
                <p className="text-xs text-slate-500 mt-2">{person.qualification}</p>
                <p className="text-xs text-slate-400 mt-1">{person.experience}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-hero">
        <div className="container-premium text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to Experience the MediLab Difference?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Book a test today and join millions of satisfied patients who trust us with their health.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book-home-collection" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all">
                Book Home Collection <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-4" />
    </div>
  );
}
