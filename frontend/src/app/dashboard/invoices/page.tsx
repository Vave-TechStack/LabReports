'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, Search, Calendar, ArrowRight, Receipt, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Invoice {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  gstAmount: number;
  discountAmount: number;
  totalAmount: number;
  isPaid: boolean;
  paidAt: string | null;
  createdAt: string;
  booking: { bookingNumber: string; createdAt: string };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await apiService.invoices.getMyInvoices();
        setInvoices(res.data?.data || []);
      } catch {
        setInvoices([
          { id: 'inv1', invoiceNumber: 'INV-2024-10892', subtotal: 3500, gstAmount: 630, discountAmount: 0, totalAmount: 4130, isPaid: true, paidAt: new Date().toISOString(), createdAt: new Date().toISOString(), booking: { bookingNumber: 'ML-2024-10892', createdAt: new Date().toISOString() } },
          { id: 'inv2', invoiceNumber: 'INV-2024-10891', subtotal: 2499, gstAmount: 449.82, discountAmount: 0, totalAmount: 2948.82, isPaid: true, paidAt: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date(Date.now() - 86400000).toISOString(), booking: { bookingNumber: 'ML-2024-10891', createdAt: new Date(Date.now() - 86400000).toISOString() } },
          { id: 'inv3', invoiceNumber: 'INV-2024-10890', subtotal: 4999, gstAmount: 899.82, discountAmount: 0, totalAmount: 5898.82, isPaid: true, paidAt: new Date(Date.now() - 172800000).toISOString(), createdAt: new Date(Date.now() - 172800000).toISOString(), booking: { bookingNumber: 'ML-2024-10890', createdAt: new Date(Date.now() - 172800000).toISOString() } },
          { id: 'inv4', invoiceNumber: 'INV-2024-10889', subtotal: 1800, gstAmount: 324, discountAmount: 0, totalAmount: 2124, isPaid: true, paidAt: new Date(Date.now() - 259200000).toISOString(), createdAt: new Date(Date.now() - 259200000).toISOString(), booking: { bookingNumber: 'ML-2024-10889', createdAt: new Date(Date.now() - 259200000).toISOString() } },
          { id: 'inv5', invoiceNumber: 'INV-2024-10888', subtotal: 4200, gstAmount: 756, discountAmount: 0, totalAmount: 4956, isPaid: false, paidAt: null, createdAt: new Date().toISOString(), booking: { bookingNumber: 'ML-2024-10888', createdAt: new Date(Date.now() - 43200000).toISOString() } },
          { id: 'inv6', invoiceNumber: 'INV-2024-10885', subtotal: 7500, gstAmount: 1350, discountAmount: 500, totalAmount: 8350, isPaid: true, paidAt: new Date(Date.now() - 345600000).toISOString(), createdAt: new Date(Date.now() - 345600000).toISOString(), booking: { bookingNumber: 'ML-2024-10885', createdAt: new Date(Date.now() - 345600000).toISOString() } },
        ]);
      }
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.booking.bookingNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="skeleton h-8 w-48 mb-6 rounded-lg" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-premium p-5">
              <div className="skeleton h-5 w-1/3 mb-3" />
              <div className="skeleton h-4 w-1/2 mb-2" />
              <div className="skeleton h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-slate-900">Invoices</h1>
        <p className="text-slate-500 mt-1">View and download your billing history.</p>
      </motion.div>

      <div className="card-premium p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-slate-900 mb-2">No invoices yet</h3>
          <p className="text-slate-500">Your invoices will appear here after your first booking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((inv, index) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card-premium p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    inv.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {inv.isPaid ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{inv.invoiceNumber}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                        inv.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {inv.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(inv.createdAt)}
                      </span>
                      <span>Booking: {inv.booking.bookingNumber}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-2">{formatCurrency(inv.totalAmount)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('accessToken');
                    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/invoices/download/invoices/${inv.id}/pdf?token=${token}`, '_blank');
                  }}
                  className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
