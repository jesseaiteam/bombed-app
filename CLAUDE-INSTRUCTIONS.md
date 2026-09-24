# BOMBED.app — Claude Implementation Pack
**For Jesse Salas · Kill Tony energy · vulgar · loud · put in the fucking reps**

**Goal:** Turn the free-everything site into a hard-capped free tier + $5/month **Reps** flagship. Scarcity + teaching = money. Keep Redline Engine, lessons, and games as the free hook. Do NOT deploy live from this pack — generate the code and leave it for Jesse to wire/Stripe/deploy.

**Last updated:** Sep 24, 2026 morning PDT (Grok session)

**Archive note:** The Notion page titled *BOMBED.app - Comedy Platform Plan & Improvements* could not be written this session (Notion connector needs re-auth). This file is the live spec. Mirror: `PLAN-SEP-24.md`, `SESSION-NOTES-2026-09-24.md`, and the Sep 24 Google Doc.

---

## 1. DETAILED FEATURE SPEC — $5/month "Reps" Tier

### Positioning
"You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy."

Reps is the Kill Tony Monday-night energy productized: put in the reps, get told why the room went quiet, rewrite the punch, get the voice.

### Free Tier (hard cap)
- **3 roasts total (lifetime for anonymous users via localStorage; migrates to account on signup)**
- Text-only output (no ElevenLabs voice)
- Full access to: lessons, games, Redline Engine (punch-up tools), Redline Pass, Talent Gallery submit
- No autopsy, no punchline clinic, no Saved Wins cloud sync
- When cap hit → aggressive paywall modal (copy in section 3)

### Reps Tier — $5/month (cancel anytime)
| Feature | Limit / Detail |
|---------|----------------|
| **Voice Roasts** | 10 per calendar month. Two characters roast the target. Full ElevenLabs "Trailer Guy" (or per-character) TTS. Audio cached & downloadable. |
| **Weekly Joke Autopsy** | 1 submission per ISO week. User pastes bit + optional target/context. Trailer Guy returns structured breakdown (Setup / Surprise / Punch / Tags / Button / Verdict + 2 fixed versions). |
| **Punchline Clinic** | Up to 5 weak punchlines per session. Each gets 3 stronger rewrites + one-line logic why the original died. |
| **Saved Wins** | Local + account-synced list of best rewrites & autopsy fixes. Export as text/JSON. |
| **Caption / Hook tools** | Quick generators for social clips from winning lines. |
| **Account required** | Yes. Stripe subscription status checked server-side. |

### Existing one-time offers (keep)
- **Vault** — $4.99 one-time — full 73-show audio catalog
- **Fast Joke Fix** — $19 one-time — emergency rewrite of one dying bit + voice

### Hard rules
- Punch-up only. No identity roasts, no protected-class targeting.
- Free Redline Engine stays free (the hook).
- Do not break existing combinatorial roast engine.
- Do not deploy live from this pack.

---

## 2. CODE STRUCTURE / PSEUDOCODE

See live files: `reps-tier.js`, `functions/api/roast.js`, `functions/api/tts.js`, `functions/api/autopsy.js`, `functions/api/clinic.js`, `functions/api/create-checkout.js`, `functions/api/stripe-webhook.js`.

```javascript
const FREE_ROAST_CAP = 3;
const REPS_MONTHLY_ROASTS = 10;

function canRoast(user) {
  if (isPaidReps(user)) return true; // still enforce monthly server-side
  if (getFreeRoastCount() >= FREE_ROAST_CAP) {
    showPaywall();
    return false;
  }
  return true;
}
```

**Server /api/roast:** anon or unpaid + lifetime >= 3 → 402 paywall. Paid + monthly >= 10 → 429 Fast Joke Fix copy.

**ElevenLabs:** NEVER put key in client. POST /api/tts. Paid or Fast Joke Fix only. Cache hash(text+voiceId) in R2.

**Autopsy:** POST /api/autopsy { bit, target }. Paid + 1 per ISO week else 429 Monday copy. Trailer Guy JSON only.

**Stripe:** Product Reps, $5 recurring, Checkout subscription mode. Webhook on created/updated/deleted + checkout.session.completed. Test mode only.

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

Full HTML stub lives in `pricing.html`.

---

## 4. SAMPLE FIRST AUTOPSY DEMO (live on /autopsy)

**Bit submitted:**
"I clean toilets to fund a comedy app."

**Trailer Guy:**
"Setup's fine — two jobs, one dream. But you *explained* the punch. 'To fund' is the tell. Cut it.
Try: 'I scrub toilets so a robot can make me funny.' Now the surprise is the robot, not the toilet.
Tag: 'The robot's funnier than me. That's not a business plan, that's a hostage situation.'
Button: 'Roger still hasn't called back.' — ties to your own lore, lands hard.
You died because you narrated instead of surprising."

### Thirteenth demo bit (Sep 24)
**Bit:** "I treat Thursday like a booking — Grok files the plan, I stay home and call it work."

**Trailer Guy:**
"That's a timesheet for cowardice. You didn't book a room. You booked a document.
Try: 'I clock Thursday as a show date, then send a robot onstage in my place.'
Tag: 'The pack is loud. The room is empty. That's not a career, that's a filing cabinet with a mic stand.'
Button: 'Sacramento still has a Wednesday. Bring a body.'
You died because you roasted the calendar instead of the guy hiding behind it."

- Setup: Founder treating a Grok pack like a booking. Clear.
- Surprise: Missing. You announced the stall as labor.
- Punch: Soft. Calendar confession is a status update.
- Tags: None until the filing-cabinet line.
- Button: None until Wednesday wants a body.
- Verdict: Died as a timesheet. Make the pack the coward.
- Fixed 1: "I clock Thursday as a show date, then send a robot onstage in my place."
- Fixed 2: "My week has seven open mics and zero bodies. The calendar is funnier than I am."

Prior demos (1–12) remain in git history and earlier session notes.

---

## 5. WHAT TO BUILD FIRST (order for Claude)
1. Free roast cap + paywall modal
2. Stripe Checkout for $5/mo Reps + webhook
3. Gate voice TTS behind paid status
4. Autopsy form + /api/autopsy + weekly quota
5. Punchline clinic endpoint
6. Pricing page copy + nav links
7. Demo autopsy page at /autopsy
8. Flesh out functions/api stubs into real Workers (keys in env only)

## 6. CLAUDE ACCEPTANCE CHECKLIST
- [ ] Fourth anonymous roast returns 402 and shows the paywall modal
- [ ] Clearing localStorage then signing up still carries the 3-roast lifetime count
- [ ] Paid Reps user can roast 10 times; 11th is 429 with Fast Joke Fix copy
- [ ] /api/tts refuses unpaid users; never leaks ElevenLabs key
- [ ] Second autopsy in the same ISO week is 429 Monday copy
- [ ] Clinic rejects 6th punchline and unpaid users
- [ ] Checkout stub does not create a live Stripe charge
- [ ] Webhook verifies signature before writing plan status
- [ ] No identity-roast path exists in prompts

## 7. DO NOT TOUCH
- Punch-up-only policy
- Free Redline Engine / lessons / games
- Existing Vault + $19 Fast Joke Fix
- Combinatorial roast character engine
- Live production deploy from this pack

Ready for Claude. Paste this file + the rest of the repo and say:
**"Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live."**
