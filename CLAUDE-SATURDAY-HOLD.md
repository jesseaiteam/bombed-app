# CLAUDE-SATURDAY-HOLD.md
# Oct 10, 2026 — Saturday does not open a new ISO week.
# Do not rewrite the math in limits.js. Add the fixture and assert it.

## Rule
Oct 10, 2026 is still 2026-W41.
Monday Oct 5 opened the week. Tuesday held it. Wednesday had no pack. Thursday held it. Friday held it. Saturday holds it.

autopsy:{userId}:2026-W41 remains the lock.
A spent Monday/Tuesday/Thursday/Friday autopsy blocks Saturday.
An unspent W41 autopsy may be spent once on Saturday, then 429 until Monday Oct 12 00:00 UTC (2026-W42).

roast:{userId}:2026-10 keeps counting. October does not restart on Saturday.
clinic:{userId}:2026-10-10 is a fresh day key. Friday's lines do not follow you.

Do not key the week off America/Los_Angeles.
Saturday 12:01 AM PDT Oct 10 is 07:01 UTC and still W41.
The server clock is UTC. The room is not.

## Fixture
demos/iso-week-2026-10-10.json

## Acceptance
- autopsy used Mon-Fri W41 must 429 on Saturday
- unused W41 must succeed once on Saturday, then 429 the second Saturday call
- roast bumped Oct 5–9 must still increment the 2026-10 counter
- clinic used Oct 9 must not count against Oct 10

Do not deploy live. Stripe test mode only.
