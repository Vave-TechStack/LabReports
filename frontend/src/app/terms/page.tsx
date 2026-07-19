'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function TermsPage() {
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
              <Shield className="w-4 h-4" /> Terms of Use
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Terms of Use</h1>
            <p className="text-lg text-white/80">Last Updated: December 15, 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium max-w-3xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                By accessing and using the MediLab Diagnostics website and services, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">2. Services Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                MediLab Diagnostics provides diagnostic laboratory services including blood tests, health checkups, home sample collection, and related healthcare services. Our services are available through our website, mobile application, and physical collection centers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">3. User Responsibilities</h2>
              <p className="text-sm text-slate-600 leading-relaxed">As a user of our services, you agree to:</p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-2">
                <li>Provide accurate and complete information during registration and booking</li>
                <li>Follow sample collection instructions provided by our team</li>
                <li>Inform us of any medical conditions or allergies before sample collection</li>
                <li>Not misuse or abuse our services, staff, or facilities</li>
                <li>Maintain the confidentiality of your account credentials</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">4. Booking and Payment</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                All bookings are subject to availability. Payment must be made at the time of booking unless otherwise agreed. Prices are subject to change without prior notice. Discounts and promotional offers are subject to specific terms and conditions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">5. Cancellation and Refund</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cancellations made 2 hours before the scheduled appointment are eligible for a full refund. Cancellations after sample collection may incur charges based on tests processed. Please refer to our Refund Policy for detailed terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">6. Test Results and Reports</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Test results are for informational purposes and should be interpreted by a qualified healthcare professional. MediLab Diagnostics is not responsible for the interpretation or use of test results by unauthorized persons. Reports are confidential and will only be shared with the patient or authorized representatives.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">7. Intellectual Property</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of MediLab Diagnostics and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">8. Limitation of Liability</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                MediLab Diagnostics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services. Our total liability shall not exceed the amount paid by you for the specific service in question.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">9. Modifications to Terms</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any modifications indicates your acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">10. Contact Information</h2>
              <p className="text-sm text-slate-600 leading-relaxed">For questions about these terms, please contact us:</p>
              <div className="mt-2 text-sm text-slate-600">
                <p>Email: legal@medilab.com</p>
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
