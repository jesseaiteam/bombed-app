# PLAN — Oct 1, 2026
Jesse Salas · BOMBED.app · Claude pack · DO NOT DEPLOY LIVE

Notion connector is still dead. This file plus the Google Doc is the page.
Repo: https://github.com/jesseaiteam/bombed-app

## Build order (unchanged, now with a real helper)
1. Wire `functions/api/limits.js` into `/api/roast` so the 4th free roast is a 402 and the 11th paid roast is a 429.
2. Stripe Checkout $5/mo, test mode only. Product name: Reps.
3. `/api/tts` paid-or-Fast-Joke-Fix only. ElevenLabs key stays in env.
4. `/api/autopsy` uses `gateAutopsy`. Demo payload: `demos/autopsy-2026-10-01.json`.
5. Clinic stays 1–5 lines, unpaid = 402.
6. Pricing page already has the copy. Point the CTA at checkout, not a live charge.

## Twentieth autopsy (Thursday)
Bit: It's Thursday and I'm still packing the autopsy instead of dying on a Thursday mic. Twenty packs. Zero rooms.
Trailer Guy: That's a shipping label on a corpse. Try: I autopsy the joke so I never have to bomb the room.

## Claude paste line
Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live.
