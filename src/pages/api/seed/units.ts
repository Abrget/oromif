import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { units } from "~/utils/units";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Write each unit to Firestore with deterministic IDs (unitNumber)
    await Promise.all(
      units.map((unit) =>
        setDoc(doc(db, "units", String(unit.unitNumber)), unit, { merge: true }),
      ),
    );
    return res.status(200).json({ ok: true, count: units.length });
  } catch (err) {
    console.error("/api/seed/units error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
