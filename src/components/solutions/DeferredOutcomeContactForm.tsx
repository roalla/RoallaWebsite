"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ConsultationIntent, ConsultingFocus } from "@/lib/consultation-request";

const ConsultationRequestForm = dynamic(
  () => import("@/components/ConsultationRequestForm"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[28rem] animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-6 motion-reduce:animate-none" aria-hidden>
        <div className="h-5 w-40 rounded bg-white/10" />
        <div className="mt-7 h-28 rounded-xl bg-white/10" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="h-14 rounded-xl bg-white/10" />
          <div className="h-14 rounded-xl bg-white/10" />
        </div>
      </div>
    ),
  },
);

type Props = {
  initialIntent: ConsultationIntent;
  initialFocus: ConsultingFocus | null;
  initialGoal: string;
  initialSourcePage: string;
  initialOutcome: string;
  initialQuickMode: boolean;
  loadLabel?: string;
};

export default function DeferredOutcomeContactForm({ loadLabel = "Start your consultation", ...props }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready || !containerRef.current) return;
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div ref={containerRef} className="min-h-[28rem]">
      {ready ? (
        <ConsultationRequestForm {...props} />
      ) : (
        <div className="flex min-h-[28rem] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] p-6 text-center">
          <button
            type="button"
            onClick={() => setReady(true)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-darker focus-visible:ring-2 focus-visible:ring-white"
          >
            {loadLabel}
          </button>
        </div>
      )}
    </div>
  );
}
