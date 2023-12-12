import SideNav from '@/app/ui/dashboard/sidenav';
import { dictations } from "./../lib/placeholder-data";

export default function Layout({ children }: { children: React.ReactNode }) {
  () => {
    'use client'
    localStorage.setItem('dictations', JSON.stringify(dictations));
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
