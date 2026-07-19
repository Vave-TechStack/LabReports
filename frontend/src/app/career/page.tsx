'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Star, Shield, CheckCircle, Search, ChevronDown, Mail, Phone, Loader2, Send, Heart, TrendingUp, GraduationCap, Calendar } from 'lucide-react';

const departments = [
  { name: 'Pathology', positions: 4, icon: '🔬' },
  { name: 'Radiology', positions: 2, icon: '🫁' },
  { name: 'Phlebotomy', positions: 6, icon: '💉' },
  { name: 'Customer Support', positions: 3, icon: '📞' },
  { name: 'IT & Development', positions: 2, icon: '💻' },
  { name: 'Sales & Marketing', positions: 5, icon: '📊' },
  { name: 'Administration', positions: 2, icon: '📋' },
  { name: 'Quality Assurance', positions: 1, icon: '✅' },
];

const openings = [
  { id: 1, title: 'Senior Pathologist', dept: 'Pathology', location: 'Bangalore', type: 'Full-time', experience: '8-12 years', description: 'Lead our diagnostic team with expertise in clinical pathology. Supervise lab operations and ensure quality standards.', salary: '₹25L - ₹35L PA', posted: '2 days ago', icon: '🔬' },
  { id: 2, title: 'Lab Technician', dept: 'Pathology', location: 'Multiple Cities', type: 'Full-time', experience: '1-3 years', description: 'Perform routine and specialized diagnostic tests. Maintain lab equipment and follow quality protocols.', salary: '₹3L - ₹5L PA', posted: '5 days ago', icon: '🧪' },
  { id: 3, title: 'Phlebotomist', dept: 'Phlebotomy', location: 'Bangalore', type: 'Full-time', experience: '0-2 years', description: 'Collect blood samples with expertise and care. Ensure patient comfort and sample quality.', salary: '₹2.5L - ₹4L PA', posted: '1 week ago', icon: '💉' },
  { id: 4, title: 'Senior Phlebotomist', dept: 'Phlebotomy', location: 'Mumbai', type: 'Full-time', experience: '3-5 years', description: 'Lead phlebotomy team, train junior staff, and handle complex collection cases.', salary: '₹4L - ₹6L PA', posted: '3 days ago', icon: '💉' },
  { id: 5, title: 'Customer Relationship Manager', dept: 'Customer Support', location: 'Bangalore', type: 'Full-time', experience: '3-5 years', description: 'Manage patient relationships, handle escalations, and improve service experience.', salary: '₹6L - ₹9L PA', posted: '1 week ago', icon: '📞' },
  { id: 6, title: 'Frontend Developer', dept: 'IT & Development', location: 'Bangalore', type: 'Full-time', experience: '2-4 years', description: 'Build and maintain web applications using React, Next.js, and TypeScript.', salary: '₹8L - ₹14L PA', posted: '2 days ago', icon: '💻' },
  { id: 7, title: 'Sales Executive', dept: 'Sales & Marketing', location: 'Multiple Cities', type: 'Full-time', experience: '1-3 years', description: 'Drive B2B sales for corporate health packages and wellness programs.', salary: '₹4L - ₹7L PA + Incentives', posted: '4 days ago', icon: '📊' },
  { id: 8, title: 'Digital Marketing Specialist', dept: 'Sales & Marketing', location: 'Bangalore', type: 'Full-time', experience: '2-4 years', description: 'Manage digital campaigns, SEO, social media, and online brand presence.', salary: '₹5L - ₹8L PA', posted: '1 week ago', icon: '📈' },
  { id: 9, title: 'Quality Assurance Officer', dept: 'Quality Assurance', location: 'Bangalore', type: 'Full-time', experience: '4-6 years', description: 'Ensure NABL and ISO compliance. Conduct audits and implement quality improvement initiatives.', salary: '₹7L - ₹10L PA', posted: '6 days ago', icon: '✅' },
  { id: 10, title: 'HR Executive', dept: 'Administration', location: 'Bangalore', type: 'Full-time', experience: '2-4 years', description: 'Manage recruitment, employee relations, payroll, and HR operations.', salary: '₹4L - ₹6L PA', posted: '3 days ago', icon: '📋' },
];

const benefits = [
  { icon: Heart, title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and your family up to ₹10L' },
  { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Clear career progression paths with regular performance reviews' },
  { icon: GraduationCap, title: 'Learning & Development', desc: 'Sponsored certifications, workshops, and advanced training programs' },
  { icon: Shield, title: 'Job Security', desc: 'Stable career with India\'s fastest growing diagnostic chain' },
  { icon: Star, title: 'Performance Bonuses', desc: 'Quarterly and annual performance-based incentives' },
  { icon: Calendar, title: 'Flexible Schedules', desc: 'Work-life balance with flexible shift options' },
];

export default function CareerPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [appliedJob, setAppliedJob] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const filtered = openings.filter(j => {
    const matchDept = deptFilter === 'All' || j.dept === deptFilter;
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.dept.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleApply = (jobId: number) => {
    setAppliedJob(jobId);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
                <Briefcase className="w-4 h-4" /> Careers
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Join the MediLab<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">Family</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Be part of India's most trusted diagnostic laboratory. We're looking for passionate individuals to join our team of 2,000+ healthcare professionals.
              </p>
              <div className="flex flex-wrap gap-3">
                {['2,000+ Team Members', '500+ Centers', '12 Cities', '4.9 Rating'].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/90 font-medium">
                    <CheckCircle className="w-3 h-3 text-emerald-300" /> {tag}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '20+', label: 'Open Positions' },
                    { value: '8+', label: 'Departments Hiring' },
                    { value: '4.5', label: 'Employee Rating' },
                    { value: '95%', label: 'Retention Rate' },
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

      {/* Departments */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Departments Hiring</h2>
            <p className="text-slate-500">Explore opportunities across various departments.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((d, i) => (
              <motion.button
                key={d.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                onClick={() => { setDeptFilter(d.name); setSearch(''); }}
                className={`card-premium p-4 text-center cursor-pointer ${deptFilter === d.name ? 'ring-2 ring-primary-500' : ''}`}
              >
                <span className="text-2xl mb-2 block">{d.icon}</span>
                <p className="text-sm font-medium text-slate-900">{d.name}</p>
                <p className="text-xs text-primary-600">{d.positions} positions</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-heading font-bold text-slate-900">Open Positions</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 py-2 text-sm w-48" />
              </div>
              <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input-field py-2 text-sm w-40">
                <option value="All">All Departments</option>
                {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto card-premium p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-2">Application Submitted! 🎉</h2>
              <p className="text-slate-500 mb-4">Thank you for applying. Our HR team will review your application and get back to you within 5-7 business days.</p>
              <button onClick={() => { setSubmitted(false); setAppliedJob(null); }} className="btn-outline text-sm">Browse More Jobs</button>
            </motion.div>
          ) : showForm && appliedJob ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
              <button onClick={() => { setShowForm(false); setAppliedJob(null); }} className="text-sm text-primary-600 hover:text-primary-700 mb-4">← Back to jobs</button>
              <form onSubmit={handleSubmit} className="card-premium p-6 space-y-4">
                <div className="bg-primary-50 rounded-xl p-3 mb-2">
                  <p className="text-sm font-medium text-primary-800">Applying for: {openings.find(j => j.id === appliedJob)?.title}</p>
                  <p className="text-xs text-primary-600">{openings.find(j => j.id === appliedJob)?.dept} • {openings.find(j => j.id === appliedJob)?.location}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" required className="input-field" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input type="email" required className="input-field" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                    <input type="tel" required className="input-field" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                    <input type="number" className="input-field" placeholder="e.g., 3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Company</label>
                  <input type="text" className="input-field" placeholder="Current/Last employer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Why are you interested? (Optional)</label>
                  <textarea rows={3} className="input-field resize-none" placeholder="Tell us why you'd be a great fit..." />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  <Send className="w-4 h-4" /> Submit Application
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-slate-500">No open positions found matching your criteria.</p>
                </div>
              ) : (
                filtered.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                    className="card-premium p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                          {job.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-slate-900">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.dept}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3" />{job.experience}</span>
                          </div>
                          <p className={`text-sm text-slate-600 mt-2 ${expandedId === job.id ? '' : 'line-clamp-2'}`}>{job.description}</p>
                          {expandedId === job.id && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm">
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-500">Salary Range:</span>
                                <span className="font-medium text-slate-900">{job.salary}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Posted:</span>
                                <span className="font-medium text-slate-900">{job.posted}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button onClick={() => handleApply(job.id)} className="btn-primary text-sm py-2 px-4">
                          Apply Now
                        </button>
                        <button onClick={() => setExpandedId(expandedId === job.id ? null : job.id)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                          {expandedId === job.id ? 'Show Less' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Why Join MediLab?</h2>
            <p className="text-lg text-slate-600">We invest in our people with great benefits and growth opportunities.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-premium p-6 flex items-start gap-4">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shrink-0">
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-slate-500">{b.desc}</p>
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
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Don't See the Right Role?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:careers@medilab.com" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all">
                <Mail className="w-4 h-4" /> careers@medilab.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
