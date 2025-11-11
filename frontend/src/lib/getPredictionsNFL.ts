import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import type { GameData } from "../types/nflPredictionsInterface";

export async function getAllGames(): Promise<GameData[]> {
  try {
    // ¡Asegúrate que el nombre de la colección sea EXACTAMENTE este!
    const colRef = collection(db, "games");
    const snapshot = await getDocs(colRef);

    console.log("[Firestore] games docs:", snapshot.size);

    const data = snapshot.docs.map((doc) => {
      const raw = doc.data();
      // Opcional: formatea Timestamp a ISO si viene como Firestore Timestamp
      const createdAt = (raw.created_at?.toDate?.() ?? raw.created_at) || null;

      return {
        id: doc.id,
        ...raw,
        created_at: createdAt,
      } as GameData;
    });

    return data;
  } catch (err) {
    console.error("[Firestore] getAllGames error:", err);
    throw err;
  }
}
