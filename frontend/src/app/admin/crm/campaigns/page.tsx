'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Megaphone, X, Loader2, Mail, MessageSquare, Send, Trash2, Edit2, Calendar } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = { DRAFT: 'bg-gray-100 text-gray-700', SCHEDULED: 'bg-blue-100 text-blue-700', SENDING: 'bg-amber-100 text-amber-700', SENT: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-700' };
const typeIcons: Record<string, any> = { EMAIL: Mail, SMS: MessageSquare, WHATSAPP: Send };
const statuses = ['', 'DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED'];
const types = ['EMAIL', 'SMS', 'WHATSAPP'];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'EMAIL', subject: '', message: '', audience: 'all', scheduledAt: '', status: 'DRAFT' });

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (statusFilter) params.status = statusFilter;
      const res = await apiService.crm.getCampaigns(params);
      setCampaigns(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyCampaigns = [
        {
          id: 'cmp-1', name: 'Summer Health Checkup Promo', type: 'EMAIL', status: 'SENT',
          subject: 'Beat the Heat with 30% Off Health Checkups',
          message: 'Summer is here! Book your comprehensive health checkup package and get 30% off. Offer valid until June 30th. Includes free home sample collection and doctor consultation.',
          audience: { type: 'all' },
          createdAt: '2024-03-15T10:00:00Z', sentAt: '2024-03-16T08:00:00Z'
        },
        {
          id: 'cmp-2', name: 'New Patient Welcome Series', type: 'EMAIL', status: 'DRAFT',
          subject: 'Welcome to MediLab - Your Health Partner',
          message: 'Welcome to MediLab Diagnostics! We\'re glad to have you. Here\'s everything you need to know about our services, online reports, and home collection options.',
          audience: { type: 'recent' },
          createdAt: '2024-03-14T14:30:00Z'
        },
        {
          id: 'cmp-3', name: 'Diabetes Awareness SMS Blast', type: 'SMS', status: 'SCHEDULED',
          message: 'Free Diabetes Screening Camp this Saturday at MediLab! HbA1c, FBS, and PPBS tests at 50% off. Call 1800-MEDILAB to book.',
          audience: { type: 'leads' },
          createdAt: '2024-03-13T09:00:00Z', scheduledAt: '2024-03-20T09:00:00Z'
        },
        {
          id: 'cmp-4', name: 'Health Package WhatsApp Campaign', type: 'WHATSAPP', status: 'SENDING',
          message: '🎯 *Exclusive Health Packages* 🎯\n\nComplete Body Checkup: ₹999 only!\nCardiac Profile: ₹1499\nDiabetes Package: ₹799\n\nBook now and get 20% off on all packages!',
          audience: { type: 'all' },
          createdAt: '2024-03-12T11:00:00Z'
        },
        {
          id: 'cmp-5', name: 'Seasonal Flu Prevention', type: 'EMAIL', status: 'DRAFT',
          subject: 'Stay Protected This Flu Season',
          message: 'Flu season is approaching! Get your complete blood work and immunity panel done at MediLab. Early detection ensures timely treatment.',
          audience: { type: 'all' },
          createdAt: '2024-03-11T16:00:00Z'
        },
        {
          id: 'cmp-6', name: 'Corporate Wellness Follow-Up', type: 'EMAIL', status: 'SENT',
          subject: 'Quarterly Health Checkup Reports Ready',
          message: 'Dear Corporate Partner, your employees\' quarterly health checkup reports are now available. Login to the corporate portal to view and download individual reports.',
          audience: { type: 'recent' },
          createdAt: '2024-03-10T08:30:00Z', sentAt: '2024-03-11T09:00:00Z'
        }
      ];
      const filtered = search
        ? dummyCampaigns.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.message.toLowerCase().includes(search.toLowerCase()) ||
            c.subject?.toLowerCase().includes(search.toLowerCase())
          )
        : dummyCampaigns;
      const statusFiltered = statusFilter ? filtered.filter(c => c.status === statusFilter) : filtered;
      setCampaigns(statusFiltered);
      setMeta({ totalPages: 1, total: statusFiltered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, search, statusFilter]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = { ...form, audience: { type: form.audience } };
      if (editing) { await apiService.crm.updateCampaign(editing.id, data); }
      else { await apiService.crm.createCampaign(data); }
      setShowForm(false); setEditing(null);
      setForm({ name: '', type: 'EMAIL', subject: '', message: '', audience: 'all', scheduledAt: '', status: 'DRAFT' });
      fetch();
    } catch { /* */ }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await apiService.crm.updateCampaignStatus(id, status); fetch(); } catch { /* */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    try { await apiService.crm.deleteCampaign(id); fetch(); } catch { /* */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-500 mt-1">Create and manage marketing campaigns.</p>
        </motion.div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', type: 'EMAIL', subject: '', message: '', audience: 'all', scheduledAt: '', status: 'DRAFT' }); }} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Campaign</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" /></div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {statuses.map((s) => (<button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{s || 'All'}</button>))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">{editing ? 'Edit Campaign' : 'New Campaign'}</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Campaign Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g., Summer Health Checkup Promo" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <div className="flex gap-2">{['EMAIL', 'SMS', 'WHATSAPP'].map((type) => {
                    const Icon = typeIcons[type];
                    return (
                      <button key={type} onClick={() => setForm({ ...form, type })} className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${form.type === type ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}><Icon className="w-3.5 h-3.5" /> {type[0]}</button>
                    );
                  })}</div>
                </div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Audience</label>
                  <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="input-field">
                    <option value="all">All Patients</option>
                    <option value="recent">Recent Patients</option>
                    <option value="leads">Leads Only</option>
                  </select>
                </div>
              </div>
              {form.type === 'EMAIL' && <div><label className="block text-xs font-medium text-slate-700 mb-1">Email Subject</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" /></div>}
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Message *</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="input-field resize-none" placeholder="Write your campaign message here..." /></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Schedule (optional)</label><input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="input-field" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} disabled={submitting || !form.name || !form.message} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <Edit2 className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Create Campaign'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-40 w-full rounded-xl" />)
        : campaigns.length === 0 ? (
          <div className="md:col-span-2 card-premium p-12 text-center"><Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Campaigns</h3><p className="text-slate-500">Create your first marketing campaign.</p></div>
        ) : campaigns.map((c: any) => {
          const TypeIcon = typeIcons[c.type] || Mail;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${statusColors[c.status]} rounded-xl flex items-center justify-center shrink-0`}>
                  <TypeIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{c.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1 line-clamp-2">{c.message?.substring(0, 120)}...</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(c.createdAt)}</span>
                    <span>{c.type}</span>
                    {c.subject && <span>Subject: {c.subject}</span>}
                    {c.scheduledAt && <span>Scheduled: {formatDate(c.scheduledAt)}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                {c.status === 'DRAFT' && (
                  <>
                    <button onClick={() => handleStatusUpdate(c.id, 'SCHEDULED')} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100">{c.scheduledAt ? 'Schedule' : 'Send'}</button>
                    <button onClick={() => { setForm({ name: c.name, type: c.type, subject: c.subject || '', message: c.message, audience: c.audience?.type || 'all', scheduledAt: c.scheduledAt?.split('T')[0] || '', status: c.status }); setEditing(c); setShowForm(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </>
                )}
                {(c.status === 'SCHEDULED' || c.status === 'SENDING') && (
                  <button onClick={() => handleStatusUpdate(c.id, 'CANCELLED')} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Cancel</button>
                )}
                {c.status === 'SENT' && <span className="text-xs text-emerald-600 font-medium">✓ Sent {c.sentAt ? formatDate(c.sentAt) : ''}</span>}
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
