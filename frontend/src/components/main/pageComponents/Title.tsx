import { useLanguage } from "../../../context/LanguageContext";

type Lang = "es" | "en" | "zh";

const i18n: Record<
  Lang,
  {
    brandTag: string;
    headline: string;
    sub: string;
    cta?: string;
  }
> = {
  es: {
    brandTag: "SPADA — Predicción Deportiva • IA",
    headline: "Deja de jugar con fuego y entra al juego",
    sub: "Utiliza análisis estadístico e inteligencia artificial para mejorar tus decisiones en el mundo de las apuestas deportivas.",
    cta: "Empieza ahora",
  },
  en: {
    brandTag: "SPADA — Sports Prediction • AI",
    headline: "Stop playing with fire and get in to the game",
    sub: "Use statistical analysis and AI to make smarter decisions in the world of sports betting.",
    cta: "Get started",
  },
  zh: {
    brandTag: "SPADA — 体育预测 • 人工智能",
    headline: "别再玩火了，真正加入比赛",
    sub: "运用统计分析与人工智能，让你的体育博彩决策更聪明。",
    cta: "立即开始",
  },
};

export default function HeroSplash() {
  const { lang } = useLanguage();
  const t = i18n[lang];

  return (
    <section
      id="inicio"
      className="relative isolate min-h-[92vh] pt-28 flex items-center overflow-hidden
                 bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B]"
      aria-labelledby="hero-title"
    >
      {/* --- Background FX: soft glow + gradient beams --- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Halo central */}
        <div
          className="absolute -inset-x-32 top-16 h-[38rem] blur-3xl opacity-40
                     bg-[radial-gradient(60rem_30rem_at_50%_0%,rgba(168,85,247,0.35),transparent_60%)]"
        />
        {/* Barrido diagonal */}
        <div
          className="absolute -right-32 top-24 w-[60rem] h-[60rem] rotate-12 blur-2xl opacity-20
                     bg-[conic-gradient(from_180deg_at_50%_50%,#A855F7_0deg,#7C3AED_120deg,#F97316_240deg,#A855F7_360deg)] animate-slow-spin"
        />
        {/* Línea glow superior (match con tu header) */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]
                     bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#F97316] opacity-60"
        />
      </div>

      {/* --- Content --- */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        {/* Tag mini */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10
                     bg-white/5 px-3 py-1 text-[11px] uppercase tracking-widest text-white/70
                     backdrop-blur animate-fade-in mx-auto"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#F97316] shadow-[0_0_10px_2px_rgba(249,115,22,0.35)]" />
          {t.brandTag}
        </div>

        {/* Headline (blanco y centrado) */}
        <h1
          id="hero-title"
          className="text-balance text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]
                     text-white drop-shadow-[0_0_16px_rgba(0,0,0,0.35)] animate-rise"
        >
          <span className="relative inline-block">
            {t.headline}
            {/* Glow underline */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-3 left-0 h-[5px] w-full rounded-full
                         bg-gradient-to-r from-[#A855F7] via-[#7C3AED] to-[#F97316]
                         blur-[2px] opacity-80"
            />
            {/* Shimmer */}
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent
                         [mask-image:linear-gradient(90deg,transparent,black,transparent)]
                         animate-shimmer pointer-events-none"
            />
          </span>
        </h1>

        {/* Subheadline (centrado) */}
        <p
          className="mt-8 mx-auto max-w-3xl text-pretty text-base md:text-lg text-white/80 leading-relaxed
                     animate-fade-up delay-150"
        >
          {t.sub}
        </p>

        {/* Acción principal */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up delay-300">
          <a
            href="#signup"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold
                       bg-gradient-to-r from-[#F97316] via-[#7C3AED] to-[#A855F7]
                       hover:brightness-110 transition
                       shadow-[0_0_24px_rgba(249,115,22,0.25)]"
          >
            {t.cta ?? "Comenzar"}
          </a>
        </div>
      </div>

      {/* CSS-in-component para animaciones sin libs extra */}
      <style>{`
        @keyframes rise {
          0% { opacity: 0; transform: translateY(14px) scale(0.98); filter: blur(1px); }
          60% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 1; }
        }
        .animate-rise { animation: rise 900ms cubic-bezier(.2,.8,.2,1) both; }

        @keyframes fadein {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadein 600ms ease-out both; }
        .animate-fade-up { animation: fadein 700ms ease-out both; }
        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-10deg); }
          60% { transform: translateX(100%) skewX(-10deg); }
          100% { transform: translateX(100%) skewX(-10deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s ease-in-out 400ms 1;
          mix-blend-mode: screen;
        }

        @keyframes slowspin {
          from { transform: rotate(0deg) }
          to { transform: rotate(360deg) }
        }
        .animate-slow-spin { animation: slowspin 18s linear infinite; }
      `}</style>
    </section>
  );
}
