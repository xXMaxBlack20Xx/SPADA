import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import background from '@/assets/img/sign/background.webp';
import { FcGoogle } from 'react-icons/fc';

const t = {
    headline: 'Crea tu cuenta',
    cta: 'Registrarme',
    registering: 'Registrando...',
    altCta: 'Registrarte con Google',
    helper: 'Al continuar aceptas nuestros',
    termsA: 'Términos',
    termsB: 'Privacidad',
    haveAccount: '¿Ya tienes cuenta?',
    signin: 'Inicia sesión',
    back: 'Volver al inicio',
    labels: {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        password: 'Contraseña',
        confirm: 'Confirmar contraseña',
        placeholderName: 'Tu nombre y apellidos',
        placeholderEmail: 'tu@correo.com',
        placeholderPass: '••••••••',
    },
    hints: {
        password: 'Mín. 8 caracteres. Usa mayúsculas, minúsculas, número y símbolo.',
        mismatch: 'Las contraseñas no coinciden.',
        required: 'Completa todos los campos obligatorios.',
        terms: 'Debes aceptar los Términos y la Privacidad.',
    },
};

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [accept, setAccept] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const canSubmit =
        name.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(email) &&
        pass.length >= 8 &&
        confirm.length >= 8 &&
        pass === confirm &&
        accept &&
        !isLoading;

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
        setIsLoading(true);

        try {
            const API_URL = '/api/auth/register';
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: pass }),
            });

            if (!response.ok) {
                let errorMessage = `Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message;
                    }
                } catch {
                    errorMessage = `Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            navigate('/login');
        } catch (err: any) {
            console.error('Error en el registro:', err);
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section
            className="relative isolate min-h-screen grid place-items-center overflow-hidden text-(--color-text) p-6 md:p-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
            {/* Overlay para legibilidad */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* CARD ÚNICA, CENTRADA Y SIMÉTRICA */}
            <main
                role="main"
                className=" relative z-10 w-full max-w-3xl
                rounded-2xl border overflow-hidden mt-12
                bg-[color-mix(in_oklab,var(--color-surface)_97%,transparent)]
                border-[color-mix(in_oklab,var(--color-text-muted)_18%,transparent)]
                shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
            >
                <div className="p-7 md:p-10">
                    {/* Contenido centrado a un ancho legible */}
                    <div className="max-w-xl mx-auto">
                        {/* Back */}
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
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {t.headline}
                            </h1>
                            <p className="mt-2 text-sm text-white/70">
                                Accede a métricas avanzadas y picks con una cuenta gratuita.
                            </p>
                        </header>

                        <h2 className="sr-only">Signup form</h2>
                        <form
                            className="grid gap-5"
                            aria-describedby="form-hint"
                            onSubmit={onSubmit}
                        >
                            {/* Fila 1: Name + Email */}
                            <div className="grid gap-5 md:grid-cols-2">
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
                                            autoComplete="name"
                                            className="w-full rounded-xl pl-11 pr-4 h-12 outline-none
                                            border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                                            border-[color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                                            placeholder:text-(--color-text-muted)
                                            focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                                            focus-visible:border-[color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                                            transition"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={isLoading}
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
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="8"
                                                    r="4"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                />
                                                <path
                                                    d="M4 21c1.5-3.5 4.5-5.5 8-5.5s6.5 2 8 5.5"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
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
                                            autoComplete="email"
                                            inputMode="email"
                                            className="w-full rounded-xl pl-11 pr-4 h-12 outline-none
                                            border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                                            border-[color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                                            placeholder:text-(--color-text-muted)
                                            focus-visible:ring-4 focus-visible:ring-[color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                                            focus-visible:border-[color-mix(in_oklab,var(--color-secondary)_70%,transparent)] transition"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
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
                                            >
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
                            </div>

                            {/* Fila 2: Password + Confirm */}
                            <div className="grid gap-5 md:grid-cols-2">
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
                                            autoComplete="new-password"
                                            className="w-full rounded-xl pl-11 pr-11 h-12 outline-none
                                            border bg-[color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                        border-[color:color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                        placeholder:text-[var(--color-text-muted)]
                        focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                        focus-visible:border-[color:color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                        transition"
                                            value={pass}
                                            onChange={(e) => setPass(e.target.value)}
                                            disabled={isLoading}
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
                                            >
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
                                                    ? 'Ocultar contraseña'
                                                    : 'Mostrar contraseña'
                                            }
                                            disabled={isLoading}
                                        >
                                            {showPass ? (
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
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
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
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
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {t.hints.password}
                                    </p>
                                </div>

                                {/* Confirm */}
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="confirm"
                                        className="text-sm text-[color:color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
                                    >
                                        {t.labels.confirm}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirm"
                                            name="confirm"
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder={t.labels.placeholderPass}
                                            autoComplete="new-password"
                                            className="w-full rounded-xl pl-11 pr-11 h-12 outline-none
                        border bg-[color:color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                        border-[color:color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                        placeholder:text-[var(--color-text-muted)]
                        focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                        focus-visible:border-[color:color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                        transition"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            disabled={isLoading}
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
                                            >
                                                <path
                                                    d="M12 1v22M1 12h22"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </span>
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                                            onClick={() => setShowConfirm((v) => !v)}
                                            aria-label={
                                                showConfirm
                                                    ? 'Ocultar contraseña'
                                                    : 'Mostrar contraseña'
                                            }
                                            disabled={isLoading}
                                        >
                                            {showConfirm ? (
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
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
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
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
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-3 text-sm select-none">
                                <input
                                    type="checkbox"
                                    className="mt-1 accent-(--color-primary)"
                                    checked={accept}
                                    onChange={(e) => setAccept(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <span className="text-(--color-text-muted)">
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
                                </span>
                            </label>

                            {/* Error */}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-400/40 bg-red-400/10 text-red-200 px-4 py-3 text-sm"
                                >
                                    {error}
                                </div>
                            )}

                            {/* CTA principal */}
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="rounded-xl px-4 h-12 font-bold w-full
                                bg-(--color-primary) text-[#1A1D21]
                                shadow-[0_14px_28px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]
                                hover:shadow-[0_18px_36px_-12px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]
                                hover:ring-4 hover:ring-[color:color-mix(in_oklab,var(--color-primary)_22%,transparent)]
                                transition disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-disabled={!canSubmit}
                            >
                                {isLoading ? t.registering : t.cta}
                            </button>

                            {/* Separador “o” */}
                            <div className="relative my-1.5 text-center">
                                <span
                                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/10"
                                    aria-hidden
                                />
                                <span className="relative z-10 inline-block bg-[color-mix(in_oklab,var(--color-surface)_68%,transparent)] px-3 text-xs text-white/60">
                                    o
                                </span>
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                className="rounded-xl px-4 h-12 font-semibold w-full
                                border bg-transparent text-[var(--color-text)]
                                border-[color-mix(in_oklab,var(--color-text-muted)_28%,transparent)]
                                hover:bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)]
                                hover:border-[color-mix(in_oklab,var(--color-secondary)_40%,transparent)]
                                hover:shadow-[0_8px_24px_-14px_color-mix(in_oklab,var(--color-secondary)_45%,transparent)]
                                transition flex items-center justify-center gap-2"
                                onClick={() => {
                                    /* provider Google */
                                }}
                                disabled={isLoading}
                            >
                                <FcGoogle size={24} />
                                {t.altCta}
                            </button>

                            {/* Helper + links */}
                            <p
                                id="form-hint"
                                className="mt-1 text-xs text-(--color-text-muted) text-center"
                            >
                                {t.haveAccount}{' '}
                                <Link
                                    to="/login"
                                    className="text-(--color-secondary) hover:underline underline-offset-4"
                                >
                                    {t.signin}
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </section>
    );
}
