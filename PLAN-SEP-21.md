# BOMBED.app — Comedy Platform Plan & Improvements
Sep 21, 2026 · Jesse Salas · Claude implementation pack

NOTION NOTE: Connector still needs re-auth. Archive lives here + Google Drive.
DO NOT DEPLOY LIVE FROM THIS PACK. Stripe stays TEST MODE.

## 1) REPS TIER SPEC — $5/month

Positioning: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy.

### FREE
- 3 lifetime TEXT-ONLY roasts (localStorage; migrate to account on signup)
- No ElevenLabs
- Lessons, games, Redline Engine, Watch clips stay free
- 4th roast = paywall modal. No silent fail.

### REPS — $5 / calendar month
- 10 voice roasts / month (Trailer Guy + crew, ElevenLabs, cache in R2)
- 1 weekly joke autopsy (ISO week Mon–Sun)
- Punchline clinic: 1–5 weak lines in, 3 rewrites each + why it died
- Saved Wins + caption/hook tools
- Account + Stripe required. Cancel anytime.

### KEEP
- Vault $4.99 one-time
- Fast Joke Fix $19 one-time

### RAILS
Punch-up only. Roast the BIT, not the identity. No slurs, no hate, no punching down, no minors.

### USAGE
- Free roast count is LIFETIME.
- Paid roast count resets calendar month UTC.
- Autopsy: 1 per ISO week.
- Clinic: max 5 lines per request.
- TTS: paid OR Fast Joke Fix only.

## 2) CODE / PSEUDOCODE

```
FREE_ROAST_CAP = 3
REPS_MONTHLY_ROASTS = 10
AUTOPSY_PER_ISO_WEEK = 1
CLINIC_MAX_LINES = 5
```

Client `canRoast(user)`: paid && monthly < 10, else freeCount < 3, else showPaywall().

POST /api/roast
- unpaid + lifetime >= 3 → 402 PAYWALL
- paid + monthly >= 10 → 429 MONTHLY_CAP + Fast Joke Fix copy

POST /api/tts
- key NEVER on client
- unpaid without Fast Joke Fix → 402
- cache hash(text+voiceId) in R2

POST /api/autopsy
- paid + 1 per ISO week else 429 Monday copy
- JSON: setup, surprise, punch, tags, button, verdict, fixes[2]

POST /api/clinic
- paid, 1-5 lines, 3 rewrites + deathReason each

Stripe: Reps $5 monthly, Checkout subscription, webhook signature, TEST MODE ONLY.

Files: reps-tier.js, pricing.html, autopsy.html, functions/api/{roast,tts,autopsy,clinic,create-checkout,stripe-webhook}.js

## 3) COPY

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

## 4) SAMPLE AUTOPSY

BIT: I clean toilets to fund a comedy app.
TRAILER GUY: Setup's fine — two jobs, one dream. But you explained the punch. "To fund" is the tell. Cut it.
FIX 1: I scrub toilets so a robot can make me funny.
FIX 2: I clock out of bathrooms and into a club that lives in my phone. The toilets tip better.
TAG: The robot's funnier than me. That's not a business plan, that's a hostage situation.
BUTTON: Roger still hasn't called back.
VERDICT: You died because you narrated instead of surprising.

SEP 21 TENTH
BIT: I built 11 robots to roast me so I don't have to wait for a real room.
TRAILER GUY: That's a loneliness confession wearing a tech demo. The robots aren't the joke. The wait is.
FIX 1: I hired 11 robots to heckle me because open mics take reservations and I don't.
FIX 2: The bots never sleep. Neither does the part of me that still wants a Saturday.
TAG: They don't drink. The two-drink minimum is me arguing with the speaker.
BUTTON: I put myself on the list. The list is also me.
VERDICT: You died because you pitched the product instead of roasting the guy who needed the product.

## 5) CLAUDE ORDER

Build: cap+paywall → Stripe → TTS gate → autopsy → clinic → pricing nav → /autopsy demo → Workers. Do not go live.

Paste CLAUDE-INSTRUCTIONS.md and say: Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Do not deploy live.
