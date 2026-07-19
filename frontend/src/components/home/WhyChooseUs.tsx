'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Clock, Heart, Microscope, Home, UserCheck, Truck, BadgeCheck, FlaskConical, Users, HeadphonesIcon } from 'lucide-react';

const features = [
  { icon: Award, title: 'NABL Accredited', description: 'Accredited by National Accreditation Board for Testing and Calibration Laboratories.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Microscope, title: 'Advanced Technology', description: 'State-of-the-art automated analyzers for accurate and precise results.', color: 'bg-blue-50 text-blue-600' },
  { icon: Clock, title: 'Quick Reports', description: 'Most reports delivered within 6-24 hours of sample collection.', color: 'bg-amber-50 text-amber-600' },
  { icon: Home, title: 'Free Home Collection', description: 'Free sample collection from your home by trained phlebotomists.', color: 'bg-purple-50 text-purple-600' },
  { icon: UserCheck, title: 'Expert Team', description: 'Highly qualified pathologists and experienced lab technicians.', color: 'bg-rose-50 text-rose-600' },
  { icon: Shield, title: 'Quality Assured', description: 'Strict quality control measures at every step of the testing process.', color: 'bg-cyan-50 text-cyan-600' },
  { icon: Truck, title: 'Pan-India Network', description: '500+ collection centers across 200+ cities in India.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: HeadphonesIcon, title: '24/7 Support', description: 'Round-the-clock customer support for all your queries and concerns.', color: 'bg-teal-50 text-teal-600' },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-white" id="why-choose-us">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <BadgeCheck className="w-4 h-4" />
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Why MediLab Diagnostics?
          </h2>
          <p className="text-lg text-slate-600">
            We combine advanced technology with compassionate care to provide the best diagnostic experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="card-premium p-6 group"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
