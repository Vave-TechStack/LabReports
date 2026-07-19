'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ChevronDown, HelpCircle, FileText, CreditCard, FlaskConical, Truck, User, Shield, Clock, ArrowRight, Phone, Mail } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'booking', label: 'Booking & Appointments', icon: FileText },
  { id: 'tests', label: 'Tests & Reports', icon: FlaskConical },
  { id: 'collection', label: 'Sample Collection', icon: Truck },
  { id: 'payment', label: 'Payment & Pricing', icon: CreditCard },
  { id: 'account', label: 'Account & Profile', icon: User },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
];

const faqs = [
  {
    category: 'booking',
    q: 'How do I book a test?',
    a: 'You can book a test online through our website by selecting the tests you need, choosing an appointment time, and completing the booking. You can also book by calling our helpline at +91 80880 00100 or visiting any of our collection centers.'
  },
  {
    category: 'booking',
    q: 'Can I reschedule or cancel my appointment?',
    a: 'Yes, you can reschedule or cancel your appointment up to 2 hours before the scheduled time at no charge. Please call our support team or log in to your account to make changes. Last-minute cancellations may incur a nominal fee.'
  },
  {
    category: 'booking',
    q: 'Do I need a doctor\'s prescription for tests?',
    a: 'While most routine tests can be booked without a prescription, certain specialized tests may require a doctor\'s referral. Our team will advise you at the time of booking if a prescription is needed.'
  },
  {
    category: 'booking',
    q: 'Is home sample collection available?',
    a: 'Yes, we offer free home sample collection across all major cities. Our trained phlebotomist will visit your home at the scheduled time. The service is free with all tests and packages within 10 km of our collection centers.'
  },
  {
    category: 'booking',
    q: 'How early should I book an appointment?',
    a: 'We recommend booking at least 24 hours in advance for home collection and 2 hours in advance for lab visits. Same-day appointments are available subject to slot availability.'
  },
  {
    category: 'tests',
    q: 'How long does it take to get reports?',
    a: 'Most routine reports are available within 6-24 hours. Specialized tests may take 24-48 hours. You will receive a notification via WhatsApp and email when your reports are ready. You can also check your patient portal for real-time status.'
  },
  {
    category: 'tests',
    q: 'How can I access my reports?',
    a: 'Reports are delivered via WhatsApp, email, and our patient portal. You can also download them from our website using your registered mobile number. Printed copies are available at our collection centers.'
  },
  {
    category: 'tests',
    q: 'Are the reports explained?',
    a: 'Yes, your report includes reference ranges for all parameters. Abnormal values are flagged for easy identification. You can also schedule a free consultation with our doctors to understand your results.'
  },
  {
    category: 'tests',
    q: 'Do you offer second opinion on reports?',
    a: 'Yes, we provide free expert review of your reports by our senior pathologists. You can request a second opinion by contacting our customer support team.'
  },
  {
    category: 'collection',
    q: 'Do I need to fast before a blood test?',
    a: 'For tests like Fasting Blood Sugar (FBS) and Lipid Profile, fasting for 8-12 hours is required. You may drink water during this time. For other tests like CBC, Thyroid, and Vitamin tests, no fasting is needed. Specific instructions will be provided at booking.'
  },
  {
    category: 'collection',
    q: 'Is the home collection service safe and hygienic?',
    a: 'Absolutely. Our phlebotomists follow strict safety protocols including hand sanitization, use of gloves, and single-use sterile equipment. All samples are transported in biohazard-safe containers following NABL guidelines.'
  },
  {
    category: 'collection',
    q: 'What should I wear for sample collection?',
    a: 'Wear loose, comfortable clothing with sleeves that can be easily rolled up above the elbow. This helps our phlebotomist access the vein easily and makes the process more comfortable.'
  },
  {
    category: 'payment',
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods including Credit/Debit Cards, Net Banking, UPI (GPay, PhonePe, Paytm), and Cash on collection. Online payments are processed through our secure payment gateway.'
  },
  {
    category: 'payment',
    q: 'Do you offer discounts on bulk bookings?',
    a: 'Yes, we offer special discounts for corporate bookings, family packages, and annual health checkup plans. Contact our sales team for customized pricing based on your requirements.'
  },
  {
    category: 'payment',
    q: 'Can I get a refund if I cancel my test?',
    a: 'Yes, you can get a full refund if you cancel before sample collection. Once the sample is collected, refunds are processed on a case-by-case basis. Please refer to our refund policy for detailed terms.'
  },
  {
    category: 'account',
    q: 'How do I create an account?',
    a: 'You can create an account by signing up on our website with your email or phone number. You can also register while booking your first test. Your account will store all your reports and health history securely.'
  },
  {
    category: 'account',
    q: 'Can I manage family members\' health records?',
    a: 'Yes, you can add family members to your account and manage their health records, book tests on their behalf, and access their reports. This is especially useful for parents and children\'s health management.'
  },
  {
    category: 'privacy',
    q: 'How is my health data protected?',
    a: 'We take data privacy very seriously. All health records are encrypted and stored on secure servers. We comply with HIPAA and Indian data protection regulations. Your data is never shared with third parties without your explicit consent.'
  },
  {
    category: 'privacy',
    q: 'Are my payment details secure?',
    a: 'Yes, all payments are processed through PCI-DSS compliant payment gateways. Your card details are never stored on our servers. We use industry-standard encryption for all financial transactions.'
  },
  {
    category: 'privacy',
    q: 'How do I delete my account and data?',
    a: 'You can request account deletion by contacting our support team. All your personal data will be permanently deleted within 30 days. Medical records are retained as per regulatory requirements for a specified period.'
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filtered = faqs.filter(f => {
    const matchCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchSearch = !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" /> FAQ
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Find answers to common questions about our services, tests, and policies.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-slate-900 placeholder:text-gray-400 outline-none shadow-xl text-base" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.id ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}>
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-slate-500">No questions found. Try a different search.</p>
              </div>
            ) : (
              filtered.map((faq, i) => {
                const isOpen = openFaq === `${faq.q}-${i}`;
                return (
                  <motion.div
                    key={`${faq.q}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    className="card-premium overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : `${faq.q}-${i}`)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="text-sm font-medium text-slate-900 pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="h-px bg-gray-100 mb-4" />
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="card-premium p-8 text-center max-w-2xl mx-auto">
            <HelpCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Still Have Questions?</h2>
            <p className="text-slate-500 mb-6">Our support team is available 24/7 to help you.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+918088000100" className="btn-primary inline-flex items-center gap-2">
                <Phone className="w-4 h-4" /> Call +91 80880 00100
              </a>
              <Link href="/contact" className="btn-outline inline-flex items-center gap-2">
                <Mail className="w-4 h-4" /> Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
