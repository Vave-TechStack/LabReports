'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FlaskConical, Mail, Lock, Phone, Send, Loader2, Eye, EyeOff, ArrowLeft, Smartphone } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { loginSchema } from '@/lib/validations';
import type { LoginFormData } from '@/lib/validations';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleEmailLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.auth.login(data);
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        setAuth(user, accessToken, refreshToken);
        // Route based on role
        const roleRedirects: Record<string, string> = {
          SUPER_ADMIN: '/admin',
          ADMIN: '/admin',
          LAB_ASSISTANT: '/lab',
          DOCTOR: '/doctor',
          PATIENT: '/dashboard',
        };
        router.push(roleRedirects[user.role] || '/dashboard');
      }
    } catch (err: any) {
      // Demo login - fallback when backend is not running
      const demoAccounts: Record<string, { user: { id: string; email: string; role: string; name: string; phone: string }; redirect: string }> = {
        'demo@medilab.com': { user: { id: 'demo-001', email: 'demo@medilab.com', role: 'PATIENT', name: 'Demo Patient', phone: '+919999999999' }, redirect: '/dashboard' },
        'admin@medilab.com': { user: { id: 'admin-001', email: 'admin@medilab.com', role: 'SUPER_ADMIN', name: 'Admin User', phone: '+919999999900' }, redirect: '/admin' },
        'lab@medilab.com': { user: { id: 'lab-001', email: 'lab@medilab.com', role: 'LAB_ASSISTANT', name: 'Lab Technician', phone: '+919999999901' }, redirect: '/lab' },
        'doctor@medilab.com': { user: { id: 'doc-001', email: 'doctor@medilab.com', role: 'DOCTOR', name: 'Demo Doctor', phone: '+919999999902' }, redirect: '/doctor' },
      };
      const demo = demoAccounts[data.email];
      // Check demo accounts by both email AND password
      const demoPasswords: Record<string, string> = { 'demo@medilab.com': 'Demo@123', 'admin@medilab.com': 'Admin@123', 'lab@medilab.com': 'Lab@123', 'doctor@medilab.com': 'Doc@123' };
      if (demo && demoPasswords[data.email] === data.password) {
        const demoAccessToken = 'demo_access_token_' + Date.now();
        const demoRefreshToken = 'demo_refresh_token_' + Date.now();
        setAuth(demo.user, demoAccessToken, demoRefreshToken);
        router.push(demo.redirect);
        setLoading(false);
        return;
      }
      setError(err.response?.data?.message || 'Login failed. Invalid email or password.');
    }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    setError('');
    try {
      await apiService.auth.sendOTP(phone);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      const response = await apiService.auth.verifyOTP(phone, otpValue);
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        setAuth(user, accessToken, refreshToken);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-80 h-80 bg-white/20 rounded-full bottom-0 right-0 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-md"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-white">
              Medi<span className="text-emerald-200">Lab</span>
            </span>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-white mb-6">Welcome Back!</h1>
          <p className="text-lg text-white/80 mb-8">Access your health records, book tests, and track your reports all in one place.</p>
          <div className="grid grid-cols-3 gap-4">
            {['🔬', '📋', '📱'].map((emoji, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
              >
                <span className="text-3xl block mb-2">{emoji}</span>
                <p className="text-xs text-white/70">{['Lab Tests', 'Health Records', 'Instant Reports'][i]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          <div className="card-premium p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                {loginMethod === 'email' ? 'Sign In' : 'OTP Login'}
              </h2>
              <p className="text-slate-500">Welcome back! Please enter your details.</p>
            </div>

            {/* Demo Credentials Info */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-primary-700 mb-2">🎯 Demo Credentials</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-primary-600">
                <p><strong>Patient:</strong> demo@medilab.com / Demo@123</p>
                <p><strong>Admin:</strong> admin@medilab.com / Admin@123</p>
                <p><strong>Lab Tech:</strong> lab@medilab.com / Lab@123</p>
                <p><strong>Doctor:</strong> doctor@medilab.com / Doc@123</p>
              </div>
            </div>

            {/* Login Method Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => { setLoginMethod('email'); setOtpSent(false); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => { setLoginMethod('otp'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Smartphone className="w-4 h-4 inline mr-2" />
                OTP
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {loginMethod === 'email' ? (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit(handleEmailLogin)}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" {...register('email')} placeholder="you@example.com" className="input-field pl-10" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Enter your password" className="input-field pl-10 pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {!otpSent ? (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            placeholder="+91 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      <button onClick={handleSendOTP} disabled={loading || phone.length < 10} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <p className="text-sm text-slate-600 text-center">Enter the 6-digit code sent to <strong>{phone}</strong></p>
                      <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-14 text-center text-xl font-semibold bg-white border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        ))}
                      </div>
                      <button onClick={handleVerifyOTP} disabled={loading || otp.join('').length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </button>
                      <button onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); }} className="text-sm text-primary-600 hover:text-primary-700 block mx-auto">
                        Change phone number
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">Sign up</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
