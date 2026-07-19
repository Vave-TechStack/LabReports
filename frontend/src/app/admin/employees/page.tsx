'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CalendarCheck2, DollarSign, Users, CheckCircle, AlertCircle, ArrowRight, ChevronRight, Building2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await apiService.employees.getDashboard(); setStats(res.data?.data); } catch {
        setStats({
          totalEmployees: 48,
          todayPresent: 38,
          onLeave: 5,
          pendingLeaves: 3,
          departments: [
            { department: 'Pathology', _count: { id: 12 } },
            { department: 'Radiology', _count: { id: 6 } },
            { department: 'Administration', _count: { id: 8 } },
            { department: 'Front Desk', _count: { id: 6 } },
            { department: 'Phlebotomy', _count: { id: 8 } },
            { department: 'Accounting', _count: { id: 4 } },
            { department: 'IT', _count: { id: 2 } },
            { department: 'Marketing', _count: { id: 2 } },
          ],
          recentLeaves: [
            { id: 'lv-1', employee: { firstName: 'Suresh', lastName: 'Reddy' }, type: 'SICK', status: 'APPROVED', startDate: '2024-03-18T00:00:00Z' },
            { id: 'lv-2', employee: { firstName: 'Neha', lastName: 'Singh' }, type: 'EARNED', status: 'PENDING', startDate: '2024-03-20T00:00:00Z' },
            { id: 'lv-3', employee: { firstName: 'Raj', lastName: 'Verma' }, type: 'CASUAL', status: 'PENDING', startDate: '2024-03-19T00:00:00Z' },
          ],
          recentPayroll: [
            { id: 'pr-1', employee: { firstName: 'Suresh', lastName: 'Reddy' }, month: 3, year: 2024, netSalary: 45000, status: 'PAID' },
            { id: 'pr-2', employee: { firstName: 'Neha', lastName: 'Singh' }, month: 3, year: 2024, netSalary: 38000, status: 'PROCESSED' },
            { id: 'pr-3', employee: { firstName: 'Raj', lastName: 'Verma' }, month: 3, year: 2024, netSalary: 52000, status: 'PAID' },
          ],
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Employees', value: stats?.totalEmployees, color: 'bg-blue-50 text-blue-600', href: '/admin/employees/list' },
    { icon: Clock, label: 'Present Today', value: stats?.todayPresent, color: 'bg-emerald-50 text-emerald-600', href: '/admin/employees/attendance' },
    { icon: CalendarCheck2, label: 'On Leave', value: stats?.onLeave, color: 'bg-amber-50 text-amber-600', href: '/admin/employees/leaves' },
    { icon: AlertCircle, label: 'Pending Leaves', value: stats?.pendingLeaves, color: 'bg-red-50 text-red-600', href: '/admin/employees/leaves?status=PENDING' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">HR Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage employees, attendance, leaves, shifts, and payroll.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card-premium p-5"><div className="skeleton h-20 w-full rounded-xl" /></div>)
        : statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={stat.href} className="card-premium p-5 block group hover:shadow-lg transition-all">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}><stat.icon className="w-5 h-5" /></div>
                <p className="text-2xl font-heading font-bold text-slate-900">{stat.value ?? '—'}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </Link>
            </motion.div>
          ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Departments */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">By Department</h2>
          {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-8 w-full mb-2 rounded-xl" />)
          : stats?.departments?.length === 0 ? <p className="text-sm text-slate-500 text-center py-8">No departments</p>
          : <div className="space-y-2">
              {stats?.departments?.map((d: any) => (
                <div key={d.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-900">{d.department}</span>
                  <span className="text-sm font-semibold text-cyan-600">{d._count.id}</span>
                </div>
              ))}
            </div>}
        </div>

        {/* Recent Leaves */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Recent Leaves</h2>
            <Link href="/admin/employees/leaves" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">View All <ChevronRight className="w-3.5 h-3.5 inline" /></Link>
          </div>
          {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 w-full mb-2 rounded-xl" />)
          : stats?.recentLeaves?.length === 0 ? <p className="text-sm text-slate-500 text-center py-8">No recent leaves</p>
          : <div className="space-y-2">
              {stats?.recentLeaves?.map((l: any) => (
                <div key={l.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0"><CalendarCheck2 className="w-4 h-4 text-amber-600" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">{l.employee?.firstName} {l.employee?.lastName}</p>
                    <p className="text-[10px] text-slate-500">{l.type} • {formatDate(l.startDate)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : l.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{l.status}</span>
                </div>
              ))}
            </div>}
        </div>

        {/* Recent Payroll */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">Recent Payroll</h2>
            <Link href="/admin/employees/payroll" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">View All <ChevronRight className="w-3.5 h-3.5 inline" /></Link>
          </div>
          {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 w-full mb-2 rounded-xl" />)
          : stats?.recentPayroll?.length === 0 ? <p className="text-sm text-slate-500 text-center py-8">No payroll data</p>
          : <div className="space-y-2">
              {stats?.recentPayroll?.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0"><DollarSign className="w-4 h-4 text-cyan-600" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 truncate">{p.employee?.firstName} {p.employee?.lastName}</p>
                    <p className="text-[10px] text-slate-500">{p.month}/{p.year} • ₹{p.netSalary}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : p.status === 'PROCESSED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
                </div>
              ))}
            </div>}
        </div>
      </div>
    </div>
  );
}
