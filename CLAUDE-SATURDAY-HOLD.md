# CLAUDE-SATURDAY-HOLD.md
# BOMBED.app — Saturday hold for the autopsy lock
# Oct 17, 2026 · still 2026-W42

Do not rewrite limits.js math. The isoWeekKey already treats Saturday as the same week as Friday.

Saturday rule:
- autopsy:{userId}:2026-W42 remains the single lock.
- Spent any day Mon-Fri W42 → 429 on Saturday with Saturday copy.
- Unused W42 may be spent once on Saturday, then 429 until Monday 00:00 UTC (W43).
- roast:{userId}:2026-10 does not reset on Saturday.
- clinic:{userId}:2026-10-17 is a new day.

Fixture: demos/iso-week-2026-10-17.json
Assert isoWeekKey(new Date('2026-10-17T00:00:00Z')) === '2026-W42'
Assert isoWeekKey(new Date('2026-10-19T00:00:00Z')) === '2026-W43'

Saturday copy for 429:
"You already used this week's autopsy. Saturday is not a free pass. Put in the reps and come back Monday."

Do not deploy live. Stripe test mode only.
