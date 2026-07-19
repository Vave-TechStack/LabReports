'use client';

import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, FileCheck, Building2, Globe } from 'lucide-react';

const certifications = [
  { icon: Award, title: 'NABL Accredited', description: 'ISO 15189:2022 Certified' },
  { icon: Shield, title: 'ISO 9001:2015', description: 'Quality Management System' },
  { icon: FileCheck, title: 'CAP Accredited', description: 'College of American Pathologists' },
  { icon: Globe, title: 'ICMR Recognized', description: 'Indian Council of Medical Research' },
  { icon: Building2, title: 'GST Compliant', description: 'Registered & Tax Compliant' },
  { icon: CheckCircle, title: 'HIPAA Compliant', description: 'Data Security Standards' },
];

export function CertificationsSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Our Certifications
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Accreditations & Certifications
          </h2>
          <p className="text-lg text-slate-600">
            We maintain the highest standards of quality and accuracy through rigorous certifications.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="card-premium p-5 text-center"
            >
              <cert.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="text-xs font-heading font-semibold text-slate-900 mb-1">{cert.title}</h3>
              <p className="text-[10px] text-slate-500">{cert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
