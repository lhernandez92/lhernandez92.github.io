/* ── i18n: language switching ─────────────────────────────── */

const SUPPORTED = ['es', 'fr', 'en'];
const DEFAULT_LANG = 'es';

function getLang() {
  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED.includes(stored)) return stored;

  // Auto-detect from browser
  const browser = (navigator.language || 'es').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
}

function getKey(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
}

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  document.documentElement.lang = lang;
  document.title = t.meta.title;

  // Plain text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = getKey(t, el.dataset.i18n);
    if (val != null) el.textContent = val;
  });

  // Nodes that contain HTML (e.g. <strong>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = getKey(t, el.dataset.i18nHtml);
    if (val != null) el.innerHTML = val;
  });

  localStorage.setItem('lang', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
  });
}

function initI18n() {
  const lang = getLang();
  applyTranslations(lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
  });
}

document.addEventListener('DOMContentLoaded', initI18n);
