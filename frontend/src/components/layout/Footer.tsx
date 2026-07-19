'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FlaskConical, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, Linkedin, ChevronRight } from 'lucide-react';

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

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Top CTA Section */}
      <div className="gradient-primary">
        <div className="container-premium py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-heading font-bold text-white">Ready to Get Started?</h3>
              <p className="text-primary-100 mt-1">Book your health checkup today and take the first step towards better health.</p>
            </div>
            <Link href="/book-appointment" className="px-8 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:shadow-lg hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-premium py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary-300" />
              </div>
              <div>
                <span className="text-xl font-heading font-bold text-white">
                  Medi<span className="text-primary-300">Lab</span>
                </span>
                <p className="text-[10px] text-gray-400 -mt-1 tracking-widest uppercase">Diagnostics</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              India&apos;s most trusted blood diagnostic laboratory with advanced technology, NABL accredited, providing accurate and timely results for over 2 million patients.
            </p>
            <div className="space-y-3">
              <a href="tel:+918088000100" className="flex items-center gap-3 text-gray-300 hover:text-primary-300 transition-colors">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>+91 80880 00100</span>
              </a>
              <a href="mailto:info@medilab.com" className="flex items-center gap-3 text-gray-300 hover:text-primary-300 transition-colors">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>info@medilab.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-primary-400 mt-1 shrink-0" />
                <span>42, Tech Park Boulevard, Whitefield, Bangalore - 560066</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-4 h-4 text-primary-400 shrink-0" />
                <span>Mon - Sat: 7:00 AM - 8:00 PM | Sun: 8:00 AM - 2:00 PM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-8">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-gray-300 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-all group">
                    <ChevronRight className="w-3 h-3 text-primary-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-gray-300 mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-all group">
                    <ChevronRight className="w-3 h-3 text-primary-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-gray-300 mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.patientResources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 text-gray-400 hover:text-primary-300 transition-all group">
                    <ChevronRight className="w-3 h-3 text-primary-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-premium py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} MediLab Diagnostics. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy-policy" className="hover:text-primary-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-300 transition-colors">Terms of Use</Link>
              <Link href="/refund-policy" className="hover:text-primary-300 transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
