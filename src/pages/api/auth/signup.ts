import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { rtdb } from "~/lib/firebase";
import { ref, query as rQuery, orderByChild, equalTo, limitToFirst, get, set, serverTimestamp, child } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, username, password, name } = req.body as {
    email?: string;
    username?: string;
    password?: string;
    name?: string;
  };

  if (!password || (!email && !username)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    type UserRec = { email?: string | null; username?: string | null; name?: string | null; password_hash?: string | null; provider?: string | null };
    const normEmail = email?.toLowerCase() ?? null;
    const normUsername = username?.toLowerCase() ?? null;

    // Check existence by email
    const usersRef = ref(rtdb, "users");
    if (normEmail) {
      const qEmail = rQuery(usersRef, orderByChild("email"), equalTo(normEmail), limitToFirst(1));
      const snapEmail = await get(qEmail);
      if (snapEmail.exists()) {
        return res.status(409).json({ error: "User already exists" });
      }
    }
    // Check existence by username
    if (normUsername) {
      const qUsername = rQuery(usersRef, orderByChild("username"), equalTo(normUsername), limitToFirst(1));
      const snapUsername = await get(qUsername);
      if (snapUsername.exists()) {
        return res.status(409).json({ error: "User already exists" });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Create user with a UUID id in RTDB
    const userId = uuidv4();
    await set(child(usersRef, userId), {
      provider: "local",
      email: normEmail,
      username: normUsername,
      name: name ?? null,
      password_hash,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    } as UserRec & { created_at: object; updated_at: object; provider: string });

    // Create a session for the new user (RTDB)
    const sessionId = uuidv4();
    await set(ref(rtdb, `sessions/${sessionId}`), {
      user_id: userId,
      created_at: serverTimestamp(),
      // Optional: add expiry
    });

    // Set cookie for session (readable by client to mirror into localStorage)
    const cookie = `session_id=${sessionId}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`; // 30 days
    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({ ok: true, session_id: sessionId, user: { id: userId, email: normEmail, username: normUsername, name: name ?? null } });
  } catch (err) {
    console.error("/api/auth/signup error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
