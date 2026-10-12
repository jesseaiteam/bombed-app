BOMBED.app — Comedy Platform Plan & Improvements
Oct 12, 2026 · Jesse Salas · Claude implementation pack

NOTION NOTE: Connector still not connected. This Google Doc is the page. Archive branch (not main, so Pages does not ship it): https://github.com/jesseaiteam/bombed-app/tree/pack/2026-10-12 DO NOT DEPLOY LIVE FROM THIS PACK. Stripe stays test mode. CTA stays on /roast-pro.

1) REPS TIER SPEC — $5/month
Positioning: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy.

FREE: 3 lifetime text-only roasts. localStorage until signup, then the count migrates so clearing storage does not reset the cap. No ElevenLabs. Lessons, games, Redline Engine stay free. Cap = paywall. Server returns 402.
REPS $5/mo: 10 voice roasts per UTC month. 1 weekly autopsy (ISO week, Monday 00:00 UTC reset). Punchline clinic 1–5 lines, 3 rewrites each, 5 lines per UTC day. Saved Wins. Caption/hook tools. Stripe required. Account required. Client paid-flag is a hint, never the lock.
11th paid roast = 429 + Fast Joke Fix offer. Second autopsy in the same ISO week = 429 Monday copy. 6th clinic line in one request = 400. Over the daily clinic cap = 429. Unpaid clinic = 402.
KEEP: Vault $4.99 one-time. Fast Joke Fix $19 one-time. Fast Joke Fix does not raise the monthly roast cap.
RAILS: punch-up only. No identity roasts. No slurs. Everybody gets roasted. Nobody gets destroyed.

MONDAY RULE (new today): Oct 12, 2026 is 2026-W42. Monday opens the new week. Saturday Oct 10 was still W41. The autopsy key resets. The roast month does not. The clinic day does.

- autopsy:{userId}:2026-W42 is the new lock. A spent W41 autopsy does not block Monday.
- An unused W42 autopsy may be spent once on Monday, then 429 until next Monday 00:00 UTC (2026-W43).
- roast:{userId}:2026-10 keeps counting. October did not restart because it is Monday. The calendar is not a reset button for the month.
- clinic:{userId}:2026-10-12 is a fresh day key. Saturday's 5 lines do not follow you.
- Do not key the week off America/Los_Angeles. Monday 12:01 AM PDT Oct 12 is 07:01 UTC and already W42. The server clock is UTC. The room is not. Sacramento does not get a free Monday autopsy just because the bars closed.

Acceptance: autopsy used any day of W41 must succeed once on Monday W42. Unused W42 must succeed once on Monday, then 429 the second Monday call. Roast used on Oct 5 through Oct 10 must still count against the October 10. Clinic used on Oct 10 must not count against Oct 12.

2) CODE
functions/api/limits.js — already has gateRoast, bumpRoast, gateAutopsy, markAutopsy, gateClinic, markClinic, isoWeekKey, monthKey, dayKey. Do not rewrite the math. Add the Monday fixture next to the Saturday one and assert it.
KV binding BOMBED_LIMITS. Keys: roast:{userId}:{YYYY-MM}, autopsy:{userId}:{YYYY-Www}, clinic:{userId}:{YYYY-MM-DD}.
Existing: reps-tier.js paywall modal. functions/api/roast.js, tts.js, autopsy.js, clinic.js, create-checkout.js, stripe-webhook.js.
FREE_ROAST_CAP=3. REPS_MONTHLY_ROASTS=10. CLINIC_DAILY_LINES=5. REPS_PRICE_USD=5.
402 on 4th free roast. 429 on 11th paid roast.
TTS: ElevenLabs key never on the client. Paid or Fast Joke Fix only. Cache hash(text+voiceId) in R2 BOMBED_AUDIO.
Voice env names only: ELEVENLABS_API_KEY, VOICE_TRAILER_GUY, VOICE_ROACH, VOICE_TONY, VOICE_SAL, VOICE_MAYA, VOICE_ROMAN, VOICE_TRIXIE, VOICE_KARIM.
Autopsy: POST { bit, target }. Trailer Guy forced JSON: setup, surprise, punch, tags, button, verdict, fixedVersions.
Stripe test mode only. Webhook verifies signature before writing plan=reps AND subscription_status=active.
Monday fixture: demos/iso-week-2026-10-12.json
Pseudocode for the reset is in CLAUDE-MONDAY-RESET.md on the branch. Saturday hold stays in CLAUDE-SATURDAY-HOLD.md. Do not delete them.

Paywall pseudocode (client is a hint):
- on roast click: POST /api/roast with session cookie
- server reads plan from KV written only by verified Stripe webhook
- if plan != reps and lifetimeCount >= 3: 402 { paywall: "reps", copy: open-mic line }
- if plan == reps and monthCount >= 10: 429 { offer: "fast-joke-fix" }
- else generate text; if plan == reps, call /api/tts server-side and return audio URL from R2 cache

Autopsy pseudocode:
- POST /api/autopsy { bit, target } with session
- if plan != reps: 402
- if KV autopsy:{userId}:{isoWeek} exists: 429 Monday copy, resetAt = next Monday 00:00 UTC
- else call model as Trailer Guy, force JSON, markAutopsy, do not call ElevenLabs unless voice flag and paid

3) PRICING COPY
PAYWALL: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy — someone telling them exactly why the room went quiet. REPS — $5/month. 10 voice roasts. 1 weekly joke autopsy. Punchline clinic. Cancel anytime. [ Start Reps — $5 ] [ Keep bombing free — no, really ]
HERO: PUT IN THE REPS. Free gets you 3 text roasts and the open-mic energy. Reps gets you the voice, the autopsy, and the rewrite that stops the silence. $5/month. Cancel when you finally kill.
MONDAY LINE: Monday is a new week. Saturday already held the folder. The clinic rolled. The autopsy reset. Same October roast count. $5 opens the new folder. A Monday morning is not a pardon for the silence you already bought on the weekend. The calendar doesn't double your autopsy just because the bars closed.
HTML stub on the branch only: pricing-reps-monday.html. CTA still points at /roast-pro until checkout is wired. Do not point it at a live charge.

4) SAMPLE AUTOPSY
BIT: I clean toilets to fund a comedy app.
TRAILER GUY: You explained the punch. Cut 'to fund.' Try: I scrub toilets so a robot can make me funny. Tag: The robot's funnier than me. That's not a business plan, that's a hostage situation. Button: Roger still hasn't called back.

TWENTY-NINTH — Oct 12, Monday
BIT: It's Monday and I treated the new week like the weekend never happened. Twenty-nine packs. The Saturday autopsy is still warm. I brought a new toilet joke to a door that just unlocked because the calendar said so.
TRAILER GUY: Monday is the open mic that thinks the new week is a free pass. You counted packs again. Cut the twenty-nine. Try: Monday opened and I still owed Saturday's silence. Tag: Monday energy, same toilets, same silence. Button: Sacramento has a Monday. The mic doesn't forget the silence you bought on Saturday just because the bars closed.
Verdict: Died as a calendar reset. Make Monday the comic who counted the locked nights and still showed up with the same joke.
Fixed 1: Monday opened and I still owed Saturday's silence.
Fixed 2: The week is new. The toilets are not.
Fixed 3: New week. Same app. I still haven't bombed in public.
Machine copy: demos/autopsy-2026-10-12.json

5) CLAUDE
Implement the Reps tier and free roast cap first. Wire Stripe for $5/month in test mode. Do not deploy live. Do not merge pack/2026-10-12 to main unless Jesse says the Pages project is not watching main.
Paste CLAUDE-INSTRUCTIONS.md plus CLAUDE-MONDAY-RESET.md plus CLAUDE-SATURDAY-HOLD.md plus the previous holds plus the repo.
Monday check: one autopsy any day of W41 and one Monday W42 must succeed (new key). An unused W42 autopsy may be spent Monday, then the second Monday call must 429. A roast bumped on Oct 5 through Oct 10 must still increment the 2026-10 counter. A clinic line used Oct 10 must not count against Oct 12.
