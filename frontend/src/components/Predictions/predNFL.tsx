import { useEffect, useState } from "react";
import { getAllGames } from "../../lib/getPredictionsNFL";
import type { GameData } from "../../types/nflPredictionsInterface";

export default function GameList() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const result = await getAllGames();
        if (alive) setGames(result);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Error leyendo Firestore");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading)
    return <p className="text-center text-gray-400">Loading games...</p>;
  if (error) return <p className="text-center text-red-400">⚠️ {error}</p>;
  if (!games.length)
    return (
      <p className="text-center text-gray-400">No hay juegos para mostrar.</p>
    );

  return (
    <div className="p-6 space-y-4">
      {games.map((g) => (
        <div
          key={g.id}
          className="p-4 border rounded-xl bg-gray-900 text-white"
        >
          <h2 className="text-xl font-bold">
            {g.away_team} @ {g.home_team}
          </h2>
          <p>ID: {g.game_id}</p>
          <p>Fecha: {g.gameday}</p>
          <p>
            Spread: {g.spread_line} | Total: {g.total_line}
          </p>
          <p>
            Prob. local:{" "}
            {(g.model_metadata?.pred_prob_home_win * 100).toFixed(1)}%
          </p>
          {g.created_at && (
            <p className="text-sm opacity-70">
              Creado: {new Date(g.created_at).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
