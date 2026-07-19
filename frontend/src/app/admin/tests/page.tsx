'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Beaker, X, Save, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AdminTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', categoryId: '', description: '', price: 0, discountPrice: '', reportTime: '24 hours', isPopular: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [testsRes, catsRes] = await Promise.all([apiService.tests.getAll({ limit: 200 }), apiService.tests.getCategories()]);
      setTests(testsRes.data?.data || []);
      setCategories(catsRes.data?.data || []);
    } catch {
      // Fallback demo data
      const demoCategories = [
        { id: 'cat1', name: 'Complete Blood Count' },
        { id: 'cat2', name: 'Diabetes' },
        { id: 'cat3', name: 'Thyroid' },
        { id: 'cat4', name: 'Lipid Profile' },
        { id: 'cat5', name: 'Liver Function' },
        { id: 'cat6', name: 'Kidney Function' },
        { id: 'cat7', name: 'Vitamin & Minerals' },
      ];
      setCategories(demoCategories);
      setTests([
        { id: 't1', name: 'Complete Blood Count (CBC)', code: 'CBC', category: demoCategories[0], categoryId: 'cat1', description: 'Measures different components of blood.', price: 500, discountPrice: 350, reportTime: '6 hours', isPopular: true },
        { id: 't2', name: 'Thyroid Profile (T3, T4, TSH)', code: 'THYROID', category: demoCategories[2], categoryId: 'cat3', description: 'Complete thyroid function assessment.', price: 800, discountPrice: 599, reportTime: '12 hours', isPopular: true },
        { id: 't3', name: 'Fasting Blood Sugar (FBS)', code: 'FBS', category: demoCategories[1], categoryId: 'cat2', description: 'Measures blood glucose after fasting.', price: 150, discountPrice: 100, reportTime: '6 hours', isPopular: true },
        { id: 't4', name: 'HbA1c', code: 'HBA1C', category: demoCategories[1], categoryId: 'cat2', description: 'Average blood sugar over 2-3 months.', price: 600, discountPrice: 450, reportTime: '12 hours', isPopular: true },
        { id: 't5', name: 'Lipid Profile', code: 'LIPID', category: demoCategories[3], categoryId: 'cat4', description: 'Cholesterol and triglyceride assessment.', price: 550, discountPrice: 399, reportTime: '12 hours', isPopular: true },
        { id: 't6', name: 'Liver Function Test (LFT)', code: 'LFT', category: demoCategories[4], categoryId: 'cat5', description: 'Assesses liver health.', price: 600, discountPrice: 450, reportTime: '12 hours', isPopular: true },
        { id: 't7', name: 'Kidney Function Test (KFT)', code: 'KFT', category: demoCategories[5], categoryId: 'cat6', description: 'Evaluates kidney function.', price: 500, discountPrice: 380, reportTime: '12 hours', isPopular: true },
        { id: 't8', name: 'Vitamin D Test', code: 'VITD', category: demoCategories[6], categoryId: 'cat7', description: 'Vitamin D level measurement.', price: 1200, discountPrice: 899, reportTime: '24 hours', isPopular: true },
        { id: 't9', name: 'Vitamin B12 Test', code: 'VITB12', category: demoCategories[6], categoryId: 'cat7', description: 'Vitamin B12 level measurement.', price: 1000, discountPrice: 750, reportTime: '24 hours', isPopular: true },
        { id: 't10', name: 'Dengue Test (NS1)', code: 'DENGUE', category: demoCategories[6], categoryId: 'cat7', description: 'Early dengue detection.', price: 800, discountPrice: 599, reportTime: '12 hours', isPopular: false },
        { id: 't11', name: 'Urine Routine Analysis', code: 'URINE', category: demoCategories[0], categoryId: 'cat1', description: 'Complete urine analysis.', price: 200, discountPrice: 150, reportTime: '6 hours', isPopular: false },
        { id: 't12', name: 'Malaria Test', code: 'MALARIA', category: demoCategories[6], categoryId: 'cat7', description: 'Malaria parasite detection.', price: 350, discountPrice: 250, reportTime: '6 hours', isPopular: false },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTests = tests.filter((t: any) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiService.tests.update(editing.id, form);
      } else {
        await apiService.tests.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', code: '', categoryId: '', description: '', price: 0, discountPrice: '', reportTime: '24 hours', isPopular: false });
      fetchData();
    } catch { /* */ }
    setSaving(false);
  };

  const handleEdit = (test: any) => {
    setEditing(test);
    setForm({ name: test.name, code: test.code, categoryId: test.categoryId, description: test.description, price: test.price, discountPrice: test.discountPrice || '', reportTime: test.reportTime, isPopular: test.isPopular });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this test?')) return;
    try {
      await apiService.tests.delete(id);
      fetchData();
    } catch { /* */ }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Test Management</h1>
          <p className="text-slate-500 mt-1">Manage all laboratory tests and categories.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', code: '', categoryId: categories[0]?.id || '', description: '', price: 0, discountPrice: '', reportTime: '24 hours', isPopular: false }); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Test
        </button>
      </motion.div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search tests by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tests Table */}
        <div className="lg:col-span-2 card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Code</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Price</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Popular</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="p-4"><div className="skeleton h-10 w-full rounded-lg" /></td></tr>
                  ))
                ) : filteredTests.map((test: any) => (
                  <tr key={test.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">{test.name}</td>
                    <td className="py-3 px-4 text-xs font-mono text-primary-600">{test.code}</td>
                    <td className="py-3 px-4 text-slate-600">{test.category?.name}</td>
                    <td className="py-3 px-4">{formatCurrency(test.discountPrice || test.price)}</td>
                    <td className="py-3 px-4">{test.isPopular ? <span className="text-emerald-600 text-xs font-semibold">★ Popular</span> : '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(test)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(test.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-slate-900">{editing ? 'Edit Test' : 'Add New Test'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Test Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Code</label>
                  <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field text-sm">
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Discount Price</label>
                  <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Report Time</label>
                  <input type="text" value={form.reportTime} onChange={(e) => setForm({ ...form, reportTime: e.target.value })} className="input-field text-sm" />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} className="w-4 h-4 rounded text-purple-600" />
                    <span className="text-sm text-slate-700">Mark as Popular</span>
                  </label>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Test'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
