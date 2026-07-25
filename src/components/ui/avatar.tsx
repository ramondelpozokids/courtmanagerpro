'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

const AvatarImageContext = React.createContext<{
  status: AvatarImageStatus;
  hasSrc: boolean;
  setStatus: (s: AvatarImageStatus) => void;
  setHasSrc: (v: boolean) => void;
} | null>(null);

export function Avatar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [status, setStatus] = React.useState<AvatarImageStatus>('idle');
  const [hasSrc, setHasSrc] = React.useState(false);
  const value = React.useMemo(
    () => ({ status, hasSrc, setStatus, setHasSrc }),
    [status, hasSrc]
  );

  return (
    <AvatarImageContext.Provider value={value}>
      <div
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 bg-slate-800',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AvatarImageContext.Provider>
  );
}

export function AvatarImage({
  className,
  src,
  alt,
  onLoad,
  onError,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ctx = React.useContext(AvatarImageContext);
  const setStatus = ctx?.setStatus;
  const setHasSrc = ctx?.setHasSrc;
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const ok = Boolean(src);
    setHasSrc?.(ok);
    if (!ok) {
      setStatus?.('error');
      return;
    }
    setStatus?.('loading');
  }, [src, setStatus, setHasSrc]);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img || !src) return;
    // Imágenes en caché: onLoad a veces no se dispara
    if (img.complete && img.naturalWidth > 0) {
      setStatus?.('loaded');
    }
  }, [src, setStatus]);

  if (!src) return null;

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={cn(
        'aspect-square h-full w-full object-cover relative z-10',
        ctx?.status === 'error' && 'hidden',
        className
      )}
      onLoad={(e) => {
        setStatus?.('loaded');
        onLoad?.(e);
      }}
      onError={(e) => {
        setStatus?.('error');
        onError?.(e);
      }}
      {...props}
    />
  );
}

export function AvatarFallback({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(AvatarImageContext);

  // Con foto válida o cargando: nunca mostrar la letra encima
  if (ctx?.hasSrc && ctx.status !== 'error') return null;
  if (ctx?.status === 'loaded') return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-0 flex items-center justify-center rounded-full bg-slate-700 text-slate-200 font-bold',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
