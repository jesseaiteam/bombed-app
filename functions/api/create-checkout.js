// BOMBED.app — /api/create-checkout stub
// Creates a Stripe Checkout Session for Reps $5/mo. Do not deploy live.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { env } = context;
  // TODO: require logged-in user
  // TODO: Stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   line_items: [{ price: env.STRIPE_REPS_PRICE_ID, quantity: 1 }],
  //   success_url: `${env.APP_URL}/reps/welcome?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${env.APP_URL}/pricing`,
  //   client_reference_id: user.id,
  //   metadata: { plan: 'reps' }
  // })

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_REPS_PRICE_ID) {
    return json({
      stub: true,
      message: 'Stripe env not wired. Do not deploy live.',
      placeholder: '/pricing'
    }, 501);
  }

  return json({
    stub: true,
    checkoutUrl: null,
    note: 'Wire Stripe then return session.url'
  });
}
