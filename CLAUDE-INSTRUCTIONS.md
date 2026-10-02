# BOMBED.app — Claude Implementation Pack
**For Jesse Salas · Kill Tony energy · vulgar · loud · put in the fucking reps**

**Goal:** Turn the free-everything site into a hard-capped free tier + $5/month **Reps** flagship. Scarcity + teaching = money. Keep Redline Engine, lessons, and games as the free hook. Do NOT deploy live from this pack — generate the code and leave it for Jesse to wire/Stripe/deploy.

**Last updated:** Oct 2, 2026 morning PDT (Grok session)

**Archive note:** The Notion page titled *BOMBED.app - Comedy Platform Plan & Improvements* still cannot be written (Notion connector is not connected). This file is the live spec. Mirror: `PLAN-OCT-02.md`, `SESSION-NOTES-2026-10-02.md`, `functions/api/limits.js`, `demos/autopsy-2026-10-02.json`, and the Oct 2 Google Doc.

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
- When cap hit → aggressive paywall modal (copy in section 3). Server returns **402**.

### Reps Tier — $5/month (cancel anytime)
| Feature | Limit / Detail |
|---------|----------------|
| **Voice Roasts** | 10 per calendar month (UTC). Two characters roast the target. Full ElevenLabs Trailer Guy (or per-character) TTS. Audio cached & downloadable. 11th roast = **429** + Fast Joke Fix offer. |
| **Weekly Joke Autopsy** | 1 submission per ISO week. User pastes bit + optional target/context. Trailer Guy returns structured breakdown (Setup / Surprise / Punch / Tags / Button / Verdict + 2 fixed versions). Second in the same week = **429** Monday copy. |
| **Punchline Clinic** | 1–5 weak punchlines per session, max 5 lines per UTC day. Each gets 3 stronger rewrites + one-line logic why the original died. 6th line in one request = 400. Over the daily cap = 429. Unpaid = 402. |
| **Saved Wins** | Local + account-synced list of best rewrites & autopsy fixes. Export as text/JSON. |
| **Caption / Hook tools** | Quick generators for social clips from winning lines. |
| **Account required** | Yes. Stripe subscription status checked server-side. Client `isPaidReps` is a hint, never the lock. |

### Existing one-time offers (keep)
- **Vault** — $4.99 one-time — full 73-show audio catalog
- **Fast Joke Fix** — $19 one-time — emergency rewrite of one dying bit + voice. Does not raise the monthly roast cap.

### Hard rules
- Punch-up only. No identity roasts, no protected-class targeting.
- Free Redline Engine stays free (the hook).
- Do not break existing combinatorial roast engine.
- Do not deploy live from this pack. Stripe test mode only.

---

## 2. CODE STRUCTURE

Live files:
- `reps-tier.js` — client gate, paywall modal, TTS + autopsy + clinic callers
- `functions/api/limits.js` — one quota module. Import it. Do not re-copy counters. Oct 2 added `gateClinic` / `markClinic`.
- `functions/api/roast.js`, `tts.js`, `autopsy.js`, `clinic.js`, `create-checkout.js`, `stripe-webhook.js`
- `pricing.html`, `autopsy.html`, `demos/autopsy-2026-10-02.json`

```javascript
import { gateRoast, bumpRoast, gateAutopsy, markAutopsy, gateClinic, markClinic, isActiveReps } from './limits.js';

// /api/roast
const gate = await gateRoast(env, user);
if (gate instanceof Response) return gate; // 402 free cap or 429 monthly cap
const roast = await runEngine(body);       // existing combinatorial engine
if (gate.paid) await bumpRoast(env, user);
else await incrementLifetimeFree(env, user);
return json({ ok: true, roast, voiceEligible: gate.paid });

// /api/tts — NEVER read ELEVENLABS_API_KEY on the client
const gate = await gateRoast(env, user); // or a paid/fast-fix flag
if (!isActiveReps(user) && !user.fastFixCredit) return json({ error: 'voice is paid' }, 402);
const audio = await elevenLabs(env.ELEVENLABS_API_KEY, text, voiceId);
// cache hash(text+voiceId) in R2, return { audioUrl }

// /api/autopsy
const gate = await gateAutopsy(env, user);
if (gate instanceof Response) return gate;
const report = await trailerGuyJson(bit, target); // forced JSON schema
await markAutopsy(env, gate.key);
return json(report);

// /api/clinic
const clinic = await gateClinic(env, user, body.lines.length);
if (clinic instanceof Response) return clinic;
const rewrites = await clinicRewrite(body.lines); // 3 alts + why each died
await markClinic(env, clinic.key, clinic.lines);
return json({ ok: true, rewrites });

// Stripe — test mode
// create-checkout: mode subscription, price $5 recurring, success/cancel URLs
// webhook: verify signature, then set plan=reps / subscription_status on checkout.session.completed,
// customer.subscription.updated, customer.subscription.deleted
```

KV binding: `BOMBED_LIMITS`. Keys: `roast:{userId}:{YYYY-MM}`, `autopsy:{userId}:{YYYY-Www}`, `clinic:{userId}:{YYYY-MM-DD}`.

---

## 3. PRICING PAGE + PAYWALL COPY

PAYWALL
You've bombed 3 times for free. That's the open mic.
Real comics pay for the autopsy — someone telling them exactly why the room went quiet.
REPS — $5/month
- 10 voice roasts (Trailer Guy + the crew)
- 1 weekly joke autopsy
- Punchline clinic (weak lines → killers)
- Cancel anytime
[ Start Reps — $5 ]
[ Keep bombing free — no, really ]

HERO
PUT IN THE REPS.
Free gets you 3 text roasts and the open-mic energy.
Reps gets you the voice, the autopsy, and the rewrite that stops the silence.
$5/month. Cancel when you finally kill.

Full HTML stub lives in `pricing.html`. CTA currently points at `/roast-pro` until checkout is wired. Do not point it at a live charge.

---

## 4. SAMPLE FIRST AUTOPSY DEMO (live stub on /autopsy)

**Bit submitted:**
"I clean toilets to fund a comedy app."

**Trailer Guy:**
"Setup's fine — two jobs, one dream. But you *explained* the punch. 'To fund' is the tell. Cut it.
Try: 'I scrub toilets so a robot can make me funny.' Now the surprise is the robot, not the toilet.
Tag: 'The robot's funnier than me. That's not a business plan, that's a hostage situation.'
Button: 'Roger still hasn't called back.' — ties to your own lore, lands hard.
You died because you narrated instead of surprising."

### Twenty-first demo bit (Oct 2 — Friday)
**Bit:** "It's Friday and I'm still writing the pack instead of dying on a Friday mic. Twenty-one folders. The weekend starts and I haven't died once."

**Trailer Guy:**
"Friday is the room that forgives drunk uncles, not founders with a changelog. You counted the folders and called it a set.
Try: 'I spent Friday writing the autopsy so the joke wouldn't have to die in public.'
Tag: 'The weekend showed up and I handed it a spec.'
Button: 'Sacramento still has a Friday. The mic doesn't read markdown.'
You died because you filed the bomb and skipped the blast."

- Setup: Founder using Friday paperwork as a stand-in for a real mic.
- Surprise: Missing. The folder count is a stall.
- Punch: Soft. Haven't died once is a brag about avoiding the job.
- Tags: None until the spec line.
- Button: None until Sacramento still has a Friday.
- Verdict: Died as production. Make Friday the coward.
- Fixed 1: "I spent Friday writing the autopsy so the joke wouldn't have to die in public."
- Fixed 2: "I booked the weekend and left the mic for somebody with a spine."

Machine-readable copy: `demos/autopsy-2026-10-02.json`. Prior demos (1–20) remain in git history and earlier session notes.

---

## 5. WHAT TO BUILD FIRST (order for Claude)
1. Free roast cap + paywall modal, using `limits.js`
2. Stripe Checkout for $5/mo Reps + webhook (test mode)
3. Gate voice TTS behind paid status
4. Autopsy form + /api/autopsy + weekly quota
5. Punchline clinic endpoint using `gateClinic`
6. Pricing page copy + nav links (copy already in `pricing.html`)
7. Demo autopsy page at /autopsy seeded with the toilet bit and the Oct 2 bit
8. Flesh out functions/api stubs into real Workers (keys in env only)

## 6. CLAUDE ACCEPTANCE CHECKLIST
- [ ] Fourth anonymous roast returns 402 and shows the paywall modal
- [ ] Clearing localStorage then signing up still carries the 3-roast lifetime count
- [ ] Paid Reps user can roast 10 times; 11th is 429 with Fast Joke Fix copy
- [ ] /api/tts refuses unpaid users; never leaks ElevenLabs key
- [ ] Second autopsy in the same ISO week is 429 Monday copy
- [ ] Clinic rejects a 6th line in one request (400) and unpaid users (402)
- [ ] Clinic rejects a 6th line across the UTC day (429)
- [ ] Checkout stub does not create a live Stripe charge
- [ ] Webhook verifies signature before writing plan status
- [ ] No identity-roast path exists in prompts
- [ ] `demos/autopsy-2026-10-02.json` renders on the demo autopsy page

## 7. DO NOT TOUCH
- Punch-up-only policy
- Free Redline Engine / lessons / games
- Existing Vault + $19 Fast Joke Fix
- Combinatorial roast character engine
- Live production deploy from this pack

Ready for Claude. Paste this file + the rest of the repo and say:
**"Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live."**
