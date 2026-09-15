// BOMBED.app — /api/stripe-webhook stub
// Keep raw body for signature verification. Do not deploy live.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const sig = request.headers.get('stripe-signature');
  const raw = await request.text();

  // TODO: stripe.webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET)
  if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
    return json({ stub: true, error: 'missing signature or secret' }, 400);
  }

  // Handle:
  // customer.subscription.created  -> user.plan = 'reps', status = 'active'
  // customer.subscription.updated  -> sync status (past_due, canceled, active)
  // customer.subscription.deleted  -> user.plan = 'free'
  // checkout.session.completed     -> attach stripe_customer_id to user

  return json({ stub: true, received: true });
}
