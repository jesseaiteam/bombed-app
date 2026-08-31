// BOMBED.app — Autopsy page client
// Requires reps-tier.js (window.BombedReps)

document.getElementById('autopsy-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bit = document.getElementById('bit').value.trim();
  const target = document.getElementById('target').value.trim();
  const resultEl = document.getElementById('autopsy-result');

  if (!bit) return;

  resultEl.hidden = false;
  resultEl.innerHTML = '<p>Trailer Guy is reading your corpse...</p>';

  try {
    const data = await window.BombedReps.submitAutopsy(bit, target);
    if (!data) {
      resultEl.innerHTML = '<p>Paywall or weekly limit. Put in the reps.</p>';
      return;
    }

    resultEl.innerHTML = `
      <div class="verdict">
        <p><strong>Setup:</strong> ${escapeHtml(data.setup || '')}</p>
        <p><strong>Surprise:</strong> ${escapeHtml(data.surprise || '')}</p>
        <p><strong>Punch:</strong> ${escapeHtml(data.punch || '')}</p>
        <p><strong>Tags:</strong> ${escapeHtml(data.tags || '')}</p>
        <p><strong>Button:</strong> ${escapeHtml(data.button || '')}</p>
        <p><strong>Verdict:</strong> ${escapeHtml(data.verdict || '')}</p>
        <h4>Fixed versions</h4>
        <ol>
          ${(data.fixedVersions || []).map(v => `<li>${escapeHtml(v)}</li>`).join('')}
        </ol>
      </div>
    `;
  } catch (err) {
    resultEl.innerHTML = `<p>Something died on the way to the stage: ${escapeHtml(err.message)}</p>`;
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
