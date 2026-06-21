'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogIn, Shield, Eye, EyeOff, Fingerprint, ScanFace } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BIOMETRIC_QUICK_ACCESS } from '@/lib/auth-credentials';
import {
  fetchBiometricStatus,
  hasLocalPasskey,
  isWebAuthnSupported,
  markLocalPasskey,
  registerPasskey,
} from '@/lib/passkey-client';

export default function LoginPage() {
  const { login, loginWithBiometric } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioSupported, setBioSupported] = useState(false);
  const [localPasskeys, setLocalPasskeys] = useState<Record<string, boolean>>({});
  const [setupUser, setSetupUser] = useState<(typeof BIOMETRIC_QUICK_ACCESS)[number] | null>(null);
  const [setupPassword, setSetupPassword] = useState('');
  const [bioLoading, setBioLoading] = useState<string | null>(null);

  useEffect(() => {
    isWebAuthnSupported().then(setBioSupported);
    fetchBiometricStatus().then(() => {
      const local: Record<string, boolean> = {};
      for (const user of BIOMETRIC_QUICK_ACCESS) {
        local[user.email] = hasLocalPasskey(user.email);
      }
      setLocalPasskeys(local);
    });
  }, []);

  const canEnterWithBiometric = (userEmail: string) => hasLocalPasskey(userEmail);

  const openSetup = (userEmail: string) => {
    const user = BIOMETRIC_QUICK_ACCESS.find((u) => u.email === userEmail);
    if (user) setSetupUser(user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas. Verifica email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async (userEmail: string) => {
    setError('');
    setBioLoading(userEmail);
    try {
      if (!canEnterWithBiometric(userEmail)) {
        openSetup(userEmail);
        return;
      }
      await loginWithBiometric(userEmail);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      const message = err.message || 'No se pudo completar el acceso biométrico.';
      if (/cancel|abort|not allowed|denied|expired|expirada|reconocida/i.test(message)) {
        setError(`${message} Prueba a configurar de nuevo en este móvil.`);
        openSetup(userEmail);
      } else {
        setError(message);
      }
    } finally {
      setBioLoading(null);
    }
  };

  const handleSetupPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupUser) return;
    setError('');
    setBioLoading(setupUser.email);
    try {
      await registerPasskey(setupUser.email, setupPassword);
      markLocalPasskey(setupUser.email);
      setLocalPasskeys((prev) => ({ ...prev, [setupUser.email]: true }));
      setSetupUser(null);
      setSetupPassword('');
      await loginWithBiometric(setupUser.email);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'No se pudo configurar el acceso biométrico.');
    } finally {
      setBioLoading(null);
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
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {bioSupported && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Acceso rápido — Huella / Face ID
              </p>
              <div className="grid grid-cols-2 gap-3">
                {BIOMETRIC_QUICK_ACCESS.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    disabled={bioLoading !== null}
                    onClick={() => handleBiometricLogin(user.email)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all disabled:opacity-60"
                  >
                    <img src={user.avatar} alt={user.shortName} className="h-10 w-10 rounded-full object-cover border-2 border-white shadow" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{user.shortName}</span>
                    <span className="flex items-center gap-1 text-[10px] text-orange-600 font-semibold">
                      {bioLoading === user.email ? (
                        'Verificando...'
                      ) : canEnterWithBiometric(user.email) ? (
                        <>
                          <Fingerprint className="h-3 w-3" />
                          Entrar
                        </>
                      ) : (
                        <>
                          <ScanFace className="h-3 w-3" />
                          Configurar
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Cada móvil debe configurarse una vez. Pulsa tu avatar, confirma contraseña y registra huella o Face ID en este dispositivo.
              </p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                O con email
              </span>
            </div>
          </div>

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
                placeholder="tu@email.com"
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

      {setupUser && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSetupPasskey}
            className="bg-white dark:bg-slate-900 border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="text-center">
              <ScanFace className="h-10 w-10 text-orange-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white">Activar acceso biométrico</h3>
              <p className="text-xs text-slate-400 mt-1">
                {setupUser.name} — confirma tu contraseña para registrar huella o Face ID en este dispositivo
              </p>
            </div>
            <input
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={setupPassword}
              onChange={(e) => setSetupPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setSetupUser(null); setSetupPassword(''); }}
                className="flex-1 py-2.5 text-sm font-bold text-slate-500 border rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={bioLoading !== null}
                className="flex-1 py-2.5 text-sm font-bold bg-orange-500 text-white rounded-lg disabled:opacity-60"
              >
                {bioLoading ? 'Configurando...' : 'Continuar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
