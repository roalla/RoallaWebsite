'use client';

import React from 'react';
import Script from 'next/script';

const SchedulePage = () => {
  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <main className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900">
              Schedule a Consultation
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Choose a time that works best for you. We look forward to speaking with you.
            </p>
          </div>

          {/* Calendly inline widget */}
          <div className="mt-12">
            <div 
              className="calendly-inline-widget w-full" 
              data-url="https://calendly.com/steven-robin-roalla" 
              style={{ minWidth: '320px', height: '700px' }}
            ></div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SchedulePage; 