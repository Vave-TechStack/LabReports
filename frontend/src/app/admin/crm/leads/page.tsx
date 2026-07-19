'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Users, Edit2, Trash2, X, Check, Loader2, Filter, ChevronRight, Phone, Mail, Calendar } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700', CONTACTED: 'bg-amber-100 text-amber-700',
  QUALIFIED: 'bg-purple-100 text-purple-700', PROPOSAL: 'bg-cyan-100 text-cyan-700',
  CONVERTED: 'bg-emerald-100 text-emerald-700', LOST: 'bg-red-100 text-red-700',
};

const statuses = ['', 'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'CONVERTED', 'LOST'];
const sources = ['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'CAMPAIGN', 'WALK_IN', 'PHONE', 'OTHER'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', source: 'WEBSITE', status: 'NEW', notes: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (statusFilter) params.status = statusFilter;
      const res = await apiService.crm.getLeads(params);
      setLeads(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyLeads = [
        { id: 'lead-1', firstName: 'Ravi', lastName: 'Kumar', email: 'ravi.kumar@email.com', phone: '9876543210', source: 'WEBSITE', status: 'NEW', notes: 'Looking for full body checkup package', createdAt: '2024-03-18T10:30:00Z', _count: { followUps: 1 } },
        { id: 'lead-2', firstName: 'Sneha', lastName: 'Patel', email: 'sneha.patel@email.com', phone: '9876543211', source: 'REFERRAL', status: 'CONTACTED', notes: 'Referred by Dr. Sharma. Interested in cardiac package.', createdAt: '2024-03-18T09:15:00Z', _count: { followUps: 2 } },
        { id: 'lead-3', firstName: 'Amit', lastName: 'Sharma', email: 'amit.sharma@email.com', phone: '9876543212', source: 'SOCIAL_MEDIA', status: 'QUALIFIED', notes: 'High potential - family of 4 looking for annual checkups', createdAt: '2024-03-17T14:00:00Z', _count: { followUps: 3 } },
        { id: 'lead-4', firstName: 'Pooja', lastName: 'Reddy', email: 'pooja.reddy@email.com', phone: '9876543213', source: 'CAMPAIGN', status: 'NEW', notes: 'Came from Summer Health Promo email campaign', createdAt: '2024-03-17T11:30:00Z', _count: { followUps: 0 } },
        { id: 'lead-5', firstName: 'Vijay', lastName: 'Singh', email: 'vijay.singh@email.com', phone: '9876543214', source: 'WALK_IN', status: 'CONVERTED', notes: 'Booked health package and completed tests', createdAt: '2024-03-16T16:45:00Z', _count: { followUps: 1 } },
        { id: 'lead-6', firstName: 'Anjali', lastName: 'Joshi', email: 'anjali.joshi@email.com', phone: '9876543215', source: 'PHONE', status: 'PROPOSAL', notes: 'Corporate tie-up inquiry for employee health checkups', createdAt: '2024-03-16T08:20:00Z', _count: { followUps: 2 } },
        { id: 'lead-7', firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@email.com', phone: '9876543216', source: 'WEBSITE', status: 'LOST', notes: 'Chose competing lab due to location proximity', createdAt: '2024-03-15T13:10:00Z', _count: { followUps: 1 } },
        { id: 'lead-8', firstName: 'Kavita', lastName: 'Nair', email: 'kavita.nair@email.com', phone: '9876543217', source: 'CAMPAIGN', status: 'CONTACTED', notes: 'Interested in diabetes management package', createdAt: '2024-03-15T10:00:00Z', _count: { followUps: 1 } },
        { id: 'lead-9', firstName: 'Deepak', lastName: 'Gupta', email: 'deepak.gupta@email.com', phone: '9876543218', source: 'REFERRAL', status: 'QUALIFIED', notes: 'Referred by existing patient - needs full body checkup', createdAt: '2024-03-14T15:30:00Z', _count: { followUps: 2 } },
        { id: 'lead-10', firstName: 'Meera', lastName: 'Iyer', email: 'meera.iyer@email.com', phone: '9876543219', source: 'WALK_IN', status: 'NEW', notes: 'Walked in for thyroid profile test inquiry', createdAt: '2024-03-14T09:45:00Z', _count: { followUps: 0 } },
      ];
      const filtered = search
        ? dummyLeads.filter(l =>
            l.firstName.toLowerCase().includes(search.toLowerCase()) ||
            l.lastName.toLowerCase().includes(search.toLowerCase()) ||
            l.email?.toLowerCase().includes(search.toLowerCase()) ||
            l.phone?.includes(search)
          )
        : dummyLeads;
      const statusFiltered = statusFilter ? filtered.filter(l => l.status === statusFilter) : filtered;
      setLeads(statusFiltered);
      setMeta({ totalPages: 1, total: statusFiltered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, search, statusFilter]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) {
        await apiService.crm.updateLead(editing.id, form);
      } else {
        await apiService.crm.createLead(form);
      }
      setShowForm(false); setEditing(null); setForm({ firstName: '', lastName: '', email: '', phone: '', source: 'WEBSITE', status: 'NEW', notes: '' });
      fetch();
    } catch { /* */ }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await apiService.crm.updateLeadStatus(id, status); fetch(); } catch { /* */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try { await apiService.crm.deleteLead(id); fetch(); } catch { /* */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Leads</h1>
          <p className="text-slate-500 mt-1">Track and manage potential customers.</p>
        </motion.div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ firstName: '', lastName: '', email: '', phone: '', source: 'WEBSITE', status: 'NEW', notes: '' }); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name, email, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {statuses.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold text-slate-900">{editing ? 'Edit Lead' : 'Add Lead'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label><input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label><input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Source</label>
                  <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="input-field">
                    {sources.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                    {statuses.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="input-field resize-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.firstName} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Lead'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Contact</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Source</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Follow-Ups</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Created</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={7}><div className="skeleton h-12 w-full mx-4 my-2 rounded-xl" /></td></tr>)
              ) : leads.length === 0 ? (
                <tr><td colSpan={7}><div className="text-center py-12"><Users className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-slate-500">No leads found</p></div></td></tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-rose-600">{lead.firstName?.[0]}{lead.lastName?.[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">{lead.firstName} {lead.lastName}</p>
                          {lead.notes && <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{lead.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs space-y-0.5">
                        {lead.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {lead.email}</p>}
                        {lead.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {lead.phone}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center"><span className="text-xs text-slate-600">{lead.source?.replace(/_/g, ' ')}</span></td>
                    <td className="py-3 px-4 text-center">
                      <div className="relative group inline-block">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${statusColors[lead.status] || 'bg-gray-100 text-gray-700'}`}>
                          {lead.status}
                        </span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 p-1 hidden group-hover:block z-10 min-w-[120px]">
                          {statuses.filter(Boolean).map(s => (
                            <button key={s} onClick={() => handleStatusUpdate(lead.id, s)} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${lead.status === s ? 'bg-rose-50 text-rose-700' : 'hover:bg-gray-50 text-slate-600'}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center"><span className="text-xs text-slate-500">{lead._count?.followUps || 0}</span></td>
                    <td className="py-3 px-4 text-center"><span className="text-xs text-slate-500">{formatDate(lead.createdAt)}</span></td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setForm({ firstName: lead.firstName, lastName: lead.lastName || '', email: lead.email || '', phone: lead.phone || '', source: lead.source, status: lead.status, notes: lead.notes || '' }); setEditing(lead); setShowForm(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(lead.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
