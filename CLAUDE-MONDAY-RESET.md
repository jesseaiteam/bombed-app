# CLAUDE-MONDAY-RESET.md
# Oct 12, 2026 — Monday opens a new ISO week. The autopsy folder resets.
# Do not rewrite the math in limits.js. The isoWeekKey already does this. Add the fixture and assert it.

## Rule
Oct 12, 2026 is 2026-W42.
Monday Oct 12 00:00 UTC opens the new week.
Saturday Oct 10 was still 2026-W41. The weekend did not double the autopsy.

autopsy:{userId}:2026-W42 is the new lock. A spent W41 autopsy does not block Monday.
An unused W42 autopsy may be spent once on Monday, then 429 until next Monday (2026-W43).

roast:{userId}:2026-10 keeps counting. October did not restart because it is Monday. Same month, same 10.
clinic:{userId}:2026-10-12 is a fresh day key. Saturday's lines do not follow you.

Do not key the week off America/Los_Angeles.
Monday 12:01 AM PDT Oct 12 is 07:01 UTC and already W42.
The server clock is UTC. The room is not.
Sacramento does not get a free Monday autopsy just because the bars closed.

## Fixture
demos/iso-week-2026-10-12.json

## Acceptance
- autopsy used any day of W41 must succeed once on Monday W42 (new key)
- unused W42 must succeed once on Monday, then 429 the second Monday call
- roast bumped Oct 5 through Oct 10 must still increment the 2026-10 counter
- clinic used Oct 10 must not count against Oct 12

Do not deploy live. Stripe test mode only.
