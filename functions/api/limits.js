// BOMBED.app — quota helper for Cloudflare Pages Functions
// Do not deploy live. Claude: import this from roast.js / tts.js / autopsy.js / clinic.js.
// Counters live in KV binding BOMBED_LIMITS. Keys never hold the ElevenLabs secret.

export const FREE_ROAST_CAP = 3;
export const REPS_MONTHLY_ROASTS = 10;
export const REPS_PRICE_USD = 5;

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function monthKey(d = new Date()) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function isActiveReps(user) {
  return !!(user && user.plan === 'reps' && user.subscription_status === 'active');
}

// user: { id, plan, subscription_status, lifetime_free_roasts }
// returns { ok: true } or a Response the route should return immediately
export async function gateRoast(env, user) {
  if (!user) {
    return json({
      ok: false,
      paywall: true,
      code: 'FREE_CAP',
      message: "You've bombed 3 times for free. That's the open mic."
    }, 402);
  }
  if (isActiveReps(user)) {
    const key = `roast:${user.id}:${monthKey()}`;
    const used = Number(await env.BOMBED_LIMITS.get(key) || 0);
    if (used >= REPS_MONTHLY_ROASTS) {
      return json({
        ok: false,
        code: 'MONTHLY_CAP',
        used,
        limit: REPS_MONTHLY_ROASTS,
        message: 'You burned your 10 voice roasts. Come back next month or buy a Fast Joke Fix.'
      }, 429);
    }
    return { ok: true, paid: true, used };
  }
  const used = Number(user.lifetime_free_roasts || 0);
  if (used >= FREE_ROAST_CAP) {
    return json({
      ok: false,
      paywall: true,
      code: 'FREE_CAP',
      used,
      limit: FREE_ROAST_CAP,
      message: "You've bombed 3 times for free. That's the open mic."
    }, 402);
  }
  return { ok: true, paid: false, used };
}

export async function bumpRoast(env, user) {
  if (isActiveReps(user)) {
    const key = `roast:${user.id}:${monthKey()}`;
    const used = Number(await env.BOMBED_LIMITS.get(key) || 0) + 1;
    await env.BOMBED_LIMITS.put(key, String(used), { expirationTtl: 60 * 60 * 24 * 40 });
    return used;
  }
  // free path: increment lifetime_free_roasts in D1, not localStorage
  return Number(user.lifetime_free_roasts || 0) + 1;
}

export async function gateAutopsy(env, user) {
  if (!isActiveReps(user)) {
    return json({ error: 'paywall', message: 'Real comics pay for the autopsy.' }, 402);
  }
  const week = isoWeekKey();
  const key = `autopsy:${user.id}:${week}`;
  if (await env.BOMBED_LIMITS.get(key)) {
    return json({
      error: 'weekly_cap',
      week,
      message: "You already used this week's autopsy. Put in the reps and come back Monday."
    }, 429);
  }
  return { ok: true, week, key };
}

export async function markAutopsy(env, key) {
  await env.BOMBED_LIMITS.put(key, '1', { expirationTtl: 60 * 60 * 24 * 14 });
}
