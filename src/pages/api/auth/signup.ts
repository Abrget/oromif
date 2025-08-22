import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { db } from "~/lib/firebase";
import { collection, addDoc, query, where, limit, getDocs } from "firebase/firestore";

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
    const normEmail = email?.toLowerCase() ?? null;
    const normUsername = username?.toLowerCase() ?? null;

    // Check existence by email
    if (normEmail) {
      const qEmail = query(collection(db, "users"), where("email", "==", normEmail), limit(1));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return res.status(409).json({ error: "User already exists" });
      }
    }
    // Check existence by username
    if (normUsername) {
      const qUsername = query(collection(db, "users"), where("username", "==", normUsername), limit(1));
      const snapUsername = await getDocs(qUsername);
      if (!snapUsername.empty) {
        return res.status(409).json({ error: "User already exists" });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userDoc = await addDoc(collection(db, "users"), {
      provider: "local",
      email: normEmail,
      username: normUsername,
      name: name ?? null,
      password_hash,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    return res.status(200).json({ ok: true, user: { id: userDoc.id, email: normEmail, username: normUsername, name: name ?? null } });
  } catch (err) {
    console.error("/api/auth/signup error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
