/* main.js — language switching & misc */

// ─── Language system ───────────────────────────────────
function setLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);

  // Toggle active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update every element that has data-pt / data-en
  document.querySelectorAll('[data-pt]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.textContent = val;
  });

  // Persist choice
  localStorage.setItem('lang', lang);
}

// On load: restore saved lang or detect browser
(function () {
  const saved    = localStorage.getItem('lang');
  const browser  = navigator.language?.startsWith('pt') ? 'pt' : 'en';
  setLang(saved || browser);
})();

// ─── Expose globally for inline onclick ────────────────
window.setLang = setLang;

// ─── Subtle tilt on avatar (mouse parallax) ────────────
const avatarWrap = document.querySelector('.avatar-wrap');
document.addEventListener('mousemove', (e) => {
  if (!avatarWrap) return;
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  avatarWrap.style.transform = `translate(${dx * 6}px, ${dy * 4}px)`;
});
