# BOMBED.app — Claude Implementation Instructions

**Goal:** Turn the free-everything site into a $5/month Reps tier with a hard free cap. Keep the existing Redline Engine, lessons, and games as the free hook. Add scarcity + teaching = money.

## 1. Pricing tiers (final)

| Tier | Price | What you get | Gate?
|------|-------|--------------|------
| **Free** | $0 | Lessons, games, Redline Engine (limited), 3 roasts total (text only, no voice), Redline Pass | Yes — 3-roast lifetime cap, no account needed until cap hit
| **Reps** (new flagship) | **$5/month** | 10 voice roasts/month (Trailer Guy ElevenLabs), 1 weekly joke autopsy, punchline clinic (5 weak lines × 3 rewrites), saved wins, caption/hook tools | Account required
| **Vault** | $4.99 one-time | Full 73-show audio catalog | Existing
| **Fast Joke Fix** | $19 one-time | Emergency rewrite of one dying bit + voice | Existing (currently Redline Fast Clip Pack)

## 2. Free-tier cap logic (pseudocode)

```javascript
const FREE_ROAST_CAP = 3;
function canRoast(user) {
  if (user.isPaid('reps')) return true;
  const used = getRoastCount(user.id); // localStorage or DB
  if (used >= FREE_ROAST_CAP) {
    showPaywall('reps', 'You've used your 3 free roasts. Comics who pay get the voice + the autopsy.');
    return false;
  }
  return true;
}
```

Store count in localStorage for anonymous users; migrate to account on signup.

## 3. Reps tier features to build

- **Voice roasts:** call ElevenLabs with Trailer Guy voice ID on roast output. Cache audio URLs.
- **Joke Autopsy:** form → submit bit text + target → Trailer Guy returns structured breakdown:
  - Setup (what expectation you built)
  - Surprise (where the swerve is / isn't)
  - Punch (did it land? why/why not)
  - Tags (missing? weak?)
  - Button (did you close hard?)
  - Verdict: "dies here because…" + 2 fixed versions
- **Punchline Clinic:** input 5 weak punchlines → output 3 stronger each, with one-line logic ("you explained the joke — cut the explanation").
- **Saved Wins:** local list of best rewrites, exportable.

## 4. Copy for the paywall screen (paste into modal)

> **You've bombed 3 times for free. That's the open mic.**
> Real comics pay for the autopsy — someone telling them exactly why the room went quiet.
> **Reps — $5/month.** 10 voice roasts. One weekly joke autopsy. Punchline clinic. Cancel anytime.
> [Start Reps]  [Keep bombing free — no, really]

## 5. Sample first autopsy (demo — post this on /autopsy)

**Bit submitted:** "I clean toilets to fund a comedy app."
**Trailer Guy:** "Setup's fine — two jobs, one dream. But you *explained* the punch. 'To fund' is the tell. Cut it. Try: 'I scrub toilets so a robot can make me funny.' Now the surprise is the robot, not the toilet. Tag: 'The robot's funnier than me. That's not a business plan, that's a hostage situation.' Button: 'Roger still hasn't called back.' — ties to your own lore, lands hard. You died because you narrated instead of surprising."

## 6. Files to add/change

- `reps-tier.js` — paywall, cap, voice call, autopsy form
- `autopsy.html` + `autopsy.js` — the demo page
- Update `index.html` nav: add "Reps $5" + "Autopsy" links
- Update `styles.css` — paywall modal, Trailer Guy badge
- `CLAUDE-INSTRUCTIONS.md` — this file

## 7. What NOT to change

- Keep punch-up-only policy (no identity roasts)
- Keep the Redline Engine free (it's the hook)
- Keep Vault + $19 fix as one-time upsells
- Don't break the existing combinatorial engine — it's solid

*Ready for Claude. Paste this + the repo into Claude and say: implement the Reps tier and free cap first.*
