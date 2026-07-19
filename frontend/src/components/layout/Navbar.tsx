'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, Phone, ChevronDown, User, LogIn, CalendarCheck,
  FlaskConical, Package, Home, Building2, Heart, ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface NavChild {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

const serviceLinks: NavChild[] = [
  { label: 'All Tests', href: '/tests', icon: FlaskConical, description: 'Browse 1000+ lab tests' },
  { label: 'Health Packages', href: '/packages', icon: Package, description: 'Comprehensive health checkups' },
  { label: 'Book Appointment', href: '/book-appointment', icon: CalendarCheck, description: 'Schedule your visit today' },
  { label: 'Book Home Collection', href: '/book-home-collection', icon: Home, description: 'Samples from your doorstep' },
  { label: 'Corporate Services', href: '/corporate-services', icon: Building2, description: 'Health solutions for business' },
  { label: 'Preventive Checkups', href: '/preventive-checkups', icon: Heart, description: 'Stay ahead with prevention' },
];

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '#', children: serviceLinks },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100/80'
          : 'bg-white border-b border-transparent'
      )}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-cyan-500/20 rounded-xl blur-xl transition-all duration-500 group-hover:blur-2xl group-hover:scale-110" />
              <Image
                src="/images/logo.png"
                alt="MediLab Diagnostics"
                width={164}
                height={40}
                className="h-10 w-auto object-contain relative transition-all duration-500 group-hover:scale-[1.02]"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.children ? (
                  <button
                    className={cn(
                      'group flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300',
                      activeDropdown === link.label
                        ? 'text-primary-700 bg-primary-50/80 shadow-sm'
                        : 'text-slate-700 hover:text-primary-600 hover:bg-primary-50/50'
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={cn(
                      'w-4 h-4 transition-all duration-300',
                      activeDropdown === link.label && 'rotate-180'
                    )} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-600 rounded-xl hover:bg-primary-50/50 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Mega Menu Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[680px]"
                      >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 shadow-md" />

                        <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100/80 overflow-hidden">
                          {/* Header */}
                          <div className="px-6 pt-5 pb-3 border-b border-gray-50">
                            <h3 className="text-sm font-semibold text-slate-900">Our Services</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Comprehensive diagnostic solutions</p>
                          </div>

                          {/* Grid */}
                          <div className="p-3 grid grid-cols-2 gap-1">
                            {link.children.map((child) => {
                              const IconComponent = child.icon;
                              return (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className="group/item flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-gradient-to-r hover:from-primary-50/80 hover:to-cyan-50/50 transition-all duration-300"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-cyan-50 border border-primary-100/50 flex items-center justify-center shrink-0 group-hover/item:from-primary-500 group-hover/item:to-cyan-500 group-hover/item:border-primary-200/50 transition-all duration-300">
                                    <IconComponent className="w-5 h-5 text-primary-600 group-hover/item:text-white transition-all duration-300" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-medium text-slate-800 group-hover/item:text-primary-700 transition-colors">
                                        {child.label}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-primary-400 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 group-hover/item:text-slate-600 transition-colors">
                                      {child.description}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Footer */}
                          <div className="px-6 py-3 bg-gradient-to-r from-primary-50/50 to-cyan-50/50 border-t border-gray-50">
                            <Link
                              href="/tests"
                              className="group/cta flex items-center justify-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-600 transition-colors"
                            >
                              <FlaskConical className="w-4 h-4" />
                              <span>View all tests &amp; packages</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <button className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-100 transition-all duration-300 group">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Search tests...</span>
              <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-200/50 rounded-md ml-2">
                ⌘K
              </kbd>
            </button>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-gray-200" />

            {/* Contact Phone */}
            <a href="tel:+918088000100" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-600 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center group-hover:bg-primary-100 group-hover:border-primary-200 transition-all duration-300">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs leading-tight">
                <span className="block font-normal text-slate-500">24/7 Helpline</span>
                <span className="block font-semibold text-slate-800">+91 80880 00100</span>
              </span>
            </a>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-gray-200" />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Link
                href={user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? '/admin' : user?.role === 'LAB_ASSISTANT' ? '/lab' : user?.role === 'DOCTOR' ? '/doctor' : '/dashboard'}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>{user?.name || 'Dashboard'}</span>
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 rounded-xl hover:bg-primary-50/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                isMobileMenuOpen
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-700 hover:bg-gray-100'
              )}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden shadow-2xl shadow-black/5 max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="container-premium py-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <div>
                      <button
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-800 hover:text-primary-700 hover:bg-primary-50/80 rounded-xl transition-all"
                      >
                        <span>{link.label}</span>
                        <div className={cn(
                          'w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-300',
                          mobileDropdownOpen === link.label && 'bg-primary-100 rotate-180'
                        )}>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      </button>
                      <AnimatePresence>
                        {mobileDropdownOpen === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="ml-2 pl-3 border-l-2 border-primary-100 space-y-0.5 pb-1 mt-0.5">
                              {link.children.map((child) => {
                                const IconComponent = child.icon;
                                return (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-700 hover:bg-primary-50/60 rounded-lg transition-all group"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100/50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                                      <IconComponent className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <div>
                                      <span className="block text-sm font-medium">{child.label}</span>
                                      <span className="block text-xs text-slate-400 mt-px">{child.description}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-800 hover:text-primary-700 hover:bg-primary-50/80 rounded-xl transition-all"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Auth & Contact Section */}
              <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
                {/* Phone */}
                <a
                  href="tel:+918088000100"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <Phone className="w-4 h-4 text-primary-600" />
                  <span>24/7 Helpline: +91 80880 00100</span>
                </a>

                {/* Auth Buttons */}
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-lg shadow-primary-500/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.name || 'Dashboard'}</span>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-slate-700 rounded-xl font-medium hover:border-primary-500 hover:text-primary-700 hover:bg-primary-50 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium shadow-lg shadow-primary-500/20"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
