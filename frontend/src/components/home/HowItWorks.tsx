'use client';

import { motion } from 'framer-motion';
import { Search, CalendarCheck, FlaskConical, Download, ArrowDown, Smartphone, CreditCard, Bell } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Select Tests', description: 'Choose from 500+ tests or comprehensive health packages tailored for you.' },
  { icon: CalendarCheck, title: 'Book Appointment', description: 'Pick your preferred time slot. Choose lab visit or free home collection.' },
  { icon: CreditCard, title: 'Pay Online', description: 'Secure payment via UPI, cards, net banking, or digital wallets.' },
  { icon: FlaskConical, title: 'Sample Collection', description: 'Visit our lab or our phlebotomist collects your sample at home.' },
  { icon: Bell, title: 'Get Reports', description: 'Receive reports via WhatsApp & Email. Track your sample status in real-time.' },
  { icon: Download, title: 'Download & Share', description: 'Download PDF reports anytime from your secure patient portal.' },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-surface" id="how-it-works">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Smartphone className="w-4 h-4" />
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Simple & Convenient Process
          </h2>
          <p className="text-lg text-slate-600">
            Getting your health checkup done is as easy as 1-2-3-4-5-6.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-300 to-primary-100 hidden md:block" />

          <div className="space-y-8 md:space-y-0 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-6 md:gap-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} mb-8 md:mb-0 md:even:mt-16`}
              >
                {/* Step Number & Icon */}
                <div className="relative shrink-0 z-10">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">
                    {index + 1}
                  </div>
                </div>

                {/* Content Card */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex-1 card-premium p-6 max-w-lg"
                >
                  <h3 className="font-heading font-semibold text-slate-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
