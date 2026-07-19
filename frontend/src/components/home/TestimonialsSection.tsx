'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { apiService } from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  image: string | null;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiService.testimonials.getFeatured();
        setTestimonials(response.data?.data || []);
      } catch { /* */ }
    };
    fetchTestimonials();
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % Math.max(testimonials.length, 1));
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % Math.max(testimonials.length, 1));

  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-700 text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-slate-600">
            Hear from thousands of satisfied patients who trust us with their health.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card-premium p-8 md:p-12 text-center"
            >
              <Quote className="w-12 h-12 text-primary-100 mx-auto mb-6" />
              <p className="text-lg text-slate-700 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[currentIndex]?.content}&rdquo;
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: testimonials[currentIndex]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="font-heading font-semibold text-slate-900">{testimonials[currentIndex]?.name}</p>
              {testimonials[currentIndex]?.role && (
                <p className="text-sm text-slate-500">{testimonials[currentIndex]?.role}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={prev} className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
