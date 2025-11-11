import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

type Lang = "es" | "en" | "zh";
const i18n: Record<
  Lang,
  {
    headline: string;
    cta: string;
    altCta: string;
    helper: string;
    termsA: string;
    termsB: string;
    haveAccount: string;
    signin: string;
    back: string;
    labels: {
      name: string;
      email: string;
      password: string;
      confirm: string;
      placeholderName: string;
      placeholderEmail: string;
      placeholderPass: string;
    };
    hints: {
      password: string;
      mismatch: string;
      required: string;
      terms: string;
    };
  }
> = {
  es: {
    headline: "Crea tu cuenta",
    cta: "Registrarme",
    altCta: "Registrarte con Google",
    helper: "Al continuar aceptas nuestros",
    termsA: "Términos",
    termsB: "Privacidad",
    haveAccount: "¿Ya tienes cuenta?",
    signin: "Inicia sesión",
    back: "Volver al inicio",
    labels: {
      name: "Nombre completo",
      email: "Correo electrónico",
      password: "Contraseña",
      confirm: "Confirmar contraseña",
      placeholderName: "Tu nombre y apellidos",
      placeholderEmail: "tu@correo.com",
      placeholderPass: "••••••••",
    },
    hints: {
      password:
        "Mín. 8 caracteres. Usa mayúsculas, minúsculas, número y símbolo.",
      mismatch: "Las contraseñas no coinciden.",
      required: "Completa todos los campos obligatorios.",
      terms: "Debes aceptar los Términos y la Privacidad.",
    },
  },
  en: {
    headline: "Create your account",
    cta: "Sign up",
    altCta: "Continue with Google",
    helper: "By continuing you agree to our",
    termsA: "Terms",
    termsB: "Privacy",
    haveAccount: "Already have an account?",
    signin: "Sign in",
    back: "Back to home",
    labels: {
      name: "Full name",
      email: "Email",
      password: "Password",
      confirm: "Confirm password",
      placeholderName: "Your first and last name",
      placeholderEmail: "you@example.com",
      placeholderPass: "••••••••",
    },
    hints: {
      password: "Min 8 chars. Use uppercase, lowercase, number & symbol.",
      mismatch: "Passwords do not match.",
      required: "Please fill all required fields.",
      terms: "You must accept Terms and Privacy.",
    },
  },
  zh: {
    headline: "创建账户",
    cta: "注册",
    altCta: "使用 Google 继续",
    helper: "继续即表示你同意我们的",
    termsA: "条款",
    termsB: "隐私政策",
    haveAccount: "已经有账号？",
    signin: "登录",
    back: "返回首页",
    labels: {
      name: "姓名",
      email: "邮箱",
      password: "密码",
      confirm: "确认密码",
      placeholderName: "你的姓名",
      placeholderEmail: "you@example.com",
      placeholderPass: "••••••••",
    },
    hints: {
      password: "至少 8 位，包含大小写、数字和符号。",
      mismatch: "两次输入的密码不一致。",
      required: "请填写所有必填项。",
      terms: "你必须同意条款与隐私。",
    },
  },
};

export default function Register() {
  const { lang } = useLanguage();
  const t = i18n[lang];
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(email) &&
    pass.length >= 8 &&
    confirm.length >= 8 &&
    pass === confirm &&
    accept;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // Validación mínima en cliente
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

    // Aquí integrarías tu lógica real de registro (API, auth provider, etc.)
    // Por ahora solo navegamos a /login (o al dashboard) como ejemplo:
    navigate("/login");
  }

  return (
    <section
      className="relative isolate min-h-screen grid place-items-center overflow-hidden
                 bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B] text-[var(--color-text)] p-6 md:p-10"
    >
      {/* ===== Background FX ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#F97316] opacity-60" />
        <div
          className="absolute -inset-x-32 top-10 h-[34rem] blur-3xl opacity-40
                     bg-[radial-gradient(60rem_30rem_at_50%_0%,rgba(168,85,247,0.35),transparent_60%)]"
        />
        <div
          className="absolute -right-32 top-16 w-[60rem] h-[60rem] rotate-12 blur-2xl opacity-20
                     bg-[conic-gradient(from_180deg_at_50%_50%,#A855F7_0deg,#7C3AED_120deg,#F97316_240deg,#A855F7_360deg)]
                     animate-[spin_18s_linear_infinite]"
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(to right, color-mix(in oklab, var(--color-surface) 45%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in oklab, var(--color-surface) 45%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px, 48px 48px",
            maskImage:
              "radial-gradient(1200px 700px at 50% 20%, #000 60%, transparent 90%)",
          }}
        />
        <div
          className="absolute w-[38vmax] h-[38vmax] -top-10 -left-10 rounded-full blur-[40px] mix-blend-screen opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--color-primary), transparent 60%)",
            animation: "float1 12s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute w-[38vmax] h-[38vmax] -bottom-16 -right-12 rounded-full blur-[40px] mix-blend-screen opacity-30"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, var(--color-secondary), transparent 60%)",
            animation: "float2 14s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,\
            <svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>\
            <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>\
            <feColorMatrix type='saturate' values='0'/><feComponentTransfer>\
            <feFuncA type='table' tableValues='0 0 0 0 .02 .03 .04 .05 .06 .07 .08 .09 .1 .12 .14 .16'/></feComponentTransfer></filter>\
            <rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* ===== Card ===== */}
      <main
        className="relative z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl border backdrop-blur-xl
                   bg-[color:color-mix(in_oklab,var(--color-surface)_68%,transparent)]
                   border-[color:color-mix(in_oklab,var(--color-text-muted)_22%,transparent)]
                   shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]
                   px-6 py-7 md:px-10 md:py-10 mt-20"
        role="main"
      >
        <button
          onClick={() => navigate("/")}
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
        <h2 className="sr-only">Signup form</h2>
        <form
          className="grid gap-5"
          aria-describedby="form-hint"
          onSubmit={onSubmit}
        >
          {/* Name */}
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm text-[color:color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
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
                className="w-full rounded-xl pl-11 pr-4 py-3.5 outline-none
                           border bg-[color:color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                           border-[color:color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                           placeholder:text-[var(--color-text-muted)]
                           focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                           focus-visible:border-[color:color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                           transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
                aria-hidden
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
              className="text-sm text-[color:color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
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
                className="w-full rounded-xl pl-11 pr-4 py-3.5 outline-none
                           border bg-[color:color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                           border-[color:color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                           placeholder:text-[var(--color-text-muted)]
                           focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                           focus-visible:border-[color:color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                           transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="text-sm text-[color:color-mix(in_oklab,var(--color-text)_85%,var(--color-text-muted))]"
            >
              {t.labels.password}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder={t.labels.placeholderPass}
                autoComplete="new-password"
                className="w-full rounded-xl pl-11 pr-11 py-3.5 outline-none
                           border bg-[color:color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                           border-[color:color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                           placeholder:text-[var(--color-text-muted)]
                           focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                           focus-visible:border-[color:color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                           transition"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
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
                aria-label={showPass ? "Hide password" : "Show password"}
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
            <p className="text-xs text-[var(--color-text-muted)]">
              {t.hints.password}
            </p>
          </div>

          {/* Confirm Password */}
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
                type={showConfirm ? "text" : "password"}
                placeholder={t.labels.placeholderPass}
                autoComplete="new-password"
                className="w-full rounded-xl pl-11 pr-11 py-3.5 outline-none
                           border bg-[color:color-mix(in_oklab,var(--color-surface)_78%,transparent)]
                           border-[color:color-mix(in_oklab,var(--color-text-muted)_30%,transparent)]
                           placeholder:text-[var(--color-text-muted)]
                           focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_oklab,var(--color-secondary)_25%,transparent)]
                           focus-visible:border-[color:color-mix(in_oklab,var(--color-secondary)_70%,transparent)]
                           transition"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
                aria-hidden
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
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

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 text-sm select-none">
            <input
              type="checkbox"
              className="mt-1 accent-[var(--color-primary)]"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
            />
            <span className="text-[var(--color-text-muted)]">
              {t.helper}{" "}
              <a
                href="#"
                className="underline decoration-[var(--color-secondary)] underline-offset-4"
              >
                {t.termsA}
              </a>{" "}
              &{" "}
              <a
                href="#"
                className="underline decoration-[var(--color-secondary)] underline-offset-4"
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
            className="rounded-xl px-4 py-3.5 font-bold w-full
                       bg-[var(--color-primary)] text-[#1A1D21]
                       shadow-[0_14px_28px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]
                       hover:shadow-[0_18px_36px_-12px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]
                       hover:ring-4 hover:ring-[color:color-mix(in_oklab,var(--color-primary)_22%,transparent)]
                       transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!canSubmit}
          >
            {t.cta}
          </button>

          {/* Separador “o” */}
          <div className="relative my-1.5 text-center">
            <span
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/10"
              aria-hidden
            />
            <span className="relative z-10 inline-block bg-[color:color-mix(in_oklab,var(--color-surface)_68%,transparent)] px-3 text-xs text-white/60">
              o
            </span>
          </div>

          {/* Google */}
          <button
            type="button"
            className="rounded-xl px-4 py-3.5 font-semibold w-full
                       border bg-transparent text-[var(--color-text)]
                       border-[color:color-mix(in_oklab,var(--color-text-muted)_28%,transparent)]
                       hover:bg=[color:color-mix(in_oklab,var(--color-surface)_60%,transparent)]
                       hover:border-[color:color-mix(in_oklab,var(--color-secondary)_40%,transparent)]
                       hover:shadow-[0_8px_24px_-14px_color-mix(in_oklab,var(--color-secondary)_45%,transparent)]
                       transition flex items-center justify-center gap-2"
            onClick={() => {
              /* aquí iría tu provider de Google */
            }}
          >
            <span
              aria-hidden
              className="inline-block w-[0.95em] h-[0.95em] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #4285F4 0 25%, #34A853 0 50%, #FBBC05 0 75%, #EA4335 0 100%)",
                boxShadow:
                  "0 0 0 2px color-mix(in oklab, var(--color-surface) 60%, transparent)",
              }}
            />
            {t.altCta}
          </button>

          {/* Helper + links */}
          <p
            id="form-hint"
            className="mt-1 text-xs text-[var(--color-text-muted)] text-center"
          >
            {t.haveAccount}{" "}
            <Link
              to="/login"
              className="text-[var(--color-secondary)] hover:underline underline-offset-4"
            >
              {t.signin}
            </Link>
          </p>
        </form>
      </main>

      {/* Keyframes */}
      <style>{`
        @keyframes float1 { from { transform: translateY(0px); } to { transform: translateY(24px); } }
        @keyframes float2 { from { transform: translateY(0px); } to { transform: translateY(-28px); } }
        @keyframes fadein { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-10deg); }
          60% { transform: translateX(100%) skewX(-10deg); }
          100% { transform: translateX(100%) skewX(-10deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="feTurbulence"], [style*="radial-gradient"], [class*="animate-["] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
