# Claude — Monday reset addendum (Oct 5)

Do not deploy. Do not merge this branch unless Jesse confirms Pages is not watching main.

`isoWeekKey()` is already Monday-start UTC. Do not special-case Monday. Do not reset `monthKey()` when the week flips.

```js
// Fixture. Dates are UTC.
// 2026-10-04T23:59:59Z -> 2026-W40  month 2026-10  day 2026-10-04
// 2026-10-05T00:00:00Z -> 2026-W41  month 2026-10  day 2026-10-05
// 2026-10-05T07:01:00Z -> 2026-W41  (this is 12:01 AM PDT Monday)
// 2026-10-05T07:00:00Z is 12:00 AM PDT and still... wait:
// PDT is UTC-7. Monday 12:01 AM PDT = 2026-10-05 07:01 UTC = W41.
// Sunday 11:59 PM PDT = 2026-10-05 06:59 UTC = already Monday UTC = W41.
// The trap is the other direction:
// Monday 12:01 AM PDT is already Monday UTC.
// Sunday 5:01 PM PDT Oct 4 = Monday 00:01 UTC Oct 5 = W41 while Sacramento still says Sunday.
// Server clock is UTC. The room in Sacramento is not the key.

export function assertMondayFlip() {
  const sun = isoWeekKey(new Date('2026-10-04T16:20:00Z')); // Sunday morning PDT
  const mon = isoWeekKey(new Date('2026-10-05T16:20:00Z')); // Monday morning PDT
  if (sun !== '2026-W40') throw new Error('Sunday still W40');
  if (mon !== '2026-W41') throw new Error('Monday is the new week');
  if (monthKey(new Date('2026-10-05T16:20:00Z')) !== '2026-10') {
    throw new Error('October does not restart because the mic did');
  }
}
```

Acceptance the route must pass before anyone touches production:

1. `gateAutopsy` after a W40 mark, called with `now = 2026-10-05T16:20:00Z`, returns ok.
2. Second call the same Monday returns 429 and the Monday copy.
3. `bumpRoast` on Oct 4 and Oct 5 share `roast:{id}:2026-10`.
4. Clinic used on `2026-10-04` does not reduce `clinic:{id}:2026-10-05`.
5. ElevenLabs key never leaves the Worker. Free tier never reaches `tts.js`.
