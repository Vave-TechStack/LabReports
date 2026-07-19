'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <Shield className="w-4 h-4" /> Privacy Policy
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-lg text-white/80">Last Updated: December 15, 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium max-w-3xl mx-auto">
          <div className="prose prose-slate max-w-none space-y-8">
            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">1. Introduction</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                MediLab Diagnostics (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">2. Information We Collect</h2>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Personal Information</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Name, date of birth, and gender</li>
                <li>Contact information (email address, phone number, mailing address)</li>
                <li>Government-issued identification documents (for verification purposes)</li>
                <li>Health information provided during test bookings</li>
                <li>Payment information (processed through secure third-party gateways)</li>
              </ul>
              <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>IP address, browser type, and device information</li>
                <li>Usage patterns and preferences on our website</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>To process and manage your test bookings and appointments</li>
                <li>To deliver test reports and health information</li>
                <li>To communicate with you about your appointments and services</li>
                <li>To improve our services and user experience</li>
                <li>To comply with legal and regulatory requirements</li>
                <li>To send health tips, promotional offers (with your consent)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">4. Data Security</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-2">
                <li>256-bit SSL encryption for data transmission</li>
                <li>Secure data centers with restricted access</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee training on data protection practices</li>
                <li>Compliance with HIPAA and Indian IT Act guidelines</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">5. Data Retention</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We retain your personal data for as long as necessary to provide services and comply with legal obligations. Medical records are retained for 5 years as per regulatory requirements. You may request deletion of your account and personal data at any time, subject to legal retention requirements.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">6. Data Sharing</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-2">
                <li>Healthcare providers involved in your diagnosis and treatment</li>
                <li>Payment processors for transaction processing</li>
                <li>Regulatory authorities as required by law</li>
                <li>Service providers who assist in our operations (under strict confidentiality)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">7. Your Rights</h2>
              <p className="text-sm text-slate-600 leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mt-2">
                <li>Access your personal data held by us</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Data portability</li>
                <li>Lodge a complaint with data protection authorities</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">8. Cookies</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our website uses cookies to enhance your browsing experience. You can control cookie preferences through your browser settings. Essential cookies are required for the website to function properly. Analytics cookies help us improve our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">9. Contact Information</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                For questions about this Privacy Policy or to exercise your data rights, please contact us:
              </p>
              <div className="mt-2 text-sm text-slate-600">
                <p>Email: privacy@medilab.com</p>
                <p>Phone: +91 80880 00100</p>
                <p>Address: 42, Tech Park Boulevard, Whitefield, Bangalore - 560066</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-slate-900 mb-3">10. Changes to This Policy</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date. We encourage you to review this policy periodically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
