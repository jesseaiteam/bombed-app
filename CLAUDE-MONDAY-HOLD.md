# CLAUDE-MONDAY-HOLD.md
**Oct 19, 2026 — Monday opens 2026-W43**

Do not rewrite isoWeekKey. It already returns 2026-W43 for Monday Oct 19 UTC.

Monday 00:00 UTC is the reset. Last week's autopsy key is dead. This week's is fresh.

Acceptance fixture (demos/iso-week-2026-10-19.json):
- Date: 2026-10-19
- isoWeek: 2026-W43
- Previous week: 2026-W42
- A spent autopsy:2026-W42 must not block autopsy:2026-W43
- Second call in W43 must 429 with Monday copy
- roast:2026-10 continues from previous days
- clinic:2026-10-19 is independent of clinic:2026-10-18

Message for 429 on second autopsy:
"You already used this week's autopsy. Put in the reps and come back next Monday. The folder unlocked at midnight UTC. It locks again after one use."

Do not key off America/Los_Angeles. Sacramento Monday morning is still UTC Monday.
