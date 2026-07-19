'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const DASHBOARD_PATHS = ['/admin', '/dashboard', '/lab', '/doctor', '/login', '/signup'];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardPage = DASHBOARD_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
