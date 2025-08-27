import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { rtdb } from "~/lib/firebase";
import { ref, query as rQuery, orderByChild, equalTo, limitToFirst, get, set, serverTimestamp } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

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
    type UserRec = { email?: string | null; username?: string | null; name?: string | null; password_hash?: string | null };
    const normIdentity = (email ?? username ?? "").toLowerCase();

    // Try email match first in Realtime DB
    let userId: string | null = null;
    let data: UserRec | null = null;

    const usersRef = ref(rtdb, "users");
    let qs = rQuery(usersRef, orderByChild("email"), equalTo(normIdentity), limitToFirst(1));
    let snap = await get(qs);
    if (!snap.exists()) {
      // Try username
      qs = rQuery(usersRef, orderByChild("username"), equalTo(normIdentity), limitToFirst(1));
      snap = await get(qs);
    }

    if (!snap.exists()) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    snap.forEach((child) => {
      if (!userId) {
        userId = child.key;
        data = child.val() as UserRec;
      }
    });

    if (!userId || !data) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Ensure typing
    const first = { id: userId };
    const user = data as UserRec;
    if (!user.password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash as string);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Create a new session in RTDB
    const sessionId = uuidv4();
    await set(ref(rtdb, `sessions/${sessionId}`), {
      user_id: first.id,
      created_at: serverTimestamp(),
    });

    // Set a cookie (readable by client to mirror into localStorage)
    const cookie = `session_id=${sessionId}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`; // 30 days
    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({ ok: true, session_id: sessionId, user: { id: first.id, email: user.email ?? null, username: user.username ?? null, name: user.name ?? null } });
  } catch (err) {
    console.error("/api/auth/login error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
