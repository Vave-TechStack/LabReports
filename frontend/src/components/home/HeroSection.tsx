'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Shield, Award, Microscope, ChevronRight, TrendingUp, Droplets, Activity, Heart, ArrowRight, Star, Clock, Users, FlaskConical } from 'lucide-react';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { icon: Users, value: '2M+', label: 'Patients Trusted' },
    { icon: Award, value: 'NABL', label: 'Accredited' },
    { icon: Clock, value: '6-24', label: 'Hours Report' },
    { icon: Star, value: '4.9', label: 'Patient Rating' },
  ];

  const floatingIcons = [
    { Icon: Microscope, className: 'top-20 left-[15%] text-primary-300/30', size: 48, delay: 0 },
    { Icon: Droplets, className: 'top-40 right-[20%] text-primary-400/20', size: 36, delay: 1 },
    { Icon: Activity, className: 'bottom-32 left-[25%] text-secondary-300/25', size: 42, delay: 2 },
    { Icon: Heart, className: 'bottom-24 right-[15%] text-rose-300/25', size: 40, delay: 0.5 },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full -top-20 -left-20 blur-3xl" />
        <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full top-40 -right-20 blur-3xl" />
        <div className="absolute w-[300px] h-[300px] bg-white/5 rounded-full bottom-20 left-1/2 blur-2xl" />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, className, size, delay }, i) => (
        <motion.div
          key={i}
          className={`absolute ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <div className="container-premium relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8">
                <Shield className="w-4 h-4 text-emerald-300" />
                <span>NABL Accredited · ISO 15189:2022 Certified</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Advanced Blood<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">
                  Diagnostics
                </span>
                <br />for a Healthier You
              </h1>

              <p className="text-lg text-white/80 max-w-lg mb-8 leading-relaxed">
                India&apos;s most trusted diagnostic laboratory. Get accurate results with free home sample collection, online reports, and expert doctor consultation.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-xl mb-8"
            >
              <div className="flex items-center bg-white rounded-2xl shadow-2xl p-2">
                <div className="flex-1 flex items-center gap-3 pl-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for blood tests, health packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3 text-gray-700 placeholder:text-gray-400 bg-transparent outline-none text-base"
                  />
                </div>
                <Link
                  href={searchQuery ? `/tests?search=${encodeURIComponent(searchQuery)}` : '/tests'}
                  className="gradient-primary text-white px-6 py-3 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  Search
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Popular Searches */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['CBC', 'Thyroid', 'Diabetes', 'Lipid Profile', 'Vitamin D'].map((term) => (
                  <Link
                    key={term}
                    href={`/tests?search=${term}`}
                    className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white/80 hover:bg-white/20 transition-all duration-200"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/book-appointment"
                className="group inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Book a Test
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Health Packages
              </Link>
            </motion.div>
          </div>

          {/* Right - Stats & Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-emerald-300 mb-3" />
                  <p className="text-3xl font-heading font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/70 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4"
            >
              <FlaskConical className="w-10 h-10 text-emerald-300 shrink-0" />
              <div>
                <p className="text-white font-semibold">50,000+ Tests Daily</p>
                <p className="text-sm text-white/70">Processed with advanced automated analyzers</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}
