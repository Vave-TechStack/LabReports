'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Headphones, X, Loader2, Send, MessageSquare, Clock, CheckCircle, AlertCircle, ArrowUp } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const statusColors: Record<string, string> = { OPEN: 'bg-blue-100 text-blue-700', IN_PROGRESS: 'bg-amber-100 text-amber-700', RESOLVED: 'bg-emerald-100 text-emerald-700', CLOSED: 'bg-gray-100 text-gray-700' };
const priorityColors: Record<string, string> = { LOW: 'bg-slate-100 text-slate-600', MEDIUM: 'bg-blue-100 text-blue-700', HIGH: 'bg-amber-100 text-amber-700', URGENT: 'bg-red-100 text-red-700' };
const statuses = ['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', customerName: '', customerEmail: '', customerPhone: '', priority: 'MEDIUM', bookingId: '' });
  const [viewTicket, setViewTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (statusFilter) params.status = statusFilter;
      const res = await apiService.crm.getTickets(params);
      setTickets(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyTickets = [
        {
          id: 'tkt-1', subject: 'Report delivery delayed', description: 'My lab report for the test taken on March 15th has not been delivered yet. It has been 3 days and I need the results urgently.',
          customerName: 'Priya Sharma', customerEmail: 'priya.sharma@email.com', customerPhone: '9876543210',
          priority: 'HIGH', status: 'IN_PROGRESS', ticketNumber: 'TKT-2024-0101',
          createdAt: '2024-03-17T10:30:00Z',
          _count: { messages: 3 },
          messages: [
            { id: 'msg-1', sender: 'Priya Sharma', isStaff: false, message: 'My report is delayed. Please help!', createdAt: '2024-03-17T10:30:00Z' },
            { id: 'msg-2', sender: 'Support Team', isStaff: true, message: 'We apologize for the delay. Let me check the status of your report.', createdAt: '2024-03-17T11:00:00Z' },
            { id: 'msg-3', sender: 'Support Team', isStaff: true, message: 'Your report is with the doctor for verification. It will be available within 24 hours.', createdAt: '2024-03-17T14:30:00Z' }
          ]
        },
        {
          id: 'tkt-2', subject: 'Billing discrepancy for package', description: 'I was charged Rs. 2,499 for the Wellness Package but the website shows Rs. 1,999. Please check and refund the difference.',
          customerName: 'Rajesh Patel', customerEmail: 'rajesh.patel@email.com', customerPhone: '9876543211',
          priority: 'URGENT', status: 'OPEN', ticketNumber: 'TKT-2024-0102',
          createdAt: '2024-03-18T09:15:00Z',
          _count: { messages: 1 },
          messages: [
            { id: 'msg-4', sender: 'Rajesh Patel', isStaff: false, message: 'Billing issue with my package purchase.', createdAt: '2024-03-18T09:15:00Z' }
          ]
        },
        {
          id: 'tkt-3', subject: 'Appointment rescheduling request', description: 'I need to reschedule my appointment from March 20th to March 22nd due to a sudden work commitment.',
          customerName: 'Sunita Verma', customerEmail: 'sunita.verma@email.com', customerPhone: '9876543212',
          priority: 'MEDIUM', status: 'RESOLVED', ticketNumber: 'TKT-2024-0103',
          createdAt: '2024-03-16T14:00:00Z',
          _count: { messages: 4 },
          resolution: 'Appointment rescheduled to March 22nd at 10:00 AM successfully.',
          messages: [
            { id: 'msg-5', sender: 'Sunita Verma', isStaff: false, message: 'Please reschedule my appointment.', createdAt: '2024-03-16T14:00:00Z' },
            { id: 'msg-6', sender: 'Support Team', isStaff: true, message: 'Sure! Which date would you prefer?', createdAt: '2024-03-16T15:00:00Z' },
            { id: 'msg-7', sender: 'Sunita Verma', isStaff: false, message: 'March 22nd would work.', createdAt: '2024-03-16T15:30:00Z' },
            { id: 'msg-8', sender: 'Support Team', isStaff: true, message: 'Done! Rescheduled to March 22nd at 10:00 AM.', createdAt: '2024-03-16T16:00:00Z' }
          ]
        },
        {
          id: 'tkt-4', subject: 'Test result not showing online', description: 'I got my blood tests done yesterday but the results are not visible in my patient portal. My booking number is BL-2024-0890.',
          customerName: 'Ananya Reddy', customerEmail: 'ananya.reddy@email.com', customerPhone: '9876543213',
          priority: 'HIGH', status: 'OPEN', ticketNumber: 'TKT-2024-0104',
          createdAt: '2024-03-18T07:30:00Z',
          _count: { messages: 2 },
          messages: [
            { id: 'msg-9', sender: 'Ananya Reddy', isStaff: false, message: 'Test results not visible in portal.', createdAt: '2024-03-18T07:30:00Z' },
            { id: 'msg-10', sender: 'Support Team', isStaff: true, message: 'Our team is looking into this. The lab results are being processed.', createdAt: '2024-03-18T08:15:00Z' }
          ]
        },
        {
          id: 'tkt-5', subject: 'Home collection service inquiry', description: 'I am unable to book a home sample collection slot for this weekend. The calendar shows no availability.',
          customerName: 'Vikram Singh', customerEmail: 'vikram.singh@email.com', customerPhone: '9876543214',
          priority: 'LOW', status: 'OPEN', ticketNumber: 'TKT-2024-0105',
          createdAt: '2024-03-17T17:00:00Z',
          _count: { messages: 1 },
          messages: [
            { id: 'msg-11', sender: 'Vikram Singh', isStaff: false, message: 'No slots available for home collection this weekend.', createdAt: '2024-03-17T17:00:00Z' }
          ]
        }
      ];
      const filtered = search
        ? dummyTickets.filter(t =>
            t.subject.toLowerCase().includes(search.toLowerCase()) ||
            t.customerName.toLowerCase().includes(search.toLowerCase()) ||
            t.ticketNumber.toLowerCase().includes(search.toLowerCase())
          )
        : dummyTickets;
      const statusFiltered = statusFilter ? filtered.filter(t => t.status === statusFilter) : filtered;
      setTickets(statusFiltered);
      setMeta({ totalPages: 1, total: statusFiltered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, search, statusFilter]);

  const handleCreate = async () => {
    setSubmitting(true);
    try { await apiService.crm.createTicket(form); setShowForm(false); setForm({ subject: '', description: '', customerName: '', customerEmail: '', customerPhone: '', priority: 'MEDIUM', bookingId: '' }); fetch(); } catch { /* */ }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (id: string, status: string, resolution?: string) => {
    try { await apiService.crm.updateTicketStatus(id, status, resolution); fetch(); if (viewTicket?.id === id) loadTicket(id); } catch { /* */ }
  };

  const loadTicket = async (id: string) => {
    try { const res = await apiService.crm.getTicketById(id); setViewTicket(res.data?.data); } catch {
      const found = tickets.find(t => t.id === id);
      if (found) setViewTicket(found);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !viewTicket) return;
    try {
      await apiService.crm.addTicketMessage(viewTicket.id, { sender: 'Staff', message: newMessage });
      setNewMessage('');
      loadTicket(viewTicket.id);
    } catch {
      setViewTicket({
        ...viewTicket,
        messages: [...(viewTicket.messages || []), {
          id: 'msg-demo-' + Date.now(), sender: 'Support Team', isStaff: true,
          message: newMessage, createdAt: new Date().toISOString()
        }]
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-500 mt-1">Manage customer support requests and inquiries.</p>
        </motion.div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Ticket</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by subject, customer, or ticket #..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" /></div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {statuses.map((s) => (<button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{s || 'All'}</button>))}
        </div>
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-heading font-semibold text-slate-900">New Ticket</h2><button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Subject *</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" /></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Description *</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Customer Name *</label><input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">{priorities.map(p => <option key={p} value={p}>{p}</option>)}</select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Email</label><input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className="input-field" /></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Phone</label><input type="text" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="input-field" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCreate} disabled={submitting || !form.subject || !form.description || !form.customerName} className="btn-primary flex-1 flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{submitting ? 'Creating...' : 'Create Ticket'}</button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)
        : tickets.length === 0 ? (
          <div className="card-premium p-12 text-center"><Headphones className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-heading font-semibold text-slate-900 mb-1">No Tickets</h3><p className="text-slate-500">All clear! No support tickets found.</p></div>
        ) : tickets.map((t: any) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-4">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 ${priorityColors[t.priority] || 'bg-blue-50 text-blue-600'} rounded-xl flex items-center justify-center shrink-0`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => loadTicket(t.id)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900">{t.subject}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColors[t.priority]}`}>{t.priority}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                  <span className="font-mono">#{t.ticketNumber?.slice(-8)}</span><span>•</span><span>{t.customerName}</span><span>•</span><span>{t._count?.messages || 0} messages</span>
                </div>
                <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${statusColors[t.status]}`}>{t.status?.replace(/_/g, ' ')}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {t.status === 'OPEN' && <button onClick={() => handleStatusUpdate(t.id, 'IN_PROGRESS')} className="px-2 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-medium hover:bg-amber-100">Take</button>}
                {t.status === 'IN_PROGRESS' && <button onClick={() => handleStatusUpdate(t.id, 'RESOLVED', 'Resolved by staff')} className="px-2 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-medium hover:bg-emerald-100">Resolve</button>}
                {(t.status === 'OPEN' || t.status === 'IN_PROGRESS') && <button onClick={() => handleStatusUpdate(t.id, 'CLOSED')} className="px-2 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-medium hover:bg-gray-200">Close</button>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ticket Detail Modal */}
      {viewTicket && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewTicket(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div><h2 className="text-lg font-heading font-semibold text-slate-900">{viewTicket.subject}</h2><p className="text-xs text-slate-500 font-mono">#{viewTicket.ticketNumber} • {viewTicket.customerName}</p></div>
              <button onClick={() => setViewTicket(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{viewTicket.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusColors[viewTicket.status]}`}>{viewTicket.status?.replace(/_/g, ' ')}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${priorityColors[viewTicket.priority]}`}>{viewTicket.priority}</span>
                </div>
              </div>
              {viewTicket.messages?.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.isStaff ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isStaff ? 'bg-rose-50 rounded-tr-sm' : 'bg-gray-50 rounded-tl-sm'}`}>
                    <p className="text-xs font-medium text-slate-700 mb-1">{msg.sender} {msg.isStaff ? '(Staff)' : ''}</p>
                    <p className="text-sm text-slate-900">{msg.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
              {viewTicket.resolution && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-xs font-medium text-emerald-700 mb-1">Resolution</p>
                  <p className="text-sm text-emerald-800">{viewTicket.resolution}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your reply..." className="input-field flex-1" onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="btn-primary !p-2.5 !rounded-xl"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

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
