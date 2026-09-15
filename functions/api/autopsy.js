// BOMBED.app — /api/autopsy stub
// 1 structured Trailer Guy autopsy per ISO week. Paid Reps only.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export async function onRequestPost(context) {
  const { request } = context;
  // TODO: auth + Stripe active Reps
  const user = null;
  const paid = false;
  if (!paid) return json({ error: 'paywall' }, 402);

  const { bit, target } = await request.json();
  if (!bit || String(bit).trim().length < 8) {
    return json({ error: 'Paste the bit that died.' }, 400);
  }

  const week = isoWeekKey();
  // TODO: if user already submitted this week → 429
  // "You already used this week's autopsy. Put in the reps and come back Monday."

  // TODO: call model with Trailer Guy system prompt + forced JSON schema
  return json({
    stub: true,
    week,
    target: target || null,
    setup: 'what expectation you built',
    surprise: 'where the swerve is or is not',
    punch: 'did it land and why not',
    tags: 'missing or weak',
    button: 'did you close hard',
    verdict: 'dies here because you narrated instead of surprising',
    fixedVersions: [
      'Rewrite one — surprise first.',
      'Rewrite two — add tag + button.'
    ]
  });
}
