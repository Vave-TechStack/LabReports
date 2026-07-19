'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Heart, Brain, Activity, Users, Star, Clock, CheckCircle } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const packageIcons = [Heart, Brain, Activity, Users, Shield, Star];

interface HealthPackage {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  discountPrice: number;
  isPopular: boolean;
  reportTime: string;
  tests: { test: { name: string } }[];
}

export function HealthPackages() {
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await apiService.packages.getPopular();
        // response.data = { success, data, meta }
        setPackages(response.data?.data || []);
      } catch { /* */ }
      setLoading(false);
    };
    fetchPackages();
  }, []);

  return (
    <section className="section-padding bg-white" id="packages">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Health Packages
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Comprehensive Health Packages
          </h2>
          <p className="text-lg text-slate-600">
            Choose from our carefully curated health checkup packages designed for every need and budget.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-premium p-6">
                <div className="skeleton h-8 w-3/4 mb-4 rounded-lg" />
                <div className="skeleton h-4 w-1/2 mb-6 rounded-lg" />
                <div className="skeleton h-4 w-full mb-6 rounded-lg" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            ))
          ) : (
            packages.slice(0, 6).map((pkg, index) => {
              const Icon = packageIcons[index % packageIcons.length];
              const savings = pkg.discountPrice ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100) : 0;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="card-premium p-6 group"
                >
                  {pkg.isPopular && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold rounded-full mb-4">
                      <Star className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                  <Icon className="w-10 h-10 text-primary-600 mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{pkg.shortDescription}</p>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-heading font-bold text-slate-900">
                      {formatCurrency(pkg.discountPrice || pkg.price)}
                    </span>
                    {pkg.discountPrice && (
                      <>
                        <span className="text-sm text-slate-400 line-through">{formatCurrency(pkg.price)}</span>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Save {savings}%
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reports in {pkg.reportTime}</span>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    {pkg.tests?.slice(0, 4).map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {t.test.name}
                      </div>
                    ))}
                    {pkg.tests && pkg.tests.length > 4 && (
                      <p className="text-xs text-primary-600 font-medium ml-5">+{pkg.tests.length - 4} more tests</p>
                    )}
                  </div>

                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 hover:border-primary-300 transition-all group"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
          >
            View All Packages
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
