# BOMBED.app — Comedy Platform Plan & Improvements
Sep 29, 2026 · Jesse Salas · Claude implementation pack

NOTION NOTE: Connector still needs re-auth. Archive: https://github.com/jesseaiteam/bombed-app
DO NOT DEPLOY LIVE FROM THIS PACK.

## 1) REPS TIER SPEC — $5/month

Positioning: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy.

### FREE (no card)
- 3 lifetime text-only roasts
- No ElevenLabs playback
- Lessons, games, Redline catalog teasers stay free
- Cap = paywall. Fourth roast returns 402 with checkout URL
- No Saved Wins, no clinic, no autopsy

### REPS — $5/month (Stripe subscription, test mode only)
- 10 voice roasts / billing period
- 1 weekly autopsy (ISO week, Monday 00:00 America/Los_Angeles)
- Punchline clinic: 1–5 lines per submit, rate-limit 20/day
- Saved Wins: persist last 50 winning lines
- Premium ElevenLabs voices (server-side only)
- Personalized greetings if they give a screen name
- Cancel anytime. Keep Vault $4.99 one-time and Fast Joke Fix $19 one-time

### Rails
- Punch-up only. No identity roasts. No slurs. No hate. No punching down.
- Adult language OK. Dirty jokes OK. Kids never in the room.
- Voice key NEVER on the client. TTS via `/api/tts` only for active Reps.
- Stripe test mode. No live keys in this repo.

## 2) CODE STRUCTURE

```
reps-tier.js
functions/api/roast.js
functions/api/tts.js
functions/api/autopsy.js
functions/api/clinic.js
functions/api/create-checkout.js
functions/api/stripe-webhook.js
pricing.html
autopsy.html + autopsy.js
```

```
FREE_ROAST_CAP = 3
REPS_MONTHLY_ROASTS = 10

async function gateRoast(user) {
  if (!user.repsActive) {
    if (user.lifetimeRoasts >= FREE_ROAST_CAP) return 402 PAYWALL
    user.lifetimeRoasts++
    return textRoastOnly()
  }
  if (user.periodRoasts >= REPS_MONTHLY_ROASTS) return 429 MONTH_CAP
  user.periodRoasts++
  return voiceRoast()
}

async function gateAutopsy(user, bit) {
  if (!user.repsActive) return 402
  if (user.lastAutopsyIsoWeek === currentIsoWeek('America/Los_Angeles')) return 429
  user.lastAutopsyIsoWeek = currentIsoWeek(...)
  return trailerGuyAutopsy(bit)
}
```

Stripe: test mode only. Webhook marks `repsActive` + `periodStart`. Do not deploy live.

## 3) PRICING PAGE COPY

Headline: You've bombed 3 times for free. That's the open mic.
Sub: Real comics pay for the autopsy.

FREE — $0
3 text roasts. Then the room goes dark unless you put in the reps.

REPS — $5/month
10 voice roasts. One weekly autopsy. Punchline clinic.
PUT IN THE REPS. Cancel when you finally kill.

Still there: Vault $4.99 once. Fast Joke Fix $19 once.

CTA: PUT IN THE REPS
Fine print: Adult comedy. 21+. Stripe test until Jesse says go live. Cancel any time.

## 4) SAMPLE AUTOPSY

CANON DEMO
BIT: I clean toilets to fund a comedy app.
TRAILER GUY: You explained the punch. Cut "to fund." Try: I scrub toilets so a robot can make me funny.

EIGHTEENTH · Sep 29
BIT: It's Tuesday morning and I keep shipping Claude packs like they're ticket stubs for a room I still haven't walked into.
TRAILER GUY: That's merch for a show with no doors. Try: I print the plan so I never have to print the set list.

## 5) CLAUDE
Implement the Reps tier and free roast cap first. Wire Stripe for $5/month in TEST MODE. Do not deploy live. Keep the vulgar Kill Tony tone. Punch-up only.
