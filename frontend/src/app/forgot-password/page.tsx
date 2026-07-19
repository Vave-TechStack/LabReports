'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, ArrowLeft, Loader2, CheckCircle, Shield, FlaskConical } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'form' | 'sent' | 'reset'>('form');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setStep('sent');
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setStep('reset');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-slate-900">
              Medi<span className="text-primary-600">Lab</span>
            </span>
          </Link>

          {step === 'form' && (
            <div className="card-premium p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary-600" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-slate-900">Forgot Password?</h1>
                <p className="text-sm text-slate-500 mt-1">No worries! Enter your details and we'll send you a reset OTP.</p>
              </div>

              {/* Method Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button onClick={() => setMethod('email')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  <Mail className="w-4 h-4 inline mr-1.5" /> Email
                </button>
                <button onClick={() => setMethod('phone')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  <Phone className="w-4 h-4 inline mr-1.5" /> Phone
                </button>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                {method === 'email' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-10" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Registered Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="input-field pl-10" />
                    </div>
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Reset OTP'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </div>
          )}

          {step === 'sent' && (
            <div className="card-premium p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-slate-900">Check Your {method === 'email' ? 'Email' : 'Phone'}</h1>
                <p className="text-sm text-slate-500 mt-1">We've sent a 6-digit OTP to {method === 'email' ? email : phone}</p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 text-center">Enter OTP</label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input key={i} type="text" maxLength={1} value={digit}
                        onChange={(e) => {
                          const newOtp = [...otp];
                          newOtp[i] = e.target.value.replace(/\D/g, '');
                          setOtp(newOtp);
                          if (e.target.value && i < 5) {
                            const next = document.getElementById(`otp-${i + 1}`);
                            next?.focus();
                          }
                        }}
                        id={`otp-${i}`}
                        className="w-12 h-12 text-center text-lg font-bold input-field"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" minLength={8} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" className="input-field" />
                </div>

                <button type="submit" disabled={loading || otp.some(d => !d) || !newPassword || newPassword !== confirmPassword} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : 'Reset Password'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={() => setStep('form')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Didn't receive OTP? Resend</button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">Password Reset! 🎉</h1>
              <p className="text-sm text-slate-500 mb-6">Your password has been successfully reset. You can now log in with your new password.</p>
              <Link href="/login" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
