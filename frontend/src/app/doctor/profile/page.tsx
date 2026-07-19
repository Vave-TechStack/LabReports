'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Mail, Award, BookOpen, Clock, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function DoctorProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.doctor.getDashboard();
        setData(res.data?.data);
        if (res.data?.data?.doctor?.signature) {
          setSignature(res.data.data.doctor.signature);
        }
      } catch {
        setData({
          pendingVerification: 8,
          verifiedToday: 12,
          totalVerified: 847,
          totalPatients: 152,
          doctor: {
            firstName: 'Arun',
            lastName: 'Kumar',
            specialization: 'Cardiologist',
            qualification: 'MD, DM Cardiology - AIIMS Delhi',
            experience: 18,
            signature: ''
          }
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSignatureSave = async () => {
    if (!signature.trim()) return;
    setSaving(true);
    try {
      await apiService.doctor.updateSignature(signature);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* */ }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="skeleton h-12 w-64 mb-6 rounded-xl" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><div className="skeleton h-64 w-full rounded-2xl" /></div>
          <div><div className="skeleton h-64 w-full rounded-2xl" /></div>
        </div>
      </div>
    );
  }

  const doctor = data?.doctor;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">View your profile and manage digital signature.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-slate-900">
                  Dr. {doctor?.firstName} {doctor?.lastName}
                </h2>
                <p className="text-sm text-slate-500">{doctor?.specialization}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <Award className="w-4 h-4" /> Qualification
                </div>
                <p className="text-sm font-medium text-slate-900">{doctor?.qualification || '—'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <Clock className="w-4 h-4" /> Experience
                </div>
                <p className="text-sm font-medium text-slate-900">{doctor?.experience || 0} years</p>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Digital Signature</h2>
            <p className="text-sm text-slate-500 mb-4">
              Add a digital signature image URL (e.g., a PNG of your signature uploaded to an image hosting service) that will appear on verified reports.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Signature Image URL</label>
                <input
                  type="url"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="https://example.com/your-signature.png"
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSignatureSave}
                  disabled={saving || !signature.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Signature'}
                </button>

                {doctor?.signature && (
                  <span className="text-xs text-slate-500">Current signature saved</span>
                )}
              </div>

              {signature && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-2">Preview:</p>
                  <img
                    src={signature}
                    alt="Digital signature preview"
                    className="h-16 object-contain bg-white rounded-lg p-2"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="card-premium p-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending Reports</span>
                <span className="text-lg font-bold text-amber-600">{data?.pendingVerification || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Verified Today</span>
                <span className="text-lg font-bold text-emerald-600">{data?.verifiedToday || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Verified</span>
                <span className="text-lg font-bold text-blue-600">{data?.totalVerified || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Patients</span>
                <span className="text-lg font-bold text-purple-600">{data?.totalPatients || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
