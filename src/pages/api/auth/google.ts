import type { NextApiRequest, NextApiResponse } from "next";
import { rtdb } from "~/lib/firebase";
import { ref, get, set, push } from "firebase/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { access_token } = req.body as { access_token?: string };
  if (!access_token) return res.status(400).json({ error: "Missing access_token" });

  try {
    // Get userinfo from Google with access token
    const userinfoResp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!userinfoResp.ok) {
      const text = await userinfoResp.text();
      return res.status(401).json({ error: "Failed to fetch Google userinfo", details: text });
    }
    const info = (await userinfoResp.json()) as {
      sub: string;
      email?: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
    };

    const provider = "google";
    const provider_id = info.sub;
    const email = info.email ?? null;
    const computedName = [info.given_name, info.family_name].filter(Boolean).join(" ");
    const name = info.name ?? (computedName || null);
    const username = (name || email || provider_id).replace(/\s+/g, "-").toLowerCase();

    // RTDB upsert using an index: usersByProvider/{provider}/{provider_id} -> userId
    const indexRef = ref(rtdb, `usersByProvider/${provider}/${provider_id}`);
    const indexSnap = await get(indexRef);
    if (indexSnap.exists()) {
      const userId = indexSnap.val() as string;
      const userRef = ref(rtdb, `users/${username}`);
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        const data = userSnap.val() as { username?: string | null; name?: string | null; email?: string | null };
        return res.status(200).json({ ok: true, user: { id: userId, username: data.username ?? null, name: data.name ?? null, email: data.email ?? null } });
      }
      // If mapping exists but user missing, fall through to create fresh user
    }

    
    const newUserId = username;
    const userRecord = {
      provider,
      provider_id,
      email,
      username,
      name,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    
    const userRef = ref(rtdb, `users/${newUserId}/profile`);
    await set(userRef, userRecord);
    return res.status(200).json({ ok: true, user: { id: newUserId, username, name, email } });
  } catch (err: any) {
    console.error("/api/auth/google error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
