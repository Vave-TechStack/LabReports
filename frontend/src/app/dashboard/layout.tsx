'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CalendarCheck, FileText, User, CreditCard, 
  Menu, X, LogOut, ChevronRight, FlaskConical, Receipt, ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Book a Test', href: '/dashboard/book-test', icon: CalendarCheck },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: FileText },
  { label: 'My Reports', href: '/dashboard/reports', icon: Receipt },
  { label: 'Invoices', href: '/dashboard/invoices', icon: CreditCard },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await apiService.auth.logout(); } catch { /* */ }
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:h-screen',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex flex-col h-full">
            <div className="p-4 flex-1 overflow-y-auto">
              {/* User Info */}
              <div className="card-premium p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive 
                          ? 'bg-primary-50 text-primary-700 shadow-sm' 
                          : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                      )}
                    >
                      <link.icon className={cn('w-4 h-4', isActive ? 'text-primary-600' : 'text-slate-400')} />
                      {link.label}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary-500" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Back to Website */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-primary-600 rounded-xl hover:bg-gray-50 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to Website
              </Link>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                {loggingOut ? 'Logging out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-screen p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
