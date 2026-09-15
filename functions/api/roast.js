// BOMBED.app — /api/roast stub (Cloudflare Pages Function)
// Do not deploy live. Wire auth + Stripe + engine before production.

const FREE_ROAST_CAP = 3;
const REPS_MONTHLY_ROASTS = 10;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  // TODO: auth(request) — JWT / session cookie
  const user = null;

  // TODO: persist counters in D1 / KV, not in this stub
  if (!user) {
    return json({
      ok: false,
      paywall: true,
      message: "You've bombed 3 times for free. That's the open mic."
    }, 402);
  }

  const paid = user.plan === 'reps' && user.subscription_status === 'active';
  if (!paid && (user.lifetime_free_roasts || 0) >= FREE_ROAST_CAP) {
    return json({ ok: false, paywall: true }, 402);
  }
  if (paid) {
    const used = user.monthly_roasts || 0;
    if (used >= REPS_MONTHLY_ROASTS) {
      return json({
        ok: false,
        message: 'You burned your 10 voice roasts. Come back next month or buy a Fast Joke Fix.'
      }, 429);
    }
  }

  // TODO: call existing combinatorial roast engine here
  return json({
    ok: true,
    roast: 'STUB — engine output goes here',
    voiceEligible: paid
  });
}
