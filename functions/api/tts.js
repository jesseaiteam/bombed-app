// BOMBED.app — /api/tts stub
// ElevenLabs key MUST stay in env.ELEVENLABS_KEY. Never ship to the client.

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  // TODO: auth + isPaidReps or Fast Joke Fix entitlement
  const user = null;
  const paid = false;
  if (!paid) return json({ error: 'paywall' }, 402);

  const { text, voiceId } = await request.json();
  if (!text) return json({ error: 'missing text' }, 400);

  const id = voiceId || env.TRAILER_GUY_VOICE_ID;
  const key = `tts/${hash(text + id)}.mp3`;

  // TODO: R2 cache lookup
  // const cached = await env.R2.get(key);
  // if (cached) return json({ audioUrl: cdn(key) });

  // TODO:
  // const audio = await elevenLabsSpeak(env.ELEVENLABS_KEY, id, text);
  // await env.R2.put(key, audio);

  return json({
    audioUrl: null,
    stub: true,
    note: 'Wire ElevenLabs + R2. Do not deploy this stub live.'
  });
}

function hash(s) {
  // placeholder — use a real hash in production
  return encodeURIComponent(s).slice(0, 80);
}
