'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { RAMON_AVATAR_DATA_URL } from '@/components/layout/ramon-avatar-data';

/** PNG limpio (sin N). Cache-bust alto tras sustituir el PNG corrupto. */
const CEO_SRC = '/images/avatar-ceo-ramon.png?v=20';

/**
 * Avatar fijo del CEO (Ramón). Sin iniciales, sin dicebear, sin N.
 * PNG público; si falla, data-URL embebida (también limpia).
 */
export function CeoAvatar({
  size = 32,
  className,
  title = 'Ramón del Pozo Rott',
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  const [src, setSrc] = useState(CEO_SRC);

  return (
    <span
      title={title}
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full border border-slate-600 bg-slate-900',
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        decoding="sync"
        draggable={false}
        className="pointer-events-none h-full w-full object-cover object-top"
        onError={() => {
          if (src !== RAMON_AVATAR_DATA_URL) setSrc(RAMON_AVATAR_DATA_URL);
        }}
      />
    </span>
  );
}
