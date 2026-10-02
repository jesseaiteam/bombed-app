# BOMBED.app — Comedy Platform Plan & Improvements
Oct 2, 2026 · Jesse Salas · Claude implementation pack

Notion connector is still not connected. This file + the Google Doc are the page.
Archive: https://github.com/jesseaiteam/bombed-app
DO NOT DEPLOY LIVE FROM THIS PACK.

## 1) REPS TIER SPEC — $5/month
Positioning: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy.

FREE: 3 lifetime text-only roasts. localStorage until signup, then the count migrates so clearing storage does not reset the cap. No ElevenLabs. Lessons, games, Redline Engine stay free. Cap = paywall. Server returns 402.
REPS $5/mo: 10 voice roasts per UTC month. 1 weekly autopsy (ISO week). Punchline clinic 1–5 lines, 3 rewrites each. Saved Wins. Caption/hook tools. Stripe required. Account required. Client paid-flag is a hint, never the lock.
11th paid roast = 429 + Fast Joke Fix offer. Second autopsy in the same week = 429 Monday copy. 6th clinic line = 400. Unpaid clinic = 402.
KEEP: Vault $4.99 one-time. Fast Joke Fix $19 one-time. Fast Joke Fix does not raise the monthly roast cap.
RAILS: punch-up only. No identity roasts.

## 2) CODE
`functions/api/limits.js` — gateRoast, bumpRoast, gateAutopsy, markAutopsy, gateClinic, isoWeekKey.
KV binding BOMBED_LIMITS. Keys: roast:{userId}:{YYYY-MM}, autopsy:{userId}:{YYYY-Www}, clinic:{userId}:{YYYY-MM-DD}.
Existing: reps-tier.js paywall modal. functions/api/roast.js, tts.js, autopsy.js, clinic.js, create-checkout.js, stripe-webhook.js.
FREE_ROAST_CAP=3. REPS_MONTHLY_ROASTS=10. CLINIC_DAILY_LINES=5.
402 on 4th free roast. 429 on 11th paid roast.
TTS: ElevenLabs key never on the client. Paid or Fast Joke Fix only. Cache hash(text+voiceId) in R2.
Autopsy: POST { bit, target }. Trailer Guy forced JSON: setup, surprise, punch, tags, button, verdict, fixedVersions.
Stripe test mode only. Webhook verifies signature before writing plan=reps.

## 3) PRICING COPY
PAYWALL: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy — someone telling them exactly why the room went quiet. REPS — $5/month. 10 voice roasts. 1 weekly joke autopsy. Punchline clinic. Cancel anytime. [ Start Reps — $5 ] [ Keep bombing free — no, really ]
HERO: PUT IN THE REPS. Free gets you 3 text roasts and the open-mic energy. Reps gets you the voice, the autopsy, and the rewrite that stops the silence. $5/month. Cancel when you finally kill.
HTML stub already in pricing.html. CTA still points at /roast-pro until checkout is wired. Do not point it at a live charge.

## 4) SAMPLE AUTOPSY
BIT: I clean toilets to fund a comedy app.
TRAILER GUY: You explained the punch. Cut 'to fund.' Try: I scrub toilets so a robot can make me funny. Tag: The robot's funnier than me. That's not a business plan, that's a hostage situation. Button: Roger still hasn't called back.

TWENTY-FIRST — Oct 2, Friday
BIT: It's Friday and I'm still writing the pack instead of dying on a Friday mic. Twenty-one folders. The weekend starts and I haven't died once.
TRAILER GUY: Friday is the room that forgives drunk uncles, not founders with a changelog. Try: I spent Friday writing the autopsy so the joke wouldn't have to die in public. Tag: The weekend showed up and I handed it a spec. Button: Sacramento still has a Friday. The mic doesn't read markdown.
Verdict: Died as production. Make Friday the coward.
Fixed 1: I spent Friday writing the autopsy so the joke wouldn't have to die in public.
Fixed 2: I booked the weekend and left the mic for somebody with a spine.
Machine copy: demos/autopsy-2026-10-02.json

## 5) CLAUDE
Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live.
Paste CLAUDE-INSTRUCTIONS.md plus the repo.
