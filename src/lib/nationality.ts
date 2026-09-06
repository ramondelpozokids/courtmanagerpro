/** País entre paréntesis en el lugar de nacimiento de realmadrid.com, p. ej. "Kiev (Ucrania)". */
export function countryFromBirthPlace(birthPlace?: string | null): string | null {
  if (!birthPlace) return null;
  const paren = String(birthPlace).match(/\(([^)]+)\)\s*$/);
  const raw = (paren?.[1] || '').trim();
  if (!raw) return null;

  const key = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const aliases: Record<string, string> = {
    ucrania: 'Ucrania',
    ukraine: 'Ucrania',
    'estados unidos': 'Estados Unidos',
    usa: 'Estados Unidos',
    eeuu: 'Estados Unidos',
    francia: 'Francia',
    france: 'Francia',
    argentina: 'Argentina',
    espana: 'España',
    spain: 'España',
    senegal: 'Senegal',
    italia: 'Italia',
    italy: 'Italia',
    finlandia: 'Finlandia',
    finland: 'Finlandia',
    'cabo verde': 'Cabo Verde',
    'republica dominicana': 'República Dominicana',
    brasil: 'Brasil',
    brazil: 'Brasil',
    lituania: 'Lituania',
    lithuania: 'Lituania',
    georgia: 'Georgia',
    camerun: 'Camerún',
    cameroon: 'Camerún',
  };

  if (aliases[key]) return aliases[key];
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * realmadrid.com a menudo no manda `nationality`; el país real está en el lugar de nacimiento.
 * Si solo hay el default "España" y el nacimiento es otro país, gana el nacimiento.
 */
export function inferNationality(declared?: string | null, birthPlace?: string | null): string {
  const fromPlace = countryFromBirthPlace(birthPlace);
  const declaredNorm = String(declared || '').trim();
  const declaredIsSpain = !declaredNorm || declaredNorm.toLowerCase() === 'españa';

  if (fromPlace && declaredIsSpain && fromPlace !== 'España') return fromPlace;
  if (declaredNorm) return declaredNorm.charAt(0).toUpperCase() + declaredNorm.slice(1);
  if (fromPlace) return fromPlace;
  return 'España';
}
