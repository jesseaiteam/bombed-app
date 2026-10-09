# REPS tier — $5/month — Claude spec (Oct 9)

Do not deploy. Stripe test mode only. Client paid-flag is a hint, never the lock.

## Positioning
You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy.

## Free
- 3 lifetime text-only roasts.
- localStorage until signup, then the count migrates so clearing storage does not reset the cap.
- No ElevenLabs.
- Lessons, games, Redline Engine stay free.
- 4th roast: server returns 402 with the open-mic paywall copy.

## Reps — $5/month
- Account required. Stripe required.
- 10 voice roasts per UTC month. Key `roast:{userId}:{YYYY-MM}`.
- 1 weekly autopsy. ISO week, Monday 00:00 UTC reset. Key `autopsy:{userId}:{YYYY-Www}`.
- Punchline clinic: 1–5 lines per request, 3 rewrites each, 5 lines per UTC day. Key `clinic:{userId}:{YYYY-MM-DD}`.
- Saved Wins. Caption/hook tools.
- 11th paid roast: 429 plus Fast Joke Fix offer.
- Second autopsy in the same ISO week: 429 with the Friday copy until Monday Oct 12 00:00 UTC (2026-W42).
- 6th clinic line in one request: 400. Over the daily clinic cap: 429. Unpaid clinic: 402.

## Keep
- Vault $4.99 one-time.
- Fast Joke Fix $19 one-time. It does not raise the monthly roast cap.

## Rails
Punch-up only. No identity roasts. No slurs. Everybody gets roasted. Nobody gets destroyed.

## Friday rule
Oct 9, 2026 is still 2026-W41. Monday Oct 5 opened the week. Tuesday held it. Wednesday had no pack. Thursday held it. Friday does not open a new week.

- `autopsy:{userId}:2026-W41` is still the lock. A spent Monday, Tuesday, or Thursday autopsy blocks Friday.
- An unspent W41 autopsy may be spent once on Friday, then 429 until Monday Oct 12 00:00 UTC.
- `roast:{userId}:2026-10` keeps counting. October did not restart because it is Friday.
- `clinic:{userId}:2026-10-09` is a fresh day key. Thursday's 5 lines do not follow you.
- Do not key the week off America/Los_Angeles. Friday 12:01 AM PDT Oct 9 is 07:01 UTC and still W41. The server clock is UTC. The room is not.
