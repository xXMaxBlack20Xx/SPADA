import type { JSX } from "react";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "es" | "en" | "zh";

const i18n: Record<
  Lang,
  {
    title: string;
    items: { key: string; label: string; caption: string }[];
  }
> = {
  es: {
    title: "Capacidades del sistema",
    items: [
      {
        key: "messaging",
        label: "Mensajería",
        caption: "Notifica resultados y alertas",
      },
      { key: "voice", label: "Voz", caption: "Insights y picks por audio" },
      { key: "video", label: "Video", caption: "Clips y análisis visual" },
      {
        key: "telephony",
        label: "Telefonía",
        caption: "Líneas para tips premium",
      },
      {
        key: "analytics",
        label: "Analytics",
        caption: "Modelos, métricas y ROI",
      },
    ],
  },
  en: {
    title: "System capabilities",
    items: [
      {
        key: "messaging",
        label: "Messaging",
        caption: "Notify results & alerts",
      },
      { key: "voice", label: "Voice", caption: "Insights & picks by audio" },
      { key: "video", label: "Video", caption: "Clips and visual analysis" },
      {
        key: "telephony",
        label: "Telephony",
        caption: "Lines for premium tips",
      },
      {
        key: "analytics",
        label: "Analytics",
        caption: "Models, metrics & ROI",
      },
    ],
  },
  zh: {
    title: "系统能力",
    items: [
      { key: "messaging", label: "消息", caption: "结果与提醒通知" },
      { key: "voice", label: "语音", caption: "音频洞察与推荐" },
      { key: "video", label: "视频", caption: "剪辑与可视化分析" },
      { key: "telephony", label: "电话", caption: "付费线路与提示" },
      { key: "analytics", label: "分析", caption: "模型、指标与回报" },
    ],
  },
};

// --- Iconos lineales (SVG) ---
const Icons = {
  messaging: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <path d="M7 8h10M7 12h6" />
    </svg>
  ),
  voice: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3" />
    </svg>
  ),
  video: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="5" width="15" height="14" rx="2" />
      <path d="M17 8l5-3v14l-5-3z" />
    </svg>
  ),
  telephony: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.61a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.46-1.13a2 2 0 0 1 2.11-.45c.84.26 1.71.45 2.61.57A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  analytics: () => (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 3v18h18" />
      <path d="M7 13l3-3 4 4 5-7" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="14" cy="14" r="1.5" />
      <circle cx="19" cy="7" r="1.5" />
    </svg>
  ),
};

type Tile = {
  key: string;
  icon: JSX.Element;
  accentFrom: string;
  accentTo: string;
  rotate?: string;
  translate?: string;
};

const layout: Tile[] = [
  {
    key: "messaging",
    icon: <Icons.messaging />,
    accentFrom: "#A855F7",
    accentTo: "#22D3EE",
    rotate: "-rotate-3",
    translate: "md:-translate-y-2",
  },
  {
    key: "voice",
    icon: <Icons.voice />,
    accentFrom: "#7C3AED",
    accentTo: "#F97316",
    rotate: "rotate-2",
    translate: "md:translate-y-3",
  },
  {
    key: "video",
    icon: <Icons.video />,
    accentFrom: "#A855F7",
    accentTo: "#34D399",
    rotate: "-rotate-1",
    translate: "md:-translate-y-1",
  },
  {
    key: "telephony",
    icon: <Icons.telephony />,
    accentFrom: "#22D3EE",
    accentTo: "#F97316",
    rotate: "rotate-1",
    translate: "md:translate-y-1",
  },
  {
    key: "analytics",
    icon: <Icons.analytics />,
    accentFrom: "#F97316",
    accentTo: "#A855F7",
    rotate: "-rotate-2",
    translate: "md:-translate-y-2",
  },
];

export default function Drawings() {
  const { lang } = useLanguage();
  const t = i18n[lang];

  return (
    <section
      className="relative isolate overflow-hidden bg-[#0B0A17] pt-20 pb-24
                 before:absolute before:inset-0 before:bg-[radial-gradient(60rem_40rem_at_50%_20%,rgba(168,85,247,0.18),transparent_60%)]
                 after:absolute after:bottom-[-6vw] after:left-0 after:right-0 after:h-[12vw]
                 after:bg-white after:[clip-path:polygon(0_0,100%_100%,0_100%)]"
      aria-labelledby="drawings-title"
    >
      {/* Grid sutil del fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Conectores (puntos + líneas) */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="dot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="60" r="1.2" fill="url(#dot)" />
        <circle cx="50" cy="45" r="1.2" fill="url(#dot)" />
        <circle cx="80" cy="62" r="1.2" fill="url(#dot)" />
        <path
          d="M20 60 C35 55, 45 50, 50 45 S65 55, 80 62"
          stroke="#A855F7"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2
          id="drawings-title"
          className="text-center text-2xl md:text-3xl font-extrabold text-white mb-12
                     drop-shadow-[0_0_16px_rgba(0,0,0,0.35)]"
        >
          {t.title}
        </h2>

        {/* Mosaico isométrico */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8
                     place-items-center"
        >
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

                {/* Plataforma apilada (3 layers) */}
                <div className="relative">
                  {/* capa 3 */}
                  <div
                    className="mx-auto h-10 rounded-2xl w-[92%] bg-white/5 border border-white/10
                                  backdrop-blur-sm translate-y-6"
                  />
                  {/* capa 2 */}
                  <div
                    className="mx-auto h-12 rounded-2xl w-[96%] bg-white/7 border border-white/10
                                  backdrop-blur-sm translate-y-3"
                  />
                  {/* capa 1 (top) */}
                  <div
                    className="relative mx-auto h-24 rounded-3xl w-full
                               bg-[#0E0C1C] border border-white/10
                               shadow-[0_12px_40px_rgba(168,85,247,0.15)]
                               overflow-hidden"
                    style={{
                      transform: "rotateX(6deg) translateZ(0)",
                    }}
                  >
                    {/* glow borde superior */}
                    <div
                      className="absolute inset-x-0 top-0 h-[3px]"
                      style={{
                        background: `linear-gradient(90deg, ${tile.accentFrom}, ${tile.accentTo})`,
                        opacity: 0.8,
                      }}
                    />
                    {/* brillo diagonal */}
                    <div
                      className="absolute -inset-6 opacity-20 blur-2xl pointer-events-none"
                      style={{
                        background: `conic-gradient(from_180deg_at_50%_50%, ${tile.accentFrom}, ${tile.accentTo}, ${tile.accentFrom})`,
                      }}
                    />
                    {/* contenido */}
                    <div
                      className="relative z-10 flex h-full items-center gap-4 px-6
                                 text-white transition-transform duration-500
                                 group-hover:[transform:translateZ(20px)]"
                      style={{ transform: "translateZ(0)" }}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl
                                   bg-white/10 border border-white/10
                                   shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02))`,
                        }}
                      >
                        <span
                          className="text-white"
                          style={{
                            color: "white",
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

      {/* Animaciones locales */}
      <style>{`
        .white\\/7 { background: rgba(255,255,255,.07); }
      `}</style>
    </section>
  );
}
