# BOMBED.app

AI comedy platform and stand-up training ground by Jesse Salas (Sacramento).

- 11 characters with moods, beef, and ElevenLabs voices
- Roast engine, joke builder, autopsy, punchline clinic
- Free tier capped at 3 text-only roasts; **Reps** tier at **$5/month**

## Stack
- Cloudflare Pages
- OpenAI gpt-4o-mini + ElevenLabs TTS
- Stripe for subscriptions

## Repo contents (Claude pack)
| File | Purpose |
|------|---------|
| `CLAUDE-INSTRUCTIONS.md` | Full feature spec, pseudocode, pricing copy, autopsy demos, build order |
| `SESSION-NOTES-2026-09-19.md` | This session — Notion fallback + 9th autopsy demo |
| `SESSION-NOTES-2026-09-18.md` | Prior session |
| `reps-tier.js` | Paywall, free-cap logic, voice/autopsy/clinic client stubs |
| `autopsy.html` | Demo autopsy page + submit form |
| `autopsy.js` | Form handler for autopsy submissions |
| `pricing.html` | Copy-ready pricing / Reps landing stub |
| `functions/api/` | Cloudflare Pages Function stubs |
| `material/` | Extra Trailer Guy bit material |
| `README.md` | This file |

## How to use with Claude
1. Open claude.ai (or your Claude project).
2. Paste or upload `CLAUDE-INSTRUCTIONS.md` + the JS/HTML files.
3. Say: **"Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live."**
4. Copy the generated code into your Cloudflare Pages project / this repo.

## Status
- Claude pack refreshed: **Sep 19, 2026 (morning PDT)**
- Notion page could not be written (connector needs re-auth). Use this repo + Drive copy.
- Free cap = 3 lifetime text-only roasts
- Reps = $5/mo · 10 voice roasts · 1 weekly autopsy · punchline clinic
- Stubs in `functions/api/` — not live, do not flip billing
- **Do not deploy live from this pack.**

Built for comics who put in the fucking reps.
