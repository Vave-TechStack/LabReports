'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';
import { 
  LayoutDashboard, FlaskConical, Barcode, FileText, 
  ClipboardCheck, Printer, LogOut, Menu, X, ChevronRight,
  ArrowLeft
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/lab', icon: LayoutDashboard },
  { label: 'Sample Entry', href: '/lab/sample-entry', icon: FlaskConical },
  { label: 'Barcode Scan', href: '/lab/barcode', icon: Barcode },
  { label: 'Enter Results', href: '/lab/enter-results', icon: ClipboardCheck },
  { label: 'Pending Reports', href: '/lab/pending-reports', icon: FileText },
  { label: 'Print Labels', href: '/lab/print-labels', icon: Printer },
];

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return; // Wait for zustand persist hydration
    if (!isAuthenticated || !['LAB_ASSISTANT', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '')) {
      router.push('/login');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  if (!_hasHydrated || !isAuthenticated) return null;

  const handleLogout = async () => {
    try { await apiService.auth.logout(); } catch { /* */ }
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <aside className={cn(
          'fixed left-0 top-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex flex-col h-screen">
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="card-premium p-4 mb-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">{user?.name}</p>
                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-lg text-[10px] font-semibold">Lab Assistant</span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/lab' && pathname.startsWith(link.href));
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

              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-primary-600 rounded-xl hover:bg-gray-50 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back to Website
                </Link>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-600/30">
          {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>

        <main className="flex-1 overflow-y-auto h-screen p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
