/**
 * CourtManager Pro — 4 capas de seguridad cliente
 * Uso: <script dangerouslySetInnerHTML={{ __html: SECURITY_SCRIPT }} />
 */
export const SECURITY_SCRIPT = `
(function() {
  var BRAND = 'CourtManager Pro';
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I','J','C','K'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.altKey && ['I','J','C'].includes(e.key))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
  var threshold = 160;
  var checkDevTools = function() {
    var widthGap = window.outerWidth - window.innerWidth;
    var heightGap = window.outerHeight - window.innerHeight;
    if (widthGap > threshold || heightGap > threshold) {
      document.documentElement.innerHTML = '<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#0f172a;color:#94a3b8;padding:24px;text-align:center"><div><div style="font-size:48px;margin-bottom:16px">🔒</div><h1 style="color:#f8fafc;font-size:1.25rem;margin:0 0 8px">Acceso restringido</h1><p style="margin:0;font-size:0.875rem">Inspección no autorizada. Propiedad de Ramón del Pozo Rott.</p></div></body>';
    }
  };
  setInterval(checkDevTools, 1000);
  checkDevTools();
  document.addEventListener('selectstart', function(e) {
    if (e.target && e.target.closest && e.target.closest('pre, code, .no-select')) {
      e.preventDefault();
    }
  });
  console.log('%c[' + BRAND + '] 4 capas de seguridad activas. Propiedad de Ramón del Pozo Rott.', 'color:#6366f1;font-size:9px');
})();
`.trim();
