import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { login } from '../../api/auth/authApi';
import background from '../../assets/img/sign/background.webp';

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
        error: string;
        loading: string;
        emailLabel: string;
        passwordLabel: string;
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
        error: 'Error al iniciar sesión',
        loading: 'Iniciando sesión...',
        emailLabel: 'Correo electrónico',
        passwordLabel: 'Contraseña',
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
        error: 'Error signing in',
        loading: 'Signing in...',
        emailLabel: 'Email address',
        passwordLabel: 'Password',
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
        error: '登录失败',
        loading: '登录中...',
        emailLabel: '电子邮箱',
        passwordLabel: '密码',
    },
};

export default function Login() {
    const { lang } = useLanguage();
    const t = i18n[lang];
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/Dashboard');
            return;
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión / Login error / 登录错误');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="relative isolate min-h-screen grid place-items-center overflow-hidden bg-linear-to-b from-[#0B0A17] via-[#121024] to-[#1A132B] text-(--color-text) p-6 md:p-10">
            {/* ===== Background Image ===== */}
            <div className="absolute inset-0 z-0">
                <img src={background} alt="Background" className="h-full w-full object-cover" />

                <div className="absolute inset-0 bg-linear-to-b from-[#0B0A17]/70 via-[#121024]/80 to-[#1A132B]/90 backdrop-blur-[2px]" />
            </div>

            {/* ===== Card ===== */}
            <main
                className="relative z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl border backdrop-blur-xl
                            bg-[color-mix(in_oklab,var(--color-surface)_68%,transparent)]
                            border-[color-mix(in_oklab,var(--color-text-muted)_22%,transparent)]
                            shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]
                            px-6 py-7 md:px-10 md:py-10 mt-20"
                role="main"
            >
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
                    <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white">{t.headline}</h1>
                </header>

                {/* Form */}
                <h2 className="sr-only">Login form</h2>
                <form className="grid gap-5" onSubmit={handleSubmit}>
                    {/* Error message */}
                    {error && (
                        <div className="rounded-xl bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Identifier */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="email"
                            className="text-sm text-[color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                        >
                            {t.emailLabel}
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="eje@gmail.com"
                                autoComplete="email"
                                inputMode="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                                className="w-full rounded-xl pl-11 pr-4 py-3.5 outline-none
                                border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                                border-[color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                                placeholder:text-(--color-text-muted) focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                                focus-visible:border-[color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                                disabled:opacity-50 disabled:cursor-not-allowed transition"
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

                    {/* Password */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="password"
                            className="text-sm text-[color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                        >
                            {t.passwordLabel}
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                                className="w-full rounded-xl pl-11 pr-4 py-3.5 outline-none
                                            border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                                            border-[color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                                            placeholder:text-(--color-text-muted)
                                            focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                                            focus-visible:border-[color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            transition"
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
                        </div>
                    </div>

                    {/* CTA principal */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-xl px-4 py-3.5 font-bold w-full
                        bg-(--color-primary) text-[#1A1D21]
                        shadow-[0_14px_28px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]
                        hover:shadow-[0_18px_36px_-12px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]
                        hover:ring-4 hover:ring-[color-mix(in_oklab,var(--color-primary)_22%,transparent)]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                        transition"
                    >
                        {isLoading ? t.loading : t.cta}
                    </button>

                    {/* Helper + links */}
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
            </main>
        </section>
    );
}
