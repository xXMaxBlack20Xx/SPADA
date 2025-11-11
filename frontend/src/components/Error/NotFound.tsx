// src/pages/NotFound.tsx
import { useLanguage } from "../../context/LanguageContext";

type Lang = "es" | "en" | "zh";

const i18n: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    hint: string;
    ctaHome: string;
    ctaSupport: string;
  }
> = {
  es: {
    title: "404 — Página no encontrada",
    subtitle: "La ruta que intentas visitar no existe o fue movida.",
    hint: "Verifica la URL o vuelve al inicio.",
    ctaHome: "Volver al inicio",
    ctaSupport: "Reportar un problema",
  },
  en: {
    title: "404 — Page not found",
    subtitle: "The route you requested doesn’t exist or was moved.",
    hint: "Check the URL or go back home.",
    ctaHome: "Back to home",
    ctaSupport: "Report an issue",
  },
  zh: {
    title: "404 — 未找到页面",
    subtitle: "你请求的页面不存在或已被移动。",
    hint: "请检查链接，或返回首页。",
    ctaHome: "返回首页",
    ctaSupport: "报告问题",
  },
};

export default function NotFound() {
  const { lang } = useLanguage();
  const t = i18n[lang];

  return (
    <main
      className="relative isolate min-h-[100svh] bg-[#1a1d21] text-white grid place-items-center px-6"
      aria-labelledby="notfound-title"
      role="main"
    >
      {/* Fondo grid sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.50]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.10) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow radial superior */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(168,85,247,.15) 0%, rgba(26,29,33,0) 70%)",
        }}
      />

      {/* Contenido centrado */}
      <section className="relative z-10 w-full max-w-4xl text-center space-y-5">
        <h1
          id="notfound-title"
          className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_0_16px_rgba(0,0,0,0.35)]"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #A855F7, #22D3EE 40%, #34D399 70%, #F97316 100%)",
            }}
          >
            {t.title}
          </span>
        </h1>

        <p className="text-white/80 text-base md:text-lg">{t.subtitle}</p>
        <p className="text-white/60 text-sm">{t.hint}</p>

        {/* Botones */}
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/10"
          >
            {/* Home icon */}
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 10v10h14V10" />
            </svg>
            {t.ctaHome}
          </a>

          <a
            href="/support"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition
                       border border-transparent
                       [background:linear-gradient(#1a1d21,#1a1d21)_padding-box,linear-gradient(90deg,#A855F7,#22D3EE,#34D399,#F97316)_border-box]
                       hover:opacity-90"
          >
            {/* Bug icon */}
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M8 4h8" />
              <path d="M9 4v3a3 3 0 1 0 6 0V4" />
              <rect x="6" y="9" width="12" height="10" rx="3" />
              <path d="M4 13h2m12 0h2M3 17h3m12 0h3" />
            </svg>
            {t.ctaSupport}
          </a>
        </div>
      </section>
    </main>
  );
}
