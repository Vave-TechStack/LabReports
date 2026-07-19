'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="pt-20 min-h-screen bg-surface">
      <section className="section-padding gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 right-0 blur-3xl" />
        </div>
        <div className="container-premium relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" /> Refund Policy
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Refund & Cancellation Policy</h1>
            <p className="text-lg text-white/80">Last Updated: December 15, 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium max-w-3xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">1. Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                At MediLab Diagnostics, we strive to provide the highest quality diagnostic services. This Refund and Cancellation Policy outlines the terms under which cancellations and refunds are processed.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">2. Cancellation Policy</h2>
              
              <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">Before Sample Collection</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li><strong>More than 2 hours before appointment:</strong> Full refund, no questions asked</li>
                <li><strong>Less than 2 hours before appointment:</strong> 90% refund (10% cancellation fee applies)</li>
                <li><strong>Home collection bookings:</strong> Free cancellation up to 1 hour before the scheduled visit</li>
              </ul>

              <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">After Sample Collection</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li><strong>Before processing:</strong> 80% refund (20% processing fee applies)</li>
                <li><strong>After processing started:</strong> No refund, but reports will be provided</li>
                <li><strong>Partial cancellation:</strong> Refund for unprocessed tests only</li>
              </ul>

              <h3 className="text-base font-semibold text-slate-900 mb-2 mt-4">Health Packages</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Full refund within 7 days of purchase if no tests have been conducted</li>
                <li>Pro-rata refund for partially utilized packages</li>
                <li>Package is valid for 6 months from date of purchase</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">3. Refund Process</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Refunds are processed within 7-10 business days from the date of cancellation approval. The refund will be credited to the original payment method used during booking. For cash payments, refunds will be processed via bank transfer.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-slate-600">
                <p className="font-medium text-slate-900 mb-2">Refund Timelines:</p>
                <ul className="space-y-1">
                  <li>• UPI / GPay / PhonePe: 2-3 business days</li>
                  <li>• Credit/Debit Cards: 5-7 business days</li>
                  <li>• Net Banking: 3-5 business days</li>
                  <li>• Bank Transfer: 7-10 business days</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">4. Non-Refundable Items</h2>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Tests that have been fully processed and reported</li>
                <li>Wellness program enrollment fees (after program start)</li>
                <li>Corporate contract services (governed by separate agreement)</li>
                <li>Third-party lab test processing fees</li>
                <li>Shipping and handling charges for special requests</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">5. Exceptional Circumstances</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                In case of medical emergencies, hospitalizations, or other exceptional circumstances, we may waive cancellation fees at our discretion. Please contact our support team with supporting documentation for review.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">6. How to Request a Refund</h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-1">
                <p>To request a cancellation or refund:</p>
                <p>1. Call our helpline: +91 80880 00100</p>
                <p>2. Email: support@medilab.com</p>
                <p>3. Visit any of our collection centers</p>
                <p className="mt-2">Please have your booking reference number ready for faster processing.</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">7. Contact Us</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                For any questions regarding this refund policy, please contact our support team:
              </p>
              <div className="mt-2 text-sm text-slate-600">
                <p>Email: support@medilab.com</p>
                <p>Phone: +91 80880 00100</p>
                <p>Address: 42, Tech Park Boulevard, Whitefield, Bangalore - 560066</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
