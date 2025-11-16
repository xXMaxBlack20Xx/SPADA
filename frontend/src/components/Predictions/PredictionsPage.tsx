import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../api/auth";
import GameList from "./predNFL";

export default function PredictionsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0A17] via-[#121024] to-[#1A132B] text-[var(--color-text)]">
      {/* Background Effects */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#F97316] opacity-60" />
        <div
          className="absolute -inset-x-32 top-10 h-[34rem] blur-3xl opacity-40
                     bg-[radial-gradient(60rem_30rem_at_50%_0%,rgba(168,85,247,0.35),transparent_60%)]"
        />
      </div>

      {/* Header with Back Button */}
      <header className="relative z-10 border-b border-[color:color-mix(in_oklab,var(--color-text-muted)_15%,transparent)] backdrop-blur-sm bg-[color:color-mix(in_oklab,var(--color-surface)_20%,transparent)]">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition mb-3"
          >
            ← Volver al Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">
            Predicciones NFL
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <GameList />
      </main>
    </div>
  );
}
