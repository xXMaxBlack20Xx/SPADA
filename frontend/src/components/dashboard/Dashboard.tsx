import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getAccessToken, logout } from "../../api/auth";
import { useState, useEffect } from "react";

type Lang = "es" | "en" | "zh";

const i18n: Record<Lang, any> = {
  es: {
    welcome: "Bienvenido a SPADA",
    subtitle: "Tu plataforma de predicciones deportivas con IA",
    logout: "Cerrar sesión",
    predictions: "Predicciones NFL",
    predictionsDesc: "Ver predicciones en tiempo real para juegos de la NFL",
    features: "Características disponibles",
    realtime: "Predicciones en Tiempo Real",
    realtimeDesc: "Análisis instantáneo y predicciones actualizadas",
    filters: "Filtros Inteligentes",
    filtersDesc: "Busca por jugador, liga, fecha y tendencias",
    access: "Acceso Abierto",
    accessDesc: "Sin paywalls ni restricciones de contenido",
  },
  en: {
    welcome: "Welcome to SPADA",
    subtitle: "Your AI-powered sports prediction platform",
    logout: "Sign out",
    predictions: "NFL Predictions",
    predictionsDesc: "View real-time predictions for NFL games",
    features: "Available Features",
    realtime: "Real-Time Predictions",
    realtimeDesc: "Instant analysis and up-to-date predictions",
    filters: "Smart Filters",
    filtersDesc: "Search by player, league, date and trends",
    access: "Open Access",
    accessDesc: "No paywalls or content restrictions",
  },
  zh: {
    welcome: "欢迎来到 SPADA",
    subtitle: "您的人工智能体育预测平台",
    logout: "登出",
    predictions: "NFL 预测",
    predictionsDesc: "查看 NFL 比赛的实时预测",
    features: "可用功能",
    realtime: "实时预测",
    realtimeDesc: "即时分析和最新预测",
    filters: "智能过滤器",
    filtersDesc: "按球员、联赛、日期和趋势搜索",
    access: "开放访问",
    accessDesc: "无付费墙或内容限制",
  },
};

export default function Dashboard() {
  const { lang } = useLanguage();
  const t = i18n[lang];
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePredictions = () => {
    navigate("/predictions");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B] text-[var(--color-text)]">
      {/* Background Effects */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
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
      </div>

      {/* Header with Logout */}
      <header className="relative z-10 border-b border-[color:color-mix(in_oklab,var(--color-text-muted)_15%,transparent)] backdrop-blur-sm bg-[color:color-mix(in_oklab,var(--color-surface)_20%,transparent)]">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">
              SPADA
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-medium text-sm
                       bg-transparent border border-[var(--color-secondary)]/40
                       text-[var(--color-secondary)]
                       hover:bg-[color:color-mix(in_oklab,var(--color-secondary)_15%,transparent)]
                       hover:border-[var(--color-secondary)]/60
                       transition"
          >
            {t.logout}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Welcome Section */}
        <section className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.welcome}
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
            {t.subtitle}
          </p>
        </section>

        {/* Quick Actions */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NFL Predictions Card */}
          <button
            onClick={handlePredictions}
            className="relative group overflow-hidden rounded-2xl border backdrop-blur-xl
                       bg-[color:color-mix(in_oklab,var(--color-surface)_60%,transparent)]
                       border-[color:color-mix(in_oklab,var(--color-text-muted)_20%,transparent)]
                       shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]
                       hover:shadow-[0_15px_50px_-10px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]
                       hover:border-[color:color-mix(in_oklab,var(--color-primary)_60%,transparent)]
                       p-8 transition-all duration-300 text-left"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-[color:color-mix(in_oklab,var(--color-primary)_20%,transparent)] flex items-center justify-center mb-4 group-hover:bg-[color:color-mix(in_oklab,var(--color-primary)_30%,transparent)] transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9z"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-[var(--color-primary)]"
                  />
                  <path
                    d="M12 7v5l4 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    className="text-[var(--color-primary)]"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[var(--color-primary)] transition">
                {t.predictions}
              </h3>
              <p className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition">
                {t.predictionsDesc}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-secondary)] font-medium">
                {t.predictions} →
              </div>
            </div>
          </button>

          {/* Coming Soon Card */}
          <div
            className="relative overflow-hidden rounded-2xl border backdrop-blur-xl
                       bg-[color:color-mix(in_oklab,var(--color-surface)_60%,transparent)]
                       border-[color:color-mix(in_oklab,var(--color-text-muted)_15%,transparent)]
                       shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]
                       p-8 opacity-60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/3 to-[var(--color-secondary)]/3" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-[color:color-mix(in_oklab,var(--color-text-muted)_15%,transparent)] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-[var(--color-text-muted)]"
                  />
                  <path
                    d="M12 7v5m0 4v.01"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    className="text-[var(--color-text-muted)]"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-text-muted)]">
                Más predicciones
              </h3>
              <p className="text-[var(--color-text-muted)]">
                Próximamente: NBA, MLB y más ligas
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <h3 className="text-2xl font-bold mb-8 text-white">{t.features}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t.realtime, desc: t.realtimeDesc },
              { title: t.filters, desc: t.filtersDesc },
              { title: t.access, desc: t.accessDesc },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border
                           bg-[color:color-mix(in_oklab,var(--color-surface)_40%,transparent)]
                           border-[color:color-mix(in_oklab,var(--color-text-muted)_15%,transparent)]
                           hover:border-[color:color-mix(in_oklab,var(--color-secondary)_40%,transparent)]
                           hover:bg-[color:color-mix(in_oklab,var(--color-surface)_50%,transparent)]
                           transition"
              >
                <h4 className="font-bold text-lg mb-2 text-[var(--color-primary)]">
                  {feature.title}
                </h4>
                <p className="text-[var(--color-text-muted)]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
