# Claude — Tuesday hold addendum (Oct 6)

Do not deploy. Do not merge this branch unless Jesse confirms Pages is not watching main.

`isoWeekKey()` is already Monday-start UTC. Tuesday is not a new week. Do not special-case Tuesday. Do not reset `monthKey()` because the club has a Tuesday night.

```js
// Fixture. Dates are UTC.
// 2026-10-05T16:20:00Z -> 2026-W41  month 2026-10  day 2026-10-05
// 2026-10-06T00:00:00Z -> 2026-W41  month 2026-10  day 2026-10-06
// 2026-10-06T16:20:00Z -> 2026-W41  (this is 9:20 AM PDT Tuesday)
// Tuesday 12:01 AM PDT = 2026-10-06 07:01 UTC = still W41.
// The trap: a comic in Sacramento thinks a new day is a new autopsy.
// It is a new clinic day. It is not a new week. October still has the roast count.

export function assertTuesdayHold() {
  const mon = isoWeekKey(new Date('2026-10-05T16:20:00Z'));
  const tue = isoWeekKey(new Date('2026-10-06T16:20:00Z'));
  if (mon !== '2026-W41') throw new Error('Monday opened W41');
  if (tue !== '2026-W41') throw new Error('Tuesday does not open W42');
  if (mon !== tue) throw new Error('autopsy key must hold');
  if (monthKey(new Date('2026-10-06T16:20:00Z')) !== '2026-10') {
    throw new Error('October does not restart on Tuesday night');
  }
  if (dayKey(new Date('2026-10-06T16:20:00Z')) !== '2026-10-06') {
    throw new Error('clinic day does roll');
  }
}
```

Acceptance the route must pass before anyone touches production:

1. `gateAutopsy` after a W41 mark on Monday, called with `now = 2026-10-06T16:20:00Z`, returns 429 and the Tuesday copy. Same key. Same silence.
2. An unused W41 autopsy may be spent Tuesday, then the second Tuesday call returns 429 until Monday Oct 12 00:00 UTC (2026-W42).
3. `bumpRoast` on Oct 5 and Oct 6 share `roast:{id}:2026-10`.
4. Clinic used on `2026-10-05` does not reduce `clinic:{id}:2026-10-06`.
5. ElevenLabs key never leaves the Worker. Free tier never reaches `tts.js`.
6. Do not rewrite limits.js math. Add the Tuesday fixture next to the Monday one and assert it.
