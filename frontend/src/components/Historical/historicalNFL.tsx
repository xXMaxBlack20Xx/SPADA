import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../api/firebase";
import type { GameData } from "../../types/nflPredictionsInterface";

const COLLECTION_NAME = "predictions"; // ← cámbialo si tu colección se llama distinto

type SortKey = "date_desc" | "prob_desc";

export default function HistoricalNFL() {
  const [items, setItems] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controles UI
  const [season, setSeason] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("date_desc");

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Ordenamos por fecha (si guardas "gameday" como string YYYY-MM-DD, se ordena bien)
    const baseQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy("gameday", "desc")
    );

    const unsub = onSnapshot(
      baseQuery,
      (snap) => {
        const rows: GameData[] = snap.docs.map((d) => {
          const raw: any = d.data();
          const created = raw.created_at?.toDate?.() ?? raw.created_at ?? null;

          return {
            id: d.id,
            ...raw,
            created_at: created,
          } as GameData;
        });

        setItems(rows);
        setLoading(false);
      },
      (err) => {
        console.error("[Firestore] historicalNFL error:", err);
        setError(err?.message ?? "Error leyendo Firestore");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Derivar temporadas disponibles
  const seasons = useMemo(() => {
    const set = new Set<number>();
    items.forEach((x) => {
      const s = x?.model_metadata?.season ?? (x as any).season;
      if (typeof s === "number") set.add(s);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [items]);

  // Filtro + búsqueda + ordenamiento
  const filtered = useMemo(() => {
    let list = items.slice();

    if (season !== "all") {
      list = list.filter(
        (x) => (x?.model_metadata?.season ?? (x as any).season) === season
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((x) => {
        const haystack = [
          x.game_id,
          x.home_team,
          x.away_team,
          x.gameday,
          String(x?.model_metadata?.week ?? (x as any).week ?? ""),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    if (sortBy === "date_desc") {
      list.sort((a, b) => (a.gameday < b.gameday ? 1 : -1));
    } else if (sortBy === "prob_desc") {
      list.sort(
        (a, b) =>
          (b.model_metadata?.pred_prob_home_win ?? 0) -
          (a.model_metadata?.pred_prob_home_win ?? 0)
      );
    }

    return list;
  }, [items, season, search, sortBy]);

  if (loading)
    return <p className="text-center text-gray-400">Loading games...</p>;
  if (error) return <p className="text-center text-red-400">⚠️ {error}</p>;
  if (!filtered.length)
    return (
      <div className="space-y-4">
        <Controls
          seasons={seasons}
          season={season}
          setSeason={setSeason}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <p className="text-center text-gray-400">
          No hay predicciones para mostrar.
        </p>
      </div>
    );

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-white">
          📜 Historial de Predicciones NFL
        </h1>
        <p className="text-sm text-gray-400">
          Total: {filtered.length} {filtered.length === 1 ? "juego" : "juegos"}
        </p>
      </header>

      <Controls
        seasons={seasons}
        season={season}
        setSeason={setSeason}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <GameCard key={g.id} g={g} />
        ))}
      </div>
    </section>
  );
}

/** ————— Subcomponentes ————— */

function Controls(props: {
  seasons: number[];
  season: number | "all";
  setSeason: (v: number | "all") => void;
  search: string;
  setSearch: (v: string) => void;
  sortBy: SortKey;
  setSortBy: (v: SortKey) => void;
}) {
  const { seasons, season, setSeason, search, setSearch, sortBy, setSortBy } =
    props;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div className="flex-1">
        <label className="block text-sm text-gray-400 mb-1">Buscar</label>
        <input
          className="w-full rounded-xl bg-[#111418] text-white border border-gray-700 px-3 py-2 outline-none focus:border-gray-400"
          placeholder="Equipo, fecha (YYYY-MM-DD), game_id, semana..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Temporada</label>
        <select
          className="rounded-xl bg-[#111418] text-white border border-gray-700 px-3 py-2"
          value={String(season)}
          onChange={(e) => {
            const v = e.target.value;
            setSeason(v === "all" ? "all" : Number(v));
          }}
        >
          <option value="all">Todas</option>
          {seasons.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Ordenar por</label>
        <select
          className="rounded-xl bg-[#111418] text-white border border-gray-700 px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
        >
          <option value="date_desc">Fecha (recientes primero)</option>
          <option value="prob_desc">Probabilidad (mayor primero)</option>
        </select>
      </div>
    </div>
  );
}

function GameCard({ g }: { g: GameData }) {
  const prob = g.model_metadata?.pred_prob_home_win ?? 0;
  const predHome = (g.model_metadata?.pred_home_win ?? 0) === 1;
  const winner = predHome ? g.home_team : g.away_team;

  const wk = g.model_metadata?.week ?? (g as any).week;
  const season = g.model_metadata?.season ?? (g as any).season;

  return (
    <article className="rounded-2xl border border-gray-800 bg-[#0d1013] p-4 text-white">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {g.away_team} @ {g.home_team}
        </h2>
        <span className="text-xs text-gray-400">{g.gameday}</span>
      </header>

      <div className="mt-2 text-sm text-gray-300">
        <p>
          <span className="text-gray-400">Game ID:</span> {g.game_id}
        </p>
        <p>
          <span className="text-gray-400">Season/Week:</span> {season} / {wk}
        </p>
        <p>
          <span className="text-gray-400">Spread:</span> {g.spread_line} &nbsp;
          <span className="text-gray-400">Total:</span> {g.total_line}
        </p>
        <p className="mt-1">
          <span className="text-gray-400">Predicción:</span>{" "}
          <span className="font-semibold">
            {winner} &middot; {(prob * 100).toFixed(1)}%
          </span>
        </p>
      </div>

      {/* Barra simple de probabilidad */}
      <div className="mt-3 h-2 w-full rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full ${predHome ? "bg-emerald-500" : "bg-indigo-500"}`}
          style={{
            width: `${Math.max(2, Math.min(98, Math.round(prob * 100)))}%`,
          }}
        />
      </div>

      {g.created_at && (
        <p className="mt-3 text-xs text-gray-500">
          Creado: {new Date(g.created_at).toLocaleString()}
        </p>
      )}
    </article>
  );
}
