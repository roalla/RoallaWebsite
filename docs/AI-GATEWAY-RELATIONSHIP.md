# Auth Hub and AI Gateway — relationship

Short pointer for PitchHotshot developers. **Full integration steps:** [`ROALLA-HUB_Instructions.md`](./ROALLA-HUB_Instructions.md) Part 11.

**Gateway team onboarding spec (copy-paste):** [Handoff to Roalla AI Gateway team](./ROALLA-HUB_Instructions.md#handoff-to-roalla-ai-gateway-team-pitchhotshot)

| Service | URL | Role |
|---------|-----|------|
| **Auth Hub** | https://sso.roalla.com | Login, JWT issuer, email, Azure storage SAS |
| **AI Gateway** | https://ai.roalla.com | OpenAI/Whisper routing, limits, central API keys |

Product apps set `AUTH_URL` + `AUTH_CLIENT_ID` for login and `AI_GATEWAY_URL` for AI. They **do not** set `OPENAI_API_KEY`.

Admin overview (no code): [`ROALLA-PLATFORM.md`](./ROALLA-PLATFORM.md) · [sso platform page](https://sso.roalla.com/platform.html) · [ai.roalla.com/guide.html](https://ai.roalla.com/guide.html)

Developer porting (AI Gateway repo): `PORTING.md` in Roalla-AI-Gateway.
