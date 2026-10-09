# Claude — Friday hold addendum (Oct 9)

Do not deploy. Do not merge this branch unless Jesse confirms Pages is not watching main.

`isoWeekKey()` is already Monday-start UTC. Friday is not a new week. Thursday Oct 8 already held the lock. A weekend-eve calendar square is not a pardon. Do not special-case Friday. Do not reset `monthKey()` because the comic thinks the weekend starts the autopsy over.

```js
// Fixture. Dates are UTC.
// 2026-10-05T16:20:00Z -> 2026-W41  month 2026-10  day 2026-10-05  (Monday opened the week)
// 2026-10-06T16:20:00Z -> 2026-W41  month 2026-10  day 2026-10-06  (Tuesday held)
// 2026-10-07T16:20:00Z -> 2026-W41  month 2026-10  day 2026-10-07  (Wednesday, no pack, still the lock)
// 2026-10-08T16:16:00Z -> 2026-W41  month 2026-10  day 2026-10-08  (Thursday held)
// 2026-10-09T16:16:00Z -> 2026-W41  month 2026-10  day 2026-10-09  (Friday 9:16 AM PDT)
// Friday 12:01 AM PDT = 2026-10-09 07:01 UTC = still W41.
// Next autopsy key is Monday Oct 12 00:00 UTC (2026-W42).
// The trap: a comic in Sacramento thinks Friday night is a new booking. It is a new clinic day. It is not a new week. October still has the roast count.

export function assertFridayHold() {
  const mon = isoWeekKey(new Date('2026-10-05T16:20:00Z'));
  const tue = isoWeekKey(new Date('2026-10-06T16:20:00Z'));
  const wed = isoWeekKey(new Date('2026-10-07T16:20:00Z'));
  const thu = isoWeekKey(new Date('2026-10-08T16:16:00Z'));
  const fri = isoWeekKey(new Date('2026-10-09T16:16:00Z'));
  if (mon !== '2026-W41') throw new Error('Monday opened W41');
  if (tue !== '2026-W41' || wed !== '2026-W41' || thu !== '2026-W41' || fri !== '2026-W41') {
    throw new Error('Fri does not open W42');
  }
  if (mon !== fri) throw new Error('autopsy key must hold through Friday');
  if (monthKey(new Date('2026-10-09T16:16:00Z')) !== '2026-10') {
    throw new Error('October does not restart because it is Friday');
  }
  if (dayKey(new Date('2026-10-09T16:16:00Z')) !== '2026-10-09') {
    throw new Error('clinic day does roll');
  }
  if (dayKey(new Date('2026-10-08T16:16:00Z')) === dayKey(new Date('2026-10-09T16:16:00Z'))) {
    throw new Error('Thursday clinic must not bleed into Friday');
  }
}
```

Acceptance the route must pass before anyone touches production:

1. `gateAutopsy` after a W41 mark on Monday, Tuesday, or Thursday, called with `now = 2026-10-09T16:16:00Z`, returns 429 and the Friday copy. Same key. Same silence.
2. An unused W41 autopsy may be spent Friday, then the second Friday call returns 429 until Monday Oct 12 00:00 UTC (2026-W42).
3. `bumpRoast` on Oct 5 through Oct 9 share `roast:{id}:2026-10`.
4. Clinic used on `2026-10-08` does not reduce `clinic:{id}:2026-10-09`.
5. ElevenLabs key never leaves the Worker. Free tier never reaches `tts.js`.
6. Do not rewrite limits.js math. Add the Friday fixture next to Monday, Tuesday, and Thursday and assert it. Do not delete CLAUDE-MONDAY-RESET.md, CLAUDE-TUESDAY-HOLD.md, or CLAUDE-THURSDAY-HOLD.md.
