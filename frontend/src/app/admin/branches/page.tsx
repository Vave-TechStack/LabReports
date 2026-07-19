'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Building2, MapPin, Phone, Users, X, Save, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', isMainLab: false, openingTime: '08:00', closingTime: '20:00' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getBranches();
      setBranches(res.data?.data || []);
    } catch {
      setBranches([
        { id: 'br1', name: 'MediLab Diagnostics - Main Lab', code: 'ML001', address: '42, Tech Park Boulevard', city: 'Bangalore', state: 'Karnataka', pincode: '560066', phone: '+918088000100', email: 'bangalore@medilab.com', isMainLab: true, openingTime: '07:00', closingTime: '20:00', _count: { employees: 45, labAssistants: 12 } },
        { id: 'br2', name: 'MediLab - Koramangala', code: 'ML002', address: '27, 80 Feet Road, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560095', phone: '+918088000101', email: 'koramangala@medilab.com', isMainLab: false, openingTime: '07:00', closingTime: '20:00', _count: { employees: 18, labAssistants: 5 } },
        { id: 'br3', name: 'MediLab - HSR Layout', code: 'ML003', address: '56, 27th Main Road, HSR Layout', city: 'Bangalore', state: 'Karnataka', pincode: '560102', phone: '+918088000102', email: 'hsr@medilab.com', isMainLab: false, openingTime: '07:00', closingTime: '20:00', _count: { employees: 22, labAssistants: 6 } },
        { id: 'br4', name: 'MediLab - Andheri', code: 'ML004', address: '12, SV Road, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400058', phone: '+918088000200', email: 'mumbai@medilab.com', isMainLab: false, openingTime: '07:00', closingTime: '21:00', _count: { employees: 30, labAssistants: 8 } },
        { id: 'br5', name: 'MediLab - Connaught Place', code: 'ML005', address: '15, Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+918088000300', email: 'delhi@medilab.com', isMainLab: false, openingTime: '08:00', closingTime: '20:00', _count: { employees: 25, labAssistants: 7 } },
        { id: 'br6', name: 'MediLab - T Nagar', code: 'ML006', address: '42, Pondy Bazaar, T Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', phone: '+918088000400', email: 'chennai@medilab.com', isMainLab: false, openingTime: '07:00', closingTime: '20:00', _count: { employees: 20, labAssistants: 5 } },
        { id: 'br7', name: 'MediLab - Jubilee Hills', code: 'ML007', address: '8-2-293, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', phone: '+918088000500', email: 'hyderabad@medilab.com', isMainLab: false, openingTime: '07:00', closingTime: '20:00', _count: { employees: 28, labAssistants: 6 } },
        { id: 'br8', name: 'MediLab - Koregaon Park', code: 'ML008', address: '7, Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '+918088000600', email: 'pune@medilab.com', isMainLab: false, openingTime: '07:00', closingTime: '20:00', _count: { employees: 16, labAssistants: 4 } },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await apiService.admin.updateBranch(editing.id, form);
      else await apiService.admin.createBranch(form);
      setShowForm(false); setEditing(null);
      fetchData();
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this branch?')) return;
    try { await apiService.admin.deleteBranch(id); fetchData(); } catch { /* */ }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Branch Management</h1>
          <p className="text-slate-500 mt-1">Manage all laboratory branches and collection centers.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="card-premium p-5"><div className="skeleton h-20 w-full rounded-xl" /></div>)
          ) : branches.map((branch: any) => (
            <div key={branch.id} className="card-premium p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${branch.isMainLab ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900">{branch.name}</h3>
                      {branch.isMainLab && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-semibold">Main Lab</span>}
                    </div>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {branch.address}, {branch.city}, {branch.state}</p>
                      <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {branch.phone}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /> {branch._count?.employees || 0} staff</span>
                      <span className="text-gray-400">•</span>
                      <span>{branch._count?.labAssistants || 0} assistants</span>
                      <span className="text-gray-400">•</span>
                      <span>{branch.openingTime} - {branch.closingTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(branch); setForm(branch); setShowForm(true); }} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(branch.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-slate-900">{editing ? 'Edit Branch' : 'New Branch'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Code</label><input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field text-sm" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Address</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field text-sm" /></div>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">City</label><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">State</label><input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Pincode</label><input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Opening</label><input type="time" value={form.openingTime} onChange={(e) => setForm({ ...form, openingTime: e.target.value })} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Closing</label><input type="time" value={form.closingTime} onChange={(e) => setForm({ ...form, closingTime: e.target.value })} className="input-field text-sm" /></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" checked={form.isMainLab} onChange={(e) => setForm({ ...form, isMainLab: e.target.checked })} className="w-4 h-4 rounded text-purple-600" />
                <span className="text-sm text-slate-700">Main Laboratory</span>
              </label>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Branch'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
