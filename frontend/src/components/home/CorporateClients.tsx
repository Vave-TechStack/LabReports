'use client';

import { motion } from 'framer-motion';
import { Building2, Briefcase, Heart, Shield } from 'lucide-react';

const clients = [
  { name: 'Tata Group', icon: Briefcase },
  { name: 'Infosys', icon: Building2 },
  { name: 'Wipro', icon: Heart },
  { name: 'Reliance', icon: Shield },
  { name: 'Aditya Birla', icon: Building2 },
  { name: 'ICICI Bank', icon: Briefcase },
  { name: 'HDFC', icon: Heart },
  { name: 'Google India', icon: Shield },
];

export function CorporateClients() {
  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Trusted By
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Corporate Clients & Partners
          </h2>
          <p className="text-lg text-slate-600">
            We partner with India&apos;s leading organizations for their employee health checkup needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="card-premium p-4 text-center flex flex-col items-center justify-center gap-2"
            >
              <client.icon className="w-6 h-6 text-primary-600" />
              <span className="text-xs font-medium text-slate-700">{client.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
