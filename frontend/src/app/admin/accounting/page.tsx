'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Receipt, ArrowRight, ChevronRight, CreditCard, FileText } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AccountingDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.accounting.getDashboard()
      .then(r => setData(r.data?.data))
      .catch(() => setData({
        monthlyIncome: 458000,
        monthlyExpenses: 312000,
        monthlyProfit: 146000,
        pendingInvoices: 23,
        yearlyIncome: 5340000,
        yearlyExpenses: 3780000,
        recentTransactions: [
          { id: 'tx-1', type: 'income', ref: 'BL-2024-0890', amount: 3500, date: '2024-03-18T10:30:00Z' },
          { id: 'tx-2', type: 'income', ref: 'BL-2024-0889', amount: 2500, date: '2024-03-18T09:15:00Z' },
          { id: 'tx-3', type: 'expense', ref: 'Reagent Purchase - CBC Kit', amount: 25000, date: '2024-03-18T08:00:00Z' },
          { id: 'tx-4', type: 'income', ref: 'BL-2024-0888', amount: 4800, date: '2024-03-17T14:20:00Z' },
          { id: 'tx-5', type: 'expense', ref: 'Monthly Rent - Andheri Branch', amount: 85000, date: '2024-03-17T10:00:00Z' },
          { id: 'tx-6', type: 'income', ref: 'BL-2024-0887', amount: 1800, date: '2024-03-17T11:45:00Z' },
          { id: 'tx-7', type: 'expense', ref: 'Electricity Bill - Main Lab', amount: 12500, date: '2024-03-16T09:00:00Z' },
          { id: 'tx-8', type: 'income', ref: 'BL-2024-0886', amount: 6500, date: '2024-03-16T16:30:00Z' },
        ]
      }))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: TrendingUp, label: 'Monthly Income', value: `₹${(data?.monthlyIncome || 0).toLocaleString()}`, color: 'bg-emerald-50 text-emerald-600' },
    { icon: TrendingDown, label: 'Monthly Expenses', value: `₹${(data?.monthlyExpenses || 0).toLocaleString()}`, color: 'bg-red-50 text-red-600' },
    { icon: DollarSign, label: 'Monthly Profit', value: `₹${(data?.monthlyProfit || 0).toLocaleString()}`, color: data?.monthlyProfit >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600', href: '/admin/accounting/profit-loss' },
    { icon: FileText, label: 'Pending Invoices', value: data?.pendingInvoices || 0, color: 'bg-amber-50 text-amber-600', href: '/admin/accounting/invoices' },
    { icon: DollarSign, label: 'Yearly Income', value: `₹${(data?.yearlyIncome || 0).toLocaleString()}`, color: 'bg-purple-50 text-purple-600' },
    { icon: TrendingDown, label: 'Yearly Expenses', value: `₹${(data?.yearlyExpenses || 0).toLocaleString()}`, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Accounting Dashboard</h1>
        <p className="text-slate-500 mt-1">Track income, expenses, and financial performance.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="card-premium p-5"><div className="skeleton h-20 w-full rounded-xl" /></div>)
        : stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className={`card-premium p-5 ${s.href ? 'group hover:shadow-lg transition-all cursor-pointer' : ''}`} onClick={() => s.href && window.location.assign(s.href)}>
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
                <p className="text-lg font-heading font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </motion.div>
          ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Recent Transactions</h2>
          </div>
          {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 w-full mb-2 rounded-xl" />)
          : !data?.recentTransactions?.length ? <p className="text-sm text-slate-500 text-center py-8">No transactions yet</p>
          : <div className="space-y-2">
              {data.recentTransactions.slice(0, 8).map((t: any, i: number) => (
                <div key={`${t.type}-${t.id}-${i}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-8 h-8 ${t.type === 'income' ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg flex items-center justify-center shrink-0`}>
                    {t.type === 'income' ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">{t.type === 'income' ? `Booking ${t.ref}` : t.ref}</p>
                    <p className="text-[10px] text-slate-500">{t.type === 'income' ? 'Payment Received' : 'Expense'} • {formatDate(t.date)}</p>
                  </div>
                  <span className={`text-xs font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                  </span>
                </div>
              ))}
            </div>}
        </div>

        <div className="card-premium p-6">
          <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            {[
              { icon: TrendingDown, label: 'Manage Expenses', desc: 'Track and categorize expenses', href: '/admin/accounting/expenses', color: 'bg-red-50 text-red-600' },
              { icon: Receipt, label: 'View Invoices', desc: 'Browse all invoices and payments', href: '/admin/accounting/invoices', color: 'bg-blue-50 text-blue-600' },
              { icon: BarChart, label: 'Profit & Loss', desc: 'View financial performance reports', href: '/admin/accounting/profit-loss', color: 'bg-purple-50 text-purple-600' },
            ].map((a) => (
              <Link key={a.label} href={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                <div className={`w-9 h-9 ${a.color} rounded-xl flex items-center justify-center shrink-0`}><a.icon className="w-4 h-4" /></div>
                <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{a.label}</p><p className="text-xs text-slate-500">{a.desc}</p></div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChart(props: any) {
  return (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="8" /><rect x="10" y="7" width="4" height="13" /><rect x="17" y="3" width="4" height="17" /></svg>);
}
