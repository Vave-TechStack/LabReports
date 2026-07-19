'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, TrendingDown, Edit2, Trash2, X, Check, Loader2, Building2, Calendar, CreditCard } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const categories = ['SALARY','REAGENTS','CONSUMABLES','EQUIPMENT','MAINTENANCE','UTILITIES','RENT','MARKETING','TRAVEL','TRAINING','PROFESSIONAL_FEES','INSURANCE','TAXES','MISCELLANEOUS'];
const paymentMethods = ['CASH','BANK_TRANSFER','CHEQUE','CREDIT_CARD','UPI','OTHER'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: 'MISCELLANEOUS', amount: 0, description: '', date: new Date().toISOString().split('T')[0], branchId: '', paymentMethod: 'CASH', vendor: '', invoiceRef: '', notes: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (catFilter) params.category = catFilter;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      const res = await apiService.accounting.getExpenses(params);
      setExpenses(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyExpenses = [
        { id: 'exp-1', category: 'RENT', amount: 85000, description: 'Monthly rent - Andheri Branch', date: '2024-03-17T10:00:00Z', paymentMethod: 'BANK_TRANSFER', vendor: 'Skyline Properties', branch: { name: 'Mumbai - Andheri Branch' }, invoiceRef: 'INV-2024-032', notes: 'March 2024 rent' },
        { id: 'exp-2', category: 'SALARY', amount: 185000, description: 'Monthly salary - March 2024', date: '2024-03-15T09:00:00Z', paymentMethod: 'BANK_TRANSFER', vendor: '', branch: { name: 'Hyderabad - Main Lab' }, invoiceRef: 'PAY-2024-03', notes: 'Full staff salaries' },
        { id: 'exp-3', category: 'REAGENTS', amount: 25000, description: 'CBC Reagent Kit - Bulk Purchase', date: '2024-03-14T11:30:00Z', paymentMethod: 'BANK_TRANSFER', vendor: 'MediSupplies India', branch: { name: 'Hyderabad - Main Lab' }, invoiceRef: 'PO-2024-0045-1', notes: '10 kits ordered' },
        { id: 'exp-4', category: 'UTILITIES', amount: 12500, description: 'Electricity Bill - Main Lab Hyderabad', date: '2024-03-13T08:00:00Z', paymentMethod: 'UPI', vendor: 'TS Power Distribution', branch: { name: 'Hyderabad - Main Lab' }, invoiceRef: 'EB-2024-03-HYD', notes: '' },
        { id: 'exp-5', category: 'EQUIPMENT', amount: 45000, description: 'Centrifuge Machine - Bangalore Branch', date: '2024-03-12T15:00:00Z', paymentMethod: 'CHEQUE', vendor: 'LabTech Instruments', branch: { name: 'Bangalore - Whitefield Branch' }, invoiceRef: 'PO-2024-0047-1', notes: 'New equipment' },
        { id: 'exp-6', category: 'MARKETING', amount: 15000, description: 'Facebook & Google Ads - March Campaign', date: '2024-03-11T10:00:00Z', paymentMethod: 'CREDIT_CARD', vendor: 'Google Ads', branch: null, invoiceRef: 'AD-2024-03', notes: 'Digital marketing campaign' },
        { id: 'exp-7', category: 'CONSUMABLES', amount: 8000, description: 'Sample collection tubes & gloves', date: '2024-03-10T09:30:00Z', paymentMethod: 'CASH', vendor: 'HealthFirst Medical', branch: { name: 'Chennai - T Nagar Branch' }, invoiceRef: '', notes: 'Monthly consumables' },
        { id: 'exp-8', category: 'MAINTENANCE', amount: 7500, description: 'Annual maintenance - Hematology Analyzer', date: '2024-03-09T14:00:00Z', paymentMethod: 'BANK_TRANSFER', vendor: 'BioLab Diagnostics', branch: { name: 'Hyderabad - Main Lab' }, invoiceRef: 'AMC-2024-HA', notes: 'AMC renewal' },
        { id: 'exp-9', category: 'TRAVEL', amount: 5500, description: 'Staff travel reimbursement - March', date: '2024-03-08T16:00:00Z', paymentMethod: 'CASH', vendor: '', branch: null, invoiceRef: '', notes: 'Field collection visits' },
        { id: 'exp-10', category: 'PROFESSIONAL_FEES', amount: 12000, description: 'Lab accreditation audit fees', date: '2024-03-07T11:00:00Z', paymentMethod: 'BANK_TRANSFER', vendor: 'NABL Accreditation Board', branch: null, invoiceRef: 'NABL-2024-01', notes: 'Annual accreditation' },
        { id: 'exp-11', category: 'REAGENTS', amount: 16800, description: 'Lipid Profile & Glucose Reagents', date: '2024-03-06T10:00:00Z', paymentMethod: 'BANK_TRANSFER', vendor: 'BioLab Diagnostics', branch: { name: 'Mumbai - Andheri Branch' }, invoiceRef: 'PO-2024-0046-1', notes: '' },
        { id: 'exp-12', category: 'TRAINING', amount: 3500, description: 'Staff training - New SOP implementation', date: '2024-03-05T09:00:00Z', paymentMethod: 'UPI', vendor: 'Training Solutions', branch: { name: 'Hyderabad - Main Lab' }, invoiceRef: '', notes: 'All lab staff attended' },
      ];
      let filtered = dummyExpenses;
      if (search) {
        filtered = filtered.filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.vendor?.toLowerCase().includes(search.toLowerCase()));
      }
      if (catFilter) {
        filtered = filtered.filter(e => e.category === catFilter);
      }
      if (fromDate) {
        filtered = filtered.filter(e => e.date >= fromDate);
      }
      if (toDate) {
        filtered = filtered.filter(e => e.date.split('T')[0] <= toDate);
      }
      setExpenses(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, catFilter, fromDate, toDate, search]);
  useEffect(() => {
    apiService.admin.getBranches()
      .then(r => setBranches(r.data?.data || []))
      .catch(() => setBranches([
        { id: 'br-1', name: 'Hyderabad - Main Lab' },
        { id: 'br-2', name: 'Bangalore - Whitefield Branch' },
        { id: 'br-3', name: 'Mumbai - Andheri Branch' },
        { id: 'br-4', name: 'Chennai - T Nagar Branch' },
        { id: 'br-5', name: 'Delhi - Noida Branch' }
      ]));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) await apiService.accounting.updateExpense(editing.id, form);
      else await apiService.accounting.createExpense(form);
      setShowForm(false); setEditing(null);
      setForm({ category: 'MISCELLANEOUS', amount: 0, description: '', date: new Date().toISOString().split('T')[0], branchId: '', paymentMethod: 'CASH', vendor: '', invoiceRef: '', notes: '' });
      fetch();
    } catch { /* */ }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-heading font-bold text-slate-900">Expenses</h1><p className="text-slate-500 mt-1">Track and manage all business expenses.</p></motion.div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Expense</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" /></div>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="input-field w-36 text-xs" />
        <span className="text-xs text-slate-400">to</span>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="input-field w-36 text-xs" />
        <div className="flex items-center gap-2 overflow-x-auto">
          {['', ...categories.slice(0, 6)].map((c) => (<button key={c} onClick={() => { setCatFilter(c); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${catFilter === c ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{c || 'All'}</button>))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">{editing ? 'Edit Expense' : 'Add Expense'}</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Category *</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Amount *</label><input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} className="input-field" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Description *</label><input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Date *</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label><select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="input-field">{paymentMethods.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Vendor</label><input type="text" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Branch</label><select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="input-field"><option value="">All branches</option>{branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Invoice Ref</label><input type="text" value={form.invoiceRef} onChange={(e) => setForm({ ...form, invoiceRef: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.amount || !form.description} className="btn-primary flex-1 flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}{submitting ? 'Saving...' : editing ? 'Update' : 'Add Expense'}</button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)
        : expenses.length === 0 ? (
          <div className="card-premium p-12 text-center"><TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Expenses</h3><p className="text-slate-500">No expenses found for the selected period.</p></div>
        ) : expenses.map((e: any) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0"><TrendingDown className="w-5 h-5 text-red-600" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{e.description}</span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-semibold">{e.category}</span>
                    <span className="text-sm font-bold text-red-600 ml-auto">-₹{e.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(e.date)}</span>
                    <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {e.paymentMethod?.replace(/_/g, ' ')}</span>
                    {e.vendor && <span>{e.vendor}</span>}
                    {e.branch?.name && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {e.branch.name}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setForm({ category: e.category, amount: e.amount, description: e.description, date: e.date?.split('T')[0] || '', branchId: e.branchId || '', paymentMethod: e.paymentMethod, vendor: e.vendor || '', invoiceRef: e.invoiceRef || '', notes: e.notes || '' }); setEditing(e); setShowForm(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm('Delete this expense?')) apiService.accounting.deleteExpense(e.id).then(fetch); }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
