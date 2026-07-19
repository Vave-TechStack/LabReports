'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Package2, X, Save, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatCurrency, slugify } from '@/lib/utils';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', shortDescription: '', price: 0, discountPrice: '', isPopular: false, testIds: [] as string[] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, testRes] = await Promise.all([apiService.packages.getAll({ limit: 100 }), apiService.tests.getAll({ limit: 200 })]);
      setPackages(pkgRes.data?.data || []);
      setTests(testRes.data?.data || []);
    } catch {
      const demoTestList = [
        { id: 't1', name: 'Complete Blood Count (CBC)', price: 500 },
        { id: 't2', name: 'Thyroid Profile', price: 800 },
        { id: 't3', name: 'Fasting Blood Sugar', price: 150 },
        { id: 't4', name: 'HbA1c', price: 600 },
        { id: 't5', name: 'Lipid Profile', price: 550 },
        { id: 't6', name: 'Liver Function Test', price: 600 },
        { id: 't7', name: 'Kidney Function Test', price: 500 },
        { id: 't8', name: 'Vitamin D', price: 1200 },
        { id: 't9', name: 'Vitamin B12', price: 1000 },
      ];
      setTests(demoTestList);
      setPackages([
        { id: 'p1', name: 'Basic Health Checkup', shortDescription: 'Essential health screening', slug: 'basic-health-checkup', price: 1500, discountPrice: 999, isPopular: true, reportTime: '24 hours', tests: [{ test: demoTestList[0] }, { test: demoTestList[2] }], description: 'Essential health screening covering CBC, blood sugar, and urine analysis.' },
        { id: 'p2', name: 'Comprehensive Full Body Checkup', shortDescription: 'Complete health assessment - 40+ parameters', slug: 'full-body-checkup', price: 4000, discountPrice: 2499, isPopular: true, reportTime: '36 hours', tests: [{ test: demoTestList[0] }, { test: demoTestList[1] }, { test: demoTestList[3] }, { test: demoTestList[4] }, { test: demoTestList[5] }, { test: demoTestList[6] }], description: 'Complete health assessment with 40+ parameters including all major organs.' },
        { id: 'p3', name: 'Diabetes Care Package', shortDescription: 'Diabetes monitoring', slug: 'diabetes-care', price: 2500, discountPrice: 1799, isPopular: true, reportTime: '24 hours', tests: [{ test: demoTestList[2] }, { test: demoTestList[3] }, { test: demoTestList[4] }, { test: demoTestList[6] }], description: 'Complete diabetes monitoring package with FBS, HbA1c, lipid profile.' },
        { id: 'p4', name: 'Heart Health Package', shortDescription: 'Cardiac risk assessment', slug: 'heart-health', price: 3000, discountPrice: 1999, isPopular: true, reportTime: '24 hours', tests: [{ test: demoTestList[4] }, { test: demoTestList[5] }, { test: demoTestList[6] }], description: 'Comprehensive cardiac risk assessment with lipid profile and enzymes.' },
        { id: 'p5', name: 'Women Wellness Package', shortDescription: 'Women health checkup', slug: 'women-wellness', price: 3500, discountPrice: 2499, isPopular: false, reportTime: '36 hours', tests: [{ test: demoTestList[0] }, { test: demoTestList[1] }, { test: demoTestList[7] }, { test: demoTestList[8] }], description: 'Specialized health checkup for women including thyroid and vitamins.' },
        { id: 'p6', name: 'Senior Citizen Checkup', shortDescription: 'Senior health assessment', slug: 'senior-citizen', price: 5000, discountPrice: 3499, isPopular: true, reportTime: '48 hours', tests: [{ test: demoTestList[0] }, { test: demoTestList[1] }, { test: demoTestList[3] }, { test: demoTestList[4] }, { test: demoTestList[5] }, { test: demoTestList[6] }, { test: demoTestList[7] }, { test: demoTestList[8] }], description: 'Comprehensive health checkup designed for senior citizens.' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...form, slug: slugify(form.name), reportTime: '48 hours' };
      if (editing) {
        await apiService.packages.update(editing.id, data);
      } else {
        await apiService.packages.create(data);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', shortDescription: '', price: 0, discountPrice: '', isPopular: false, testIds: [] });
      fetchData();
    } catch { /* */ }
    setSaving(false);
  };

  const handleEdit = (pkg: any) => {
    setEditing(pkg);
    setForm({
      name: pkg.name, description: pkg.description, shortDescription: pkg.shortDescription || '',
      price: pkg.price, discountPrice: pkg.discountPrice || '', isPopular: pkg.isPopular,
      testIds: pkg.tests?.map((t: any) => t.test.id) || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    try { await apiService.packages.delete(id); fetchData(); } catch { /* */ }
  };

  const toggleTest = (testId: string) => {
    setForm(prev => ({
      ...prev,
      testIds: prev.testIds.includes(testId) ? prev.testIds.filter(id => id !== testId) : [...prev.testIds, testId],
    }));
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Package Management</h1>
          <p className="text-slate-500 mt-1">Manage health checkup packages.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="card-premium p-5"><div className="skeleton h-16 w-full rounded-xl" /></div>)
          ) : packages.length === 0 ? (
            <div className="card-premium p-12 text-center"><Package2 className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-slate-500">No packages yet</p></div>
          ) : (
            packages.map((pkg: any) => (
              <div key={pkg.id} className="card-premium p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900">{pkg.name}</h3>
                    {pkg.isPopular && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-semibold">Popular</span>}
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{pkg.shortDescription}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-slate-900">{formatCurrency(pkg.discountPrice || pkg.price)}</span>
                    <span className="text-slate-400">{pkg.tests?.length || 0} tests</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(pkg)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-slate-900">{editing ? 'Edit Package' : 'New Package'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" /></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Short Description</label><input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input-field text-sm" /></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field text-sm resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Price (₹)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Discount</label><input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field text-sm" /></div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Included Tests ({form.testIds.length} selected)</label>
                <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-xl p-2">
                  {tests.map((test: any) => (
                    <label key={test.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-xs">
                      <input type="checkbox" checked={form.testIds.includes(test.id)} onChange={() => toggleTest(test.id)} className="w-3.5 h-3.5 rounded text-purple-600" />
                      {test.name} <span className="text-gray-400 ml-auto">{formatCurrency(test.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} className="w-4 h-4 rounded text-purple-600" />
                <span className="text-sm text-slate-700">Mark as Popular</span>
              </label>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Package'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
