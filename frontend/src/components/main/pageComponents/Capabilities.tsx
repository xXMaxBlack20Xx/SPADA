import type { JSX } from "react";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "es" | "en" | "zh";

const i18n: Record<
  Lang,
  {
    title: string;
    items: {
      key: "realtime" | "filters" | "openaccess";
      label: string;
      caption: string;
    }[];
  }
> = {
  es: {
    title: "Ventajas clave",
    items: [
      {
        key: "realtime",
        label: "Predicciones en tiempo real",
        caption: "Estadística avanzada sin límites ni ventanas de espera.",
      },
      {
        key: "filters",
        label: "Filtros inteligentes",
        caption: "Filtra por jugador, liga y fecha para afinar tus picks.",
      },
      {
        key: "openaccess",
        label: "Acceso sin paywalls",
        caption: "Todos los análisis sin suscripciones ni bloqueos.",
      },
    ],
  },
  en: {
    title: "Key advantages",
    items: [
      {
        key: "realtime",
        label: "Real-time predictions",
        caption: "Advanced stats with no throttling or delays.",
      },
      {
        key: "filters",
        label: "Smart filters",
        caption: "Filter by player, league, and date to refine picks.",
      },
      {
        key: "openaccess",
        label: "No paywalls",
        caption: "Full analysis without subscriptions or locks.",
      },
    ],
  },
  zh: {
    title: "核心优势",
    items: [
      {
        key: "realtime",
        label: "实时预测",
        caption: "高级统计，无限制、无等待。",
      },
      {
        key: "filters",
        label: "智能筛选",
        caption: "按球员、联赛与日期精准筛选。",
      },
      {
        key: "openaccess",
        label: "无付费墙",
        caption: "全部分析无需订阅与解锁。",
      },
    ],
  },
};

// --- Iconos lineales (SVG) ---
const Icons = {
  // Predicciones en tiempo real: gráfico con rayo
  realtime: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15l3-4 3 2 4-6" />
      <path d="M14 13l2-5" />
      <path d="M12 7l2-4" />
    </svg>
  ),
  // Filtros inteligentes: embudo/funnel
  filters: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 4h18l-7 8v5l-4 3v-8L3 4z" />
    </svg>
  ),
  // Acceso sin paywalls: candado abierto
  openaccess: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="10" width="18" height="11" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 9.7-1" />
      <path d="M12 15v2" />
    </svg>
  ),
};

type Tile = {
  key: "realtime" | "filters" | "openaccess";
  icon: JSX.Element;
  accentFrom: string;
  accentTo: string;
  rotate?: string;
  translate?: string;
};

const layout: Tile[] = [
  {
    key: "realtime",
    icon: <Icons.realtime />,
    accentFrom: "#A855F7",
    accentTo: "#22D3EE",
    rotate: "-rotate-2",
    translate: "md:-translate-y-1",
  },
  {
    key: "filters",
    icon: <Icons.filters />,
    accentFrom: "#7C3AED",
    accentTo: "#34D399",
    rotate: "rotate-1",
    translate: "md:translate-y-1",
  },
  {
    key: "openaccess",
    icon: <Icons.openaccess />,
    accentFrom: "#F97316",
    accentTo: "#A855F7",
    rotate: "-rotate-1",
    translate: "md:-translate-y-1",
  },
];

export default function Drawings() {
  const { lang } = useLanguage();
  const t = i18n[lang];

  return (
    <section
      className="relative isolate overflow-hidden bg-[#1a1d21] pt-20 pb-24"
      aria-labelledby="drawings-title"
    >
      {/* Grid sutil del fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.50]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2
          id="drawings-title"
          className="text-center text-2xl md:text-5xl font-extrabold text-white mb-12
                     drop-shadow-[0_0_16px_rgba(0,0,0,0.35)]"
        >
          {t.title}
        </h2>

        {/* Mosaico isométrico (3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
          {layout.map((tile) => {
            const trans = t.items.find((i) => i.key === tile.key)!;
            return (
              <article
                key={tile.key}
                className={`group relative w-full max-w-sm ${tile.rotate} ${tile.translate}
                            transition-transform duration-500 hover:-translate-y-1
                            [perspective:1000px]`}
              >
                {/* Sombra base */}
                <div
                  className="absolute inset-x-6 -bottom-1 h-8 rounded-full blur-2xl opacity-50
                                bg-gradient-to-r from-black/40 via-black/30 to-black/40"
                />

                {/* Plataforma apilada */}
                <div className="relative">
                  <div className="mx-auto h-10 rounded-2xl w-[92%] bg-white/5 border border-white/10 backdrop-blur-sm translate-y-6" />
                  <div className="mx-auto h-12 rounded-2xl w-[96%] bg-white/7 border border-white/10 backdrop-blur-sm translate-y-3" />
                  <div
                    className="relative mx-auto h-28 rounded-3xl w-full
                               bg-[#0E0C1C] border border-white/10
                               shadow-[0_12px_40px_rgba(168,85,247,0.15)]
                               overflow-hidden"
                    style={{ transform: "rotateX(6deg) translateZ(0)" }}
                  >
                    {/* glow borde superior */}
                    <div
                      className="absolute inset-x-0 top-0 h-[3px]"
                      style={{
                        background: `linear-gradient(90deg, ${tile.accentFrom}, ${tile.accentTo})`,
                        opacity: 0.85,
                      }}
                    />

                    {/* contenido */}
                    <div
                      className="relative z-10 flex h-full items-center gap-4 px-6 text-white
                                 transition-transform duration-500 group-hover:[transform:translateZ(20px)]"
                      style={{ transform: "translateZ(0)" }}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl
                                   bg-white/10 border border-white/10
                                   shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02))",
                        }}
                      >
                        <span
                          className="text-white"
                          style={{
                            textShadow: "0 0 12px rgba(168,85,247,0.35)",
                          }}
                        >
                          {tile.icon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold leading-tight">
                          {trans.label}
                        </span>
                        <span className="text-sm text-white/70">
                          {trans.caption}
                        </span>
                      </div>
                    </div>

                    {/* barra luminosa inferior al hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[6px] opacity-0
                                 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(90deg, ${tile.accentFrom}, ${tile.accentTo})`,
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
