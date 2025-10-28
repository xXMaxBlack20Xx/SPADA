// Footer del Main Page
import { useLanguage } from "../../context/LanguageContext";
import Logo from "@/assets/logos/BLK_WHT_Logo_Shield.png";

// Context Global de traducciones
const i18n = {
    es: {
        rights: "Todos los derechos reservados.",
        disclaimer:
            "SPADA provee análisis y predicciones basadas en datos estadísticos. No garantizamos resultados de apuestas. El uso de la plataforma es bajo su propio riesgo. SPADA no se hace responsable de pérdidas financieras, decisiones individuales ni de cualquier daño directo o indirecto derivado del uso de esta información.",
        links: {
            about: "Sobre SPADA",
            privacy: "Política de Privacidad",
            terms: "Términos de Servicio",
            contact: "Contacto",
        },
        backToTop: "Volver arriba",
    },
    en: {
        rights: "All rights reserved.",
        disclaimer:
            "SPADA provides analytics and predictions based on statistical data. We do not guarantee betting outcomes. Use of our platform is at your own risk. SPADA is not responsible for financial losses, individual decisions, or any direct or indirect damages arising from the use of this information.",
        links: {
            about: "About SPADA",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            contact: "Contact",
        },
        backToTop: "Back to top",
    },
    zh: {
        rights: "保留所有权利。",
        disclaimer:
            "SPADA 基于统计数据提供分析与预测，并不保证任何投注结果。使用本平台需自行承担风险。因使用本平台信息导致的任何经济损失或直接/间接损害，SPADA 概不负责。",
        links: {
            about: "关于 SPADA",
            privacy: "隐私政策",
            terms: "服务条款",
            contact: "联系",
        },
        backToTop: "回到顶部",
    },
} as const;

export default function FooterAesthetic() {
    const { lang } = useLanguage(); // idioma sincronizado con Header
    const t = i18n[lang];

    // Efecto “levitar con sombra blanca”
    const hoverLift =
        "relative transition transform hover:-translate-y-0.5 " +
        "hover:shadow-[0_12px_40px_rgba(255,255,255,0.12)] " +
        "after:content-[''] after:absolute after:inset-0 after:-z-10 " +
        "after:rounded-xl after:blur-xl after:opacity-0 hover:after:opacity-100 " +
        "after:transition after:bg-white/10";

    return (
        <footer className="relative mt-16">
            {/* Franja glow superior */}
            <div className="h-[2px] w-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#F97316]" />

            {/* Cuerpo */}
            <div className="w-full bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B]/95 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    {/* Top: Logo + Links + Social */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                        {/* Logo + Marca */}
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <img
                                src={Logo}
                                alt="SPADA"
                                className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]"
                            />
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-[#F5D0FE]">
                                    SPADA
                                </span>
                                <span className="text-[11px] uppercase tracking-widest text-white/50">
                                    Sports Prediction • AI
                                </span>
                            </div>
                        </div>

                        {/* Enlaces rápidos */}
                        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                            <a href="#about" className={`text-sm text-white/80 hover:text-white ${hoverLift}`}>
                                {t.links.about}
                            </a>
                            <a href="#privacy" className={`text-sm text-white/80 hover:text-white ${hoverLift}`}>
                                {t.links.privacy}
                            </a>
                            <a href="#terms" className={`text-sm text-white/80 hover:text-white ${hoverLift}`}>
                                {t.links.terms}
                            </a>
                            <a href="#contacto" className={`text-sm text-white/80 hover:text-white ${hoverLift}`}>
                                {t.links.contact}
                            </a>
                        </nav>

                        {/* Social */}
                        <div className="flex justify-center md:justify-end gap-4">
                            <a
                                href="#x"
                                aria-label="X / Twitter"
                                className={`p-2 rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-white/25 ${hoverLift}`}
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                    <path d="M18 2h3l-7.5 8.5L22 22h-6l-4-6-4 6H2l8.5-11.5L2 2h6l4 5.5L18 2z" />
                                </svg>
                            </a>
                            <a
                                href="#instagram"
                                aria-label="Instagram"
                                className={`p-2 rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-white/25 ${hoverLift}`}
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2A2.8 2.8 0 1014.8 12 2.8 2.8 0 0012 9.2zM17.8 6a1 1 0 110 2 1 1 0 010-2z" />
                                </svg>
                            </a>
                            <a
                                href="#github"
                                aria-label="GitHub"
                                className={`p-2 rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-white/25 ${hoverLift}`}
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                    <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.6 2.8 1.1.1-.8.4-1.3.7-1.6-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1-2.8-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.9 1.1a9.5 9.5 0 015.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.4.1 2.7.7.8 1 1.7 1 2.8 0 3.9-2.3 4.7-4.5 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10.3 10.3 0 0022 12.3C22 6.6 17.5 2 12 2z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-8 h-px w-full bg-white/10" />

                    {/* Disclaimer + derechos */}
                    <div className="mt-6 flex flex-col items-center text-center gap-4">
                        <p className="text-xs md:text-sm leading-relaxed text-gray-300/80 max-w-4xl">
                            {t.disclaimer}
                        </p>
                        <p className="text-xs text-gray-400">
                            © {new Date().getFullYear()} <span className="font-semibold">SPADA</span>. {t.rights}
                        </p>
                    </div>
                </div>
            </div>

        </footer>
    );
}