'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [configWarning, setConfigWarning] = useState('');

  useEffect(() => {
    fetch('/api/auth/config')
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.production && !cfg.supabaseConfigured) {
          setConfigWarning(
            'Este deploy no tiene Supabase configurado en Vercel. Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Environment Variables.'
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas. Verifica email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-6 py-8 text-center">
          <img src="/logo.png" alt="CourtManager Pro" className="h-12 w-12 mx-auto mb-3" />
          <h1 className="text-xl font-black text-white">CourtManager Pro</h1>
          <p className="text-xs text-slate-400 mt-1">Acceso seguro al portal de utilería</p>
        </div>

        <div className="p-6 space-y-5 text-left">
          {configWarning && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold leading-relaxed">
              {configWarning}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Correo electrónico</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="info@ramondelpozorott.es"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Accediendo...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-orange-600 font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/seguridad"
              className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-orange-500 transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              Política de seguridad y privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
