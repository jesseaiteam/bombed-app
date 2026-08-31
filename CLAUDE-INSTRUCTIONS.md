# BOMBED.app — Claude Implementation Pack
**For Jesse Salas · Kill Tony energy · vulgar · loud · put in the fucking reps**

**Goal:** Turn the free-everything site into a hard-capped free tier + $5/month **Reps** flagship. Scarcity + teaching = money. Keep Redline Engine, lessons, and games as the free hook. Do NOT deploy live from this pack — generate the code and leave it for Jesse to wire/Stripe/deploy.

---

## 1. DETAILED FEATURE SPEC — $5/month "Reps" Tier

### Positioning
"You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy."

Reps is the Kill Tony Monday-night energy productized: put in the reps, get told why the room went quiet, rewrite the punch, get the voice.

### Free Tier (hard cap)
- **3 roasts total (lifetime for anonymous, resets only on new device/localStorage clear)**
- Text-only output (no ElevenLabs voice)
- Full access to: lessons, games, Redline Engine (punch-up tools), Redline Pass, Talent Gallery submit
- No autopsy, no punchline clinic, no saved wins cloud
- When cap hit → aggressive paywall modal (copy below)

### Reps Tier — $5/month (cancel anytime)
| Feature | Limit / Detail |
|---------|----------------|
| **Voice Roasts** | 10 per calendar month. Two characters roast the target. Full ElevenLabs "Trailer Guy" (or per-character) TTS. Audio cached & downloadable. |
| **Weekly Joke Autopsy** | 1 submission per week. User pastes bit + optional target/context. Trailer Guy returns structured breakdown (Setup / Surprise / Punch / Tags / Button / Verdict + 2 fixed versions). |
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
├── styles.css
├── reps-tier.js          ← paywall, limits, checkout trigger
├── autopsy.html
├── autopsy.js
├── clinic.html (optional)
├── api/
│   ├── roast.js          ← existing + voice gate
│   ├── autopsy.js        ← new
│   ├── clinic.js         ← new
│   └── stripe-webhook.js ← subscription status
└── CLAUDE-INSTRUCTIONS.md
```

### Paywall + roast limits (reps-tier.js — expanded)
```javascript
// BOMBED.app — Reps Tier Logic
// Free = 3 text roasts lifetime (localStorage). Paid = 10 voice/month + autopsy + clinic.

const FREE_ROAST_CAP = 3;
const REPS_MONTHLY_ROASTS = 10;

function getFreeRoastCount() {
  return parseInt(localStorage.getItem('bombed_free_roasts') || '0', 10);
}
function incrementFreeRoast() {
  localStorage.setItem('bombed_free_roasts', String(getFreeRoastCount() + 1));
}

// Paid status comes from account / Stripe customer portal / JWT claim
function isPaidReps(user) {
  return !!(user && (user.subscription === 'reps' || user.plan === 'reps'));
}

function canRoast(user) {
  if (isPaidReps(user)) {
    // TODO: also check monthly usage against REPS_MONTHLY_ROASTS via API
    return true;
  }
  if (getFreeRoastCount() >= FREE_ROAST_CAP) {
    showPaywall();
    return false;
  }
  return true;
}

function afterSuccessfulRoast(user) {
  if (!isPaidReps(user)) incrementFreeRoast();
  // paid: increment monthly counter server-side
}

function showPaywall() {
  // inject modal — full copy in section 3
  const modal = document.createElement('div');
  modal.className = 'paywall-modal';
  modal.innerHTML = `...`; // see pricing copy
  document.body.appendChild(modal);
}

function startRepsCheckout() {
  // Stripe Checkout Session for price $5/mo recurring
  // window.location = stripeCheckoutUrl or fetch('/api/create-checkout')
  window.location.href = '/roast-pro'; // existing landing until Stripe wired
}
```

### ElevenLabs voice integration (pseudocode)
```javascript
// Call after roast text is generated. Only for paid Reps (or Fast Joke Fix).
async function generateTrailerGuyAudio(roastText, characterVoiceId = 'TRAILER_GUY_VOICE_ID') {
  const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + characterVoiceId, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: roastText,
      model_id: 'eleven_monolingual_v1', // or turbo
      voice_settings: { stability: 0.4, similarity_boost: 0.8 }
    })
  });
  const audioBlob = await res.blob();
  // upload to R2 / Cloudflare or return temporary URL; cache by hash of text
  return URL.createObjectURL(audioBlob); // client demo; production = permanent CDN URL
}
```

### Autopsy submission flow
```javascript
// Client
async function submitAutopsy(bitText, target = '') {
  if (!isPaidReps(currentUser)) { showPaywall(); return null; }
  const res = await fetch('/api/autopsy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ bit: bitText, target, weekKey: getISOWeek() })
  });
  if (res.status === 429) throw new Error('Weekly autopsy already used');
  return res.json();
}

// Server /api/autopsy (Cloudflare Worker or Pages Function)
// 1. Verify Stripe subscription active
// 2. Check weekly quota (1 per ISO week per user)
// 3. Prompt GPT with Trailer Guy system prompt + structured output schema
// 4. Optionally TTS the verdict with ElevenLabs
// 5. Store result + return JSON
```

**Structured autopsy response schema (force this):**
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

### Punchline Clinic (same pattern)
- Input array of ≤5 weak lines
- Output: for each line → 3 rewrites + one-line reason
- Gate behind isPaidReps + optional daily soft limit

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

### Pricing / Roast-Pro page hero copy
```
PUT IN THE REPS.

Free gets you 3 text roasts and the open-mic energy.
Reps gets you the voice, the autopsy, and the rewrite that stops the silence.

$5/month. Cancel when you finally kill.

[ Join Reps ]
```

### Feature bullets (pricing table)
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

### Microcopy / buttons
- CTA primary: "Start Reps — $5"
- Secondary: "Keep bombing free — no, really"
- Success after checkout: "Welcome to the room. Put in the reps."
- Autopsy empty state: "Paste the bit that died. Trailer Guy will tell you why."

---

## 4. SAMPLE FIRST AUTOPSY DEMO (post on /autopsy)

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
1. Free roast cap + paywall modal (localStorage + showPaywall)
2. Stripe Checkout for $5/mo "Reps" + webhook to set subscription status
3. Gate voice TTS behind paid status
4. Autopsy form + /api/autopsy with structured GPT prompt + weekly quota
5. Punchline clinic endpoint
6. Pricing page copy + nav links ("Reps $5", "Autopsy")
7. Demo autopsy page live at /autopsy

## 6. DO NOT TOUCH
- Punch-up-only policy
- Free Redline Engine / lessons / games
- Existing Vault + $19 Fast Joke Fix
- Combinatorial roast character engine

---

*Tone check: every user-facing string should sound like Kill Tony / open-mic room — loud, vulgar when it fits, zero corporate soft-serve. Comics who put in the reps get the tools. Everyone else keeps bombing for free.*

Ready for Claude. Paste this file + the rest of the repo and say:  
**"Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live."**
