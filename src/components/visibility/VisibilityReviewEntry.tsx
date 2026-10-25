"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Globe2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";

type Props = {
  locale: string;
  label: string;
  placeholder: string;
  button: string;
  note: string;
};

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function VisibilityReviewEntry({
  locale,
  label,
  placeholder,
  button,
  note,
}: Props) {
  const router = useRouter();
  const [website, setWebsite] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = normalizeWebsite(website);
    if (!url) return;

    trackAnalyticsEvent("visibility_campaign_started", {
      campaign: "website-ai-visibility-review",
      locale,
    });
    router.push({
      pathname: "/tools/digital-presence-snapshot",
      query: { url, campaign: "website-ai-visibility-review" },
    });
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 shadow-2xl backdrop-blur sm:p-5">
      <label htmlFor="visibility-review-url" className="block text-sm font-semibold text-white">
        {label}
      </label>
      <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="visibility-review-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            required
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder={placeholder}
            className="min-h-[52px] w-full rounded-xl border border-white/20 bg-white px-12 py-3 text-slate-950 outline-none ring-primary transition focus:ring-2"
          />
        </div>
        <button type="submit" className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-brand-gold px-6 py-3 font-bold text-slate-950 transition hover:bg-brand-gold-light focus:outline-none focus:ring-2 focus:ring-white">
          {button}<ArrowRight className="ml-2 h-5 w-5" aria-hidden />
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-300">{note}</p>
    </form>
  );
}
