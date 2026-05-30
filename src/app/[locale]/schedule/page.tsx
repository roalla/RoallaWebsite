'use client';

import React from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Breadcrumb from '@/components/Breadcrumb';

const SchedulePage = () => {
  const t = useTranslations('schedule');
  const tBc = useTranslations('breadcrumb');
  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <div className="page-shell">
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-16">
          <Breadcrumb items={[{ label: tBc('home'), href: '/' }, { label: tBc('schedule') }]} />
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-slate-900">
                {t('title')}
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                {t('subtitle')}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                {t('whatToExpect')}
              </p>
              <p className="mt-2">
                <Link
                  href="/assessment"
                  className="text-primary hover:underline"
                >
                  {t('assessmentTeaser')}
                </Link>
              </p>
            </div>

            <div className="mt-12 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-card">
              <div
                className="calendly-inline-widget w-full"
                data-url="https://calendly.com/roalla"
                style={{ minWidth: '320px', height: '700px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchedulePage;
