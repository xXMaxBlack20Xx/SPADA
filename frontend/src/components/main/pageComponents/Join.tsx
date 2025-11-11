import type { JSX } from "react";
import { useLanguage } from "../../../context/LanguageContext";

type Lang = "es" | "en" | "zh";

const i18n: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    cta: string;
  }
> = {
  es: {
    title: "Comenzar es muy fácil",
    subtitle:
      "Empieza de inmediato y prueba nuestra plataforma de predicciones deportivas totalmente gratis.",
    cta: "Únete a SPADA",
  },
  en: {
    title: "Getting started is easy",
    subtitle:
      "Start right away and try our sports prediction platform completely free.",
    cta: "Join SPADA",
  },
  zh: {
    title: "开始非常简单",
    subtitle: "立即开始，免费体验我们的体育预测平台。",
    cta: "加入 SPADA",
  },
};

type JoinProps = {
  imageSrc: string;
  className?: string;
};

export default function Join({
  imageSrc,
  className = "",
}: JoinProps): JSX.Element {
  const { lang } = useLanguage();
  const t = i18n[lang];

  return (
    <section
      className={`relative bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B] py-24 px-6 ${className}`}
      aria-labelledby="join-title"
    >
      <div className="mx-auto max-w-6xl relative isolate overflow-hidden rounded-3xl bg-[#1a1d21] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_12px_40px_rgba(168,85,247,0.15)]">
        {/* Text content */}
        <div className="max-w-xl">
          <h2
            id="join-title"
            className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight"
          >
            {t.title}
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-8">
            {t.subtitle}
          </p>

          <a
            href="#signup"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold
                       bg-gradient-to-r from-[#F97316] via-[#7C3AED] to-[#A855F7]
                       hover:brightness-110 transition shadow-[0_0_24px_rgba(249,115,22,0.25)]"
          >
            {t.cta}
          </a>
        </div>

        {/* Image section */}
        <div className="relative flex justify-center items-center w-full md:w-auto">
          <img
            src={imageSrc}
            alt="SPADA logo"
            className="w-56 md:w-200 drop-shadow-[0_0_40px_rgba(124,58,237,0.45)]"
          />
          {/* Floating glows */}
          <div
            aria-hidden
            className="absolute -z-10 inset-0 blur-3xl opacity-40 bg-[radial-gradient(25rem_25rem_at_center,rgba(168,85,247,0.25),transparent_70%)]"
          />
        </div>
      </div>

      {/* Línea superior glow */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#F97316] opacity-60"
      />
    </section>
  );
}
