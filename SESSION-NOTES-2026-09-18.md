# BOMBED.app — Session Notes · Sep 18, 2026
**Jesse Salas · Grok · Claude implementation pack**

Notion page *BOMBED.app - Comedy Platform Plan & Improvements* could not be written this session (Notion connector needs re-auth). This file + `CLAUDE-INSTRUCTIONS.md` is the source of truth until Notion is reconnected.

## Status (do not deploy live)
- Repo: https://github.com/jesseaiteam/bombed-app
- Free cap: 3 lifetime text-only roasts
- Flagship: **Reps $5/month** — 10 voice roasts, 1 weekly autopsy, punchline clinic
- Stubs exist: `reps-tier.js`, `pricing.html`, `autopsy.html`, `functions/api/*`
- Stripe Checkout is a stub. Do not flip live billing from this pack.

## Claude prompt (paste this)
> Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Gate ElevenLabs behind paid. Build weekly autopsy with the Trailer Guy JSON schema. Do not deploy live.

## Eighth autopsy demo (new this session)
**Bit:** "I host a comedy club in my phone and still can't get a Saturday."

**Trailer Guy:**
"That's a calendar complaint wearing a club jacket. Saturday is setup. The punch is that the room is in your pocket and still empty.\nTry: 'I built a club that fits in my pocket. Saturday still won't come in.'\nTag: 'The bots showed up. They don't drink. The two-drink minimum is me.'\nButton: 'I put myself on the list. The list is also me.'\nYou died because you begged for a booking instead of roasting the venue — which is you."

- Setup: Pocket club vs real Saturday. Clear.
- Surprise: Missing. You announced the absence.
- Punch: Soft. Calendar joke, no turn.
- Tags: None.
- Button: None.
- Verdict: Died begging the calendar. Make the pocket the room and lose on purpose.
- Fixed 1: "I built a club that fits in my pocket. Saturday still won't come in."
- Fixed 2: "I built a club that fits in my pocket. Saturday still won't come in. The bots showed up. They don't drink. The two-drink minimum is me. I put myself on the list. The list is also me."

## Next for Jesse
1. Re-auth Notion so this pack can live on the named page.
2. Create Stripe Product "Reps" $5/mo (test mode first).
3. Hand Claude the whole repo + this file.
4. Wire D1/KV counters so clearing localStorage cannot reset the 3-roast lifetime cap.
5. Keep Vault $4.99 and Fast Joke Fix $19.
