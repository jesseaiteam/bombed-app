// BOMBED.app — Reps Tier Logic
// Free cap: 3 roasts (text only). Paid: 10 voice roasts + autopsy + clinic.

const FREE_ROAST_CAP = 3;
const REPS_PRICE = 5; // USD / month

// Anonymous roast counter (localStorage). Migrate to account on signup.
function getRoastCount() {
  return parseInt(localStorage.getItem('bombed_free_roasts') || '0', 10);
}
function incrementRoastCount() {
  localStorage.setItem('bombed_free_roasts', getRoastCount() + 1);
}

function isPaidReps(user) {
  // TODO: check Stripe / account status
  return user && user.subscription === 'reps';
}

function canRoast(user) {
  if (isPaidReps(user)) return true;
  if (getRoastCount() >= FREE_ROAST_CAP) {
    showPaywall();
    return false;
  }
  return true;
}

function showPaywall() {
  const modal = document.createElement('div');
  modal.className = 'paywall-modal';
  modal.innerHTML = `
    <div class="paywall-card">
      <h2>You've bombed 3 times for free. That's the open mic.</h2>
      <p>Real comics pay for the autopsy — someone telling them exactly why the room went quiet.</p>
      <p><strong>Reps — $5/month.</strong> 10 voice roasts. One weekly joke autopsy. Punchline clinic. Cancel anytime.</p>
      <button onclick="startRepsCheckout()">Start Reps</button>
      <button class="secondary" onclick="this.closest('.paywall-modal').remove()">Keep bombing free — no, really</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function startRepsCheckout() {
  // TODO: Stripe checkout for $5/month Reps tier
  window.location.href = '/roast-pro';
}

// Autopsy submission (paid only)
async function submitAutopsy(bitText, target) {
  if (!isPaidReps(currentUser)) {
    showPaywall();
    return;
  }
  const res = await fetch('/api/autopsy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bit: bitText, target })
  });
  return res.json(); // returns structured breakdown + 2 fixed versions
}

// Punchline clinic (paid only)
async function punchlineClinic(weakLines) {
  if (!isPaidReps(currentUser)) {
    showPaywall();
    return;
  }
  const res = await fetch('/api/clinic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines: weakLines })
  });
  return res.json(); // 3 rewrites each + one-line logic
}
