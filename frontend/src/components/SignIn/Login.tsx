import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext'; // Corregido
import { useAuth } from '../../context/AuthContext'; // Corregido
import { FcGoogle } from 'react-icons/fc';
import background from '@/assets/img/sign/background.webp';

// --- i18n translation object (no changes) ---
type Lang = 'es' | 'en' | 'zh';
const i18n: Record<
    Lang,
    {
        headline: string;
        cta: string;
        altCta: string;
        helper: string;
        termsA: string;
        termsB: string;
        forgot: string;
        signup: string;
        back: string;
    }
> = {
    es: {
        headline: 'Bienvenido de vuelta',
        cta: 'Iniciar sesión',
        altCta: 'Continuar con Google',
        helper: 'Al continuar aceptas nuestros',
        termsA: 'Términos',
        termsB: 'Privacidad',
        forgot: '¿Olvidaste tu contraseña?',
        signup: 'Crear cuenta',
        back: 'Volver al inicio',
    },
    en: {
        headline: 'Welcome back',
        cta: 'Sign in',
        altCta: 'Continue with Google',
        helper: 'By continuing you agree to our',
        termsA: 'Terms',
        termsB: 'Privacy',
        forgot: 'Forgot your password?',
        signup: 'Create account',
        back: 'Back to home',
    },
    zh: {
        headline: '欢迎回来',
        cta: '登录',
        altCta: '使用 Google 继续',
        helper: '继续即表示你同意我们的',
        termsA: '条款',
        termsB: '隐私政策',
        forgot: '忘记密码？',
        signup: '创建账户',
        back: '返回首页',
    },
};
// --- End i18n ---

export default function Login() {
    const { lang } = useLanguage();
    const t = i18n[lang];
    const navigate = useNavigate();

    const { login, isLoading, error: authError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const canSubmit = email.trim().length > 2 && password.length >= 8 && !isLoading;

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        await login(email, password);
    }

    return (
        <section
            className="relative isolate min-h-screen grid place-items-center overflow-hidden
                 text-(--color-text) p-6 md:p-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
            {/* Overlay */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Card */}
            <main
                className="relative mt-10 z-10 w-full max-w-3xl rounded-2xl border overflow-hidden
        bg-[color-mix(in_oklab,var(--color-surface)_97%,transparent)]
        border-[color-mix(in_oklab,var(--color-text-muted)_18%,transparent)]
        shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]
        px-6 py-7 md:px-10 md:py-10"
                role="main"
            >
                <div className="max-w-xl mx-auto">
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition"
                        aria-label={t.back}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="opacity-80"
                        >
                            <path
                                d="M10 19l-7-7 7-7"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M3 12h18"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {t.back}
                    </button>

                    {/* Header */}
                    <header className="mb-6 text-center">
                        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                            {t.headline}
                        </h1>
                    </header>

                    {/* Form */}
                    <form className="grid gap-5" aria-describedby="form-hint" onSubmit={onSubmit}>
                        {/* Email Input */}
                        <div className="grid gap-2">
                            <label
                                htmlFor="email"
                                className="text-sm text-[color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                            >
                                {lang === 'es' ? 'Correo' : lang === 'en' ? 'Email' : '邮箱'}
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={lang === 'es' ? 'tu@correo.com' : 'you@email.com'}
                                    autoComplete="username"
                                    inputMode="email"
                                    className="w-full rounded-xl pl-11 pr-4 h-12 outline-none
                  border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                  border-[color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                  placeholder:text-(--color-text-muted)
                  focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                  focus-visible:border-[color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                  transition"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                <span
                                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
                                    aria-hidden
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M4 8l8 5 8-5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <rect
                                            x="4"
                                            y="5"
                                            width="16"
                                            height="14"
                                            rx="2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="grid gap-2">
                            <label
                                htmlFor="password"
                                className="text-sm text-[color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                            >
                                {lang === 'es' ? 'Contraseña' : lang === 'en' ? 'Password' : '密码'}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl pl-11 pr-11 h-12 outline-none
                  border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                  border-[color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                  placeholder:text-(--color-text-muted)
                  focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                  focus-visible:border-[color-mix(in_oklab,var(--color-secondary)_70%,transparent)] transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <span
                                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
                                    aria-hidden
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <rect
                                            x="4"
                                            y="11"
                                            width="16"
                                            height="9"
                                            rx="2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        />
                                        <path
                                            d="M8 11V8a4 4 0 118 0v3"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                                    onClick={() => setShowPass((v) => !v)}
                                    aria-label={
                                        showPass
                                            ? lang === 'es'
                                                ? 'Ocultar'
                                                : 'Hide'
                                            : lang === 'es'
                                            ? 'Mostrar'
                                            : 'Show'
                                    }
                                    disabled={isLoading}
                                >
                                    {showPass ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M3 3l18 18"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            />
                                            <path
                                                d="M10.58 10.58A3 3 0 0012 15a3 3 0 001.42-.38"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M9.88 5.08A10.94 10.94 0 0121 12c-1.8 3.1-4.9 5.5-9 5.5-1.2 0-2.4-.2-3.5-.6M6.2 6.2A11.3 11.3 0 003 12c1.8 3.1 4.9 5.5 9 5.5"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {authError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-400/40 bg-red-400/10 text-red-200 px-4 py-3 text-sm"
                            >
                                {authError}
                            </div>
                        )}

                        {/* CTA Button */}
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="rounded-xl px-4 h-12 font-bold w-full
              bg-(--color-primary) text-[#1A1D21]
              shadow-[0_14px_28px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]
              hover:shadow-[0_18px_36px_-12px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]
              hover:ring-4 hover:ring-[color-mix(in_oklab,var(--color-primary)_22%,transparent)]
              transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-disabled={!canSubmit}
                        >
                            {isLoading ? '...' : t.cta}
                        </button>

                        {/* Google / Links */}
                        <div className="relative my-1.5 text-center">
                            <span
                                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/10"
                                aria-hidden
                            />
                            <span className="relative z-10 inline-block bg-[color-mix(in_oklab,var(--color-surface)_68%,transparent)] px-3 text-xs text-white/60">
                                o
                            </span>
                        </div>
                        <button
                            type="button"
                            className="rounded-xl px-4 h-12 font-semibold w-full border bg-transparent text-(--color-text) border-[color-mix(in_oklab,var(--color-text-muted)_28%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)] hover:border-[color-mix(in_oklab,var(--color-secondary)_40%,transparent)] hover:shadow-[0_8px_24px_-14px_color-mix(in_oklab,var(--color-secondary)_45%,transparent)] transition flex items-center justify-center gap-2"
                            onClick={() => {}}
                            disabled={isLoading}
                        >
                            <FcGoogle size={24} />
                            {t.altCta}
                        </button>
                        <p
                            id="form-hint"
                            className="mt-1 text-xs text-(--color-text-muted) text-center"
                        >
                            {t.helper}{' '}
                            <a
                                href="#"
                                className="underline decoration-(--color-secondary) underline-offset-4"
                            >
                                {t.termsA}
                            </a>{' '}
                            &{' '}
                            <a
                                href="#"
                                className="underline decoration-(--color-secondary) underline-offset-4"
                            >
                                {t.termsB}
                            </a>
                            .
                        </p>
                        <nav className="mt-1 flex items-center justify-center gap-3 text-sm">
                            <Link
                                to="/forgot"
                                className="text-(--color-secondary) hover:underline underline-offset-4"
                            >
                                {t.forgot}
                            </Link>
                            <span aria-hidden className="text-(--color-text-muted)">
                                •
                            </span>
                            <Link
                                to="/signup"
                                className="text-(--color-secondary) hover:underline underline-offset-4"
                            >
                                {t.signup}
                            </Link>
                        </nav>
                    </form>
                </div>
            </main>
        </section>
    );
}
