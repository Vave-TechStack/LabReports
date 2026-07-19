'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, DollarSign, Loader2, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = { PENDING: 'bg-gray-100 text-gray-700', PROCESSED: 'bg-blue-100 text-blue-700', PAID: 'bg-emerald-100 text-emerald-700' };
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function PayrollPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [summary, setSummary] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employeeId: '', basicSalary: 0, allowances: 0, deductions: 0, notes: '' });

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, month, year };
      if (statusFilter) params.status = statusFilter;
      const [pRes, sRes] = await Promise.all([
        apiService.employees.getPayroll(params),
        apiService.employees.getPayrollSummary(),
      ]);
      setRecords(pRes.data?.data || []);
      setMeta(pRes.data?.meta || {});
      setSummary(sRes.data?.data);
    } catch {
      setSummary({
        totalPayroll: 468000,
        paidPayroll: 325000,
        pendingPayroll: 12,
        totalEmployees: 48
      });
      const dummyPayroll = [
        { id: 'pr-1', employee: { firstName: 'Suresh', lastName: 'Reddy', employeeId: 'EMP001' }, basicSalary: 45000, allowances: 15000, deductions: 5000, netSalary: 55000, status: 'PAID', paymentDate: '2024-03-01T10:00:00Z', month: 3, year: 2024 },
        { id: 'pr-2', employee: { firstName: 'Neha', lastName: 'Singh', employeeId: 'EMP002' }, basicSalary: 32000, allowances: 8000, deductions: 2000, netSalary: 38000, status: 'PAID', paymentDate: '2024-03-01T10:00:00Z', month: 3, year: 2024 },
        { id: 'pr-3', employee: { firstName: 'Raj', lastName: 'Verma', employeeId: 'EMP003' }, basicSalary: 42000, allowances: 12000, deductions: 2000, netSalary: 52000, status: 'PAID', paymentDate: '2024-03-01T10:00:00Z', month: 3, year: 2024 },
        { id: 'pr-4', employee: { firstName: 'Priya', lastName: 'Patel', employeeId: 'EMP004' }, basicSalary: 22000, allowances: 6000, deductions: 1000, netSalary: 27000, status: 'PAID', paymentDate: '2024-03-01T10:00:00Z', month: 3, year: 2024 },
        { id: 'pr-5', employee: { firstName: 'Amit', lastName: 'Kumar', employeeId: 'EMP005' }, basicSalary: 25000, allowances: 8000, deductions: 1500, netSalary: 31500, status: 'PROCESSED', month: 3, year: 2024 },
        { id: 'pr-6', employee: { firstName: 'Lakshmi', lastName: 'Devi', employeeId: 'EMP006' }, basicSalary: 28000, allowances: 7000, deductions: 2000, netSalary: 33000, status: 'PROCESSED', month: 3, year: 2024 },
        { id: 'pr-7', employee: { firstName: 'Vikram', lastName: 'Joshi', employeeId: 'EMP007' }, basicSalary: 38000, allowances: 10000, deductions: 3000, netSalary: 45000, status: 'PENDING', month: 3, year: 2024 },
        { id: 'pr-8', employee: { firstName: 'Ananya', lastName: 'Nair', employeeId: 'EMP008' }, basicSalary: 25000, allowances: 6000, deductions: 1000, netSalary: 30000, status: 'PENDING', month: 3, year: 2024 },
        { id: 'pr-9', employee: { firstName: 'Deepak', lastName: 'Gupta', employeeId: 'EMP009' }, basicSalary: 35000, allowances: 12000, deductions: 2500, netSalary: 44500, status: 'PROCESSED', month: 3, year: 2024 },
        { id: 'pr-10', employee: { firstName: 'Arjun', lastName: 'Bose', employeeId: 'EMP011' }, basicSalary: 32000, allowances: 10000, deductions: 2000, netSalary: 40000, status: 'PAID', paymentDate: '2024-03-01T10:00:00Z', month: 3, year: 2024 },
      ];
      const filtered = statusFilter ? dummyPayroll.filter(r => r.status === statusFilter) : dummyPayroll;
      setRecords(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetchPayroll(); }, [page, month, year, statusFilter]);
  useEffect(() => {
    apiService.employees.getAll({ limit: 200 })
      .then(r => setEmployees(r.data?.data || []))
      .catch(() => setEmployees([
        { id: 'emp-1', firstName: 'Suresh', lastName: 'Reddy', employeeId: 'EMP001' },
        { id: 'emp-2', firstName: 'Neha', lastName: 'Singh', employeeId: 'EMP002' },
        { id: 'emp-3', firstName: 'Raj', lastName: 'Verma', employeeId: 'EMP003' },
        { id: 'emp-4', firstName: 'Priya', lastName: 'Patel', employeeId: 'EMP004' },
        { id: 'emp-5', firstName: 'Amit', lastName: 'Kumar', employeeId: 'EMP005' },
        { id: 'emp-6', firstName: 'Lakshmi', lastName: 'Devi', employeeId: 'EMP006' },
        { id: 'emp-7', firstName: 'Vikram', lastName: 'Joshi', employeeId: 'EMP007' },
        { id: 'emp-8', firstName: 'Ananya', lastName: 'Nair', employeeId: 'EMP008' },
        { id: 'emp-9', firstName: 'Deepak', lastName: 'Gupta', employeeId: 'EMP009' },
        { id: 'emp-10', firstName: 'Kavita', lastName: 'Iyer', employeeId: 'EMP010' },
        { id: 'emp-11', firstName: 'Arjun', lastName: 'Bose', employeeId: 'EMP011' },
        { id: 'emp-12', firstName: 'Meera', lastName: 'Chopra', employeeId: 'EMP012' },
      ]));
  }, []);

  const handleProcess = async () => {
    setSubmitting(true);
    try { await apiService.employees.processPayroll({ ...form, month, year }); setShowForm(false); setForm({ employeeId: '', basicSalary: 0, allowances: 0, deductions: 0, notes: '' }); fetchPayroll(); } catch { /* */ }
    setSubmitting(false);
  };

  const handlePay = async (id: string) => {
    try { await apiService.employees.markPayrollPaid(id); fetchPayroll(); } catch { /* */ }
  };

  const handlePrevMonth = () => { if (month === 1) { setMonth(12); setYear(year - 1); } else { setMonth(month - 1); } };
  const handleNextMonth = () => { if (month === 12) { setMonth(1); setYear(year + 1); } else { setMonth(month + 1); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-heading font-bold text-slate-900">Payroll</h1><p className="text-slate-500 mt-1">Process salaries and manage payments.</p></motion.div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><DollarSign className="w-4 h-4" /> Process Salary</button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Payroll', value: `₹${(summary.totalPayroll || 0).toLocaleString()}`, color: 'bg-blue-50 text-blue-600' },
            { label: 'Paid', value: `₹${(summary.paidPayroll || 0).toLocaleString()}`, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Pending Payment', value: summary.pendingPayroll || 0, color: 'bg-amber-50 text-amber-600' },
            { label: 'Employees', value: summary.totalEmployees || 0, color: 'bg-cyan-50 text-cyan-600' },
          ].map((s, i) => (
            <div key={i} className="card-premium p-4">
              <div className={`w-8 h-8 ${s.color} rounded-xl flex items-center justify-center mb-2`}><DollarSign className="w-4 h-4" /></div>
              <p className="text-lg font-heading font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label} ({months[month - 1]} {year})</p>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
          <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-medium text-slate-900 w-32 text-center">{months[month - 1]} {year}</span>
          <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-2">{['', 'PENDING', 'PROCESSED', 'PAID'].map((s) => (<button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-cyan-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{s || 'All'}</button>))}</div>
        <span className="text-sm text-slate-500 ml-auto">{meta.total || 0} records</span>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">Process Salary</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Employee *</label><select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input-field"><option value="">Select employee</option>{employees.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeId})</option>)}</select></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Basic Salary *</label><input type="number" min="0" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: parseFloat(e.target.value) || 0 })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Allowances</label><input type="number" min="0" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: parseFloat(e.target.value) || 0 })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Deductions</label><input type="number" min="0" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: parseFloat(e.target.value) || 0 })} className="input-field" /></div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                <span className="text-sm text-slate-600">Net Salary</span>
                <span className="text-lg font-bold text-cyan-600">₹{(form.basicSalary + form.allowances - form.deductions).toLocaleString()}</span>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Notes</label><input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleProcess} disabled={submitting || !form.employeeId || !form.basicSalary} className="btn-primary flex-1 flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}{submitting ? 'Processing...' : 'Process Salary'}</button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Employee</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Basic</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Allowances</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Deductions</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Net Salary</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Status</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Payment Date</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={8}><div className="skeleton h-12 w-full mx-4 my-2 rounded-xl" /></td></tr>)
              : records.length === 0 ? <tr><td colSpan={8}><div className="text-center py-12"><DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-slate-500">No payroll records for {months[month - 1]} {year}</p></div></td></tr>
              : records.map((r: any) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center"><span className="text-xs font-bold text-cyan-600">{r.employee?.firstName?.[0]}{r.employee?.lastName?.[0]}</span></div>
                        <div><p className="text-sm font-medium text-slate-900">{r.employee?.firstName} {r.employee?.lastName}</p><p className="text-[10px] text-slate-400 font-mono">{r.employee?.employeeId}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right"><span className="text-sm text-slate-900">₹{r.basicSalary?.toLocaleString()}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm text-emerald-600">+₹{r.allowances?.toLocaleString()}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm text-red-500">-₹{r.deductions?.toLocaleString()}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm font-bold text-slate-900">₹{r.netSalary?.toLocaleString()}</span></td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[r.status]}`}>{r.status === 'PAID' ? 'Paid' : r.status === 'PROCESSED' ? 'Processed' : 'Pending'}</span>
                    </td>
                    <td className="py-3 px-4 text-center"><span className="text-xs text-slate-500">{r.paymentDate ? formatDate(r.paymentDate) : '—'}</span></td>
                    <td className="py-3 px-4 text-center">
                      {r.status === 'PROCESSED' && <button onClick={() => handlePay(r.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100">Mark Paid</button>}
                      {r.status === 'PENDING' && <span className="text-xs text-slate-400">—</span>}
                      {r.status === 'PAID' && <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
