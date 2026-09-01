# BOMBED.app — Claude Implementation Pack
**For Jesse Salas · Kill Tony energy · vulgar · loud · put in the fucking reps**

**Goal:** Turn the free-everything site into a hard-capped free tier + $5/month **Reps** flagship. Scarcity + teaching = money. Keep Redline Engine, lessons, and games as the free hook. Do NOT deploy live from this pack — generate the code and leave it for Jesse to wire/Stripe/deploy.

**Last updated:** Sep 1, 2026 (Grok session)

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

---

## 2. CODE STRUCTURE / PSEUDOCODE

### Recommended file layout (add to existing Cloudflare Pages site)
```
/
├── index.html
├── styles.css                 ← add .paywall-modal styles
├── reps-tier.js               ← paywall, limits, checkout trigger, client gates
├── autopsy.html
├── autopsy.js
├── clinic.html (optional)
├── api/
│   ├── roast.js               ← existing + voice gate + monthly counter
│   ├── autopsy.js             ← new: weekly quota + structured GPT
│   ├── clinic.js              ← new
│   ├── tts.js                 ← ElevenLabs proxy (key stays server-side)
│   └── stripe-webhook.js      ← subscription status updates
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

### ElevenLabs voice integration
- Never put the ElevenLabs API key in client code.
- Client calls `/api/tts` (Cloudflare Pages Function / Worker).
- Server checks `isPaidReps` (or Fast Joke Fix one-time entitlement) before calling ElevenLabs.
- Cache audio by hash of (text + voiceId) in R2 or similar; return permanent CDN URL.
- Voice ID: Trailer Guy (store as env var `TRAILER_GUY_VOICE_ID`).

```javascript
// Client (paid only)
async function generateTrailerGuyAudio(roastText, voiceId = 'TRAILER_GUY_VOICE_ID') {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text: roastText, voiceId })
  });
  if (!res.ok) throw new Error('TTS failed');
  const { audioUrl } = await res.json();
  return audioUrl;
}
```

### Autopsy submission flow
**Client:** `window.BombedReps.submitAutopsy(bit, target)` → POST `/api/autopsy`

**Server /api/autopsy (pseudocode):**
1. Verify JWT / session and active Stripe "Reps" subscription.
2. Check weekly quota (1 per ISO week per user_id). Return 429 if already used.
3. Build system prompt as Trailer Guy (loud, vulgar when it fits, craft-focused: setup / surprise / punch / tags / button).
4. Force structured JSON output matching the schema below.
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

### Punchline Clinic
- Input: array of 1–5 weak punchlines.
- Output: `[{ original, rewrites: [str, str, str], reason: "one-line logic" }]`
- Gate behind isPaidReps. Soft daily limit optional.

### Stripe notes (for Claude / Jesse)
- Create Product "Reps" + recurring Price $5/month.
- Checkout Session mode=subscription, success_url + cancel_url.
- Webhook: `customer.subscription.created/updated/deleted` → update user.plan / user.subscription_status in DB.
- Client `startRepsCheckout()` should hit `/api/create-checkout` which returns the Stripe session URL.
- Until wired, the existing redirect to `/roast-pro` is fine as a placeholder.

### Paywall CSS stub (add to styles.css)
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

---

## 5. WHAT TO BUILD FIRST (order for Claude)
1. Free roast cap + paywall modal (localStorage + showPaywall + CSS)
2. Stripe Checkout for $5/mo "Reps" + webhook to set subscription status
3. Gate voice TTS behind paid status (`/api/tts`)
4. Autopsy form + `/api/autopsy` with structured GPT prompt + weekly quota
5. Punchline clinic endpoint
6. Pricing page copy + nav links ("Reps $5", "Autopsy")
7. Demo autopsy page live at `/autopsy`

## 6. DO NOT TOUCH
- Punch-up-only policy
- Free Redline Engine / lessons / games
- Existing Vault + $19 Fast Joke Fix
- Combinatorial roast character engine

---

*Tone check: every user-facing string should sound like Kill Tony / open-mic room — loud, vulgar when it fits, zero corporate soft-serve. Comics who put in the reps get the tools. Everyone else keeps bombing for free.*

Ready for Claude. Paste this file + the rest of the repo and say:  
**"Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live."**
