'use client';

import { motion } from 'framer-motion';
import { Microscope, Shield, CheckCircle, Thermometer, Syringe, TestTube } from 'lucide-react';

const processSteps = [
  { icon: Syringe, title: 'Sterile Collection', description: 'All samples collected with sterile, single-use equipment by trained phlebotomists.' },
  { icon: Thermometer, title: 'Cold Chain Maintained', description: 'Samples transported in temperature-controlled containers to maintain integrity.' },
  { icon: Microscope, title: 'Advanced Analysis', description: 'State-of-the-art automated analyzers process samples with precision.' },
  { icon: Shield, title: 'Quality Check', description: 'Multiple quality checks at every stage ensure 99.9% accuracy.' },
  { icon: CheckCircle, title: 'Doctor Verification', description: 'Each report is verified by experienced pathologists before release.' },
  { icon: TestTube, title: 'Secure Storage', description: 'Samples stored securely for retesting if needed, per regulatory guidelines.' },
];

export function SampleCollectionProcess() {
  return (
    <section className="section-padding bg-white" id="sample-process">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Microscope className="w-4 h-4" />
            Our Process
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Sample Collection & Testing Process
          </h2>
          <p className="text-lg text-slate-600">
            From sample collection to report delivery, we maintain the highest standards of quality and accuracy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-premium p-6 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <step.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
