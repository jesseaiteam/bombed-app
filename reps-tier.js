// BOMBED.app — Reps Tier Logic
// Free cap: 3 text-only roasts (lifetime / localStorage).
// Paid Reps ($5/mo): 10 voice roasts/month + weekly autopsy + punchline clinic.
// Tone: Kill Tony / put in the fucking reps.
// Last updated: Sep 3, 2026

const FREE_ROAST_CAP = 3;
const REPS_MONTHLY_ROASTS = 10;
const REPS_PRICE_USD = 5;

// ---------- Free-tier counter (anonymous) ----------
function getFreeRoastCount() {
  return parseInt(localStorage.getItem('bombed_free_roasts') || '0', 10);
}

function incrementFreeRoast() {
  localStorage.setItem('bombed_free_roasts', String(getFreeRoastCount() + 1));
}

// Call this after successful account signup/login to stop the free-reset exploit
function migrateFreeRoastsToAccount(userId) {
  const count = getFreeRoastCount();
  if (count > 0 && userId) {
    // POST to /api/migrate-free-roasts { userId, count }
    // then optionally clear localStorage key
  }
}

// ---------- Paid status (replace with real Stripe / JWT claim) ----------
function isPaidReps(user) {
  // TODO: check Stripe subscription or account.plan === 'reps'
  return !!(user && (user.subscription === 'reps' || user.plan === 'reps' || user.subscription_status === 'active'));
}

// ---------- Gate ----------
function canRoast(user) {
  if (isPaidReps(user)) {
    // TODO: also enforce REPS_MONTHLY_ROASTS via server counter
    return true;
  }
  if (getFreeRoastCount() >= FREE_ROAST_CAP) {
    showPaywall();
    return false;
  }
  return true;
}

function afterSuccessfulRoast(user) {
  if (!isPaidReps(user)) {
    incrementFreeRoast();
  }
  // paid path: server increments monthly usage
}

// ---------- Paywall modal ----------
function showPaywall() {
  if (document.querySelector('.paywall-modal')) return;

  const modal = document.createElement('div');
  modal.className = 'paywall-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="paywall-card">
      <h2>You've bombed 3 times for free. That's the open mic.</h2>
      <p>Real comics pay for the autopsy — someone telling them exactly why the room went quiet.</p>
      <p><strong>Reps — $${REPS_PRICE_USD}/month.</strong><br>
      10 voice roasts. One weekly joke autopsy. Punchline clinic. Cancel anytime.</p>
      <div class="paywall-actions">
        <button type="button" class="primary" id="start-reps-btn">Start Reps — $${REPS_PRICE_USD}</button>
        <button type="button" class="secondary" id="keep-bombing-btn">Keep bombing free — no, really</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('start-reps-btn').addEventListener('click', startRepsCheckout);
  document.getElementById('keep-bombing-btn').addEventListener('click', () => modal.remove());
}

function startRepsCheckout() {
  // Production: fetch('/api/create-checkout', { method: 'POST' }) → redirect to session.url
  // Until Stripe is wired, fall back to existing pro landing
  window.location.href = '/roast-pro';
}

// ---------- ElevenLabs voice (paid only — key stays on server) ----------
async function generateTrailerGuyAudio(roastText, voiceId = 'TRAILER_GUY_VOICE_ID') {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(window.authToken ? { Authorization: `Bearer ${window.authToken}` } : {})
    },
    body: JSON.stringify({ text: roastText, voiceId })
  });
  if (!res.ok) throw new Error('TTS failed');
  const { audioUrl } = await res.json();
  return audioUrl;
}

// ---------- Autopsy (paid, 1/week) ----------
async function submitAutopsy(bitText, target = '') {
  if (!isPaidReps(window.currentUser)) {
    showPaywall();
    return null;
  }
  const res = await fetch('/api/autopsy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(window.authToken ? { Authorization: `Bearer ${window.authToken}` } : {})
    },
    body: JSON.stringify({ bit: bitText, target })
  });
  if (res.status === 429) {
    alert('You already used this week\'s autopsy. Put in the reps and come back Monday.');
    return null;
  }
  if (!res.ok) throw new Error('Autopsy failed');
  return res.json(); // { setup, surprise, punch, tags, button, verdict, fixedVersions }
}

// ---------- Punchline Clinic (paid) ----------
async function punchlineClinic(weakLines) {
  if (!isPaidReps(window.currentUser)) {
    showPaywall();
    return null;
  }
  if (!Array.isArray(weakLines) || weakLines.length === 0 || weakLines.length > 5) {
    throw new Error('Send 1–5 weak punchlines');
  }
  const res = await fetch('/api/clinic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(window.authToken ? { Authorization: `Bearer ${window.authToken}` } : {})
    },
    body: JSON.stringify({ lines: weakLines })
  });
  if (!res.ok) throw new Error('Clinic failed');
  return res.json(); // [{ original, rewrites: [..3], reason }]
}

// Export for other scripts
window.BombedReps = {
  canRoast,
  afterSuccessfulRoast,
  showPaywall,
  startRepsCheckout,
  generateTrailerGuyAudio,
  submitAutopsy,
  punchlineClinic,
  isPaidReps,
  getFreeRoastCount,
  migrateFreeRoastsToAccount,
  FREE_ROAST_CAP,
  REPS_MONTHLY_ROASTS,
  REPS_PRICE_USD
};
