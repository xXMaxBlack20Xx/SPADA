import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import GameList from "../Predictions/predNFL";
import HistoricalNFL from "../Historical/historicalNFL";

type Lang = "es" | "en" | "zh";
const i18n: Record<
  Lang,
  {
    heroTitle: string;
    heroSub: string;
    ctaLogin: string;
    ctaSignup: string;
    tilesTitle: string;
    tiles: {
      key: "realtime" | "filters" | "openaccess";
      label: string;
      caption: string;
    }[];
  }
> = {
  es: {
    heroTitle: "SPADA — Predicción Deportiva • IA",
    heroSub:
      "Placeholder de inicio. Aquí vivirá el dashboard después del login.",
    ctaLogin: "Iniciar sesión",
    ctaSignup: "Crear cuenta",
    tilesTitle: "Capacidades (demo)",
    tiles: [
      {
        key: "realtime",
        label: "Predicciones en tiempo real",
        caption: "Modelos actualizados sin restricciones.",
      },
      {
        key: "filters",
        label: "Filtros inteligentes",
        caption: "Jugador, liga, fecha y tendencias.",
      },
      {
        key: "openaccess",
        label: "Acceso abierto",
        caption: "Sin paywalls ni suscripciones.",
      },
    ],
  },
  en: {
    heroTitle: "SPADA — Sports Prediction • AI",
    heroSub: "Home placeholder. Your dashboard will live here after login.",
    ctaLogin: "Sign in",
    ctaSignup: "Create account",
    tilesTitle: "Capabilities (demo)",
    tiles: [
      {
        key: "realtime",
        label: "Real-time predictions",
        caption: "Continuously updated, no limits.",
      },
      {
        key: "filters",
        label: "Smart filters",
        caption: "Player, league, date & trends.",
      },
      {
        key: "openaccess",
        label: "Open access",
        caption: "No paywalls or subscriptions.",
      },
    ],
  },
  zh: {
    heroTitle: "SPADA — 体育预测 • AI",
    heroSub: "首页占位符。登录后这里将显示仪表板。",
    ctaLogin: "登录",
    ctaSignup: "创建账户",
    tilesTitle: "功能（演示）",
    tiles: [
      { key: "realtime", label: "实时预测", caption: "持续更新，无限制。" },
      {
        key: "filters",
        label: "智能筛选",
        caption: "球员、联赛、日期与趋势。",
      },
      { key: "openaccess", label: "开放访问", caption: "无付费墙与订阅。" },
    ],
  },
};

export default function mainHome() {
  const { lang } = useLanguage();
  const t = i18n[lang];
  const navigate = useNavigate();

  return (
    <section
      className="relative isolate min-h-screen overflow-hidden
                 bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B]
                 text-[var(--color-text)]"
      role="main"
    >
      {/* ===== Background FX (consistente con Login/Register) ===== */}
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

      {/* ===== Contenido ===== */}
      <div className="relative z-10 px-6 md:px-10">
        {/* Hero */}
        <header className="max-w-4xl mx-auto pt-24 md:pt-32 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            {t.heroTitle}
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg">{t.heroSub}</p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-5 py-3 font-bold
                         bg-[var(--color-primary)] text-[#1A1D21]
                         shadow-[0_14px_28px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]
                         hover:shadow-[0_18px_36px_-12px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]
                         hover:ring-4 hover:ring-[color:color-mix(in_oklab,var(--color-primary)_22%,transparent)]
                         transition"
            >
              {t.ctaLogin}
            </button>
            <Link
              to="/signup"
              className="rounded-xl px-5 py-3 font-semibold
                         border bg-transparent text-[var(--color-text)]
                         border-[color:color-mix(in_oklab,var(--color-text-muted)_28%,transparent)]
                         hover:bg-[color:color-mix(in_oklab,var(--color-surface)_60%,transparent)]
                         hover:border-[color:color-mix(in_oklab,var(--color-secondary)_40%,transparent)]
                         hover:shadow-[0_8px_24px_-14px_color-mix(in_oklab,var(--color-secondary)_45%,transparent)]
                         transition"
            >
              {t.ctaSignup}
            </Link>
          </div>
        </header>

        {/* Tiles / features de relleno */}
        <section className="max-w-5xl mx-auto mt-16 md:mt-24">
          <h2 className="text-center text-sm tracking-wider uppercase text-white/60">
            {t.tilesTitle}
          </h2>
          <ul className="mt-6 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {t.tiles.map((item) => (
              <li
                key={item.key}
                className="rounded-2xl border backdrop-blur-xl p-5 md:p-6
                           bg-[color:color-mix(in_oklab,var(--color-surface)_68%,transparent)]
                           border-[color:color-mix(in_oklab,var(--color-text-muted)_22%,transparent)]
                           shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]
                           hover:shadow-[0_16px_48px_-14px_color-mix(in_oklab,var(--color-secondary)_45%,transparent)]
                           transition"
              >
                <div className="flex items-start gap-3">
                  <span aria-hidden className="mt-1 opacity-80">
                    {/* Ícono simple por key */}
                    {item.key === "realtime" && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 12h6l4 8 4-16 4 8h-6"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {item.key === "filters" && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 5h18M6 12h12M10 19h4"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {item.key === "openaccess" && (
                      <svg
                        width="20"
                        height="20"
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
                    )}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{item.label}</h3>
                    <p className="text-sm text-white/70">{item.caption}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer mínimo */}
        <footer className="max-w-5xl mx-auto py-12 md:py-16 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} SPADA. Placeholder — conecta tu auth
            para continuar.
          </p>
        </footer>
      </div>

      {/* Keyframes (consistentes) */}
      <style>{`
        @keyframes float1 { from { transform: translateY(0px); } to { transform: translateY(24px); } }
        @keyframes float2 { from { transform: translateY(0px); } to { transform: translateY(-28px); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="feTurbulence"], [style*="radial-gradient"], [class*="animate-["] { animation: none !important; }
        }
      `}</style>

      <GameList/>
      <HistoricalNFL/>
    </section>
  );
}
