import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { signup } from "../../api/auth"; // Correct API import

type Lang = "es" | "en" | "zh";

const i18n: Record<Lang, any> = {
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

    // Client-side validation
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
      // Call backend API
      await signup({ name, email, password: pass });
      navigate("/login"); // Redirect to login page
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative isolate min-h-screen grid place-items-center overflow-hidden bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B] text-[var(--color-text)] p-6 md:p-10">
      {/* Card */}
      <main className="relative z-10 w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl border backdrop-blur-xl bg-[color:color-mix(in_oklab,var(--color-surface)_68%,transparent)] border-[color:color-mix(in_oklab,var(--color-text-muted)_22%,transparent)] shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] px-6 py-7 md:px-10 md:py-10 mt-20">
        <button onClick={() => navigate("/")} className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition" aria-label={t.back}>
          ← {t.back}
        </button>

        <header className="mb-6 text-center">
          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white">{t.headline}</h1>
        </header>

        <form className="grid gap-5" onSubmit={onSubmit}>
          {/* Name */}
          <div className="grid gap-2">
            <label htmlFor="name">{t.labels.name}</label>
            <input id="name" name="name" type="text" placeholder={t.labels.placeholderName} value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <label htmlFor="email">{t.labels.email}</label>
            <input id="email" name="email" type="email" placeholder={t.labels.placeholderEmail} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <label htmlFor="password">{t.labels.password}</label>
            <input id="password" name="password" type={showPass ? "text" : "password"} placeholder={t.labels.placeholderPass} value={pass} onChange={(e) => setPass(e.target.value)} />
            <button type="button" onClick={() => setShowPass((v) => !v)}>
              {showPass ? "Hide" : "Show"}
            </button>
            <p>{t.hints.password}</p>
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <label htmlFor="confirm">{t.labels.confirm}</label>
            <input id="confirm" name="confirm" type={showConfirm ? "text" : "password"} placeholder={t.labels.placeholderPass} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)}>
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 text-sm select-none">
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
            <span>{t.helper} <a href="#">{t.termsA}</a> & <a href="#">{t.termsB}</a>.</span>
          </label>

          {/* Error */}
          {error && <div role="alert" className="text-red-500">{error}</div>}

          {/* Submit */}
          <button type="submit" disabled={!canSubmit || loading}>
            {loading ? "Loading..." : t.cta}
          </button>

          <p className="text-xs text-center">
            {t.haveAccount} <Link to="/login">{t.signin}</Link>
          </p>
        </form>
      </main>
    </section>
  );
}
