'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-4">
      <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors">
        <Home size={12} />
        <span>Início</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="text-[var(--text-tertiary)]" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--text-secondary)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
