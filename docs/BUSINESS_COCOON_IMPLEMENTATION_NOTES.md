# Business Cocoon Landing Page – Implementation Notes

This folder contains a **reference implementation** of all recommended changes for the Business Cocoon homepage (below the hero). The live site at [businesscocoon.com](https://www.businesscocoon.com) is built in a separate codebase; use this as copy and structure reference when updating that app.

## File

- **`business-cocoon-landing-implementation.html`** – Full standalone landing page with Tailwind CSS (CDN). Open in a browser to preview. Copy sections or copy into your BC app as needed.

## What Was Implemented

| # | Recommendation | Implementation |
|---|----------------|----------------|
| 1 | **Tools by stage / What you can do** | New section "What You Can Do" with 9 tool cards grouped by Start / Grow / Manage (Pitch Deck, Presentation Evaluator, Business Plan, OKRs, Planning, Cash Flow, Stress & Wellbeing, Advisor Sessions, Community). Link: "Explore all 40+ business tools". |
| 2 | **Why Choose – outcomes** | Added one outcome line per card: "Get matched and book a session in minutes"; "Recommendations tailored to your profile and goals"; "One platform for your whole journey." |
| 3 | **Extra spotlight sections** | "Plan & Execute with Clarity" (OKRs, planning, execution) and "Manage the Journey—Including the Stress" (stress/wellbeing, advisors, community). Each has bullets and a CTA to explore tools. |
| 4 | **How it works – concrete** | Numbered steps (1–3) with one concrete detail each: "Takes under 2 minutes"; "See your matches and recommended tools in one dashboard"; "Book a session or open a tool in one click." |
| 5 | **Advisors vs tools in hero** | Hero subtext: "Expert advisors when you need guidance, and 40+ tools to use anytime—all in one place." |
| 6 | **Organizations – benefit + CTA** | Benefit sentence: "Give your members access to verified advisors and 40+ tools under one dashboard—ideal for accelerators, incubators, chambers of commerce, and business networks." Primary CTA: "Request Organization Access"; secondary: "Learn about organizational features". |
| 7 | **Final CTA + footer** | Final CTA line: "Get free access to tools and advisors tailored to your stage." Footer tagline: "Start, grow, and manage your business with expert advisors and 40+ tools in one place." |
| 8 | **Hero placeholder for live data** | Replaced "0 advisors online now / 0 signed up today" with **"Advisors & Tools available 24/7"** until real data is available. |

## Using This in the Business Cocoon App

1. **Preview:** Open `business-cocoon-landing-implementation.html` in a browser (or serve from `docs/`).
2. **Copy:** Copy the section markup and copy (headings, paragraphs, lists, CTAs) into your BC components/pages.
3. **Data:** When you have live advisor/signup counts, replace the "Advisors & Tools available 24/7" line with your real metrics and labels (e.g. "X advisors online now" / "Y signed up today").

## Section Order in the Reference

1. Hero (value prop + "Advisors & Tools available 24/7")
2. Why Choose The Business Cocoon? (3 cards + outcome lines)
3. What You Can Do (tools by stage)
4. Master Your Pitch & Presentation Skills (existing spotlight)
5. Plan & Execute with Clarity (new spotlight)
6. Manage the Journey—Including the Stress (new spotlight)
7. How It Works (3 steps with concrete details)
8. Organizations (benefit + Request Organization Access)
9. Final CTA (Ready to Start or Grow + "Get free access to tools and advisors tailored to your stage")
10. Footer (updated tagline)
