'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, ChevronRight,
  ArrowRight, Sparkles, ShieldCheck, Award, Users, Microscope
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const footerLinks = {
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'All Tests', href: '/tests' },
    { label: 'Health Packages', href: '/packages' },
    { label: 'Book Appointment', href: '/book-appointment' },
    { label: 'Home Collection', href: '/book-home-collection' },
    { label: 'Download Reports', href: '/reports' },
    { label: 'Contact Us', href: '/contact' },
  ],
  services: [
    { label: 'Blood Tests', href: '/tests' },
    { label: 'Health Checkups', href: '/packages' },
    { label: 'Home Collection', href: '/book-home-collection' },
    { label: 'Corporate Services', href: '/corporate-services' },
    { label: 'Preventive Care', href: '/preventive-checkups' },
    { label: 'Wellness Programs', href: '/wellness' },
  ],
  patientResources: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Career', href: '/career' },
  ],
};

const socialLinks = [
  { icon: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ), href: '#', hoverColor: 'hover:bg-[#1877F2]' },
  { icon: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ), href: '#', hoverColor: 'hover:bg-black' },
  { icon: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ), href: '#', hoverColor: 'hover:bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]' },
  { icon: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  ), href: '#', hoverColor: 'hover:bg-[#FF0000]' },
  { icon: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ), href: '#', hoverColor: 'hover:bg-[#0A66C2]' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/3 rounded-full blur-3xl" />
      </div>

      {/* Top CTA Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-cyan-600 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          </div>
          <div className="container-premium py-12 md:py-14 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium text-primary-100 uppercase tracking-wider">Limited Time Offer</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">
                  Ready to Take Control of Your Health?
                </h3>
                <p className="text-primary-100/80 mt-2 max-w-xl">
                  Book your health checkup today and get <span className="text-yellow-300 font-semibold">20% off</span> on your first test. Early detection saves lives.
                </p>
              </div>
              <Link
                href="/book-appointment"
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 rounded-xl font-semibold shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="border-b border-gray-800/50"
      >
        <div className="container-premium py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: 'NABL Accredited' },
              { icon: Award, label: 'ISO Certified' },
              { icon: Users, label: '2M+ Patients' },
              { icon: Microscope, label: '1000+ Tests' },
            ].map((badge) => (
              <motion.div
                key={badge.label}
                variants={itemVariants}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300 group cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:border-primary-500/40 transition-all duration-300">
                  <badge.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-white">{badge.label}</span>
                  <span className="block text-xs text-gray-500">Certified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Footer */}
      <div className="container-premium py-16 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8"
        >
          {/* Company Info - 2 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-cyan-400/20 rounded-xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:scale-110" />
                <Image
                  src="/images/logo.png"
                  alt="MediLab Diagnostics"
                  width={164}
                  height={40}
                  className="h-10 w-auto object-contain relative transition-all duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              India&apos;s most trusted blood diagnostic laboratory with advanced NABL-accredited technology,
              providing accurate and timely results for over <span className="text-primary-300 font-semibold">2 million</span> happy patients.
            </p>

            {/* Contact Details */}
            <div className="space-y-3.5">
              <a href="tel:+918088000100" className="flex items-center gap-3.5 text-gray-300 hover:text-primary-300 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                  <Phone className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500">24/7 Helpline</span>
                  <span className="block text-sm font-medium">+91 80880 00100</span>
                </div>
              </a>
              <a href="mailto:info@medilab.com" className="flex items-center gap-3.5 text-gray-300 hover:text-primary-300 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                  <Mail className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Email</span>
                  <span className="block text-sm font-medium">info@medilab.com</span>
                </div>
              </a>
              <div className="flex items-start gap-3.5 text-gray-300 group">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Address</span>
                  <span className="block text-sm">                  1-98/8, Madhapur Main Road, Hyderabad - 500081</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 text-gray-300 group">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Working Hours</span>
                  <span className="block text-sm">Mon - Sat: 7 AM - 8 PM | Sun: 8 AM - 2 PM</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 mt-8">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={cn(
                    'w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:border-transparent',
                    social.hoverColor
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-gray-300 mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary-500 rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-all text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-gray-300 mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500 rounded-full" />
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-all text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-gray-300 mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full" />
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.patientResources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-amber-300 transition-all text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50 relative">
        <div className="container-premium py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1.5">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="font-medium text-gray-400">MediLab Diagnostics</span>
              <span className="hidden sm:inline">. All rights reserved.</span>
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">We Accept:</span>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Visa', icon: 'M2 4h20v16H2z' },
                  { name: 'Mastercard', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
                  { name: 'UPI', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
                ].map((pm) => (
                  <div
                    key={pm.name}
                    className="w-8 h-5 rounded bg-white/10 flex items-center justify-center text-[8px] text-gray-400 font-bold"
                    title={pm.name}
                  >
                    {pm.name.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 text-sm text-gray-500">
              <Link href="/privacy-policy" className="hover:text-primary-300 transition-colors">Privacy</Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="hover:text-primary-300 transition-colors">Terms</Link>
              <span className="text-gray-700">|</span>
              <Link href="/refund-policy" className="hover:text-primary-300 transition-colors">Refunds</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
