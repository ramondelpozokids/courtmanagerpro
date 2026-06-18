'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { LegalPageContent } from '@/content/legal';

export function LegalPageView({ content }: { content: LegalPageContent }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al Dashboard
      </Link>

      <header className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">{content.title}</h1>
        <p className="text-xs text-slate-400 mt-1">Última actualización: {content.updated}</p>
      </header>

      <article className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {content.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">{section.heading}</h2>
            )}
            <p className="whitespace-pre-line">{section.body}</p>
          </section>
        ))}
      </article>
    </div>
  );
}

export function PortalBackHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-3">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al Dashboard
      </Link>
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
