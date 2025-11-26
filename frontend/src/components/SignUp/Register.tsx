import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { signup } from '../../api/serviceAuth/authApi';
import background from '../../assets/img/sign/background.webp';

type Lang = 'es' | 'en' | 'zh';

const i18n: Record<Lang, any> = {
    es: {
        headline: 'Crea tu cuenta',
        cta: 'Registrarme',
        altCta: 'Registrarte con Google',
        helper: 'Al continuar aceptas nuestros',
        termsA: 'Términos',
        termsB: 'Privacidad',
        haveAccount: '¿Ya tienes cuenta?',
        signin: 'Inicia sesión',
        back: 'Volver al inicio',
        labels: {
            name: 'Nombre de usuario',
            email: 'Correo electrónico',
            password: 'Contraseña',
            confirm: 'Confirmar contraseña',
            placeholderName: 'usuario',
            placeholderEmail: 'tu@correo.com',
            placeholderPass: '••••••••',
        },
        hints: {
            password: 'Mín. 8 caracteres. Usa mayúsculas, minúsculas, número y símbolo.',
            mismatch: 'Las contraseñas no coinciden.',
            required: 'Completa todos los campos obligatorios.',
            terms: 'Debes aceptar los Términos y la Privacidad.',
        },
    },
    en: {
        headline: 'Create your account',
        cta: 'Sign up',
        altCta: 'Continue with Google',
        helper: 'By continuing you agree to our',
        termsA: 'Terms',
        termsB: 'Privacy',
        haveAccount: 'Already have an account?',
        signin: 'Sign in',
        back: 'Back to home',
        labels: {
            name: 'User name',
            email: 'Email',
            password: 'Password',
            confirm: 'Confirm password',
            placeholderName: 'user',
            placeholderEmail: 'you@example.com',
            placeholderPass: '••••••••',
        },
        hints: {
            password: 'Min 8 chars. Use uppercase, lowercase, number & symbol.',
            mismatch: 'Passwords do not match.',
            required: 'Please fill all required fields.',
            terms: 'You must accept Terms and Privacy.',
        },
    },
    zh: {
        headline: '创建账户',
        cta: '注册',
        altCta: '使用 Google 继续',
        helper: '继续即表示你同意我们的',
        termsA: '条款',
        termsB: '隐私政策',
        haveAccount: '已经有账号？',
        signin: '登录',
        back: '返回首页',
        labels: {
            name: '用户名',
            email: '邮箱',
            password: '密码',
            confirm: '确认密码',
            placeholderName: '用户',
            placeholderEmail: 'you@example.com',
            placeholderPass: '••••••••',
        },
        hints: {
            password: '至少 8 位，包含大小写、数字和符号。',
            mismatch: '两次输入的密码不一致。',
            required: '请填写所有必填项。',
            terms: '你必须同意条款与隐私。',
        },
    },
};

export default function Register() {
    const { lang } = useLanguage();
    const t = i18n[lang];
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [accept, setAccept] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const canSubmit =
        name.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(email) &&
        pass.length >= 8 &&
        confirm.length >= 8 &&
        pass === confirm &&
        accept;

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (!name || !email || !pass || !confirm) {
            setError(t.hints.required);
            return;
        }
        if (pass !== confirm) {
            setError(t.hints.mismatch);
            return;
        }
        if (!accept) {
            setError(t.hints.terms);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await signup({ name, email, password: pass });
            navigate('/Dashboard');
            return;
        } catch (err: any) {
            setError(err?.message || 'Error al iniciar sesión / Login error / 登录错误');
        } finally {
            setLoading(false);
        }
    }

    const inputClasses = `
        w-full rounded-xl pl-11 pr-10 py-3.5 outline-none
        border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
        border-[color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
        placeholder:text-(--color-text-muted)
        focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
        focus-visible:border-[color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
    `;

    return (
        <section className="relative isolate min-h-screen grid place-items-center overflow-hidden bg-linear-to-b from-[#0B0A17] via-[#121024] to-[#1A132B] text-(--color-text) p-6 md:p-10">
            {/* ===== Background Image ===== */}
            <div className="absolute inset-0 z-0">
                <img
                    src={background}
                    alt="Background"
                    className="h-full w-full object-cover opacity-50"
                />

                <div className="absolute inset-0 bg-linear-to-b from-[#0B0A17]/70 via-[#121024]/80 to-[#1A132B]/90 backdrop-blur-[2px]" />
            </div>

            {/* ===== Card ===== */}
            <main
                className="relative z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl border backdrop-blur-xl
                            bg-[color-mix(in_oklab,var(--color-surface)_68%,transparent)]
                            border-[color-mix(in_oklab,var(--color-text-muted)_22%,transparent)]
                            shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]
                            px-6 py-7 md:px-10 md:py-10 mt-10 mb-10"
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

                <header className="mb-6 text-center">
                    <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white">{t.headline}</h1>
                </header>

                <form className="grid gap-5" onSubmit={onSubmit}>
                    {/* Error message */}
                    {error && (
                        <div className="rounded-xl bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="name"
                            className="text-sm text-[color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                        >
                            {t.labels.name}
                        </label>
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder={t.labels.placeholderName}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                className={inputClasses}
                            />
                            <span
                                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
                                aria-hidden
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="email"
                            className="text-sm text-[color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                        >
                            {t.labels.email}
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t.labels.placeholderEmail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className={inputClasses}
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
                            {t.labels.password}
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPass ? 'text' : 'password'}
                                placeholder={t.labels.placeholderPass}
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                disabled={loading}
                                className={inputClasses}
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
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition"
                                tabIndex={-1}
                            >
                                {showPass ? (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="confirm"
                            className="text-sm text-[color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                        >
                            {t.labels.confirm}
                        </label>
                        <div className="relative">
                            <input
                                id="confirm"
                                name="confirm"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder={t.labels.placeholderPass}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                disabled={loading}
                                className={inputClasses}
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
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition"
                                tabIndex={-1}
                            >
                                {showConfirm ? (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-(--color-text-muted)/70 px-1">
                            {t.hints.password}
                        </p>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 text-sm select-none text-(--color-text-muted) hover:text-white/90 transition-colors cursor-pointer">
                        <div className="relative flex items-center pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={accept}
                                onChange={(e) => setAccept(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border
                                            border-[color-mix(in_oklab,var(--color-text-muted)_50%,transparent)]
                                            bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)]
                                            checked:border-(--color-primary) checked:bg-(--color-primary)
                                            transition-all hover:border-(--color-secondary)"
                            />
                            <svg
                                className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-[calc(50%-2px)] opacity-0 peer-checked:opacity-100 text-[#1A1D21] transition-opacity"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <path
                                    d="M3 7L6 10L11 3.5"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <label htmlFor="terms" className="cursor-pointer">
                            {t.helper}{' '}
                            <a
                                href="#"
                                className="underline decoration-(--color-secondary) underline-offset-4 hover:text-white transition"
                            >
                                {t.termsA}
                            </a>{' '}
                            &{' '}
                            <a
                                href="#"
                                className="underline decoration-(--color-secondary) underline-offset-4 hover:text-white transition"
                            >
                                {t.termsB}
                            </a>
                            .
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit || loading}
                        className="rounded-xl px-4 py-3.5 font-bold w-full
                        bg-(--color-primary) text-[#1A1D21]
                        shadow-[0_14px_28px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]
                        hover:shadow-[0_18px_36px_-12px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]
                        hover:ring-4 hover:ring-[color-mix(in_oklab,var(--color-primary)_22%,transparent)]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                        transition mt-2"
                    >
                        {loading ? '...' : t.cta}
                    </button>

                    <p className="text-sm text-(--color-text-muted) text-center mt-2">
                        {t.haveAccount}{' '}
                        <Link
                            to="/login"
                            className="text-(--color-secondary) hover:underline underline-offset-4 font-medium"
                        >
                            {t.signin}
                        </Link>
                    </p>
                </form>
            </main>
        </section>
    );
}
