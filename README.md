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
| `CLAUDE-INSTRUCTIONS.md` | Full feature spec, pseudocode, pricing copy, autopsy demo, build order, Stripe notes |
| `reps-tier.js` | Paywall, free-cap logic, voice/autopsy/clinic client stubs |
| `autopsy.html` | Demo autopsy page + submit form |
| `autopsy.js` | Form handler for autopsy submissions |
| `material/` | Extra Trailer Guy bit material |
| `README.md` | This file |

## How to use with Claude
1. Open [claude.ai](https://claude.ai) (or your Claude project).
2. Paste or upload `CLAUDE-INSTRUCTIONS.md` + the JS/HTML files.
3. Say: **"Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live."**
4. Copy the generated code into your Cloudflare Pages project / this repo.

## Status
- Expanded Claude pack: Sep 1, 2026
- Next for Jesse: Stripe product + Checkout, deploy paywall, ship first live autopsy

Built for comics who put in the reps.
