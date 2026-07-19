'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CalendarCheck, Beaker, Package2, Users,
  Stethoscope, Building2, UserCog, BarChart3, Menu, X,
  LogOut, ChevronRight, FlaskConical, Settings, ArrowLeft,
  ClipboardList, Truck, ShoppingCart,
  Target, Headphones, CalendarRange, Megaphone,
  Briefcase, Clock, CalendarCheck2, Sun, DollarSign, Receipt, TrendingUp, TrendingDown, BarChart
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { label: 'Tests', href: '/admin/tests', icon: Beaker },
  { label: 'Packages', href: '/admin/packages', icon: Package2 },
  { label: 'Patients', href: '/admin/patients', icon: Users },
  { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
  { label: 'Branches', href: '/admin/branches', icon: Building2 },
  { label: 'Users', href: '/admin/users', icon: UserCog },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

const erpLinks = [
  { label: 'Inventory', href: '/admin/inventory', icon: ClipboardList },
  { label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
  { label: 'Purchase Orders', href: '/admin/purchase-orders', icon: ShoppingCart },
];

const hrLinks = [
  { label: 'HR Dashboard', href: '/admin/employees', icon: LayoutDashboard },
  { label: 'Employees', href: '/admin/employees/list', icon: Briefcase },
  { label: 'Attendance', href: '/admin/employees/attendance', icon: Clock },
  { label: 'Leaves', href: '/admin/employees/leaves', icon: CalendarCheck2 },
  { label: 'Shifts', href: '/admin/employees/shifts', icon: Sun },
  { label: 'Payroll', href: '/admin/employees/payroll', icon: DollarSign },
];

const accountingLinks = [
  { label: 'Accounting', href: '/admin/accounting', icon: LayoutDashboard },
  { label: 'Expenses', href: '/admin/accounting/expenses', icon: TrendingDown },
  { label: 'Invoices', href: '/admin/accounting/invoices', icon: Receipt },
  { label: 'P&L Report', href: '/admin/accounting/profit-loss', icon: BarChart },
];

const crmLinks = [
  { label: 'CRM Dashboard', href: '/admin/crm', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/crm/leads', icon: Target },
  { label: 'Support Tickets', href: '/admin/crm/tickets', icon: Headphones },
  { label: 'Follow-Ups', href: '/admin/crm/follow-ups', icon: CalendarRange },
  { label: 'Campaigns', href: '/admin/crm/campaigns', icon: Megaphone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return; // Wait for zustand persist hydration
    if (!isAuthenticated || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  if (!_hasHydrated || !isAuthenticated) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await apiService.auth.logout(); } catch { /* */ }
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={cn(
          'fixed left-0 top-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex flex-col h-screen">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="card-premium p-4 mb-6 bg-gradient-to-br from-purple-50 to-primary-50 border-primary-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">{user?.name}</p>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-semibold">Admin</span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/admin' && !link.href.startsWith('/admin/crm') && !link.href.startsWith('/admin/inventory') && !link.href.startsWith('/admin/suppliers') && !link.href.startsWith('/admin/purchase-orders') && pathname.startsWith(link.href));
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                      className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                      )}>
                      <link.icon className={cn('w-4 h-4', isActive ? 'text-purple-600' : 'text-slate-400')} />
                      {link.label}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-500" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Accounting Section */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Finance</p>
                <nav className="space-y-1">
                  {accountingLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                        className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                        )}>
                        <link.icon className={cn('w-4 h-4', isActive ? 'text-emerald-600' : 'text-slate-400')} />
                        {link.label}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-500" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* HR Section */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">HR Management</p>
                <nav className="space-y-1">
                  {hrLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                        className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive ? 'bg-cyan-50 text-cyan-700 shadow-sm' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                        )}>
                        <link.icon className={cn('w-4 h-4', isActive ? 'text-cyan-600' : 'text-slate-400')} />
                        {link.label}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-500" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* CRM Section */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">CRM</p>
                <nav className="space-y-1">
                  {crmLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                        className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                        )}>
                        <link.icon className={cn('w-4 h-4', isActive ? 'text-rose-600' : 'text-slate-400')} />
                        {link.label}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-rose-500" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* ERP Section */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">ERP</p>
                <nav className="space-y-1">
                  {erpLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                        className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive ? 'bg-amber-50 text-amber-700 shadow-sm' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                        )}>
                        <link.icon className={cn('w-4 h-4', isActive ? 'text-amber-600' : 'text-slate-400')} />
                        {link.label}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-500" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-primary-600 rounded-xl hover:bg-gray-50 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back to Website
                </Link>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button onClick={handleLogout} disabled={loggingOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
                <LogOut className="w-4 h-4" /> {loggingOut ? 'Logging out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </aside>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
          {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>

        <main className="flex-1 overflow-y-auto h-screen p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
