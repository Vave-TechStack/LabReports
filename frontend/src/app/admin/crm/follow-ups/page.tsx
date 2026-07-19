'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, CalendarRange, X, Loader2, CheckCircle, Clock, AlertCircle, Edit2, User } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = { PENDING: 'bg-amber-100 text-amber-700', COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-700' };
const statuses = ['', 'PENDING', 'COMPLETED', 'CANCELLED'];

export default function FollowUpsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [form, setForm] = useState({ leadId: '', ticketId: '', title: '', description: '', dueDate: '', status: 'PENDING' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (statusFilter) params.status = statusFilter;
      const res = await apiService.crm.getFollowUps(params);
      setItems(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyItems = [
        {
          id: 'fu-1', title: 'Call back about health package', description: 'Lead interested in full body checkup - call to discuss pricing',
          dueDate: '2024-03-19T10:00:00Z', status: 'PENDING',
          lead: { firstName: 'Ravi', lastName: 'Kumar' }, leadId: 'lead-1'
        },
        {
          id: 'fu-2', title: 'Follow up on test booking', description: 'Sneha had questions about sample collection - need to follow up',
          dueDate: '2024-03-19T14:00:00Z', status: 'PENDING',
          lead: { firstName: 'Sneha', lastName: 'Patel' }, leadId: 'lead-2'
        },
        {
          id: 'fu-3', title: 'Send campaign brochure', description: 'Send detailed brochure of corporate wellness programs',
          dueDate: '2024-03-20T09:00:00Z', status: 'PENDING',
          lead: { firstName: 'Amit', lastName: 'Sharma' }, leadId: 'lead-3'
        },
        {
          id: 'fu-4', title: 'Thank you call to converted lead', description: 'Call Vijay to thank and ask for referral',
          dueDate: '2024-03-18T16:00:00Z', status: 'PENDING',
          lead: { firstName: 'Vijay', lastName: 'Singh' }, leadId: 'lead-5'
        },
        {
          id: 'fu-5', title: 'Corporate proposal follow-up', description: 'Schedule meeting with HR team for tie-up discussion',
          dueDate: '2024-03-21T11:00:00Z', status: 'PENDING',
          lead: { firstName: 'Anjali', lastName: 'Joshi' }, leadId: 'lead-6'
        },
        {
          id: 'fu-6', title: 'Diabetes package details', description: 'Send comparison of diabetes packages to Kavita',
          dueDate: '2024-03-17T15:00:00Z', status: 'COMPLETED',
          lead: { firstName: 'Kavita', lastName: 'Nair' }, leadId: 'lead-8'
        },
        {
          id: 'fu-7', title: 'Follow up on missed appointment', description: 'Deepak missed his appointment - reschedule',
          dueDate: '2024-03-22T10:00:00Z', status: 'PENDING',
          lead: { firstName: 'Deepak', lastName: 'Gupta' }, leadId: 'lead-9'
        },
        {
          id: 'fu-8', title: 'Thyroid test inquiry response', description: 'Call Meera about thyroid profile package pricing',
          dueDate: '2024-03-18T10:00:00Z', status: 'CANCELLED',
          lead: { firstName: 'Meera', lastName: 'Iyer' }, leadId: 'lead-10'
        },
        {
          id: 'fu-9', title: 'Quarterly review call', description: 'Quarterly review with major corporate client',
          dueDate: '2024-03-25T14:00:00Z', status: 'PENDING',
          ticket: { ticketNumber: 'TKT-2024-0101' }
        },
        {
          id: 'fu-10', title: 'Support ticket follow-up', description: 'Check on delayed report delivery ticket status',
          dueDate: '2024-03-20T09:00:00Z', status: 'PENDING',
          ticket: { ticketNumber: 'TKT-2024-0101' }
        }
      ];
      const filtered = search
        ? dummyItems.filter(fu =>
            fu.title.toLowerCase().includes(search.toLowerCase()) ||
            fu.description?.toLowerCase().includes(search.toLowerCase()) ||
            fu.lead?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
            fu.lead?.lastName?.toLowerCase().includes(search.toLowerCase())
          )
        : dummyItems;
      const statusFiltered = statusFilter ? filtered.filter(fu => fu.status === statusFilter) : filtered;
      setItems(statusFiltered);
      setMeta({ totalPages: 1, total: statusFiltered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, search, statusFilter]);

  useEffect(() => {
    const loadLeads = async () => {
      try { const res = await apiService.crm.getLeads({ limit: 100 }); setLeads(res.data?.data || []); } catch {
        setLeads([
          { id: 'lead-1', firstName: 'Ravi', lastName: 'Kumar' },
          { id: 'lead-2', firstName: 'Sneha', lastName: 'Patel' },
          { id: 'lead-3', firstName: 'Amit', lastName: 'Sharma' },
          { id: 'lead-4', firstName: 'Pooja', lastName: 'Reddy' },
          { id: 'lead-5', firstName: 'Vijay', lastName: 'Singh' },
          { id: 'lead-6', firstName: 'Anjali', lastName: 'Joshi' },
          { id: 'lead-8', firstName: 'Kavita', lastName: 'Nair' },
          { id: 'lead-9', firstName: 'Deepak', lastName: 'Gupta' },
          { id: 'lead-10', firstName: 'Meera', lastName: 'Iyer' }
        ]);
      }
    };
    loadLeads();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) { await apiService.crm.updateFollowUp(editing.id, form); }
      else { await apiService.crm.createFollowUp(form); }
      setShowForm(false); setEditing(null);
      setForm({ leadId: '', ticketId: '', title: '', description: '', dueDate: '', status: 'PENDING' });
      fetch();
    } catch { /* */ }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await apiService.crm.updateFollowUpStatus(id, status); fetch(); } catch { /* */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Follow-Ups</h1>
          <p className="text-slate-500 mt-1">Schedule and track follow-up tasks for leads and tickets.</p>
        </motion.div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ leadId: '', ticketId: '', title: '', description: '', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: 'PENDING' }); }} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Schedule Follow-Up</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search tasks..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" /></div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {statuses.map((s) => (<button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{s || 'All'}</button>))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">{editing ? 'Edit Follow-Up' : 'Schedule Follow-Up'}</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Call back about health package" /></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Due Date *</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Related Lead</label>
                  <select value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })} className="input-field">
                    <option value="">None</option>
                    {leads.map((l: any) => <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.title || !form.dueDate} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <CheckCircle className="w-4 h-4" /> : <CalendarRange className="w-4 h-4" />}
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Schedule'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)
        : items.length === 0 ? (
          <div className="card-premium p-12 text-center"><CalendarRange className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Follow-Ups</h3><p className="text-slate-500">Schedule your first follow-up task.</p></div>
        ) : items.map((fu: any) => {
          const isOverdue = fu.status === 'PENDING' && new Date(fu.dueDate) < new Date();
          return (
            <motion.div key={fu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${isOverdue ? 'bg-red-50' : 'bg-purple-50'} rounded-xl flex items-center justify-center shrink-0`}>
                  {isOverdue ? <AlertCircle className="w-5 h-5 text-red-600" /> : <CalendarRange className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{fu.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[fu.status]}`}>{fu.status}</span>
                    {isOverdue && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">Overdue</span>}
                  </div>
                  {fu.description && <p className="text-xs text-slate-500 mb-1">{fu.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {formatDate(fu.dueDate)}</span>
                    {fu.lead && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {fu.lead.firstName} {fu.lead.lastName}</span>}
                    {fu.ticket && <span>{fu.ticket.ticketNumber}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {fu.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusUpdate(fu.id, 'COMPLETED')} className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle className="w-4 h-4" /></button>
                      <button onClick={() => { setForm({ leadId: fu.leadId || '', ticketId: fu.ticketId || '', title: fu.title, description: fu.description || '', dueDate: fu.dueDate?.split('T')[0] || '', status: fu.status }); setEditing(fu); setShowForm(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                  {fu.status === 'PENDING' && <button onClick={() => handleStatusUpdate(fu.id, 'CANCELLED')} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><X className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-rose-600 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
