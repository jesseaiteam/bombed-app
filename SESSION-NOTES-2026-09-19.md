# BOMBED.app — Session Notes · Sep 19, 2026
**Jesse Salas · Grok · Claude implementation pack**

Notion page *BOMBED.app - Comedy Platform Plan & Improvements* still cannot be written (Notion connector needs re-auth). Source of truth: this repo + Google Doc of the same title.

## Status (DO NOT DEPLOY LIVE)
- Repo: https://github.com/jesseaiteam/bombed-app
- Free cap: 3 lifetime text-only roasts
- Flagship: **Reps $5/month** — 10 voice roasts, 1 weekly autopsy, punchline clinic
- Stubs: `reps-tier.js`, `pricing.html`, `autopsy.html`, `functions/api/*`
- Stripe Checkout is a stub. Test mode only. Do not flip live billing.

## Claude prompt (paste this)
> Implement the Reps tier and free roast cap first. Wire Stripe for $5/month. Gate ElevenLabs behind paid. Build weekly autopsy with the Trailer Guy JSON schema. Do not deploy live.

## Ninth autopsy demo (new this session)
**Bit:** "Saturday morning I clean houses. Saturday night I host robots. Sunday I argue with both."

**Trailer Guy:**
"That's a schedule, not a joke. You listed three jobs and hoped the list was funny. A list is setup. The punch is who wins the argument.
Try: 'I clean houses Saturday morning and host robots Saturday night. Sunday the toilets and the bots both want a raise.'
Tag: 'I told them tips are in the app. The app is also broke.'
Button: 'I clocked out. Nobody noticed. That's the review.'
You died because you reported the calendar instead of picking a boss and losing to it."

- Setup: Two Saturdays, one man. Clear.
- Surprise: Missing. You announced the split shift.
- Punch: Soft. Argument with no loser.
- Tags: None.
- Button: None.
- Verdict: Died as a timesheet. Make the toilets and the bots the same landlord.
- Fixed 1: "I clean houses Saturday morning and host robots Saturday night. Sunday the toilets and the bots both want a raise."
- Fixed 2: "I clean houses Saturday morning and host robots Saturday night. Sunday the toilets and the bots both want a raise. I told them tips are in the app. The app is also broke. I clocked out. Nobody noticed. That's the review."

## First sample (keep on /autopsy)
**Bit:** "I clean toilets to fund a comedy app."
Trailer Guy: Setup's fine. You explained the punch. Cut "to fund." Try: I scrub toilets so a robot can make me funny.

## Next for Jesse
1. Re-auth Notion.
2. Stripe Product "Reps" $5/mo in TEST mode.
3. Hand Claude this whole repo.
4. Wire D1/KV so clearing localStorage cannot reset the 3-roast cap.
5. Keep Vault $4.99 and Fast Joke Fix $19.
6. Do not deploy live from this pack.
