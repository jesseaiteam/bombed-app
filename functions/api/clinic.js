// BOMBED.app — /api/clinic stub
// ≤5 weak punchlines → 3 rewrites each + one-line reason. Paid Reps only.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request } = context;
  // TODO: auth + Stripe active Reps
  const paid = false;
  if (!paid) return json({ error: 'paywall' }, 402);

  const body = await request.json();
  const lines = Array.isArray(body.lines) ? body.lines.slice(0, 5) : [];
  if (!lines.length) return json({ error: 'Send 1–5 weak punchlines' }, 400);

  // TODO: model rewrite. Punch-up only.
  const results = lines.map((original) => ({
    original,
    rewrites: [
      'Stronger cut — drop the explanation.',
      'Stronger cut — move the surprise later.',
      'Stronger cut — add a concrete receipt.'
    ],
    reason: 'You explained the joke. Cut the explanation.'
  }));

  return json({ stub: true, results });
}
