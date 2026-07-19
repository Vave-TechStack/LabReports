'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, MapPin, Save, Loader2, Calendar, Heart, AlertCircle, Activity } from 'lucide-react';
import { apiService } from '@/lib/api';
import { profileSchema, type ProfileFormData } from '@/lib/validations';
import { useAuthStore } from '@/store/authStore';
import { getInitials, formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          apiService.patients.getProfile(),
          apiService.patients.getHistory(),
        ]);
        const profile = profileRes.data?.data;
        if (profile) {
          reset({
            firstName: profile.firstName,
            lastName: profile.lastName,
            dateOfBirth: profile.dateOfBirth?.split('T')[0] || '',
            gender: profile.gender,
            bloodGroup: profile.bloodGroup,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            pincode: profile.pincode,
          });
          updateUser({ name: `${profile.firstName} ${profile.lastName}` });
        }
        setMedicalHistory(historyRes.data?.data || []);
      } catch {
        // Fallback demo profile data
        reset({
          firstName: 'Demo',
          lastName: 'Patient',
          dateOfBirth: '1990-06-15',
          gender: 'MALE',
          bloodGroup: 'O_POSITIVE',
          address: '42, 3rd Cross, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
        });
        updateUser({ name: 'Demo Patient' });
        setMedicalHistory([
          { id: 'h1', reportNumber: 'RPT-2024-0892', createdAt: new Date().toISOString() },
          { id: 'h2', reportNumber: 'RPT-2024-0875', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
          { id: 'h3', reportNumber: 'RPT-2024-0821', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
          { id: 'h4', reportNumber: 'RPT-2024-0765', createdAt: new Date(Date.now() - 86400000 * 90).toISOString() },
        ]);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [reset, updateUser]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await apiService.patients.updateProfile(data);
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="card-premium p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full mb-4 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and view medical history.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="card-premium p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {getInitials(user?.name || 'U')}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-slate-900">{user?.name}</h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <Save className="w-4 h-4" /> {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input type="text" {...register('firstName')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" {...register('lastName')} className="input-field" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                  <input type="date" {...register('dateOfBirth')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                  <select {...register('gender')} className="input-field">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Group</label>
                  <select {...register('bloodGroup')} className="input-field">
                    <option value="">Select Blood Group</option>
                    <option value="A_POSITIVE">A+</option>
                    <option value="A_NEGATIVE">A-</option>
                    <option value="B_POSITIVE">B+</option>
                    <option value="B_NEGATIVE">B-</option>
                    <option value="AB_POSITIVE">AB+</option>
                    <option value="AB_NEGATIVE">AB-</option>
                    <option value="O_POSITIVE">O+</option>
                    <option value="O_NEGATIVE">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode</label>
                  <input type="text" {...register('pincode')} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <input type="text" {...register('address')} className="input-field" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input type="text" {...register('city')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                  <input type="text" {...register('state')} className="input-field" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Medical History */}
        <div className="space-y-6">
          <div className="card-premium p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" /> Medical History
            </h3>
            {medicalHistory.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No medical history records yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medicalHistory.map((record: any) => (
                  <div key={record.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-primary-600 font-medium">{record.reportNumber}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(record.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-premium p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Account Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-slate-600">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-slate-600">{user?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
