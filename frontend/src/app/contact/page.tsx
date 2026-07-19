'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, ChevronDown, MessageSquare, HeadphonesIcon, Building2 } from 'lucide-react';
import Link from 'next/link';

const branches = [
  { name: 'MediLab Diagnostics - Main Lab', address: '42, Tech Park Boulevard, Whitefield', city: 'Bangalore', state: 'Karnataka', pincode: '560066', phone: '+91 80880 00100', email: 'bangalore@medilab.com', hours: 'Mon-Sat: 7AM-8PM | Sun: 8AM-2PM', isMain: true },
  { name: 'MediLab Diagnostics - Koramangala', address: '27, 80 Feet Road, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560095', phone: '+91 80880 00101', email: 'koramangala@medilab.com', hours: 'Mon-Sat: 7AM-8PM | Sun: 8AM-2PM', isMain: false },
  { name: 'MediLab Diagnostics - HSR Layout', address: '56, 27th Main Road, HSR Layout', city: 'Bangalore', state: 'Karnataka', pincode: '560102', phone: '+91 80880 00102', email: 'hsr@medilab.com', hours: 'Mon-Sat: 7AM-8PM | Sun: 8AM-2PM', isMain: false },
  { name: 'MediLab Diagnostics - Andheri', address: '12, SV Road, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400058', phone: '+91 80880 00200', email: 'mumbai@medilab.com', hours: 'Mon-Sat: 7AM-9PM | Sun: 8AM-2PM', isMain: false },
];

const faqs = [
  { q: 'How can I book a test?', a: 'You can book a test online through our website, call our helpline, or visit any of our collection centers. Home collection is available for most tests.' },
  { q: 'How do I get my reports?', a: 'Reports are delivered digitally via WhatsApp, email, and our patient portal. You can also download them from our website using your registered mobile number.' },
  { q: 'What is the turnaround time?', a: 'Most routine reports are available within 6-24 hours. Specialized tests may take 24-48 hours. You\'ll receive a notification when your reports are ready.' },
  { q: 'Is home sample collection available?', a: 'Yes, we offer free home sample collection across all our service areas. Book online or call us to schedule a visit at your convenience.' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 right-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Mail className="w-4 h-4" /> Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">We're Here to Help</h1>
            <p className="text-lg text-white/80">Have a question, feedback, or need assistance? Reach out to us. Our team is available 24/7.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section-padding bg-white -mt-10 relative z-20">
        <div className="container-premium">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Phone, label: 'Call Us', value: '+91 80880 00100', value2: '+91 80880 00200', color: 'bg-red-50 text-red-500', bg: 'hover:border-red-200' },
              { icon: Mail, label: 'Email Us', value: 'info@medilab.com', value2: 'support@medilab.com', color: 'bg-blue-50 text-blue-500', bg: 'hover:border-blue-200' },
              { icon: HeadphonesIcon, label: '24/7 Support', value: 'Toll-Free: 1800-123-4567', value2: 'support@medilab.com', color: 'bg-purple-50 text-purple-500', bg: 'hover:border-purple-200' },
              { icon: MessageSquare, label: 'WhatsApp', value: 'Chat with us', value2: '+91 80880 00100', color: 'bg-emerald-50 text-emerald-500', bg: 'hover:border-emerald-200' },
            ].map((item, i) => (
              <motion.div
                key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`card-premium p-5 text-center ${item.bg} transition-all`}
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-slate-900 text-sm">{item.label}</h3>
                <p className="text-sm text-slate-600 mt-1">{item.value}</p>
                <p className="text-sm text-primary-600 font-medium">{item.value2}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Send Us a Message</h2>
              <p className="text-slate-500 mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

              {submitted ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-500 mb-6">Thank you for reaching out. We'll respond within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card-premium p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <input type="text" required className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                      <input type="email" required className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                      <input type="tel" className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject *</label>
                      <input type="text" required className="input-field" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                    <textarea required rows={5} className="input-field resize-none" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map & Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <div className="card-premium overflow-hidden h-72">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNSJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="MediLab Location"
                />
              </div>

              <div className="card-premium p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">Main Laboratory</h4>
                    <p className="text-sm text-slate-500 mt-1">42, Tech Park Boulevard, Whitefield</p>
                    <p className="text-sm text-slate-500">Bangalore, Karnataka - 560066</p>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                      <Clock className="w-3 h-3" /> Mon-Sat: 7:00 AM - 8:00 PM | Sun: 8:00 AM - 2:00 PM
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/book-home-collection" className="block w-full btn-primary text-center py-3.5">
                Book Home Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Our Branches</h2>
            <p className="text-lg text-slate-600">Visit any of our branches across India for sample collection and consultations.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.map((branch, i) => (
              <motion.div
                key={branch.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`card-premium p-5 ${branch.isMain ? 'ring-2 ring-primary-500' : ''}`}
              >
                {branch.isMain && <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mb-2 inline-block">Main Lab</span>}
                <h3 className="font-medium text-slate-900 text-sm mb-1">{branch.name}</h3>
                <p className="text-xs text-slate-500">{branch.address}</p>
                <p className="text-xs text-slate-500">{branch.city}, {branch.state} - {branch.pincode}</p>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-600">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-500">{branch.hours}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-surface">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Quick Answers</h2>
            <p className="text-slate-600">Find answers to commonly asked questions.</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.details
                key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card-premium p-5 cursor-pointer group"
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
