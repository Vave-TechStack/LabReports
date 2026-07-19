'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Stethoscope, GraduationCap, Award, MapPin, Star, Search, ChevronDown, Phone, CalendarCheck, Filter, X } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const specializations = [
  { id: 'all', name: 'All Specialists' },
  { id: 'pathology', name: 'Pathology' },
  { id: 'microbiology', name: 'Microbiology' },
  { id: 'biochemistry', name: 'Biochemistry' },
  { id: 'hematology', name: 'Hematology' },
  { id: 'immunology', name: 'Immunology' },
  { id: 'radiology', name: 'Radiology' },
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'neurology', name: 'Neurology' },
  { id: 'gastroenterology', name: 'Gastroenterology' },
];

const doctors = [
  { id: '1', firstName: 'Venkatesh', lastName: 'Murthy', specialization: 'pathology', qualification: 'MD Pathology (AIIMS)', experience: 28, bio: 'Renowned pathologist with expertise in diagnostic pathology and lab management. Former HOD at AIIMS Delhi.', rating: 4.9, patients: 15000, available: true, fee: 800, locations: ['Bangalore', 'Mumbai'] },
  { id: '2', firstName: 'Sunita', lastName: 'Reddy', specialization: 'microbiology', qualification: 'PhD Microbiology', experience: 22, bio: 'Expert microbiologist specializing in infectious disease diagnosis and antimicrobial resistance studies.', rating: 4.8, patients: 12000, available: true, fee: 700, locations: ['Bangalore'] },
  { id: '3', firstName: 'Arjun', lastName: 'Mehta', specialization: 'hematology', qualification: 'MD Hematology', experience: 18, bio: 'Specialist in blood disorders and hematological malignancies with extensive research experience.', rating: 4.9, patients: 10000, available: true, fee: 900, locations: ['Bangalore', 'Chennai'] },
  { id: '4', firstName: 'Priya', lastName: 'Sharma', specialization: 'biochemistry', qualification: 'MD Biochemistry', experience: 20, bio: 'Leading biochemist focused on metabolic disorders and clinical biochemistry diagnostics.', rating: 4.7, patients: 9000, available: true, fee: 600, locations: ['Bangalore', 'Hyderabad'] },
  { id: '5', firstName: 'Rajesh', lastName: 'Kumar', specialization: 'immunology', qualification: 'DM Immunology', experience: 15, bio: 'Immunology specialist with focus on autoimmune diseases and allergy diagnostics.', rating: 4.8, patients: 8000, available: false, fee: 750, locations: ['Mumbai', 'Delhi'] },
  { id: '6', firstName: 'Ananya', lastName: 'Patel', specialization: 'pathology', qualification: 'MD Pathology', experience: 16, bio: 'Histopathology expert specializing in cancer diagnostics and molecular pathology.', rating: 4.9, patients: 11000, available: true, fee: 850, locations: ['Bangalore', 'Pune'] },
  { id: '7', firstName: 'Suresh', lastName: 'Reddy', specialization: 'cardiology', qualification: 'DM Cardiology', experience: 24, bio: 'Senior cardiologist with expertise in preventive cardiology and cardiac risk assessment.', rating: 4.9, patients: 20000, available: true, fee: 1000, locations: ['Bangalore', 'Mumbai', 'Delhi'] },
  { id: '8', firstName: 'Lakshmi', lastName: 'Devi', specialization: 'neurology', qualification: 'DM Neurology', experience: 19, bio: 'Neurology specialist focused on neurological disorders and brain health diagnostics.', rating: 4.8, patients: 13000, available: true, fee: 950, locations: ['Bangalore'] },
  { id: '9', firstName: 'Manoj', lastName: 'Gupta', specialization: 'gastroenterology', qualification: 'DM Gastroenterology', experience: 17, bio: 'Gastroenterologist specializing in digestive health and liver disorders.', rating: 4.7, patients: 9500, available: true, fee: 850, locations: ['Mumbai', 'Delhi'] },
  { id: '10', firstName: 'Divya', lastName: 'Nair', specialization: 'radiology', qualification: 'MD Radiology', experience: 14, bio: 'Radiology specialist with expertise in diagnostic imaging and interventional radiology.', rating: 4.8, patients: 8500, available: true, fee: 800, locations: ['Bangalore', 'Chennai'] },
  { id: '11', firstName: 'Rahul', lastName: 'Verma', specialization: 'pathology', qualification: 'MD Pathology (PGI)', experience: 21, bio: 'Senior pathologist with specialization in renal pathology and cytopathology.', rating: 4.8, patients: 14000, available: true, fee: 750, locations: ['Delhi', 'Bangalore'] },
  { id: '12', firstName: 'Kavita', lastName: 'Singh', specialization: 'microbiology', qualification: 'MD Microbiology', experience: 13, bio: 'Clinical microbiologist focusing on hospital-acquired infections and infection control.', rating: 4.6, patients: 7000, available: false, fee: 600, locations: ['Mumbai'] },
];

export default function DoctorsPage() {
  const [activeSpec, setActiveSpec] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);

  const filtered = useMemo(() => {
    return doctors.filter(doc => {
      const matchSpec = activeSpec === 'all' || doc.specialization === activeSpec;
      const matchSearch = !searchQuery ||
        `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.locations.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchAvailable = !showAvailable || doc.available;
      return matchSpec && matchSearch && matchAvailable;
    });
  }, [activeSpec, searchQuery, showAvailable]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -right-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 left-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Stethoscope className="w-4 h-4" /> Our Expert Team
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Meet Our Doctors</h1>
            <p className="text-lg text-white/80 mb-8">Our team of highly qualified doctors and pathologists ensure accurate diagnosis and the highest quality of care.</p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialization, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-slate-900 placeholder:text-gray-400 outline-none shadow-xl text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 py-4 sticky top-20 z-30">
        <div className="container-premium">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {specializations.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setActiveSpec(spec.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeSpec === spec.id ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
              >
                {spec.name}
              </button>
            ))}
            <button
              onClick={() => setShowAvailable(!showAvailable)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                showAvailable ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" /> Available Now
            </button>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="section-padding bg-surface">
        <div className="container-premium">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No doctors found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="card-premium p-6 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-xl font-bold text-white">{getInitials(doc.firstName, doc.lastName)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading font-semibold text-slate-900">Dr. {doc.firstName} {doc.lastName}</h3>
                      <p className="text-sm text-primary-600 font-medium capitalize">{doc.specialization}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium text-slate-700">{doc.rating}</span>
                        </div>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs text-slate-500">{doc.patients.toLocaleString()}+ patients</span>
                      </div>
                    </div>
                    {doc.available && (
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 mt-2 animate-pulse" title="Available" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 rounded-lg text-[11px] text-blue-700 font-medium">
                      <GraduationCap className="w-3 h-3" /> {doc.qualification}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg text-[11px] text-amber-700 font-medium">
                      <Award className="w-3 h-3" /> {doc.experience}+ yrs
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{doc.bio}</p>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                    <MapPin className="w-3 h-3" />
                    {doc.locations.join(', ')}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="flex-1">
                      <span className="text-lg font-bold text-slate-900">₹{doc.fee}</span>
                      <span className="text-[10px] text-slate-400 ml-1">consultation</span>
                    </div>
                    <Link
                      href={`/book-test?doctor=${doc.id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-all"
                    >
                      <CalendarCheck className="w-3 h-3" /> Book
                    </Link>
                    <a
                      href="tel:+918088000100"
                      className="p-2 bg-gray-100 text-slate-600 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
