'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, TestTube, Award, Building2, Activity, Heart } from 'lucide-react';

const stats = [
  { icon: Users, value: 2000000, suffix: '+', label: 'Patients Served', prefix: '' },
  { icon: TestTube, value: 500, suffix: '+', label: 'Tests Offered', prefix: '' },
  { icon: Building2, value: 200, suffix: '+', label: 'Cities Covered', prefix: '' },
  { icon: Award, value: 15, suffix: '+', label: 'Years of Excellence', prefix: '' },
  { icon: Activity, value: 50000, suffix: '+', label: 'Tests Daily', prefix: '' },
  { icon: Heart, value: 99, suffix: '%', label: 'Patient Satisfaction', prefix: '' },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="counter-value">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function LiveStatistics() {
  return (
    <section className="section-padding gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
        <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 right-0 blur-3xl" />
      </div>

      <div className="container-premium relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-primary-100">
            We take pride in serving millions of patients with accurate diagnostics and compassionate care.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
              <p className="text-2xl md:text-3xl font-heading font-bold text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
              <p className="text-sm text-primary-200 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
