# BOMBED.app — Comedy Platform Plan & Improvements
Oct 3, 2026 · Jesse Salas · Claude implementation pack

Notion connector is still not connected. This file + the Google Doc are the page.
Archive: https://github.com/jesseaiteam/bombed-app
DO NOT DEPLOY LIVE FROM THIS PACK.

## 1) REPS TIER SPEC — $5/month
Positioning: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy.

FREE: 3 lifetime text-only roasts. localStorage until signup, then the count migrates so clearing storage does not reset the cap. No ElevenLabs. Lessons, games, Redline Engine stay free. Cap = paywall. Server returns 402.
REPS $5/mo: 10 voice roasts per UTC month. 1 weekly autopsy (ISO week, Monday reset — Saturday does NOT open a new autopsy). Punchline clinic 1–5 lines, 3 rewrites each, 5 lines per UTC day (Saturday still counts against Friday's leftover if the UTC day already rolled; a new local Saturday is a new day key). Saved Wins. Caption/hook tools. Stripe required. Account required. Client paid-flag is a hint, never the lock.
11th paid roast = 429 + Fast Joke Fix offer. Second autopsy in the same ISO week = 429 Monday copy, even if today is Saturday. 6th clinic line in one request = 400. Over the daily clinic cap = 429. Unpaid clinic = 402.
KEEP: Vault $4.99 one-time. Fast Joke Fix $19 one-time. Fast Joke Fix does not raise the monthly roast cap.
RAILS: punch-up only. No identity roasts. No slurs. Everybody gets roasted. Nobody gets destroyed.

SATURDAY RULE FOR CLAUDE: isoWeekKey() is Monday-start. Oct 3, 2026 is still 2026-W40. Do not special-case weekend. Do not reset roast month on Saturday. Month key stays UTC YYYY-MM.

## 2) CODE
`functions/api/limits.js` — gateRoast, bumpRoast, gateAutopsy, markAutopsy, gateClinic, markClinic, isoWeekKey, monthKey, dayKey.
KV binding BOMBED_LIMITS. Keys: roast:{userId}:{YYYY-MM}, autopsy:{userId}:{YYYY-Www}, clinic:{userId}:{YYYY-MM-DD}.
Existing: reps-tier.js paywall modal. functions/api/roast.js, tts.js, autopsy.js, clinic.js, create-checkout.js, stripe-webhook.js.
FREE_ROAST_CAP=3. REPS_MONTHLY_ROASTS=10. CLINIC_DAILY_LINES=5. REPS_PRICE_USD=5.
402 on 4th free roast. 429 on 11th paid roast.
TTS: ElevenLabs key never on the client. Paid or Fast Joke Fix only. Cache hash(text+voiceId) in R2.
Autopsy: POST { bit, target }. Trailer Guy forced JSON: setup, surprise, punch, tags, button, verdict, fixedVersions.
Stripe test mode only. Webhook verifies signature before writing plan=reps AND subscription_status=active. isActiveReps requires both.

Voice map (server only, env names, no keys in repo):
- ELEVENLABS_API_KEY
- VOICE_TRAILER_GUY — autopsy host
- VOICE_ROACH — roast fix
- VOICE_TONY, VOICE_SAL, VOICE_MAYA, VOICE_ROMAN, VOICE_TRIXIE, VOICE_KARIM
Cache key: sha256(voiceId + '|' + normalizedText). Store mp3 in R2 BOMBED_AUDIO. Free tier never hits this route.

## 3) PRICING COPY
PAYWALL: You've bombed 3 times for free. That's the open mic. Real comics pay for the autopsy — someone telling them exactly why the room went quiet. REPS — $5/month. 10 voice roasts. 1 weekly joke autopsy. Punchline clinic. Cancel anytime. [ Start Reps — $5 ] [ Keep bombing free — no, really ]
HERO: PUT IN THE REPS. Free gets you 3 text roasts and the open-mic energy. Reps gets you the voice, the autopsy, and the rewrite that stops the silence. $5/month. Cancel when you finally kill.
SATURDAY LINE: The club is open. You're still in the folder. $5 gets the autopsy. The mic is not a pull request.
HTML stub already in pricing.html. CTA still points at /roast-pro until checkout is wired. Do not point it at a live charge.

## 4) SAMPLE AUTOPSY
BIT: I clean toilets to fund a comedy app.
TRAILER GUY: You explained the punch. Cut 'to fund.' Try: I scrub toilets so a robot can make me funny. Tag: The robot's funnier than me. That's not a business plan, that's a hostage situation. Button: Roger still hasn't called back.

TWENTY-SECOND — Oct 3, Saturday
BIT: It's Saturday and the autopsy is still in a folder. Twenty-two packs. The club is open and I'm writing the lock.
TRAILER GUY: Saturday is when the room is drunk enough to laugh at a bad premise and mean enough to bury one that explains itself. You counted packs again. Cut the twenty-two. Try: I spent Saturday writing the paywall so I wouldn't have to hear the silence. Tag: The bar is open and I brought a spec. Button: Sacramento still has a Saturday. The mic doesn't take pull requests.
Verdict: Died as production. Make Saturday the coward.
Fixed 1: I spent Saturday writing the paywall so I wouldn't have to hear the silence.
Fixed 2: The club opened and I locked the joke in a folder.
Machine copy: demos/autopsy-2026-10-03.json

## 5) CLAUDE
Implement the Reps tier and free roast cap first. Wire Stripe for $5/month in test mode. Do not deploy live.
Paste CLAUDE-INSTRUCTIONS.md plus the repo.
Saturday check: one autopsy attempt on Friday and one on Saturday in the same ISO week must 429 the second. Do not reset on the weekend.
