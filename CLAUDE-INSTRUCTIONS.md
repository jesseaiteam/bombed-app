# BOMBED.app — Claude Implementation Pack
**For Jesse Salas · Kill Tony energy · vulgar · loud · put in the fucking reps**

**Goal:** Turn the free-everything site into a hard-capped free tier + $5/month **Reps** flagship. Scarcity + teaching = money. Keep Redline Engine, lessons, and games as the free hook. Do NOT deploy live from this pack — generate the code and leave it for Jesse to wire/Stripe/deploy.

**Last updated:** Oct 19, 2026 morning PDT (Grok session) — Monday, start of 2026-W43

**Archive note:** Notion connector still not connected. This Google Doc is the page. Archive branch (not main): https://github.com/jesseaiteam/bombed-app/tree/pack/2026-10-19 DO NOT DEPLOY LIVE. Stripe test mode. CTA stays on /roast-pro.

---

## 1. DETAILED FEATURE SPEC — $5/month "Reps" Tier

### Positioning
"You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy."

Reps is the Kill Tony Monday-night energy productized: put in the reps, get told why the room went quiet, rewrite the punch, get the voice.

### Free Tier (hard cap)
- **3 roasts total (lifetime for anonymous users via localStorage; migrates to account on signup so clearing storage does not reset the cap)**
- Text-only output (no ElevenLabs voice)
- Full access to: lessons, games, Redline Engine (punch-up tools), Redline Pass, Talent Gallery submit
- No autopsy, no punchline clinic, no Saved Wins cloud sync
- When cap hit → aggressive paywall modal. Server returns **402**.

### Reps Tier — $5/month (cancel anytime)
| Feature | Limit / Detail |
|---------|----------------|
| **Voice Roasts** | 10 per calendar month (UTC). Two characters roast the target. Full ElevenLabs Trailer Guy (or per-character) TTS. Audio cached & downloadable. 11th roast = **429** + Fast Joke Fix offer. |
| **Weekly Joke Autopsy** | 1 submission per ISO week (Monday 00:00 UTC reset). User pastes bit + optional target/context. Trailer Guy returns structured breakdown (Setup / Surprise / Punch / Tags / Button / Verdict + 3 fixed versions). Second in the same week = **429** with Monday copy. |
| **Punchline Clinic** | 1–5 weak punchlines per session, max 5 lines per UTC day. Each gets 3 stronger rewrites + one-line logic why the original died. 6th line in one request = 400. Over the daily cap = 429. Unpaid = 402. |
| **Saved Wins** | Local + account-synced list of best rewrites & autopsy fixes. Export as text/JSON. |
| **Caption / Hook tools** | Quick generators for social clips from winning lines. |
| **Account required** | Yes. Stripe subscription status checked server-side. Client paid-flag is a hint, never the lock. |

### Existing one-time offers (keep)
- **Vault** — $4.99 one-time — full show catalog
- **Fast Joke Fix** — $19 one-time — emergency rewrite of one dying bit + voice. Does not raise the monthly roast cap.

### Hard rules
- Punch-up only. No identity roasts, no protected-class targeting, no slurs. Everybody gets roasted. Nobody gets destroyed.
- Free Redline Engine stays free (the hook).
- Do not break existing combinatorial roast engine.
- Do not deploy live from this pack. Stripe test mode only.

### MONDAY RULE (new today): Oct 19, 2026 is 2026-W43. Monday opens the new week.
- autopsy:{userId}:2026-W43 is a fresh lock. Previous W42 autopsy is dead. Monday 00:00 UTC unlocked it.
- roast:{userId}:2026-10 keeps counting. October did not restart because it is Monday. The month is the month.
- clinic:{userId}:2026-10-19 is a fresh day key.
- Do not key the week off America/Los_Angeles. Monday 12:01 AM PDT Oct 19 is 07:01 UTC and is W43. The server clock is UTC.
- Acceptance: A W42 autopsy spent any day last week must NOT block a W43 autopsy on Monday. An unused W43 may be spent once on Monday, then 429 the second Monday call. Roast used Oct 5-18 still counts against October 10. Clinic used Oct 18 does not count against Oct 19.

---

## 2. CODE STRUCTURE / PSEUDOCODE

functions/api/limits.js — already has gateRoast, bumpRoast, gateAutopsy, markAutopsy, gateClinic, markClinic, isoWeekKey, monthKey, dayKey. Do not rewrite the math. Add the Monday fixture next to the previous ones and assert it.

KV binding BOMBED_LIMITS. Keys: roast:{userId}:{YYYY-MM}, autopsy:{userId}:{YYYY-Www}, clinic:{userId}:{YYYY-MM-DD}.

Existing: reps-tier.js paywall modal. functions/api/roast.js, tts.js, autopsy.js, clinic.js, create-checkout.js, stripe-webhook.js.

FREE_ROAST_CAP=3. REPS_MONTHLY_ROASTS=10. CLINIC_DAILY_LINES=5. REPS_PRICE_USD=5.

402 on 4th free roast. 429 on 11th paid roast.

TTS: ElevenLabs key never on the client. Paid or Fast Joke Fix only. Cache hash(text+voiceId) in R2 BOMBED_AUDIO.

Voice env names only: ELEVENLABS_API_KEY, VOICE_TRAILER_GUY, VOICE_ROACH, VOICE_TONY, VOICE_SAL, VOICE_MAYA, VOICE_ROMAN, VOICE_TRIXIE, VOICE_KARIM.

Autopsy: POST { bit, target }. Trailer Guy forced JSON: setup, surprise, punch, tags, button, verdict, fixedVersions (array of 3).

Stripe test mode only. Webhook verifies signature before writing plan=reps AND subscription_status=active.

Monday fixture: demos/iso-week-2026-10-19.json

Pseudocode for the hold is in CLAUDE-MONDAY-HOLD.md on the branch. Previous holds stay. Do not delete them.

**Paywall pseudocode (client is a hint):**
- on roast click: POST /api/roast with session cookie
- server reads plan from KV written only by verified Stripe webhook
- if plan != reps and lifetimeCount >= 3: 402 { paywall: "reps", copy: open-mic line }
- if plan == reps and monthCount >= 10: 429 { offer: "fast-joke-fix" }
- else generate text; if plan == reps, call /api/tts server-side and return audio URL from R2 cache

**Autopsy pseudocode:**
- POST /api/autopsy { bit, target } with session
- if plan != reps: 402
- if KV autopsy:{userId}:{isoWeek} exists: 429 Monday copy, resetAt = next Monday 00:00 UTC
- else call model as Trailer Guy, force JSON, markAutopsy, do not call ElevenLabs unless voice flag and paid

---

## 3. PRICING PAGE COPY

**PAYWALL:**
You've bombed 3 times for free. That's the open mic.
Real comics pay for the autopsy — someone telling them exactly why the room went quiet.
REPS — $5/month
10 voice roasts. 1 weekly joke autopsy. Punchline clinic.
Cancel anytime.
[ Start Reps — $5 ]
[ Keep bombing free — no, really ]

**HERO:**
PUT IN THE REPS.
Free gets you 3 text roasts and the open-mic energy.
Reps gets you the voice, the autopsy, and the rewrite that stops the silence.
$5/month. Cancel when you finally kill.

**MONDAY LINE:**
Monday opens the folder. Last week is dead. The autopsy is fresh. The month is not. Same October roast count. $5 opens the mic. A Monday morning is not a free pass for the silence you already bought — it's a new week and a new chance to bomb in public. Sacramento has a Monday. The mic remembers the toilets.

HTML stub on the branch only: pricing-reps-monday.html. CTA still points at /roast-pro until checkout is wired. Do not point it at a live charge.

---

## 4. SAMPLE AUTOPSY DEMO

**BIT:** I clean toilets to fund a comedy app.

**TRAILER GUY:**
You explained the punch. Cut 'to fund.'
Try: I scrub toilets so a robot can make me funny.
Tag: The robot's funnier than me. That's not a business plan, that's a hostage situation.
Button: Roger still hasn't called back.
Verdict: Died as narration. Make the robot the punch, not the explanation.

**THIRTY-FIFTH — Oct 19, Monday**
BIT: It's Monday and the new week opened like the toilets never closed. Thirty-five packs. Last week's autopsy is cold. I brought another toilet joke to a door that unlocked at midnight UTC because the calendar said so.

TRAILER GUY: Monday is the open mic that thinks a new week erases the silence. You counted packs again. Cut the thirty-five. Try: Monday opened and I still owed the toilets. Tag: New week, same silence, same robot. Button: Sacramento has a Monday. The mic doesn't care that the bars are closed and the church is open — it wants the joke that dies in public.

Verdict: Died as a calendar reset. Make Monday the comic who shows up with the same joke and a fresh folder.

Fixed 1: Monday opened and I still owed the toilets.
Fixed 2: New week. Same robot. I still haven't bombed in public.
Fixed 3: The folder unlocked. The silence is still mine.

Machine copy: demos/autopsy-2026-10-19.json

---

## 5. CLAUDE
Implement the Reps tier and free roast cap first. Wire Stripe for $5/month in test mode. Do not deploy live. Do not merge pack/2026-10-19 to main unless Jesse says the Pages project is not watching main.

Paste CLAUDE-INSTRUCTIONS.md plus CLAUDE-MONDAY-HOLD.md plus the previous holds plus the repo.

Monday check: W42 autopsy must not block W43. Unused W43 may be spent once on Monday, then the second Monday call must 429. A roast bumped on Oct 5 through Oct 18 must still increment the 2026-10 counter. A clinic line used Oct 18 must not count against Oct 19.
