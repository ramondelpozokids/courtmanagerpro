/** Evita que la Vercel Toolbar (vercel.live) aparezca en producción y previews. */
export const DISABLE_VERCEL_TOOLBAR_SCRIPT = `
(function() {
  var selectors = 'vercel-live-feedback, script[src*="vercel.live"], iframe[src*="vercel.live"]';
  function removeToolbar() {
    document.querySelectorAll(selectors).forEach(function(el) { el.remove(); });
  }
  removeToolbar();
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(removeToolbar).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
`.trim();
