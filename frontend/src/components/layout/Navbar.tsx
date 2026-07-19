'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Phone, ChevronDown, FlaskConical, User, LogIn, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about', mobileOnly: true },
  {
    label: 'Services',
    href: '#',
    children: [
      { label: 'All Tests', href: '/tests' },
      { label: 'Health Packages', href: '/packages' },
      { label: 'Book Appointment', href: '/book-appointment' },
      { label: 'Book Home Collection', href: '/book-home-collection' },
      { label: 'Corporate Services', href: '/corporate-services' },
      { label: 'Preventive Checkups', href: '/preventive-checkups' },
    ],
  },
  { label: 'Book Appointment', href: '/book-appointment' },
  { label: 'Health Packages', href: '/packages' },
  { label: 'Tests', href: '/tests' },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white border-b border-gray-100/80 shadow-sm',
        isScrolled && 'shadow-soft border-b-gray-200/80'
      )}
    >
      <div className="container-premium">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-heading font-bold text-slate-900">
                Medi<span className="text-primary-600">Lab</span>
              </span>
              <p className="text-[10px] font-medium text-slate-500 -mt-1 tracking-widest uppercase">Diagnostics</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.children ? (
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 rounded-lg hover:bg-primary-50/50 transition-all duration-200"
                  >
                    {link.label}
                    <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', activeDropdown === link.label && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 rounded-lg hover:bg-primary-50/50 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-premium border border-gray-100 py-2 overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-slate-700 hover:text-primary-600 hover:bg-primary-50/50 transition-all border-l-2 border-transparent hover:border-primary-500"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-500 hover:bg-gray-200 transition-all">
              <Search className="w-4 h-4" />
              <span>Search tests...</span>
            </button>

            {/* Contact Phone */}
            <a href="tel:+918088000100" className="hidden lg:flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-600 transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 80880 00100</span>
            </a>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Link
                href={user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? '/admin' : user?.role === 'LAB_ASSISTANT' ? '/lab' : user?.role === 'DOCTOR' ? '/doctor' : '/dashboard'}
                className="hidden lg:flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>{user?.name || 'Dashboard'}</span>
              </Link>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login" className="btn-outline !py-2 !px-4 text-sm flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link href="/signup" className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="container-premium py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <div>
                      <button
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        {link.label}
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', mobileDropdownOpen === link.label && 'rotate-180')} />
                      </button>
                      <AnimatePresence>
                        {mobileDropdownOpen === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 space-y-1 pb-2">
                              {link.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-4 py-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="block w-full btn-primary text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="block w-full text-center px-4 py-2.5 border-2 border-primary-600 text-primary-700 rounded-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link href="/signup" className="block w-full btn-primary text-center" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
                <a href="tel:+918088000100" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-slate-600">
                  <Phone className="w-4 h-4" /> +91 80880 00100
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
