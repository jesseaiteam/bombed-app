# BOMBED.app — Claude Implementation Pack
**For Jesse Salas · Kill Tony energy · vulgar · loud · put in the fucking reps**

**Goal:** Turn the free-everything site into a hard-capped free tier + $5/month **Reps** flagship. Scarcity + teaching = money. Keep Redline Engine, lessons, and games as the free hook. Do NOT deploy live from this pack — generate the code and leave it for Jesse to wire/Stripe/deploy.

**Last updated:** Sep 18, 2026 morning PDT (Grok session)

**Archive note:** The Notion page titled *BOMBED.app - Comedy Platform Plan & Improvements* could not be written this session (Notion connector needs re-auth). This file is the live spec. Mirror: `SESSION-NOTES-2026-09-18.md` + Google Doc of the same title.

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

### Recommended file layout (add to existing Cloudflare Pages site)
```
/
├── index.html
├── pricing.html
├── styles.css
├── reps-tier.js
├── autopsy.html
├── autopsy.js
├── functions/api/
│   ├── roast.js
│   ├── autopsy.js
│   ├── clinic.js
│   ├── tts.js
│   ├── create-checkout.js
│   └── stripe-webhook.js
└── CLAUDE-INSTRUCTIONS.md
```

### Paywall + roast limits (reps-tier.js)
See the live `reps-tier.js` in this repo. Core logic:

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

Store free count in localStorage for anonymous users; on signup/login migrate the count to the account record so they cannot reset by clearing storage.

**Server roast gate (must exist — client cap is not enough):**
```javascript
// /api/roast
async function handleRoast(req, user) {
  if (!user) {
    const n = getAnonCount(req);
    if (n >= 3) return { status: 402, paywall: true };
  } else if (user.plan !== 'reps' || user.subscription_status !== 'active') {
    if ((user.lifetime_free_roasts || 0) >= 3) return { status: 402, paywall: true };
  } else {
    const used = await monthlyRoastCount(user.id, currentMonthKey());
    if (used >= 10) return { status: 429, message: 'You burned your 10 voice roasts. Come back next month or buy a Fast Joke Fix.' };
  }
}
```

Worker stubs now live under `functions/api/` — implement, do not deploy.

### ElevenLabs voice integration
- Never put the ElevenLabs API key in client code.
- Client calls `/api/tts` (Cloudflare Pages Function / Worker).
- Server checks `isPaidReps` (or Fast Joke Fix one-time entitlement) before calling ElevenLabs.
- Cache audio by hash of (text + voiceId) in R2; return CDN URL.
- Voice ID: Trailer Guy (env `TRAILER_GUY_VOICE_ID`).

```javascript
// client stub
async function playRoastVoice(text, voiceId) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId: voiceId || 'TRAILER_GUY' })
  });
  if (res.status === 402) { showPaywall(); return; }
  const { url } = await res.json();
  const audio = new Audio(url);
  return audio.play();
}
```

### Autopsy submission flow
**Client:** `window.BombedReps.submitAutopsy(bit, target)` → POST `/api/autopsy`

**Server /api/autopsy:**
1. Verify JWT / session and active Stripe "Reps" subscription.
2. Check weekly quota (1 per ISO week per user_id). Return 429 if already used.
3. Build system prompt as Trailer Guy.
4. Force structured JSON output.
5. Optionally generate TTS of the verdict line.
6. Persist result + increment weekly counter. Return JSON.

**Forced response schema:**
```json
{
  "setup": "what expectation you built",
  "surprise": "where the swerve is or isn't",
  "punch": "did it land and why/why not",
  "tags": "missing or weak",
  "button": "did you close hard",
  "verdict": "dies here because…",
  "fixedVersions": ["version 1", "version 2"]
}
```

**Trailer Guy system prompt:**
```
You are Trailer Guy, the autopsy host on BOMBED.app. Kill Tony energy. Loud. Vulgar when it earns it. Never corporate. You do not write new premises from scratch — you autopsy the bit they brought.
Break the bit into: setup, surprise, punch, tags, button, verdict, two fixed versions.
Rules: punch-up only. No identity attacks. If they explained the joke, say so like they just stepped on their own dick. Keep each field short enough to read on a phone in a green room.
Return JSON only matching the schema.
```

### Punchline Clinic
- Input: array of 1–5 weak punchlines.
- Output: `[{ original, rewrites: [str, str, str], reason: "one-line logic" }]`
- Gate behind isPaidReps.

### Stripe notes
- Create Product "Reps" + recurring Price $5/month.
- Checkout Session mode=subscription. Stub: `functions/api/create-checkout.js`.
- Webhook stub: `functions/api/stripe-webhook.js`.
- Events: `customer.subscription.created/updated/deleted`, `checkout.session.completed`.
- Client `startRepsCheckout()` hits `/api/create-checkout`.
- Until wired, redirect to `/pricing` is the placeholder.
- Do not flip live billing from this pack.

### Paywall CSS stub
```css
.paywall-modal {
  position: fixed; inset: 0; background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.paywall-card {
  background: #111; border: 2px solid #ff2d2d; border-radius: 12px;
  padding: 2rem; max-width: 28rem; text-align: center; color: #f5f5f5;
}
.paywall-card h2 { color: #ff2d2d; margin-top: 0; }
.paywall-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
.paywall-actions .primary { background: #ff2d2d; color: #fff; font-weight: 700; padding: 0.8rem; border: none; border-radius: 6px; cursor: pointer; }
.paywall-actions .secondary { background: transparent; color: #888; border: 1px solid #444; padding: 0.6rem; border-radius: 6px; cursor: pointer; }
```

---

## 3. PRICING PAGE + PAYWALL COPY

### Paywall modal (when free cap hits)
```
You've bombed 3 times for free. That's the open mic.

Real comics pay for the autopsy — someone telling them exactly why the room went quiet.

REPS — $5/month
• 10 voice roasts (Trailer Guy + the crew)
• 1 weekly joke autopsy
• Punchline clinic (weak lines → killers)
• Cancel anytime

[ Start Reps — $5 ]
[ Keep bombing free — no, really ]
```

### Pricing / Roast-Pro page hero
```
PUT IN THE REPS.

Free gets you 3 text roasts and the open-mic energy.
Reps gets you the voice, the autopsy, and the rewrite that stops the silence.

$5/month. Cancel when you finally kill.

[ Join Reps ]
```

### Feature bullets
**Free**
- Lessons, games, Redline Engine
- 3 text-only roasts (lifetime)
- Talent Gallery submit

**Reps $5/mo**
- 10 full-voice roasts / month
- Weekly Trailer Guy autopsy
- Punchline clinic
- Saved Wins + export
- Caption & hook tools

**One-time**
- Vault $4.99 — 73 shows
- Fast Joke Fix $19 — emergency rewrite + voice

### Microcopy
- CTA primary: "Start Reps — $5"
- Secondary: "Keep bombing free — no, really"
- Success after checkout: "Welcome to the room. Put in the reps."
- Autopsy empty state: "Paste the bit that died. Trailer Guy will tell you why."
- Weekly limit hit: "You already used this week's autopsy. Put in the reps and come back Monday."
- Monthly roast cap: "You burned your 10 voice roasts. Come back next month or buy a Fast Joke Fix."

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

**(Structured version for the UI)**
- **Setup:** Two jobs, one dream — clear.
- **Surprise:** Missing. "To fund" telegraphs the point.
- **Punch:** Soft. Explanation killed the laugh.
- **Tags:** None originally.
- **Button:** None.
- **Verdict:** Died from narration. Surprise + tag + button fix it.
- **Fixed 1:** "I scrub toilets so a robot can make me funny."
- **Fixed 2:** "I scrub toilets so a robot can make me funny. The robot's funnier than me. That's not a business plan, that's a hostage situation. Roger still hasn't called back."

### Second demo bit
**Bit:** "Open mics don't pay, so I pay them with my dignity."

**Trailer Guy:**  
"Dignity is a lecture. The room already knows you ate it. Don't announce the bruise — show the receipt.  
Try: 'I paid the open mic in dignity. They still charged a two-drink minimum.'  
Tag: 'The bartender comped the dignity. Kept the tab.'  
Button: 'I tipped him my next five minutes.'  
You died because you moralized instead of spending the humiliation."

### Third demo bit
**Bit:** "My back is so cooked I write jokes standing up because sitting feels like a threat."

**Trailer Guy:**  
"Pain is real. Announcing pain is a TED Talk. The laugh is in the threat assessment.  
Try: 'I write standing up. Sitting filed a restraining order.'  
Tag: 'The chair won the first hearing.'  
Button: 'I'm appealing from the kitchen counter.'  
You died because you reported the injury instead of letting the furniture become the enemy."

### Fourth demo bit
**Bit:** "I built an app that roasts people so I don't have to hear my own set die."

**Trailer Guy:**  
"That's a confession, not a joke. You told us the motive. Motive is setup. The punch is what the app does when YOU bomb.  
Try: 'I built a roast app so the bots can bomb for me.'  
Tag: 'They still get more laughs. They're unionizing.'  
Button: 'I pay them five bucks a month. That's my own ransom.'  
You died because you explained the product instead of becoming the product."

### Fifth demo bit
**Bit:** "I moved to Sacramento because rent is cheap and so is the crowd."

**Trailer Guy:**  
"Geography is setup. Calling the crowd cheap is you begging for a fight you didn't earn. The laugh is in the rent, not the insult.  
Try: 'Rent's cheap. So is the applause. I signed a lease on both.'  
Tag: 'The landlord clapped. The room asked for a deposit.'  
Button: 'I paid first, last, and a two-drink minimum.'  
You died because you roasted the room instead of the lease."

### Sixth demo bit
**Bit:** "I charge five bucks a month to tell comics why they suck."

**Trailer Guy:**  
"That's a business card, not a bit. You priced the insult. Price is setup. The punch is that they pay you to hear it again.  
Try: 'Five bucks a month and I'll tell you why you died. That's cheaper than a friend who lies.'  
Tag: 'The friend still charges a two-drink minimum.'  
Button: 'Cancel anytime. The silence doesn't.'  
You died because you pitched the product instead of roasting the customer — which is you."

### Seventh demo bit (Sep 17)
**Bit:** "I married a robot so I could lose arguments in HD."

**Trailer Guy:**  
"Cute premise, soft landing. 'In HD' is a tech joke wearing a marriage joke's jacket. Pick one enemy.  
Try: 'I married a robot. She wins every fight and still asks if I want to talk about it.'  
Tag: 'I said no. She generated a recap anyway.'  
Button: 'Now my divorce papers have a changelog.'  
You died because you punched the resolution instead of the relationship."

### Eighth demo bit (Sep 18)
**Bit:** "I host a comedy club in my phone and still can't get a Saturday."

**Trailer Guy:**  
"That's a calendar complaint wearing a club jacket. Saturday is setup. The punch is that the room is in your pocket and still empty.  
Try: 'I built a club that fits in my pocket. Saturday still won't come in.'  
Tag: 'The bots showed up. They don't drink. The two-drink minimum is me.'  
Button: 'I put myself on the list. The list is also me.'  
You died because you begged for a booking instead of roasting the venue — which is you."

- **Setup:** Pocket club vs real Saturday. Clear.
- **Surprise:** Missing. You announced the absence.
- **Punch:** Soft. Calendar joke, no turn.
- **Tags:** None.
- **Button:** None.
- **Verdict:** Died begging the calendar. Make the pocket the room and lose on purpose.
- **Fixed 1:** "I built a club that fits in my pocket. Saturday still won't come in."
- **Fixed 2:** "I built a club that fits in my pocket. Saturday still won't come in. The bots showed up. They don't drink. The two-drink minimum is me. I put myself on the list. The list is also me."

---

## 5. WHAT TO BUILD FIRST (order for Claude)
1. Free roast cap + paywall modal (localStorage + showPaywall + CSS)
2. Stripe Checkout for $5/mo "Reps" + webhook to set subscription status
3. Gate voice TTS behind paid status (`/api/tts`)
4. Autopsy form + `/api/autopsy` with structured GPT prompt + weekly quota
5. Punchline clinic endpoint
6. Pricing page copy + nav links ("Reps $5", "Autopsy")
7. Demo autopsy page live at `/autopsy`
8. Flesh out `functions/api/*` stubs into real Workers (keys in env only)

## 6. CLAUDE ACCEPTANCE CHECKLIST (do not ship until these pass in preview)
- [ ] Fourth anonymous roast returns 402 and shows the paywall modal
- [ ] Clearing localStorage then signing up still carries the 3-roast lifetime count
- [ ] Paid Reps user can roast 10 times; 11th is 429 with Fast Joke Fix copy
- [ ] `/api/tts` refuses unpaid users; never leaks ElevenLabs key to the client
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

---

*Tone check: every user-facing string should sound like Kill Tony / open-mic room — loud, vulgar when it fits, zero corporate soft-serve. Comics who put in the reps get the tools. Everyone else keeps bombing for free.*

Ready for Claude. Paste this file + the rest of the repo and say:  
**"Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live."**
