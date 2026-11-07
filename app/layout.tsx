import React, { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'ALAGA v2.0 — Barangay 101 Health Monitoring & Ambulance Dispatch',
  description:
    'Centralized Monitoring System for Medicine Inventory, Physician Scheduling, and Ambulance Dispatch for Philippine Barangays.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-font-scale="base" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-[#DDE7FF] via-[#E8DCFC] to-[#F3E8FF] dark:from-[#0D1017] dark:via-[#12151C] dark:to-[#1A1E29] text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
