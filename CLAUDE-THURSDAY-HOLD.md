# Claude — Thursday hold addendum (Oct 8)

Do not deploy. Do not merge this branch unless Jesse confirms Pages is not watching main.

`isoWeekKey()` is already Monday-start UTC. Thursday is not a new week. Wednesday Oct 7 had no pack. A missing day is not a pardon. Do not special-case Thursday. Do not reset `monthKey()` because the comic finally opened the laptop.

```js
// Fixture. Dates are UTC.
// 2026-10-05T16:20:00Z -> 2026-W41  month 2026-10  day 2026-10-05  (Monday opened the week)
// 2026-10-06T16:20:00Z -> 2026-W41  month 2026-10  day 2026-10-06  (Tuesday held)
// 2026-10-07T16:20:00Z -> 2026-W41  month 2026-10  day 2026-10-07  (Wednesday, no pack, still the lock)
// 2026-10-08T16:16:00Z -> 2026-W41  month 2026-10  day 2026-10-08  (Thursday 9:16 AM PDT)
// Thursday 12:01 AM PDT = 2026-10-08 07:01 UTC = still W41.
// Next autopsy key is Monday Oct 12 00:00 UTC (2026-W42).
// The trap: a comic in Sacramento thinks Thursday is far enough from Monday to deserve a second autopsy.
// It is a new clinic day. It is not a new week. October still has the roast count.

export function assertThursdayHold() {
  const mon = isoWeekKey(new Date('2026-10-05T16:20:00Z'));
  const tue = isoWeekKey(new Date('2026-10-06T16:20:00Z'));
  const wed = isoWeekKey(new Date('2026-10-07T16:20:00Z'));
  const thu = isoWeekKey(new Date('2026-10-08T16:16:00Z'));
  if (mon !== '2026-W41') throw new Error('Monday opened W41');
  if (tue !== '2026-W41' || wed !== '2026-W41' || thu !== '2026-W41') {
    throw new Error('Thu does not open W42');
  }
  if (mon !== thu) throw new Error('autopsy key must hold through the gap');
  if (monthKey(new Date('2026-10-08T16:16:00Z')) !== '2026-10') {
    throw new Error('October does not restart because you skipped Wednesday');
  }
  if (dayKey(new Date('2026-10-08T16:16:00Z')) !== '2026-10-08') {
    throw new Error('clinic day does roll');
  }
  if (dayKey(new Date('2026-10-07T16:20:00Z')) === dayKey(new Date('2026-10-08T16:16:00Z'))) {
    throw new Error('Wednesday clinic must not bleed into Thursday');
  }
}
```

Acceptance the route must pass before anyone touches production:

1. `gateAutopsy` after a W41 mark on Monday, called with `now = 2026-10-08T16:16:00Z`, returns 429 and the Thursday copy. Same key. Same silence. The Wednesday gap does not clear it.
2. An unused W41 autopsy may be spent Thursday, then the second Thursday call returns 429 until Monday Oct 12 00:00 UTC (2026-W42).
3. `bumpRoast` on Oct 5, Oct 6, Oct 7, and Oct 8 share `roast:{id}:2026-10`.
4. Clinic used on `2026-10-06` or `2026-10-07` does not reduce `clinic:{id}:2026-10-08`.
5. ElevenLabs key never leaves the Worker. Free tier never reaches `tts.js`.
6. Do not rewrite limits.js math. Add the Thursday fixture next to Monday and Tuesday and assert it. Do not delete CLAUDE-MONDAY-RESET.md or CLAUDE-TUESDAY-HOLD.md.
