import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { db } from "~/lib/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, username, password } = req.body as {
    email?: string;
    username?: string;
    password?: string;
  };

  if (!password || (!email && !username)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const normIdentity = (email ?? username ?? "").toLowerCase();

    // Try email match first
    let q = query(collection(db, "users"), where("email", "==", normIdentity), limit(1));
    let snap = await getDocs(q);
    if (snap.empty) {
      // Try username
      q = query(collection(db, "users"), where("username", "==", normIdentity), limit(1));
      snap = await getDocs(q);
    }

    if (snap.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const docs = snap.docs;
    if (docs.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const doc = docs[0];
    const data = doc.data() as { email?: string | null; username?: string | null; name?: string | null; password_hash?: string | null };
    if (!data.password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, data.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    return res.status(200).json({ ok: true, user: { id: doc.id, email: data.email ?? null, username: data.username ?? null, name: data.name ?? null } });
  } catch (err) {
    console.error("/api/auth/login error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
