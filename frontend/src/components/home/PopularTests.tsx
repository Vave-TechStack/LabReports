'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ChevronRight, TrendingUp, Droplets, Clock } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Test {
  id: string;
  name: string;
  code: string;
  price: number;
  discountPrice: number | null;
  reportTime: string;
  sampleType: string;
  shortDescription: string;
  category: { name: string; slug: string };
}

export function PopularTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await apiService.tests.getPopular();
        // route returns the tests array directly
        setTests(response.data?.data || response.data || []);
      } catch { /* */ }
      setLoading(false);
    };
    fetchTests();
  }, []);

  return (
    <section className="section-padding bg-surface" id="tests">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Popular Tests
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Most Requested Tests
          </h2>
          <p className="text-lg text-slate-600">
            Accurate diagnostics with quick turnaround times. Choose from 500+ tests.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-premium p-5">
                <div className="skeleton h-10 w-10 rounded-xl mb-4" />
                <div className="skeleton h-5 w-3/4 mb-2 rounded-lg" />
                <div className="skeleton h-4 w-full mb-4 rounded-lg" />
                <div className="skeleton h-4 w-1/2 mb-4 rounded-lg" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            ))
          ) : (
            tests.slice(0, 8).map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="card-premium p-5 group cursor-pointer"
              >
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <Droplets className="w-5 h-5 text-white" />
                </div>

                <h3 className="font-heading font-semibold text-slate-900 mb-1">{test.name}</h3>
                <p className="text-xs text-primary-600 font-medium mb-1">{test.code}</p>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{test.shortDescription}</p>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-heading font-bold text-slate-900">
                    {formatCurrency(test.discountPrice || test.price)}
                  </span>
                  {test.discountPrice && (
                    <span className="text-xs text-slate-400 line-through">{formatCurrency(test.price)}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {test.reportTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {test.sampleType}
                  </span>
                </div>

                <Link
                  href={`/tests/${test.code}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 text-slate-700 rounded-xl text-sm font-medium hover:bg-primary-50 hover:text-primary-700 transition-all group"
                >
                  Book Now
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 btn-outline font-semibold px-8 py-3.5"
          >
            View All Tests ({tests.length}+)
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
