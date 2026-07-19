'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, CalendarCheck2, X, Check, Loader2, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = { PENDING: 'bg-amber-100 text-amber-700', APPROVED: 'bg-emerald-100 text-emerald-700', REJECTED: 'bg-red-100 text-red-700', CANCELLED: 'bg-gray-100 text-gray-700' };
const leaveTypes = ['EARNED', 'SICK', 'CASUAL', 'MATERNITY', 'PATERNITY', 'OTHER'];
const statuses = ['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employeeId: '', type: 'EARNED', startDate: '', endDate: '', reason: '' });

  const fetch = async () => {
    setLoading(true);
    try { const params: any = { page, limit: 20 }; if (statusFilter) params.status = statusFilter; const res = await apiService.employees.getLeaves(params); setLeaves(res.data?.data || []); setMeta(res.data?.meta || {}); } catch {
      const dummyLeaves = [
        { id: 'lv-1', employee: { firstName: 'Suresh', lastName: 'Reddy', employeeId: 'EMP001' }, type: 'SICK', status: 'APPROVED', startDate: '2024-03-18T00:00:00Z', endDate: '2024-03-19T00:00:00Z', reason: 'Fever and body ache', approvedAt: '2024-03-17T10:00:00Z' },
        { id: 'lv-2', employee: { firstName: 'Neha', lastName: 'Singh', employeeId: 'EMP002' }, type: 'EARNED', status: 'PENDING', startDate: '2024-03-20T00:00:00Z', endDate: '2024-03-22T00:00:00Z', reason: 'Personal vacation - family trip to Goa' },
        { id: 'lv-3', employee: { firstName: 'Raj', lastName: 'Verma', employeeId: 'EMP003' }, type: 'CASUAL', status: 'PENDING', startDate: '2024-03-19T00:00:00Z', endDate: '2024-03-19T00:00:00Z', reason: 'Personal work - bank appointment' },
        { id: 'lv-4', employee: { firstName: 'Priya', lastName: 'Patel', employeeId: 'EMP004' }, type: 'SICK', status: 'APPROVED', startDate: '2024-03-15T00:00:00Z', endDate: '2024-03-16T00:00:00Z', reason: 'Medical appointment', approvedAt: '2024-03-14T15:00:00Z' },
        { id: 'lv-5', employee: { firstName: 'Amit', lastName: 'Kumar', employeeId: 'EMP005' }, type: 'EARNED', status: 'REJECTED', startDate: '2024-03-14T00:00:00Z', endDate: '2024-03-15T00:00:00Z', reason: 'Need to attend family function', rejectionReason: 'Insufficient earned leave balance' },
        { id: 'lv-6', employee: { firstName: 'Lakshmi', lastName: 'Devi', employeeId: 'EMP006' }, type: 'MATERNITY', status: 'APPROVED', startDate: '2024-04-01T00:00:00Z', endDate: '2024-05-31T00:00:00Z', reason: 'Maternity leave', approvedAt: '2024-03-10T09:00:00Z' },
        { id: 'lv-7', employee: { firstName: 'Vikram', lastName: 'Joshi', employeeId: 'EMP007' }, type: 'CASUAL', status: 'APPROVED', startDate: '2024-03-13T00:00:00Z', endDate: '2024-03-13T00:00:00Z', reason: 'Half day - personal errand', approvedAt: '2024-03-12T11:00:00Z' },
        { id: 'lv-8', employee: { firstName: 'Ananya', lastName: 'Nair', employeeId: 'EMP008' }, type: 'SICK', status: 'PENDING', startDate: '2024-03-21T00:00:00Z', endDate: '2024-03-22T00:00:00Z', reason: 'Not feeling well - doctor advised rest' },
      ];
      const filtered = statusFilter ? dummyLeaves.filter(l => l.status === statusFilter) : dummyLeaves;
      setLeaves(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, statusFilter]);
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

  const handleCreate = async () => {
    setSubmitting(true);
    try { await apiService.employees.createLeave(form); setShowForm(false); setForm({ employeeId: '', type: 'EARNED', startDate: '', endDate: '', reason: '' }); fetch(); } catch { /* */ }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (id: string, status: string, rejectionReason?: string) => {
    try { await apiService.employees.updateLeaveStatus(id, status, rejectionReason); fetch(); } catch { /* */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-heading font-bold text-slate-900">Leave Management</h1><p className="text-slate-500 mt-1">Handle employee leave requests and approvals.</p></motion.div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Apply Leave</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" /></div>
        <div className="flex items-center gap-2 overflow-x-auto">{statuses.map((s) => (<button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-cyan-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{s || 'All'}</button>))}</div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">Apply Leave</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Employee *</label>
                <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input-field"><option value="">Select employee</option>{employees.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeId})</option>)}</select>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Leave Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">{leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Start Date *</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">End Date *</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input-field" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Reason *</label><textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="input-field resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} disabled={submitting || !form.employeeId || !form.startDate || !form.endDate || !form.reason} className="btn-primary flex-1 flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck2 className="w-4 h-4" />}{submitting ? 'Applying...' : 'Apply'}</button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)
        : leaves.length === 0 ? (
          <div className="card-premium p-12 text-center"><CalendarCheck2 className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Leave Requests</h3><p className="text-slate-500">No leave requests found.</p></div>
        ) : leaves.map((l: any) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0"><CalendarCheck2 className="w-5 h-5 text-cyan-600" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{l.employee?.firstName} {l.employee?.lastName}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded text-[10px] font-mono">{l.employee?.employeeId}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold">{l.type}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusColors[l.status]}`}>{l.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{l.reason}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{formatDate(l.startDate)} → {formatDate(l.endDate)}</span>
                    {l.approvedAt && <span>Approved: {formatDate(l.approvedAt)}</span>}
                    {l.rejectionReason && <span className="text-red-500">Reason: {l.rejectionReason}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {l.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusUpdate(l.id, 'APPROVED')} className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600"><ThumbsUp className="w-4 h-4" /></button>
                      <button onClick={() => { const reason = prompt('Rejection reason:'); if (reason) handleStatusUpdate(l.id, 'REJECTED', reason); }} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><ThumbsDown className="w-4 h-4" /></button>
                    </>
                  )}
                  {l.status === 'PENDING' && <button onClick={() => handleStatusUpdate(l.id, 'CANCELLED')} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500"><X className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
            </motion.div>
          ))}
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
