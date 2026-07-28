/** Miniatura botiquín — SVG inline (no depende de /public en Vercel). */
export function BotiquinThumb({
  className = 'h-full w-full',
  title = 'Botiquín',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      role="img"
      aria-label={title}
      className={className}
    >
      <rect width="128" height="128" rx="24" fill="#FEF2F2" />
      <rect x="28" y="40" width="72" height="64" rx="10" fill="#DC2626" />
      <rect x="44" y="28" width="40" height="18" rx="6" fill="#B91C1C" />
      <rect x="54" y="54" width="20" height="36" rx="4" fill="#FFFFFF" />
      <rect x="42" y="66" width="44" height="20" rx="4" fill="#FFFFFF" />
    </svg>
  );
}

export function isBotiquinInventoryItem(item: {
  name?: string;
  sku?: string;
  category?: string;
  image_url?: string | null;
}): boolean {
  const cat = String(item.category || '').toLowerCase();
  return (
    cat === 'medico' ||
    cat === 'medical' ||
    /botiqu/i.test(item.name || '') ||
    /MED[-_]?KIT/i.test(item.sku || '') ||
    /botiquin/i.test(item.image_url || '')
  );
}
