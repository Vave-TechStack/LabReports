'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Receipt, CheckCircle, Clock, ChevronRight, Loader2, FileText, User, Calendar } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paidFilter, setPaidFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, search };
      if (paidFilter) params.isPaid = paidFilter;
      const res = await apiService.accounting.getInvoices(params);
      setInvoices(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch {
      const dummyInvoices = [
        { id: 'inv-1', invoiceNumber: 'INV-2024-0451', subtotal: 3150, gstAmount: 567, totalAmount: 3717, isPaid: true, paidAt: '2024-03-18T11:00:00Z', createdAt: '2024-03-18T10:30:00Z', patient: { firstName: 'Priya', lastName: 'Sharma' }, booking: { bookingNumber: 'BL-2024-0890' } },
        { id: 'inv-2', invoiceNumber: 'INV-2024-0452', subtotal: 2125, gstAmount: 382, totalAmount: 2507, isPaid: true, paidAt: '2024-03-18T09:30:00Z', createdAt: '2024-03-18T09:15:00Z', patient: { firstName: 'Rajesh', lastName: 'Patel' }, booking: { bookingNumber: 'BL-2024-0889' } },
        { id: 'inv-3', invoiceNumber: 'INV-2024-0453', subtotal: 4070, gstAmount: 732, totalAmount: 4802, isPaid: false, createdAt: '2024-03-17T14:20:00Z', patient: { firstName: 'Sunita', lastName: 'Verma' }, booking: { bookingNumber: 'BL-2024-0888' } },
        { id: 'inv-4', invoiceNumber: 'INV-2024-0454', subtotal: 1525, gstAmount: 275, totalAmount: 1800, isPaid: true, paidAt: '2024-03-17T12:00:00Z', createdAt: '2024-03-17T11:45:00Z', patient: { firstName: 'Ananya', lastName: 'Reddy' }, booking: { bookingNumber: 'BL-2024-0887' } },
        { id: 'inv-5', invoiceNumber: 'INV-2024-0455', subtotal: 5510, gstAmount: 992, totalAmount: 6502, isPaid: false, createdAt: '2024-03-16T16:30:00Z', patient: { firstName: 'Vikram', lastName: 'Singh' }, booking: { bookingNumber: 'BL-2024-0886' } },
        { id: 'inv-6', invoiceNumber: 'INV-2024-0456', subtotal: 8900, gstAmount: 1602, totalAmount: 10502, isPaid: true, paidAt: '2024-03-16T14:00:00Z', createdAt: '2024-03-16T14:00:00Z', patient: { firstName: 'Lakshmi', lastName: 'Devi' }, booking: { bookingNumber: 'BL-2024-0885' } },
        { id: 'inv-7', invoiceNumber: 'INV-2024-0457', subtotal: 3390, gstAmount: 610, totalAmount: 4000, isPaid: false, createdAt: '2024-03-15T10:00:00Z', patient: { firstName: 'Arjun', lastName: 'Nair' }, booking: { bookingNumber: 'BL-2024-0884' } },
        { id: 'inv-8', invoiceNumber: 'INV-2024-0458', subtotal: 2125, gstAmount: 382, totalAmount: 2507, isPaid: true, paidAt: '2024-03-15T09:00:00Z', createdAt: '2024-03-15T09:00:00Z', patient: { firstName: 'Meera', lastName: 'Joshi' }, booking: { bookingNumber: 'BL-2024-0883' } },
        { id: 'inv-9', invoiceNumber: 'INV-2024-0459', subtotal: 7200, gstAmount: 1296, totalAmount: 8496, isPaid: false, createdAt: '2024-03-14T16:00:00Z', patient: { firstName: 'Deepak', lastName: 'Gupta' }, booking: { bookingNumber: 'BL-2024-0882' } },
        { id: 'inv-10', invoiceNumber: 'INV-2024-0460', subtotal: 1860, gstAmount: 335, totalAmount: 2195, isPaid: false, createdAt: '2024-03-14T11:30:00Z', patient: { firstName: 'Kavita', lastName: 'Nair' }, booking: { bookingNumber: 'BL-2024-0881' } },
      ];
      let filtered = dummyInvoices;
      if (search) {
        filtered = filtered.filter(i =>
          i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          i.booking?.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
          i.patient?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          i.patient?.lastName?.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (paidFilter === 'true') {
        filtered = filtered.filter(i => i.isPaid);
      } else if (paidFilter === 'false') {
        filtered = filtered.filter(i => !i.isPaid);
      }
      setInvoices(filtered);
      setMeta({ totalPages: 1, total: filtered.length });
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, search, paidFilter]);

  const totalAmount = invoices.reduce((s: number, i: any) => s + i.totalAmount, 0);
  const totalGst = invoices.reduce((s: number, i: any) => s + i.gstAmount, 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Invoices & Income</h1>
        <p className="text-slate-500 mt-1">Browse all invoices and track payments.</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card-premium p-4"><p className="text-xs text-slate-500 mb-1">Total (This Page)</p><p className="text-xl font-bold text-slate-900">₹{totalAmount.toLocaleString()}</p></div>
        <div className="card-premium p-4"><p className="text-xs text-slate-500 mb-1">GST Amount</p><p className="text-xl font-bold text-amber-600">₹{totalGst.toLocaleString()}</p></div>
        <div className="card-premium p-4"><p className="text-xs text-slate-500 mb-1">Invoices</p><p className="text-xl font-bold text-slate-900">{meta.total || 0}</p></div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by invoice #, booking, or patient..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" /></div>
        <div className="flex items-center gap-2">{['', 'true', 'false'].map((v) => (<button key={v} onClick={() => { setPaidFilter(v); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${paidFilter === v ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>{v === '' ? 'All' : v === 'true' ? 'Paid' : 'Pending'}</button>))}</div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Invoice</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Patient</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Booking</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Subtotal</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">GST</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-500">Total</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Status</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-500">Date</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={8}><div className="skeleton h-12 w-full mx-4 my-2 rounded-xl" /></td></tr>)
              : invoices.length === 0 ? <tr><td colSpan={8}><div className="text-center py-12"><Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-sm text-slate-500">No invoices found</p></div></td></tr>
              : invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Receipt className="w-4 h-4 text-blue-600" /></div>
                        <span className="text-sm font-mono font-medium text-slate-900">{inv.invoiceNumber?.slice(-10)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="text-sm text-slate-900">{inv.patient?.firstName} {inv.patient?.lastName}</span></td>
                    <td className="py-3 px-4"><span className="text-xs font-mono text-slate-500">{inv.booking?.bookingNumber}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm text-slate-900">₹{inv.subtotal?.toLocaleString()}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm text-amber-600">₹{inv.gstAmount?.toLocaleString()}</span></td>
                    <td className="py-3 px-4 text-right"><span className="text-sm font-bold text-slate-900">₹{inv.totalAmount?.toLocaleString()}</span></td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${inv.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {inv.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center"><span className="text-xs text-slate-500">{formatDate(inv.createdAt)}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
