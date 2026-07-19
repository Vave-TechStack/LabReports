'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CalendarCheck, Users, DollarSign, Download } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend
} from 'recharts';

const COLORS = ['#0F766E', '#14B8A6', '#0284C7', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6'];

export default function AdminAnalyticsPage() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(12);

  const getDummyRevenueData = (m: number) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months.slice(0, m).map((month, i) => ({
      month, revenue: 1800000 + Math.random() * 1000000 + i * 50000, bookings: 400 + Math.floor(Math.random() * 200) + i * 10,
    }));
  };

  const dummyDashboardData = {
    totalRevenue: 28500000, monthlyRevenue: 1250000, totalBookings: 15420, totalPatients: 28750,
    bookingStatusCounts: [
      { status: 'PENDING', _count: { id: 23 } }, { status: 'CONFIRMED', _count: { id: 45 } },
      { status: 'SAMPLE_COLLECTED', _count: { id: 38 } }, { status: 'LAB_PROCESSING', _count: { id: 52 } },
      { status: 'REPORT_READY', _count: { id: 67 } }, { status: 'DELIVERED', _count: { id: 89 } }, { status: 'CANCELLED', _count: { id: 12 } },
    ],
    paymentStatusCounts: [
      { status: 'PENDING', _count: 45 }, { status: 'SUCCESS', _count: 234 }, { status: 'FAILED', _count: 12 }, { status: 'REFUNDED', _count: 5 },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [revRes, dashRes] = await Promise.all([
          apiService.admin.getRevenue(months),
          apiService.admin.getDashboard(),
        ]);
        setRevenueData(revRes.data?.data || []);
        setStats(dashRes.data?.data);
      } catch {
        setRevenueData(getDummyRevenueData(months));
        setStats(dummyDashboardData);
      }
      setLoading(false);
    };
    fetchData();
  }, [months]);

  const bookingStatusData = stats?.bookingStatusCounts?.map((b: any) => ({ name: b.status?.replace(/_/g, ' '), value: b._count?.id || 0 })) || [];
  const paymentStatusData = stats?.paymentStatusCounts?.map((p: any) => ({ name: p.status, value: p._count })) || [];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Comprehensive analytics and insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Period:</span>
          {[6, 12, 24].map(m => (
            <button key={m} onClick={() => setMonths(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${months === m ? 'bg-purple-600 text-white' : 'bg-gray-100 text-slate-600'}`}>
              {m} mo
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: 'Total Revenue', value: stats?.totalRevenue, color: 'bg-emerald-50 text-emerald-600' },
          { icon: DollarSign, label: 'Monthly Revenue', value: stats?.monthlyRevenue, color: 'bg-blue-50 text-blue-600' },
          { icon: CalendarCheck, label: 'Total Bookings', value: stats?.totalBookings, color: 'bg-purple-50 text-purple-600' },
          { icon: Users, label: 'Total Patients', value: stats?.totalPatients, color: 'bg-amber-50 text-amber-600' },
        ].map((kpi, i) => (
          loading ? (
            <div key={kpi.label} className="card-premium p-5"><div className="skeleton h-16 w-full rounded-xl" /></div>
          ) : (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-premium p-5">
              <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center mb-3`}><kpi.icon className="w-5 h-5" /></div>
              <p className="text-2xl font-heading font-bold text-slate-900">{kpi.label.includes('Revenue') ? formatCurrency(kpi.value || 0) : (kpi.value || 0).toLocaleString()}</p>
              <p className="text-sm text-slate-500">{kpi.label}</p>
            </motion.div>
          )
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="card-premium p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-6">Revenue Trend</h3>
          {loading ? <div className="skeleton h-64 w-full rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} /><stop offset="95%" stopColor="#0F766E" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bookings Trend */}
        <div className="card-premium p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-6">Bookings Trend</h3>
          {loading ? <div className="skeleton h-64 w-full rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Bar dataKey="bookings" fill="#0F766E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-6">Booking Status</h3>
          {loading ? <div className="skeleton h-64 w-full rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={bookingStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {bookingStatusData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card-premium p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-6">Payment Status</h3>
          {loading ? <div className="skeleton h-64 w-full rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {paymentStatusData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
