/**
 * CourtManager Pro — capas de seguridad cliente
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
  document.addEventListener('selectstart', function(e) {
    if (e.target && e.target.closest && e.target.closest('pre, code, .no-select')) {
      e.preventDefault();
    }
  });
  console.log('%c[' + BRAND + '] Seguridad activa. Propiedad de Ramón del Pozo Rott.', 'color:#6366f1;font-size:9px');
})();
`.trim();
