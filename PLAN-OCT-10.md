BOMBED.app — Comedy Platform Plan & Improvements
Oct 10, 2026 · Jesse Salas · Claude implementation pack

NOTION NOTE: Connector still not connected. This Google Doc is the page. Archive branch (not main, so Pages does not ship it): https://github.com/jesseaiteam/bombed-app/tree/pack/2026-10-10 DO NOT DEPLOY LIVE FROM THIS PACK. Stripe stays test mode. CTA stays on /roast-pro.

1) REPS TIER SPEC — $5/month
Positioning: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy.

FREE: 3 lifetime text-only roasts. localStorage until signup, then the count migrates so clearing storage does not reset the cap. No ElevenLabs. Lessons, games, Redline Engine stay free. Cap = paywall. Server returns 402.
REPS $5/mo: 10 voice roasts per UTC month. 1 weekly autopsy (ISO week, Monday 00:00 UTC reset). Punchline clinic 1–5 lines, 3 rewrites each, 5 lines per UTC day. Saved Wins. Caption/hook tools. Stripe required. Account required. Client paid-flag is a hint, never the lock.
11th paid roast = 429 + Fast Joke Fix offer. Second autopsy in the same ISO week = 429 Saturday copy. 6th clinic line in one request = 400. Over the daily clinic cap = 429. Unpaid clinic = 402.
KEEP: Vault $4.99 one-time. Fast Joke Fix $19 one-time. Fast Joke Fix does not raise the monthly roast cap.
RAILS: punch-up only. No identity roasts. No slurs. Everybody gets roasted. Nobody gets destroyed.

SATURDAY RULE (new today): Oct 10, 2026 is still 2026-W41. Monday Oct 5 opened the week. Tuesday held it. Wednesday Oct 7 had no pack. Thursday Oct 8 held it. Friday Oct 9 held it. Saturday does not open a new week. The autopsy key holds. The roast month does not reset. The clinic day does.

- autopsy:{userId}:2026-W41 is still the lock. A spent Monday, Tuesday, Thursday, or Friday autopsy blocks Saturday. The Wednesday gap does not clear it.
- An unspent W41 autopsy may be spent once on Saturday, then 429 until Monday Oct 12 00:00 UTC (2026-W42).
- roast:{userId}:2026-10 keeps counting. October did not restart because it is Saturday. The weekend is not a reset button.
- clinic:{userId}:2026-10-10 is a fresh day key. Friday's 5 lines do not follow you.
- Do not key the week off America/Los_Angeles. Saturday 12:01 AM PDT Oct 10 is 07:01 UTC and still W41. The server clock is UTC. The room is not. Sacramento does not get a free Saturday autopsy just because the bars are open.

Acceptance: autopsy used Monday through Friday W41 must 429 on Saturday. Unused W41 must succeed once on Saturday, then 429 the second Saturday call. Roast used on Oct 5 through Oct 9 must still count against the October 10. Clinic used on Oct 9 must not count against Oct 10.

2) CODE
functions/api/limits.js — already has gateRoast, bumpRoast, gateAutopsy, markAutopsy, gateClinic, markClinic, isoWeekKey, monthKey, dayKey. Do not rewrite the math. Add the Saturday fixture next to Monday, Tuesday, Thursday, and Friday and assert it.
KV binding BOMBED_LIMITS. Keys: roast:{userId}:{YYYY-MM}, autopsy:{userId}:{YYYY-Www}, clinic:{userId}:{YYYY-MM-DD}.
Existing: reps-tier.js paywall modal. functions/api/roast.js, tts.js, autopsy.js, clinic.js, create-checkout.js, stripe-webhook.js.
FREE_ROAST_CAP=3. REPS_MONTHLY_ROASTS=10. CLINIC_DAILY_LINES=5. REPS_PRICE_USD=5.
402 on 4th free roast. 429 on 11th paid roast.
TTS: ElevenLabs key never on the client. Paid or Fast Joke Fix only. Cache hash(text+voiceId) in R2 BOMBED_AUDIO.
Voice env names only: ELEVENLABS_API_KEY, VOICE_TRAILER_GUY, VOICE_ROACH, VOICE_TONY, VOICE_SAL, VOICE_MAYA, VOICE_ROMAN, VOICE_TRIXIE, VOICE_KARIM.
Autopsy: POST { bit, target }. Trailer Guy forced JSON: setup, surprise, punch, tags, button, verdict, fixedVersions.
Stripe test mode only. Webhook verifies signature before writing plan=reps AND subscription_status=active.
Saturday fixture: demos/iso-week-2026-10-10.json
Pseudocode for the hold is in CLAUDE-SATURDAY-HOLD.md on the branch. Monday reset notes stay in CLAUDE-MONDAY-RESET.md. Tuesday hold stays in CLAUDE-TUESDAY-HOLD.md. Thursday hold stays in CLAUDE-THURSDAY-HOLD.md. Friday hold stays in CLAUDE-FRIDAY-HOLD.md. Do not delete them.

Paywall pseudocode (client is a hint):
- on roast click: POST /api/roast with session cookie
- server reads plan from KV written only by verified Stripe webhook
- if plan != reps and lifetimeCount >= 3: 402 { paywall: "reps", copy: open-mic line }
- if plan == reps and monthCount >= 10: 429 { offer: "fast-joke-fix" }
- else generate text; if plan == reps, call /api/tts server-side and return audio URL from R2 cache

Autopsy pseudocode:
- POST /api/autopsy { bit, target } with session
- if plan != reps: 402
- if KV autopsy:{userId}:{isoWeek} exists: 429 Saturday copy, resetAt = next Monday 00:00 UTC
- else call model as Trailer Guy, force JSON, markAutopsy, do not call ElevenLabs unless voice flag and paid

3) PRICING COPY
PAYWALL: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy — someone telling them exactly why the room went quiet. REPS — $5/month. 10 voice roasts. 1 weekly joke autopsy. Punchline clinic. Cancel anytime. [ Start Reps — $5 ] [ Keep bombing free — no, really ]
HERO: PUT IN THE REPS. Free gets you 3 text roasts and the open-mic energy. Reps gets you the voice, the autopsy, and the rewrite that stops the silence. $5/month. Cancel when you finally kill.
SATURDAY LINE: Saturday is not a new week. Friday already held the folder. The clinic rolled. The autopsy did not. Same October roast count. $5 opens the folder. A Saturday night is not a pardon for the silence you already bought on Monday. The weekend doesn't double your autopsy just because you finally left the house.
HTML stub on the branch only: pricing-reps-saturday.html. CTA still points at /roast-pro until checkout is wired. Do not point it at a live charge.

4) SAMPLE AUTOPSY
BIT: I clean toilets to fund a comedy app.
TRAILER GUY: You explained the punch. Cut 'to fund.' Try: I scrub toilets so a robot can make me funny. Tag: The robot's funnier than me. That's not a business plan, that's a hostage situation. Button: Roger still hasn't called back.

TWENTY-EIGHTH — Oct 10, Saturday
BIT: It's Saturday and I treated the whole weekend like a free autopsy. Twenty-eight packs. The Monday autopsy is still warm. I brought a new toilet joke to a door that has been locked since the sign-up sheet and the Friday pack.
TRAILER GUY: Saturday is the open mic that thinks the weekend is a second Monday. You counted packs again. Cut the twenty-eight. Try: Saturday opened and I still owed Monday's silence. Tag: Weekend energy, same week, same toilets. Button: Sacramento has a Saturday. The mic doesn't double the autopsy because you can smell the bars.
Verdict: Died as a weekend. Make Saturday the comic who counted the missing nights and ignored the lock.
Fixed 1: Saturday opened and I still owed Monday's silence.
Fixed 2: The weekend is here. The week did not blink.
Fixed 3: New day. Same week. I still haven't bombed in public.
Machine copy: demos/autopsy-2026-10-10.json

5) CLAUDE
Implement the Reps tier and free roast cap first. Wire Stripe for $5/month in test mode. Do not deploy live. Do not merge pack/2026-10-10 to main unless Jesse says the Pages project is not watching main.
Paste CLAUDE-INSTRUCTIONS.md plus CLAUDE-MONDAY-RESET.md plus CLAUDE-TUESDAY-HOLD.md plus CLAUDE-THURSDAY-HOLD.md plus CLAUDE-FRIDAY-HOLD.md plus CLAUDE-SATURDAY-HOLD.md plus the repo.
Saturday check: one autopsy Monday W41 and one Saturday W41 must 429 the second. An unused W41 autopsy may be spent Saturday, then the second Saturday call must 429. A roast bumped on Oct 5 through Oct 9 must still increment the 2026-10 counter. A clinic line used Oct 9 must not count against Oct 10.
